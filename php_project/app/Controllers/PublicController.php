<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Database;
use App\Helpers\Security;
use PDO;

/**
 * Public Frontend Controller
 * Handles dynamic page rendering, 301/302 Redirect Manager lookups,
 * XML Sitemap generation, robots.txt, and Contact Enquiry submissions.
 */
final class PublicController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function handleRequest(string $requestPath): void
    {
        // 1. Check 301 / 302 Redirect Manager first
        $stmt = $this->db->prepare(
            'SELECT id, target_url, status_code FROM redirects WHERE source_path = :path AND is_active = 1 LIMIT 1'
        );
        $stmt->execute(['path' => $requestPath]);
        $redirect = $stmt->fetch();

        if ($redirect) {
            $updateHits = $this->db->prepare('UPDATE redirects SET hits_count = hits_count + 1 WHERE id = :id');
            $updateHits->execute(['id' => $redirect['id']]);
            $code = ((int)$redirect['status_code'] === 302) ? 302 : 301;
            header('Location: ' . $redirect['target_url'], true, $code);
            exit;
        }

        // 2. Special SEO Endpoints
        if ($requestPath === '/sitemap.xml') {
            $this->renderSitemapXml();
            return;
        }
        if ($requestPath === '/robots.txt') {
            $this->renderRobotsTxt();
            return;
        }

        // 3. Resolve slug (Home is 'home')
        $slug = trim($requestPath, '/');
        if ($slug === '') {
            $slug = 'home';
        }

        // 4. Fetch Published Page + SEO metadata
        $pageStmt = $this->db->prepare(
            'SELECT p.*, s.seo_title, s.meta_description, s.canonical_url,
                    s.robots_index, s.robots_follow, s.og_title, s.og_description,
                    s.og_image_url, s.schema_type, s.breadcrumb_title
             FROM pages p
             LEFT JOIN page_seo s ON s.page_id = p.id
             WHERE p.slug = :slug AND p.status = "published"
             LIMIT 1'
        );
        $pageStmt->execute(['slug' => $slug]);
        $page = $pageStmt->fetch();

        if (!$page) {
            http_response_code(404);
            require __DIR__ . '/../../resources/views/pages/404.php';
            return;
        }

        // 5. Fetch enabled dynamic Page Sections in sort_order
        $secStmt = $this->db->prepare(
            'SELECT id, section_type, title, subtitle, content_json, sort_order
             FROM page_sections
             WHERE page_id = :page_id AND is_enabled = 1
             ORDER BY sort_order ASC'
        );
        $secStmt->execute(['page_id' => $page['id']]);
        $sections = $secStmt->fetchAll();

        $settings = $this->getSiteSettings();
        require __DIR__ . '/../../resources/views/layouts/public.php';
    }

    public function renderSitemapXml(): void
    {
        header('Content-Type: application/xml; charset=utf-8');
        $baseUrl = rtrim($_ENV['APP_URL'] ?? 'https://www.shivwebsindia.com', '/');

        // Only published & indexable pages
        $stmt = $this->db->query(
            'SELECT p.slug, p.updated_at
             FROM pages p
             INNER JOIN page_seo s ON s.page_id = p.id
             WHERE p.status = "published" AND s.robots_index = 1 AND s.include_in_sitemap = 1
             ORDER BY p.id ASC'
        );
        $pages = $stmt->fetchAll();

        $postStmt = $this->db->query(
            'SELECT slug, updated_at
             FROM blog_posts
             WHERE status = "published" AND robots_index = 1
             ORDER BY published_at DESC'
        );
        $posts = $postStmt->fetchAll();

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($pages as $p) {
            $loc = $p['slug'] === 'home' ? $baseUrl . '/' : $baseUrl . '/' . rawurlencode($p['slug']);
            $lastmod = date('c', strtotime($p['updated_at']));
            echo "  <url>\n";
            echo "    <loc>" . Security::e($loc) . "</loc>\n";
            echo "    <lastmod>{$lastmod}</lastmod>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "  </url>\n";
        }
        foreach ($posts as $post) {
            $loc = $baseUrl . '/blog/' . rawurlencode($post['slug']);
            $lastmod = date('c', strtotime($post['updated_at']));
            echo "  <url>\n";
            echo "    <loc>" . Security::e($loc) . "</loc>\n";
            echo "    <lastmod>{$lastmod}</lastmod>\n";
            echo "    <changefreq>monthly</changefreq>\n";
            echo "  </url>\n";
        }
        echo '</urlset>';
    }

    public function renderRobotsTxt(): void
    {
        header('Content-Type: text/plain; charset=utf-8');
        $baseUrl = rtrim($_ENV['APP_URL'] ?? 'https://www.shivwebsindia.com', '/');
        echo "User-agent: *\n";
        echo "Allow: /\n";
        echo "Disallow: /admin/\n";
        echo "Disallow: /api/admin/\n";
        echo "Disallow: /preview/\n";
        echo "Sitemap: {$baseUrl}/sitemap.xml\n";
    }

    /**
     * Save Contact Enquiry to MySQL (contact_enquiries) AND Send Instant Email Alert to shivwebsindia@gmail.com
     */
    public function submitContactEnquiry(array $postData, string $ip, string $userAgent): array
    {
        if (!empty($postData['website_url_honeypot'])) {
            return ['success' => false, 'error' => 'Spam detected.'];
        }

        if (!Security::verifyCsrfToken($postData['csrf_token'] ?? null)) {
            return ['success' => false, 'error' => 'Invalid security token. Please refresh the page.'];
        }

        $fullName = trim((string)($postData['full_name'] ?? ''));
        $email    = trim((string)($postData['email'] ?? ''));
        $phone    = trim((string)($postData['phone'] ?? ''));
        $company  = trim((string)($postData['company_name'] ?? ''));
        $service  = trim((string)($postData['service_interested'] ?? 'General Enquiry'));
        $budget   = trim((string)($postData['budget_range'] ?? 'Not specified'));
        $message  = trim((string)($postData['message'] ?? ''));
        $source   = trim((string)($postData['source_page'] ?? '/'));

        if (mb_strlen($fullName) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($phone) < 10) {
            return ['success' => false, 'error' => 'Please provide valid name, email, and 10-digit phone number.'];
        }

        // 1. Insert Lead into MySQL `contact_enquiries` table
        $stmt = $this->db->prepare(
            'INSERT INTO contact_enquiries
             (full_name, email, phone, company_name, service_interested, budget_range, message, source_page, status, ip_address, user_agent)
             VALUES (:name, :email, :phone, :company, :service, :budget, :message, :source, "new", :ip, :ua)'
        );
        $stmt->execute([
            'name'    => $fullName,
            'email'   => $email,
            'phone'   => $phone,
            'company' => $company,
            'service' => $service,
            'budget'  => $budget,
            'message' => $message,
            'source'  => $source,
            'ip'      => $ip,
            'ua'      => mb_substr($userAgent, 0, 250),
        ]);
        $leadId = (int)$this->db->lastInsertId();

        // 2. Send Email Notification to shivwebsindia@gmail.com
        $settings = $this->getSiteSettings();
        $recipientEmail = $settings['notification_recipient_email']
            ?? $_ENV['LEAD_NOTIFICATION_RECIPIENT']
            ?? 'shivwebsindia@gmail.com';

        $subject = sprintf('[ShivWebsIndia Lead #%d] %s - %s', $leadId, $service, $fullName);
        $emailBody = "New Website Lead Received on ShivWebsIndia.com\n"
            . "================================================\n"
            . "Lead ID: #{$leadId}\n"
            . "Name: {$fullName}\n"
            . "Phone / WhatsApp: {$phone}\n"
            . "Email: {$email}\n"
            . "Company: {$company}\n"
            . "Service Required: {$service}\n"
            . "Budget Range: {$budget}\n"
            . "Source Page: {$source}\n"
            . "------------------------------------------------\n"
            . "Message / Project Details:\n{$message}\n"
            . "================================================\n"
            . "Manage all leads in Admin Panel: https://www.shivwebsindia.com/admin\n";

        $fromAddress = $_ENV['MAIL_FROM_ADDRESS'] ?? 'info@shivwebsindia.com';
        $headers = [
            'From: ShivWebsIndia Website <' . $fromAddress . '>',
            'Reply-To: ' . $fullName . ' <' . $email . '>',
            'Content-Type: text/plain; charset=UTF-8',
            'X-Mailer: ShivWebsIndia-CMS-PHP8',
        ];

        @mail($recipientEmail, $subject, $emailBody, implode("\r\n", $headers));

        return [
            'success'         => true,
            'lead_id'         => $leadId,
            'notified_email'  => $recipientEmail,
        ];
    }

    private function getSiteSettings(): array
    {
        $stmt = $this->db->query('SELECT setting_key, setting_value FROM site_settings');
        $rows = $stmt->fetchAll();
        $map = [];
        foreach ($rows as $r) {
            $map[$r['setting_key']] = $r['setting_value'];
        }
        return $map;
    }
}
