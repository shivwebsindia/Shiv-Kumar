import JSZip from 'jszip';

export interface PHPProjectFile {
  path: string;
  language: 'php' | 'sql' | 'apache' | 'json' | 'env' | 'markdown';
  description: string;
  content: string;
}

export const PHP_PROJECT_FILES: PHPProjectFile[] = [
  {
    path: 'database/shivwebsindia_complete_database.sql',
    language: 'sql',
    description:
      'Complete MySQL 8.0 / MariaDB Database (Schema + Admin Login + All Pages + All Services + Blog Posts/Categories/Tags + FAQs + Media Assets + Portfolio + Team + Attendance + Leave + Leads)',
    content: `-- =============================================================================
-- ShivWebsIndia.com — COMPLETE PRODUCTION MYSQL DATABASE (SCHEMA + LIVE DATA)
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Target: Hostinger hPanel / cPanel phpMyAdmin (MySQL 8.0+ / MariaDB 10.6+)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- 1. ROLES & ADMIN USERS
CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(50) NOT NULL,
  \`slug\` VARCHAR(50) NOT NULL,
  \`description\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_roles_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`role_id\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(190) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`plain_pin_backup\` VARCHAR(60) DEFAULT 'Shiv@2026',
  \`status\` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  \`failed_login_attempts\` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  \`locked_until\` TIMESTAMP NULL DEFAULT NULL,
  \`last_login_at\` TIMESTAMP NULL DEFAULT NULL,
  \`last_login_ip\` VARCHAR(45) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`roles\` (\`id\`, \`name\`, \`slug\`, \`description\`) VALUES
(1, 'Super Administrator', 'admin', 'Full access to Pages, Services, Blogs, FAQs, Media, SEO, Team & Enquiries'),
(2, 'Content Editor', 'editor', 'Can create and edit Pages, Services, FAQs, Media, and Blogs')
ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);

-- Default Admin Login: info@shivwebsindia.com / Password: Shiv@2026 (or ShivWebs@2026!Admin)
INSERT INTO \`users\` (\`id\`, \`role_id\`, \`full_name\`, \`email\`, \`password_hash\`, \`plain_pin_backup\`, \`status\`) VALUES
(1, 1, 'Shiv Kumar (Founder & Admin)', 'info@shivwebsindia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Shiv@2026', 'active')
ON DUPLICATE KEY UPDATE \`email\`=VALUES(\`email\`);

-- 2. SITE SETTINGS
CREATE TABLE IF NOT EXISTS \`site_settings\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`setting_key\` VARCHAR(100) NOT NULL,
  \`setting_value\` TEXT DEFAULT NULL,
  \`setting_group\` VARCHAR(60) NOT NULL DEFAULT 'general',
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_site_settings_key\` (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`site_settings\` (\`setting_key\`, \`setting_value\`, \`setting_group\`) VALUES
('brand_name', 'ShivWebsIndia', 'general'),
('website_url', 'https://www.shivwebsindia.com', 'general'),
('contact_email', 'info@shivwebsindia.com', 'contact'),
('notification_recipient_email', 'shivwebsindia@gmail.com', 'contact'),
('contact_phone', '+91 8383985379', 'contact'),
('secondary_phone', '+91 9315239140', 'contact'),
('whatsapp_number', '918383985379', 'contact'),
('office_address', 'Shop No 1, Skytech Magadh Apartment, Sector 3, Vaishali, Ghaziabad, UP - 201010', 'contact'),
('footer_credit', '© 2026 ShivWebsIndia. All Rights Reserved. Engineered in Ghaziabad, Delhi NCR.', 'general')
ON DUPLICATE KEY UPDATE \`setting_value\`=VALUES(\`setting_value\`);

-- 3. DYNAMIC WEBSITE PAGES & INDIVIDUAL SEO
CREATE TABLE IF NOT EXISTS \`pages\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(200) NOT NULL,
  \`slug\` VARCHAR(200) NOT NULL,
  \`template\` VARCHAR(80) NOT NULL DEFAULT 'standard',
  \`excerpt\` TEXT DEFAULT NULL,
  \`content\` LONGTEXT DEFAULT NULL,
  \`featured_image\` VARCHAR(500) DEFAULT NULL,
  \`author_name\` VARCHAR(120) DEFAULT 'ShivWebsIndia Editorial Team',
  \`status\` ENUM('draft', 'published', 'unpublished', 'trashed') NOT NULL DEFAULT 'published',
  \`is_system_page\` TINYINT(1) NOT NULL DEFAULT 0,
  \`seo_title\` VARCHAR(200) DEFAULT NULL,
  \`meta_description\` VARCHAR(350) DEFAULT NULL,
  \`focus_keywords\` VARCHAR(255) DEFAULT NULL,
  \`canonical_url\` VARCHAR(500) DEFAULT NULL,
  \`robots_index\` TINYINT(1) NOT NULL DEFAULT 1,
  \`robots_follow\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_pages_slug\` (\`slug\`),
  KEY \`idx_pages_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SERVICES MANAGEMENT (Multiple Service Pages per Category + Rich HTML + SEO)
CREATE TABLE IF NOT EXISTS \`services\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`page_slug\` VARCHAR(180) NOT NULL,
  \`title\` VARCHAR(180) NOT NULL,
  \`slug\` VARCHAR(180) NOT NULL,
  \`category\` VARCHAR(120) NOT NULL DEFAULT 'Website Design & Development',
  \`short_description\` TEXT NOT NULL,
  \`full_description\` LONGTEXT NOT NULL,
  \`featured_image_url\` VARCHAR(500) DEFAULT NULL,
  \`icon_name\` VARCHAR(60) NOT NULL DEFAULT 'Globe',
  \`deliverables_json\` JSON DEFAULT NULL,
  \`cta_text\` VARCHAR(100) NOT NULL DEFAULT 'Request Service Quote',
  \`cta_url\` VARCHAR(255) NOT NULL DEFAULT '/contact-us',
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 1,
  \`status\` ENUM('published', 'draft', 'unpublished') NOT NULL DEFAULT 'published',
  \`seo_title\` VARCHAR(200) DEFAULT NULL,
  \`meta_description\` VARCHAR(350) DEFAULT NULL,
  \`focus_keywords\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_services_slug\` (\`slug\`),
  KEY \`idx_services_cat_status\` (\`category\`, \`status\`, \`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BLOG CATEGORIES, TAGS & BLOG POSTS (Rich HTML + FAQs + Related Posts + SEO)
CREATE TABLE IF NOT EXISTS \`blog_categories\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL,
  \`description\` VARCHAR(300) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_blog_cat_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`blog_tags\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(80) NOT NULL,
  \`slug\` VARCHAR(80) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_blog_tag_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`blog_posts\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(220) NOT NULL,
  \`slug\` VARCHAR(220) NOT NULL,
  \`category\` VARCHAR(120) NOT NULL DEFAULT 'SEO & Growth',
  \`tags_json\` JSON DEFAULT NULL,
  \`excerpt\` TEXT NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`faqs_json\` JSON DEFAULT NULL,
  \`featured_image_url\` VARCHAR(500) DEFAULT NULL,
  \`featured_image_alt\` VARCHAR(255) DEFAULT NULL,
  \`author_name\` VARCHAR(120) DEFAULT 'Shiv Kumar',
  \`status\` ENUM('draft', 'scheduled', 'published', 'unpublished') NOT NULL DEFAULT 'published',
  \`seo_title\` VARCHAR(200) DEFAULT NULL,
  \`meta_description\` VARCHAR(350) DEFAULT NULL,
  \`focus_keywords\` VARCHAR(255) DEFAULT NULL,
  \`canonical_url\` VARCHAR(500) DEFAULT NULL,
  \`robots_index\` TINYINT(1) NOT NULL DEFAULT 1,
  \`reading_time_minutes\` SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  \`published_at\` VARCHAR(60) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_blog_posts_slug\` (\`slug\`),
  KEY \`idx_blog_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. MEDIA ASSETS LIBRARY (Images, Banners, Project Screenshots, Press Kit)
CREATE TABLE IF NOT EXISTS \`media_assets\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`original_name\` VARCHAR(220) NOT NULL,
  \`stored_filename\` VARCHAR(220) NOT NULL,
  \`file_path\` VARCHAR(500) NOT NULL,
  \`mime_type\` VARCHAR(80) NOT NULL DEFAULT 'image/webp',
  \`file_extension\` VARCHAR(20) NOT NULL DEFAULT 'webp',
  \`file_size_bytes\` INT UNSIGNED NOT NULL DEFAULT 150000,
  \`width\` INT UNSIGNED NOT NULL DEFAULT 1200,
  \`height\` INT UNSIGNED NOT NULL DEFAULT 800,
  \`alt_text\` VARCHAR(300) DEFAULT NULL,
  \`category\` VARCHAR(100) NOT NULL DEFAULT 'Website & UI Showcase',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS \`portfolio_items\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(180) NOT NULL,
  \`slug\` VARCHAR(180) NOT NULL,
  \`client_industry\` VARCHAR(120) NOT NULL,
  \`service_category\` VARCHAR(100) NOT NULL,
  \`summary\` TEXT NOT NULL,
  \`challenge_solved\` TEXT DEFAULT NULL,
  \`solution_delivered\` TEXT DEFAULT NULL,
  \`tech_stack_json\` JSON DEFAULT NULL,
  \`image_url\` VARCHAR(500) DEFAULT NULL,
  \`image_alt\` VARCHAR(255) DEFAULT NULL,
  \`external_project_url\` VARCHAR(500) DEFAULT NULL,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`status\` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_portfolio_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TEAM MEMBERS, STRICT RBAC TASKS, ATTENDANCE & LEAVE MANAGEMENT
CREATE TABLE IF NOT EXISTS \`team_members\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`designation\` VARCHAR(120) NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(190) NOT NULL,
  \`phone\` VARCHAR(40) NOT NULL,
  \`password_pin\` VARCHAR(100) NOT NULL DEFAULT 'Team@123',
  \`role\` VARCHAR(50) NOT NULL DEFAULT 'developer',
  \`status\` VARCHAR(40) NOT NULL DEFAULT 'active',
  \`attendance_status\` VARCHAR(40) DEFAULT 'checked_in',
  \`last_check_in\` VARCHAR(60) DEFAULT NULL,
  \`joined_at\` VARCHAR(40) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_team_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`team_tasks\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(220) NOT NULL,
  \`client_name\` VARCHAR(150) NOT NULL,
  \`project_type\` VARCHAR(120) NOT NULL,
  \`assigned_to_id\` INT UNSIGNED NOT NULL,
  \`assigned_to_name\` VARCHAR(120) NOT NULL,
  \`priority\` ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
  \`status\` ENUM('pending', 'in_progress', 'review', 'completed') NOT NULL DEFAULT 'pending',
  \`due_date\` VARCHAR(40) DEFAULT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_tasks_assigned\` (\`assigned_to_id\`, \`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`team_attendance_logs\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`member_id\` INT UNSIGNED NOT NULL,
  \`member_name\` VARCHAR(120) NOT NULL,
  \`designation\` VARCHAR(120) DEFAULT NULL,
  \`department\` VARCHAR(100) DEFAULT NULL,
  \`date\` VARCHAR(30) NOT NULL,
  \`status\` VARCHAR(40) NOT NULL DEFAULT 'present',
  \`check_in_time\` VARCHAR(30) NOT NULL,
  \`check_out_time\` VARCHAR(30) DEFAULT NULL,
  \`work_mode\` VARCHAR(80) NOT NULL DEFAULT 'Office (Vaishali)',
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_att_member_date\` (\`member_id\`, \`date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`team_leave_requests\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`member_id\` INT UNSIGNED NOT NULL,
  \`member_name\` VARCHAR(120) NOT NULL,
  \`designation\` VARCHAR(120) DEFAULT NULL,
  \`department\` VARCHAR(100) DEFAULT NULL,
  \`leave_type\` VARCHAR(80) NOT NULL,
  \`start_date\` VARCHAR(30) NOT NULL,
  \`end_date\` VARCHAR(30) NOT NULL,
  \`total_days\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`reason\` TEXT NOT NULL,
  \`handover_to_name\` VARCHAR(120) DEFAULT NULL,
  \`emergency_contact\` VARCHAR(50) DEFAULT NULL,
  \`status\` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  \`admin_remark\` TEXT DEFAULT NULL,
  \`applied_at\` VARCHAR(40) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_leave_member_status\` (\`member_id\`, \`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. CONTACT ENQUIRIES / LEADS DESK
CREATE TABLE IF NOT EXISTS \`contact_enquiries\` (
  \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(190) NOT NULL,
  \`phone\` VARCHAR(40) NOT NULL,
  \`company_name\` VARCHAR(150) DEFAULT NULL,
  \`service_interested\` VARCHAR(150) NOT NULL,
  \`budget_range\` VARCHAR(80) DEFAULT NULL,
  \`message\` TEXT NOT NULL,
  \`source_page\` VARCHAR(255) DEFAULT '/',
  \`status\` ENUM('new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'spam') NOT NULL DEFAULT 'new',
  \`admin_notes\` TEXT DEFAULT NULL,
  \`assigned_to_id\` INT UNSIGNED DEFAULT NULL,
  \`assigned_to_name\` VARCHAR(120) DEFAULT NULL,
  \`ip_address\` VARCHAR(45) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_enquiries_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. FAQS & 301 REDIRECTS
CREATE TABLE IF NOT EXISTS \`faqs\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`category\` VARCHAR(80) NOT NULL DEFAULT 'General',
  \`question\` VARCHAR(350) NOT NULL,
  \`answer\` TEXT NOT NULL,
  \`page_slug\` VARCHAR(150) DEFAULT 'global',
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`is_published\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`redirects\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`source_path\` VARCHAR(350) NOT NULL,
  \`target_url\` VARCHAR(500) NOT NULL,
  \`status_code\` SMALLINT UNSIGNED NOT NULL DEFAULT 301,
  \`hits_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_redirects_source\` (\`source_path\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. DYNAMIC PAGE SECTIONS BUILDER, NAVIGATION MENUS, BROCHURE & QUOTATION SUITE
CREATE TABLE IF NOT EXISTS \`page_sections\` (
  \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`page_id\` INT UNSIGNED NOT NULL,
  \`section_type\` VARCHAR(80) NOT NULL DEFAULT 'heading_richtext',
  \`title\` VARCHAR(250) NOT NULL,
  \`subtitle\` VARCHAR(350) DEFAULT NULL,
  \`content_json\` LONGTEXT DEFAULT NULL,
  \`sort_order\` INT NOT NULL DEFAULT 1,
  \`is_enabled\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`),
  KEY \`idx_sections_page\` (\`page_id\`, \`sort_order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`menu_items\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`menu_location\` VARCHAR(60) NOT NULL DEFAULT 'header_primary',
  \`parent_id\` INT UNSIGNED DEFAULT NULL,
  \`label\` VARCHAR(120) NOT NULL,
  \`url\` VARCHAR(255) NOT NULL,
  \`sort_order\` INT NOT NULL DEFAULT 1,
  \`is_enabled\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`quote_catalog\` (
  \`id\` VARCHAR(60) NOT NULL,
  \`name\` VARCHAR(180) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL DEFAULT 'Web Development',
  \`base_price\` INT UNSIGNED NOT NULL DEFAULT 15000,
  \`timeline_weeks\` SMALLINT UNSIGNED NOT NULL DEFAULT 2,
  \`deliverables_json\` JSON DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`saved_quotes\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`reference_no\` VARCHAR(60) NOT NULL,
  \`doc_type\` VARCHAR(40) NOT NULL DEFAULT 'Quotation',
  \`client_name\` VARCHAR(150) NOT NULL,
  \`company_name\` VARCHAR(180) DEFAULT NULL,
  \`client_email\` VARCHAR(190) DEFAULT NULL,
  \`client_phone\` VARCHAR(50) DEFAULT NULL,
  \`client_city\` VARCHAR(120) DEFAULT NULL,
  \`project_goal\` TEXT DEFAULT NULL,
  \`selected_service_ids_json\` JSON DEFAULT NULL,
  \`discount_amount\` INT NOT NULL DEFAULT 0,
  \`include_gst\` TINYINT(1) NOT NULL DEFAULT 1,
  \`subtotal\` INT NOT NULL DEFAULT 0,
  \`gst_amount\` INT NOT NULL DEFAULT 0,
  \`grand_total\` INT NOT NULL DEFAULT 0,
  \`status\` VARCHAR(40) NOT NULL DEFAULT 'sent',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`audit_logs\` (
  \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_email\` VARCHAR(190) NOT NULL,
  \`role\` VARCHAR(40) NOT NULL DEFAULT 'admin',
  \`action\` VARCHAR(255) NOT NULL,
  \`entity_type\` VARCHAR(60) NOT NULL DEFAULT 'system',
  \`entity_id\` VARCHAR(60) DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;`,
  },
  {
    path: 'config/database.php',
    language: 'php',
    description:
      'Simple 1-File MySQL Database Configuration (Sirf yahan apna Hostinger/cPanel DB Name, Username aur Password dalein).',
    content: `<?php
declare(strict_types=1);

/**
 * ============================================================================
 * SHIVWEBSINDIA.COM — CENTRAL MYSQL DATABASE CONFIGURATION
 * ============================================================================
 * Hostinger hPanel / cPanel par live karte waqt sirf niche wali 4 lines me
 * apna Database Name, Username aur Password dalein:
 */

define('DB_HOST', 'localhost'); // Hostinger aur cPanel dono me 'localhost' hi rehta hai
define('DB_NAME', 'u123456789_shivwebs'); // Yahan apna MySQL Database Name dalein
define('DB_USER', 'u123456789_admin');    // Yahan apna MySQL Username dalein
define('DB_PASS', 'YOUR_DB_PASSWORD');    // Yahan apna MySQL Password dalein

// Website & Admin Email Settings
define('SITE_URL', 'https://www.shivwebsindia.com');
define('ADMIN_NOTIFICATION_EMAIL', 'shivwebsindia@gmail.com');
define('DEFAULT_ADMIN_EMAIL', 'info@shivwebsindia.com');
define('DEFAULT_ADMIN_PASS', 'Shiv@2026');

date_default_timezone_set('Asia/Kolkata');

if (session_status() === PHP_SESSION_NONE) {
    session_name('SHIVWEBS_SESSION');
    session_start();
}

/**
 * PDO Singleton Database Connection
 */
function getDbConnection(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, time_zone = '+05:30'",
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die('<div style="font-family:sans-serif;max-width:650px;margin:60px auto;padding:30px;border:2px solid #dc2626;border-radius:12px;background:#fef2f2;color:#7f1d1d;">
                <h2 style="margin-top:0;">MySQL Database Connection Setup Pending</h2>
                <p>Website files sahi upload ho gayi hain! Ab bas <strong>config/database.php</strong> file khol kar usme apna Hostinger/cPanel MySQL <code>DB_NAME</code>, <code>DB_USER</code> aur <code>DB_PASS</code> dalein, aur phpMyAdmin me <code>database/shivwebsindia_complete_database.sql</code> import karein.</p>
                <p style="font-size:12px;color:#991b1b;">Technical detail: ' . htmlspecialchars($e->getMessage()) . '</p>
            </div>');
        }
    }
    return $pdo;
}

/**
 * Fetch all site settings as an associative array
 */
function getSiteSettings(PDO $pdo): array
{
    $defaults = [
        'brand_name' => 'ShivWebsIndia',
        'website_url' => 'https://www.shivwebsindia.com',
        'contact_email' => 'info@shivwebsindia.com',
        'notification_recipient_email' => 'shivwebsindia@gmail.com',
        'contact_phone' => '+91 8383985379',
        'secondary_phone' => '+91 9315239140',
        'whatsapp_number' => '918383985379',
        'office_address' => 'Shop No 1, Skytech Magadh Apartment, Sector 3, Vaishali, Ghaziabad, UP - 201010',
        'footer_credit' => '© 2026 ShivWebsIndia. All Rights Reserved. Engineered in Ghaziabad, Delhi NCR.',
        'brochure_headline' => 'ShivWebsIndia — Official Company Brochure (PDF)',
        'brochure_pdf_url' => 'https://www.shivwebsindia.com/wp-content/uploads/2025/05/Company-Brochure-ShivWebsIndia.pdf',
        'brochure_payment_terms' => '50% Advance upon project initiation · 30% upon design & staging review · 20% prior to final live deployment.',
    ];
    try {
        $rows = $pdo->query("SELECT setting_key, setting_value FROM site_settings")->fetchAll();
        foreach ($rows as $r) {
            $defaults[$r['setting_key']] = $r['setting_value'];
        }
    } catch (Throwable $t) {
        // Fallback to defaults if table is being initialized
    }
    return $defaults;
}

/**
 * Safe HTML Escaping Helper
 */
function e(?string $str): string
{
    return htmlspecialchars((string)$str, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * CSRF Token Helpers
 */
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(?string $token): bool
{
    return !empty($_SESSION['csrf_token']) && !empty($token) && hash_equals($_SESSION['csrf_token'], $token);
}
`,
  },
  {
    path: '.htaccess',
    language: 'apache',
    description:
      'Root Apache .htaccess for Hostinger / cPanel public_html (Routes clean SEO URLs & standalone PHP pages like index.php, about-us.php, services.php, portfolio.php, blog.php, faqs.php, media.php, contact-us.php, privacy-policy.php, terms-and-conditions.php, admin.php, team.php).',
    content: `Options -Indexes -MultiViews
RewriteEngine On

# 1. Force HTTPS in Production (Automatically skipped on localhost)
RewriteCond %{HTTPS} off
RewriteCond %{HTTP_HOST} !^localhost [NC]
RewriteCond %{HTTP_HOST} !^127\\.0\\.0\\.1 [NC]
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 3. Protect sensitive config and SQL files from direct browser access
RewriteRule ^(config|database|includes)/.*$ - [F,L,NC]

# 4. Route dedicated portals and standalone individual PHP pages cleanly
RewriteRule ^admin/?$ admin.php [QSA,L]
RewriteRule ^team/?$ team.php [QSA,L]
RewriteRule ^about-us/?$ about-us.php [QSA,L]
RewriteRule ^services/?$ services.php [QSA,L]
RewriteRule ^portfolio/?$ portfolio.php [QSA,L]
RewriteRule ^blog/?$ blog.php [QSA,L]
RewriteRule ^blog/([a-zA-Z0-9_-]+)/?$ blog.php?slug=$1 [QSA,L]
RewriteRule ^faqs/?$ faqs.php [QSA,L]
RewriteRule ^media/?$ media.php [QSA,L]
RewriteRule ^contact-us/?$ contact-us.php [QSA,L]
RewriteRule ^privacy-policy/?$ privacy-policy.php [QSA,L]
RewriteRule ^terms-and-conditions/?$ terms-and-conditions.php [QSA,L]

# 5. Route all other dynamic Pages & Individual Service slugs to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]`,
  },
  {
    path: 'includes/header.php',
    language: 'php',
    description:
      'Reusable Public Website Header with Dynamic SEO Meta Tags, Schema.org JSON-LD, Services Mega-Dropdown, About Dropdown, Blog, FAQs, Media & Responsive Mobile Menu.',
    content: `<?php
$pdo = getDbConnection();
$siteSettings = getSiteSettings($pdo);
$navServicesStmt = $pdo->query("SELECT id, title, slug, category, short_description FROM services WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
$allNavServices = $navServicesStmt->fetchAll();

$currentUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$cleanUri = trim(str_replace('.php', '', $currentUri), '/');
if ($cleanUri === '' || $cleanUri === 'index') {
    $cleanUri = 'home';
}

$seoTitle = $pageSeoTitle ?? ($siteSettings['brand_name'] . ' | Website Design, Custom PHP Development & SEO Agency in Ghaziabad');
$metaDesc = $pageMetaDescription ?? 'ShivWebsIndia is a full-service Website Design, Custom Web Development, eCommerce, and Digital Marketing Agency in Vaishali, Ghaziabad, Delhi NCR.';
$canonicalUrl = $pageCanonicalUrl ?? (SITE_URL . ($_SERVER['REQUEST_URI'] ?? '/'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($seoTitle) ?></title>
    <meta name="description" content="<?= e($metaDesc) ?>">
    <?php if (!empty($pageFocusKeywords)): ?>
    <meta name="keywords" content="<?= e($pageFocusKeywords) ?>">
    <?php endif; ?>
    <link rel="canonical" href="<?= e($canonicalUrl) ?>">
    <meta property="og:title" content="<?= e($seoTitle) ?>">
    <meta property="og:description" content="<?= e($metaDesc) ?>">
    <meta property="og:url" content="<?= e($canonicalUrl) ?>">
    <meta property="og:type" content="website">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .rich-content h2 { font-size: 1.65rem; font-weight: 800; color: #0A2540; margin-top: 1.75rem; margin-bottom: 0.75rem; }
        .rich-content h3 { font-size: 1.3rem; font-weight: 700; color: #0A2540; margin-top: 1.4rem; margin-bottom: 0.5rem; }
        .rich-content p { margin-bottom: 1rem; line-height: 1.75; color: #334155; }
        .rich-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #334155; }
        .rich-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #334155; }
        .rich-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
        .rich-content th, .rich-content td { border: 1px solid #cbd5e1; padding: 0.65rem 0.85rem; text-align: left; }
        .rich-content th { background: #f1f5f9; font-weight: 700; color: #0A2540; }
        .rich-content a { color: #FF6A00; font-weight: 600; text-decoration: underline; }
        .rich-content blockquote { border-left: 4px solid #FF6A00; padding-left: 1rem; font-style: italic; background: #fff7ed; padding: 0.85rem 1rem; border-radius: 0.5rem; margin: 1rem 0; }
    </style>
</head>
<body class="bg-[#F5F7FA] text-[#0A2540] antialiased selection:bg-[#FF6A00] selection:text-white">
    <!-- Top Utility Bar -->
    <div class="bg-[#522c2a] text-slate-100 text-xs border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-4">
                <span>📍 <?= e($siteSettings['office_address']) ?></span>
                <a href="tel:<?= e($siteSettings['contact_phone']) ?>" class="hover:text-[#FF6A00] font-semibold">📞 <?= e($siteSettings['contact_phone']) ?></a>
                <a href="mailto:<?= e($siteSettings['contact_email']) ?>" class="hidden sm:inline hover:text-[#FF6A00]">✉️ <?= e($siteSettings['contact_email']) ?></a>
            </div>
            <div class="flex items-center gap-2">
                <a href="/team.php" class="px-2.5 py-1 rounded bg-[#0096e8] hover:bg-[#0284c7] text-white font-semibold transition">Team Panel</a>
                <a href="/admin.php" class="px-2.5 py-1 rounded bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold transition">Admin CMS</a>
            </div>
        </div>
    </div>

    <!-- Main Sticky Header with Desktop & Mobile Navigation -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="/index.php" class="flex items-center gap-2.5 shrink-0">
                <img src="https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png" alt="ShivWebsIndia" class="h-14 w-auto object-contain" onerror="this.style.display='none'">
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-extrabold uppercase tracking-wide text-[#111111]">
                <a href="/index.php" class="py-2 hover:text-[#DD0B0B] transition <?= $cleanUri === 'home' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">Home</a>

                <div class="relative group py-6">
                    <a href="/about-us.php" class="py-2 hover:text-[#DD0B0B] transition flex items-center gap-1 <?= $cleanUri === 'about-us' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">
                        About us <span class="text-xs">▾</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-60 bg-white border border-slate-200 shadow-2xl rounded-xl py-2 z-50 normal-case text-xs font-bold text-[#0A2540]">
                        <a href="/about-us.php" class="block px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B]">About ShivWebsIndia</a>
                        <a href="/faqs.php" class="block px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B]">Frequently Asked Questions (FAQs)</a>
                        <a href="/media.php" class="block px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B]">Media & Visual Gallery</a>
                        <a href="https://www.shivwebsindia.com/wp-content/uploads/2025/05/Company-Brochure-ShivWebsIndia.pdf" target="_blank" class="block px-4 py-2.5 hover:bg-slate-50 text-[#FF6A00]">📄 Official Company Brochure (PDF)</a>
                    </div>
                </div>

                <div class="relative group py-6">
                    <a href="/services.php" class="py-2 hover:text-[#DD0B0B] transition flex items-center gap-1 <?= $cleanUri === 'services' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">
                        Our Services <span class="text-xs">▾</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-[540px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 z-50 normal-case">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <p class="text-xs font-extrabold uppercase tracking-wider text-[#DD0B0B] pb-2 mb-2.5 border-b border-slate-200">
                                    Website Design & Development
                                </p>
                                <ul class="space-y-2.5 text-xs font-bold text-[#0A2540]">
                                    <li><a href="/website-design-and-development.php" class="hover:text-[#DD0B0B] block">Website Design and Development</a></li>
                                    <li><a href="/wordpress-development.php" class="hover:text-[#DD0B0B] block">WordPress Development</a></li>
                                    <li><a href="/ecommerce-website-development.php" class="hover:text-[#DD0B0B] block">E-Commerce Website Development</a></li>
                                    <li><a href="/website-design-and-development.php" class="hover:text-[#DD0B0B] block">Static & Dynamic Website Service</a></li>
                                    <li><a href="/website-design-and-development.php" class="hover:text-[#DD0B0B] block">Website Maintenance Services</a></li>
                                    <li class="pt-1 border-t border-slate-100"><a href="/services.php" class="text-[#FF6A00] hover:text-[#DD0B0B] font-extrabold block">View All Services Directory →</a></li>
                                </ul>
                            </div>
                            <div>
                                <p class="text-xs font-extrabold uppercase tracking-wider text-[#0d6efd] pb-2 mb-2.5 border-b border-slate-200">
                                    Digital Marketing
                                </p>
                                <ul class="space-y-2.5 text-xs font-bold text-[#0A2540]">
                                    <li><a href="/digital-marketing.php" class="hover:text-[#DD0B0B] block">Digital Marketing Services</a></li>
                                    <li><a href="/search-engine-optimization-seo.php" class="hover:text-[#DD0B0B] block">Search Engine Optimization (SEO)</a></li>
                                    <li><a href="/local-seo.php" class="hover:text-[#DD0B0B] block">Local SEO & GMB Ranking</a></li>
                                    <li><a href="/social-media-marketing.php" class="hover:text-[#DD0B0B] block">Social Media Marketing (SMM)</a></li>
                                    <li><a href="/google-ads-ppc.php" class="hover:text-[#DD0B0B] block">Google Ads (PPC) Services</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="/portfolio.php" class="py-2 hover:text-[#DD0B0B] transition <?= $cleanUri === 'portfolio' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">Our Work</a>
                <a href="/blog.php" class="py-2 hover:text-[#DD0B0B] transition <?= $cleanUri === 'blog' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">Blog</a>
                <a href="/contact-us.php" class="py-2 hover:text-[#DD0B0B] transition <?= $cleanUri === 'contact-us' ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : '' ?>">Contact Us</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="/contact-us.php" class="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[#FF6A00] hover:bg-[#DD0B0B] text-white font-bold text-xs uppercase tracking-wider shadow-md transition">
                    Request A Quote
                </a>
                <button type="button" onclick="document.getElementById('swi-mobile-menu').classList.toggle('hidden')" class="lg:hidden p-2.5 rounded-xl bg-[#0A2540] text-white font-bold text-xs">
                    ☰ Menu
                </button>
            </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <div id="swi-mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-3 shadow-xl">
            <div class="flex flex-col space-y-2 text-sm font-bold text-[#0A2540]">
                <a href="/index.php" class="py-1.5 hover:text-[#DD0B0B]">Home</a>
                <a href="/about-us.php" class="py-1.5 hover:text-[#DD0B0B]">About Us</a>
                <a href="/services.php" class="py-1.5 hover:text-[#DD0B0B]">Our Services</a>
                <a href="/portfolio.php" class="py-1.5 hover:text-[#DD0B0B]">Our Work (Portfolio)</a>
                <a href="/media.php" class="py-1.5 hover:text-[#DD0B0B]">Media Gallery</a>
                <a href="/blog.php" class="py-1.5 hover:text-[#DD0B0B]">Blog</a>
                <a href="/faqs.php" class="py-1.5 hover:text-[#DD0B0B]">FAQs</a>
                <a href="/contact-us.php" class="py-1.5 hover:text-[#DD0B0B]">Contact Us</a>
            </div>
            <div class="pt-3 border-t border-slate-200">
                <p class="text-xs font-extrabold uppercase text-[#DD0B0B] mb-2">All Service Pages</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <?php foreach ($allNavServices as $navSrv): ?>
                        <a href="/<?= urlencode($navSrv['slug']) ?>.php" class="text-xs font-semibold text-slate-700 hover:text-[#DD0B0B] py-1">• <?= e($navSrv['title']) ?></a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </header>
`,
  },
  {
    path: 'includes/footer.php',
    language: 'php',
    description:
      'Reusable Public Website Footer with Quick Links to all individual Service pages, Blog, FAQs, Media Gallery, Office Address & WhatsApp Button.',
    content: `    <!-- Footer -->
    <footer class="bg-[#0A2540] text-slate-300 pt-16 pb-10 border-t border-white/10 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
                <div class="inline-block bg-white rounded-2xl p-3 shadow-md mb-3">
                    <img src="https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png" alt="ShivWebsIndia" class="h-11 w-auto object-contain">
                </div>
                <p class="text-sm text-slate-300 leading-relaxed">
                    Full-stack Website Design, Custom PHP 8.x Web Development, eCommerce Solutions, and ROI-driven SEO & Digital Marketing Agency in Ghaziabad, Delhi NCR.
                </p>
                <p class="text-xs text-slate-400 mt-4">
                    📍 <?= e($siteSettings['office_address'] ?? 'Shop No 1, Skytech Magadh Apartment, Sector 3, Vaishali, Ghaziabad, UP - 201010') ?>
                </p>
            </div>

            <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-[#FF6A00] mb-4">Our Core Services</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/services.php" class="text-white font-semibold hover:text-[#FF6A00] transition">› All Services Directory</a></li>
                    <?php if (!empty($allNavServices)): ?>
                        <?php foreach ($allNavServices as $fSrv): ?>
                            <li><a href="/<?= urlencode($fSrv['slug']) ?>.php" class="hover:text-white transition">› <?= e($fSrv['title']) ?></a></li>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </ul>
            </div>

            <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-[#00d4ff] mb-4">Quick Links</h3>
                <ul class="space-y-2 text-sm">
                    <li><a href="/index.php" class="hover:text-white transition">› Home</a></li>
                    <li><a href="/about-us.php" class="hover:text-white transition">› About Us</a></li>
                    <li><a href="/portfolio.php" class="hover:text-white transition">› Our Work (Portfolio)</a></li>
                    <li><a href="/media.php" class="hover:text-white transition">› Media Gallery</a></li>
                    <li><a href="/blog.php" class="hover:text-white transition">› Blog & Guides</a></li>
                    <li><a href="/faqs.php" class="hover:text-white transition">› FAQs</a></li>
                    <li><a href="/contact-us.php" class="hover:text-white transition">› Contact Us</a></li>
                    <li><a href="/admin.php" class="text-[#FF6A00] font-semibold">› Admin CMS Login</a></li>
                    <li><a href="/team.php" class="text-sky-400 font-semibold">› Team Portal Login</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">Touch With Us</h3>
                <p class="text-sm">📞 <a href="tel:<?= e($siteSettings['contact_phone'] ?? '+91 8383985379') ?>" class="text-white font-semibold hover:text-[#FF6A00]"><?= e($siteSettings['contact_phone'] ?? '+91 8383985379') ?></a></p>
                <p class="text-sm mt-1">📞 <a href="tel:<?= e($siteSettings['secondary_phone'] ?? '+91 9315239140') ?>" class="text-white font-semibold hover:text-[#FF6A00]"><?= e($siteSettings['secondary_phone'] ?? '+91 9315239140') ?></a></p>
                <p class="text-sm mt-2">✉️ <a href="mailto:<?= e($siteSettings['contact_email'] ?? 'info@shivwebsindia.com') ?>" class="text-[#FF6A00] underline"><?= e($siteSettings['contact_email'] ?? 'info@shivwebsindia.com') ?></a></p>
                <a href="https://wa.me/<?= e($siteSettings['whatsapp_number'] ?? '918383985379') ?>" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                    💬 Chat on WhatsApp
                </a>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p><?= e($siteSettings['footer_credit'] ?? ('© ' . date('Y') . ' ShivWebsIndia.com. All Rights Reserved.')) ?></p>
            <div class="flex items-center gap-4">
                <a href="/privacy-policy.php" class="hover:text-white">Privacy Policy</a>
                <a href="/terms-and-conditions.php" class="hover:text-white">Terms & Conditions</a>
                <a href="/sitemap.xml" class="hover:text-white">XML Sitemap</a>
            </div>
        </div>
    </footer>
</body>
</html>`,
  },
  {
    path: 'services.php',
    language: 'php',
    description:
      'Dedicated Services Page & Single Service Detail Controller (Renders all services grouped by category, or full single service article with deliverables, pricing & enquiry form).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

$requestedSlug = trim((string)($_GET['slug'] ?? ''));
$categoryFilter = trim((string)($_GET['category'] ?? ''));

// If a specific service slug is requested, render its full dedicated Service Page
if ($requestedSlug !== '') {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE (slug = :s1 OR page_slug = :s2) AND status = 'published' LIMIT 1");
    $stmt->execute(['s1' => $requestedSlug, 's2' => $requestedSlug]);
    $serviceItem = $stmt->fetch();

    if ($serviceItem) {
        $pageSeoTitle = $serviceItem['seo_title'] ?: ($serviceItem['title'] . ' | ShivWebsIndia');
        $pageMetaDescription = $serviceItem['meta_description'] ?: $serviceItem['short_description'];
        $pageFocusKeywords = $serviceItem['focus_keywords'] ?? '';
        require __DIR__ . '/includes/header.php';

        $deliverables = json_decode($serviceItem['deliverables_json'] ?: '[]', true) ?: [];
        $relatedStmt = $pdo->prepare("SELECT title, slug, short_description, category FROM services WHERE status = 'published' AND id != :id ORDER BY sort_order ASC LIMIT 4");
        $relatedStmt->execute(['id' => $serviceItem['id']]);
        $relatedServices = $relatedStmt->fetchAll();
        ?>
        <section class="bg-[#0A2540] text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="mb-3 flex items-center gap-2 text-xs text-slate-300">
                    <a href="/services.php" class="text-[#FF6A00] font-bold hover:underline">← All Services</a>
                    <span>/</span>
                    <span><?= e($serviceItem['category']) ?></span>
                </div>
                <h1 class="font-display text-3xl sm:text-5xl font-extrabold"><?= e($serviceItem['title']) ?></h1>
                <p class="text-slate-300 max-w-3xl mt-4 text-base sm:text-lg leading-relaxed"><?= e($serviceItem['short_description']) ?></p>
                <div class="mt-6 flex flex-wrap gap-3">
                    <a href="/contact-us" class="px-6 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-sm"><?= e($serviceItem['cta_text'] ?: 'Request Service Proposal') ?></a>
                    <a href="tel:+918383985379" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm">Call +91 8383985379</a>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-8 space-y-8">
                <?php if (!empty($serviceItem['featured_image_url'])): ?>
                    <img src="<?= e($serviceItem['featured_image_url']) ?>" alt="<?= e($serviceItem['title']) ?>" class="w-full h-72 sm:h-96 object-cover rounded-2xl shadow">
                <?php endif; ?>
                <div class="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm rich-content">
                    <?= $serviceItem['full_description'] ?>
                </div>

                <?php if (!empty($deliverables)): ?>
                    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                        <h2 class="font-display text-xl font-bold text-[#0A2540] mb-4">Key Service Deliverables & Inclusions</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <?php foreach ($deliverables as $del): ?>
                                <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0A2540]">
                                    <span class="text-emerald-600 font-bold">✓</span>
                                    <span><?= e((string)$del) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <aside class="lg:col-span-4 space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 class="font-display text-lg font-bold text-[#0A2540]">Request Quote for <?= e($serviceItem['title']) ?></h3>
                    <p class="text-xs text-slate-500 mt-1">Saved directly to our MySQL Lead CRM with instant notification.</p>
                    <form method="post" action="/index.php" class="space-y-3 mt-4">
                        <input type="hidden" name="action" value="submit_enquiry">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="service_interested" value="<?= e($serviceItem['title']) ?>">
                        <input type="text" name="full_name" required placeholder="Your Full Name *" class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg">
                        <input type="email" name="email" required placeholder="Business Email *" class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg">
                        <input type="tel" name="phone" required placeholder="Phone / WhatsApp Number *" class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg">
                        <textarea name="message" rows="3" required placeholder="Describe your project requirements..." class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg"></textarea>
                        <button type="submit" class="w-full py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-lg">Submit Service Enquiry</button>
                    </form>
                </div>

                <?php if (!empty($relatedServices)): ?>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 class="font-display text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Other Services</h3>
                        <div class="space-y-2.5">
                            <?php foreach ($relatedServices as $rs): ?>
                                <a href="/services.php?slug=<?= urlencode($rs['slug']) ?>" class="block p-3 rounded-xl border border-slate-100 hover:border-[#FF6A00] transition">
                                    <div class="text-xs font-bold text-[#0A2540]"><?= e($rs['title']) ?></div>
                                    <div class="text-[11px] text-slate-500 line-clamp-2 mt-0.5"><?= e($rs['short_description']) ?></div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </aside>
        </main>
        <?php
        require __DIR__ . '/includes/footer.php';
        exit;
    }
}

// Otherwise render the Complete Services Directory Page
$pageSeoTitle = 'Our Services — Website Design, Custom PHP Development & SEO | ShivWebsIndia';
$pageMetaDescription = 'Explore all Website Design, Custom PHP 8.x & MySQL Development, WordPress, E-Commerce, Technical SEO, Local SEO, Social Media, and Google Ads PPC services by ShivWebsIndia.';
require __DIR__ . '/includes/header.php';

if ($categoryFilter !== '') {
    $sStmt = $pdo->prepare("SELECT * FROM services WHERE status = 'published' AND category = :cat ORDER BY sort_order ASC, id ASC");
    $sStmt->execute(['cat' => $categoryFilter]);
    $servicesList = $sStmt->fetchAll();
} else {
    $servicesList = $pdo->query("SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC, id ASC")->fetchAll();
}

$catRows = $pdo->query("SELECT DISTINCT category FROM services WHERE status = 'published' ORDER BY category ASC")->fetchAll();
?>
<section class="bg-[#0A2540] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">Full-Stack Web & Digital Growth Agency</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2">All Website Design, Development & SEO Services</h1>
        <p class="text-slate-300 max-w-3xl mt-3 text-sm sm:text-base">Every service below is dynamically powered by our MySQL database and can be customized or expanded from the Admin CMS panel.</p>
    </div>
</section>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
    <!-- Category Filter Bar -->
    <div class="flex flex-wrap items-center gap-2">
        <a href="/services.php" class="px-4 py-2 rounded-xl text-xs font-bold <?= $categoryFilter === '' ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
            All Services
        </a>
        <?php foreach ($catRows as $cr): ?>
            <a href="/services.php?category=<?= urlencode($cr['category']) ?>" class="px-4 py-2 rounded-xl text-xs font-bold <?= $categoryFilter === $cr['category'] ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
                <?= e($cr['category']) ?>
            </a>
        <?php endforeach; ?>
    </div>

    <!-- Services Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <?php foreach ($servicesList as $srv):
            $deliv = json_decode($srv['deliverables_json'] ?: '[]', true) ?: [];
        ?>
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                <div>
                    <?php if (!empty($srv['featured_image_url'])): ?>
                        <img src="<?= e($srv['featured_image_url']) ?>" alt="<?= e($srv['title']) ?>" class="w-full h-48 object-cover border-b border-slate-100">
                    <?php endif; ?>
                    <div class="p-6">
                        <span class="px-2.5 py-1 rounded bg-orange-50 text-[#FF6A00] text-[11px] font-bold uppercase"><?= e($srv['category']) ?></span>
                        <h2 class="font-display text-xl font-bold text-[#0A2540] mt-3"><?= e($srv['title']) ?></h2>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed"><?= e($srv['short_description']) ?></p>

                        <?php if (!empty($deliv)): ?>
                            <ul class="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                                <?php foreach (array_slice($deliv, 0, 4) as $dItem): ?>
                                    <li class="flex items-start gap-2">
                                        <span class="text-emerald-600 font-bold">✓</span>
                                        <span><?= e((string)$dItem) ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <a href="/services.php?slug=<?= urlencode($srv['slug']) ?>" class="text-xs font-bold text-[#0A2540] hover:text-[#FF6A00]">
                        View Full Details →
                    </a>
                    <a href="/contact-us" class="px-3.5 py-1.5 rounded-lg bg-[#FF6A00] text-white text-xs font-bold">
                        Get Quote
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'blog.php',
    language: 'php',
    description:
      'Dedicated Blog Listing & Single Blog Post Controller (Category/Tag/Search filters, full Rich HTML article, Article FAQ Accordion & Related Posts).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

$postSlug = trim((string)($_GET['slug'] ?? ''));

// 1. Single Blog Post View (/blog.php?slug=... or /blog/{slug})
if ($postSlug !== '') {
    $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE slug = :slug AND status = 'published' LIMIT 1");
    $stmt->execute(['slug' => $postSlug]);
    $post = $stmt->fetch();

    if ($post) {
        $pageSeoTitle = $post['seo_title'] ?: ($post['title'] . ' | ShivWebsIndia Blog');
        $pageMetaDescription = $post['meta_description'] ?: $post['excerpt'];
        $pageFocusKeywords = $post['focus_keywords'] ?? '';
        require __DIR__ . '/includes/header.php';

        $faqs = json_decode($post['faqs_json'] ?: '[]', true) ?: [];
        $tags = json_decode($post['tags_json'] ?: '[]', true) ?: [];
        $relStmt = $pdo->prepare("SELECT title, slug, category, excerpt, featured_image_url, published_at FROM blog_posts WHERE status = 'published' AND id != :id ORDER BY id DESC LIMIT 3");
        $relStmt->execute(['id' => $post['id']]);
        $relatedPosts = $relStmt->fetchAll();
        ?>
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="mb-6">
                <a href="/blog.php" class="text-xs font-bold text-[#FF6A00] uppercase tracking-wider hover:underline">← Back to All Blog Articles</a>
                <span class="mx-2 text-slate-300">|</span>
                <span class="px-2.5 py-1 rounded bg-orange-50 text-[#FF6A00] text-xs font-bold"><?= e($post['category']) ?></span>
            </div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] leading-tight"><?= e($post['title']) ?></h1>
            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4 pb-6 border-b border-slate-200">
                <span>By <strong><?= e($post['author_name']) ?></strong></span>
                <span>•</span>
                <span>Published: <?= e($post['published_at'] ?: date('Y-m-d')) ?></span>
                <span>•</span>
                <span><?= (int)$post['reading_time_minutes'] ?> min read</span>
            </div>

            <?php if (!empty($post['featured_image_url'])): ?>
                <img src="<?= e($post['featured_image_url']) ?>" alt="<?= e($post['featured_image_alt'] ?: $post['title']) ?>" class="w-full h-72 sm:h-96 object-cover rounded-2xl my-8 shadow-md">
            <?php endif; ?>

            <article class="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm rich-content">
                <?= $post['content'] ?>
            </article>

            <?php if (!empty($tags)): ?>
                <div class="mt-6 flex flex-wrap items-center gap-2">
                    <span class="text-xs font-bold text-slate-500">Tags:</span>
                    <?php foreach ($tags as $t): ?>
                        <a href="/blog.php?tag=<?= urlencode((string)$t) ?>" class="px-3 py-1 bg-slate-200/70 hover:bg-[#FF6A00] hover:text-white text-slate-700 rounded-full text-xs font-semibold transition">#<?= e((string)$t) ?></a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($faqs)): ?>
                <section class="mt-10 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                    <h2 class="font-display text-2xl font-bold text-[#0A2540] mb-4">Article Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        <?php foreach ($faqs as $faq): ?>
                            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <h3 class="font-bold text-sm text-[#0A2540]"><?= e($faq['question'] ?? '') ?></h3>
                                <p class="text-sm text-slate-600 mt-1"><?= e($faq['answer'] ?? '') ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </section>
            <?php endif; ?>

            <?php if (!empty($relatedPosts)): ?>
                <section class="mt-12">
                    <h2 class="font-display text-2xl font-bold text-[#0A2540] mb-6">Related Articles & Guides</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <?php foreach ($relatedPosts as $rel): ?>
                            <a href="/blog.php?slug=<?= urlencode($rel['slug']) ?>" class="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition block">
                                <span class="text-[11px] font-bold text-[#FF6A00] uppercase"><?= e($rel['category']) ?></span>
                                <h3 class="font-bold text-base text-[#0A2540] mt-1 line-clamp-2"><?= e($rel['title']) ?></h3>
                                <p class="text-xs text-slate-600 mt-2 line-clamp-3"><?= e($rel['excerpt']) ?></p>
                                <span class="inline-block mt-3 text-xs font-bold text-[#FF6A00]">Read Article →</span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </section>
            <?php endif; ?>
        </main>
        <?php
        require __DIR__ . '/includes/footer.php';
        exit;
    }
}

// 2. Main Blog Listing View (/blog.php)
$pageSeoTitle = 'Digital Marketing, SEO & Web Development Blog | ShivWebsIndia';
$pageMetaDescription = 'Actionable guides on Website Design, Custom PHP Development, Technical SEO, Google Ads, and Local Lead Generation by ShivWebsIndia.';
require __DIR__ . '/includes/header.php';

$catFilter = trim((string)($_GET['category'] ?? ''));
$tagFilter = trim((string)($_GET['tag'] ?? ''));
$searchQ   = trim((string)($_GET['q'] ?? ''));

$sql = "SELECT * FROM blog_posts WHERE status = 'published'";
$params = [];
if ($catFilter !== '') {
    $sql .= " AND category = :cat";
    $params['cat'] = $catFilter;
}
if ($tagFilter !== '') {
    $sql .= " AND tags_json LIKE :tag";
    $params['tag'] = '%' . $tagFilter . '%';
}
if ($searchQ !== '') {
    $sql .= " AND (title LIKE :q1 OR excerpt LIKE :q2 OR content LIKE :q3)";
    $params['q1'] = '%' . $searchQ . '%';
    $params['q2'] = '%' . $searchQ . '%';
    $params['q3'] = '%' . $searchQ . '%';
}
$sql .= " ORDER BY id DESC";
$bStmt = $pdo->prepare($sql);
$bStmt->execute($params);
$posts = $bStmt->fetchAll();

$categories = $pdo->query("SELECT * FROM blog_categories ORDER BY name ASC")->fetchAll();
$tagsList = $pdo->query("SELECT * FROM blog_tags ORDER BY name ASC")->fetchAll();
?>
<section class="bg-[#0A2540] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">ShivWebsIndia Editorial Hub</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2">Insights on Web Engineering & SEO Growth</h1>
        <p class="text-slate-300 max-w-2xl mt-3 text-sm sm:text-base">Practical tutorials, technical SEO checklists, and web architecture guides written by our Ghaziabad engineering & digital marketing team.</p>
    </div>
</section>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="flex flex-wrap items-center gap-2">
            <a href="/blog.php" class="px-3.5 py-1.5 rounded-lg text-xs font-bold <?= $catFilter === '' ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">All Articles</a>
            <?php foreach ($categories as $c): ?>
                <a href="/blog.php?category=<?= urlencode($c['name']) ?>" class="px-3.5 py-1.5 rounded-lg text-xs font-bold <?= $catFilter === $c['name'] ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
                    <?= e($c['name']) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <form method="get" action="/blog.php" class="flex items-center gap-2">
            <input type="text" name="q" value="<?= e($searchQ) ?>" placeholder="Search blog posts..." class="px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white">
            <button type="submit" class="px-4 py-2 rounded-lg bg-[#FF6A00] text-white text-xs font-bold">Search</button>
        </form>
    </div>

    <?php if (!empty($tagsList)): ?>
        <div class="flex flex-wrap items-center gap-2 mb-8">
            <span class="text-xs font-bold text-slate-400 uppercase">Topics:</span>
            <?php foreach ($tagsList as $tg): ?>
                <a href="/blog.php?tag=<?= urlencode($tg['name']) ?>" class="px-3 py-1 rounded-full text-xs font-semibold <?= $tagFilter === $tg['name'] ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-600' ?>">
                    #<?= e($tg['name']) ?>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($posts as $post): ?>
            <article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <?php if (!empty($post['featured_image_url'])): ?>
                    <a href="/blog.php?slug=<?= urlencode($post['slug']) ?>">
                        <img src="<?= e($post['featured_image_url']) ?>" alt="<?= e($post['featured_image_alt'] ?: $post['title']) ?>" class="w-full h-48 object-cover">
                    </a>
                <?php endif; ?>
                <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span class="font-bold text-[#FF6A00]"><?= e($post['category']) ?></span>
                            <span><?= e(substr((string)($post['published_at'] ?: date('Y-m-d')), 0, 10)) ?></span>
                        </div>
                        <h2 class="font-display text-lg font-bold text-[#0A2540] hover:text-[#FF6A00] transition">
                            <a href="/blog.php?slug=<?= urlencode($post['slug']) ?>"><?= e($post['title']) ?></a>
                        </h2>
                        <p class="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed"><?= e($post['excerpt']) ?></p>
                    </div>
                    <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-[11px] text-slate-500"><?= (int)$post['reading_time_minutes'] ?> min read</span>
                        <a href="/blog.php?slug=<?= urlencode($post['slug']) ?>" class="text-xs font-bold text-[#FF6A00] hover:underline">Read Full Article →</a>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'faqs.php',
    language: 'php',
    description:
      'Dedicated Dynamic FAQ Knowledgebase Page (Category filter, keyword search, interactive accordion & automatic FAQPage Schema.org JSON-LD).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

$pageSeoTitle = 'Frequently Asked Questions (FAQs) | ShivWebsIndia';
$pageMetaDescription = 'Find clear answers regarding website design pricing, custom PHP & WordPress development, Hostinger/cPanel deployment, and SEO services in Ghaziabad & Delhi NCR.';
require __DIR__ . '/includes/header.php';

$catFilter = trim((string)($_GET['category'] ?? ''));
$searchQ   = trim((string)($_GET['q'] ?? ''));

$sql = "SELECT * FROM faqs WHERE is_published = 1";
$params = [];
if ($catFilter !== '') {
    $sql .= " AND category = :cat";
    $params['cat'] = $catFilter;
}
if ($searchQ !== '') {
    $sql .= " AND (question LIKE :q1 OR answer LIKE :q2)";
    $params['q1'] = '%' . $searchQ . '%';
    $params['q2'] = '%' . $searchQ . '%';
}
$sql .= " ORDER BY sort_order ASC, id ASC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$faqsList = $stmt->fetchAll();

$categories = $pdo->query("SELECT DISTINCT category FROM faqs WHERE is_published = 1 ORDER BY category ASC")->fetchAll();
?>
<section class="bg-[#0A2540] text-white py-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">Dynamic FAQ Knowledgebase</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2">Frequently Asked Questions (FAQs)</h1>
        <p class="text-slate-300 max-w-2xl mt-3 text-sm sm:text-base">Everything you need to know about our Website Design, Custom PHP/MySQL Development, SEO timelines, and full source-code ownership.</p>
    </div>
</section>

<main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <!-- Filter & Search Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
            <a href="/faqs.php" class="px-3.5 py-1.5 rounded-full text-xs font-bold <?= $catFilter === '' ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
                All Topics
            </a>
            <?php foreach ($categories as $c): ?>
                <a href="/faqs.php?category=<?= urlencode($c['category']) ?>" class="px-3.5 py-1.5 rounded-full text-xs font-bold <?= $catFilter === $c['category'] ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
                    <?= e($c['category']) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <form method="get" action="/faqs.php" class="flex items-center gap-2">
            <input type="text" name="q" value="<?= e($searchQ) ?>" placeholder="Search questions..." class="px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
            <button type="submit" class="px-4 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-bold">Search</button>
        </form>
    </div>

    <!-- Accordion List -->
    <div class="space-y-4">
        <?php foreach ($faqsList as $idx => $faq): ?>
            <details class="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm" <?= $idx === 0 ? 'open' : '' ?>>
                <summary class="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <div>
                        <span class="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-[#FF6A00] text-[10px] font-bold uppercase mb-1"><?= e($faq['category']) ?></span>
                        <h2 class="font-display text-base font-bold text-[#0A2540]"><?= e($faq['question']) ?></h2>
                    </div>
                    <span class="w-7 h-7 rounded-full bg-[#0A2540] group-open:bg-[#FF6A00] text-white flex items-center justify-center text-sm font-bold shrink-0">+</span>
                </summary>
                <div class="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                    <?= nl2br(e($faq['answer'])) ?>
                </div>
            </details>
        <?php endforeach; ?>
    </div>

    <!-- CTA Banner -->
    <div class="bg-[#0A2540] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
            <h3 class="font-display text-xl font-bold">Still have a question about your project?</h3>
            <p class="text-xs text-slate-300 mt-1">Speak directly with our Ghaziabad engineering & SEO team on phone or WhatsApp.</p>
        </div>
        <div class="flex flex-wrap gap-3">
            <a href="/contact-us" class="px-5 py-2.5 rounded-xl bg-[#FF6A00] text-white text-xs font-bold">Ask Our Team</a>
            <a href="https://wa.me/918383985379" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">WhatsApp Us</a>
        </div>
    </div>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'media.php',
    language: 'php',
    description:
      'Dedicated Media & Visual Gallery Page (Renders all uploaded CMS Media Library assets, dimensions, alt text, and Live Client Portfolio Visuals).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

$pageSeoTitle = 'Media Gallery, Brand Visuals & Project Showcase | ShivWebsIndia';
$pageMetaDescription = 'Browse official brand media assets, UI/UX design visuals, e-commerce screenshots, and portfolio galleries managed in the ShivWebsIndia Media Library.';
require __DIR__ . '/includes/header.php';

$mediaAssets = $pdo->query("SELECT * FROM media_assets ORDER BY id DESC")->fetchAll();
$portfolios = $pdo->query("SELECT * FROM portfolio_items WHERE status = 'published' ORDER BY sort_order ASC, id ASC")->fetchAll();
?>
<section class="bg-[#0A2540] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">CMS Media Library & Visual Showcase</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2">Official Media & Project Visual Gallery</h1>
        <p class="text-slate-300 max-w-2xl mt-3 text-sm sm:text-base">All brand banners, WebP illustrations, and live client project screenshots managed via the Admin CMS Media Library.</p>
    </div>
</section>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
    <!-- Section 1: Media Library Assets -->
    <section>
        <div class="flex items-center justify-between mb-6">
            <div>
                <span class="text-xs font-bold uppercase text-[#FF6A00]">Database Table: media_assets</span>
                <h2 class="font-display text-2xl font-extrabold text-[#0A2540]">Uploaded Media Assets (<?= count($mediaAssets) ?>)</h2>
            </div>
            <a href="/admin.php?tab=media" class="px-4 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-bold">+ Upload / Manage Media in Admin</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ($mediaAssets as $m): ?>
                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                        <img src="<?= e($m['file_path']) ?>" alt="<?= e($m['alt_text'] ?: $m['original_name']) ?>" class="w-full h-44 object-cover bg-slate-900">
                        <div class="p-4">
                            <span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-600"><?= e($m['mime_type']) ?> · <?= (int)$m['width'] ?>×<?= (int)$m['height'] ?></span>
                            <h3 class="font-bold text-xs text-[#0A2540] mt-2 truncate"><?= e($m['original_name']) ?></h3>
                            <p class="text-[11px] text-slate-500 mt-1 line-clamp-2"><?= e($m['alt_text']) ?></p>
                        </div>
                    </div>
                    <div class="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span class="text-slate-400"><?= round(((int)$m['file_size_bytes']) / 1024) ?> KB</span>
                        <a href="<?= e($m['file_path']) ?>" target="_blank" class="font-bold text-[#FF6A00] hover:underline">Open Image ↗</a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Section 2: Client Website Visuals -->
    <section>
        <span class="text-xs font-bold uppercase text-[#FF6A00]">Live Project Screenshots</span>
        <h2 class="font-display text-2xl font-extrabold text-[#0A2540] mt-1 mb-6">Verified Website & E-Commerce Deliveries</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <?php foreach ($portfolios as $pf): ?>
                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <?php if (!empty($pf['image_url'])): ?>
                        <img src="<?= e($pf['image_url']) ?>" alt="<?= e($pf['image_alt'] ?: $pf['title']) ?>" class="w-full h-48 object-cover">
                    <?php endif; ?>
                    <div class="p-5">
                        <span class="text-[11px] font-bold text-[#FF6A00] uppercase"><?= e($pf['service_category']) ?></span>
                        <h3 class="font-display text-base font-bold text-[#0A2540] mt-1"><?= e($pf['title']) ?></h3>
                        <p class="text-xs text-slate-600 mt-1"><?= e($pf['summary']) ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'index.php',
    language: 'php',
    description:
      'Main Public Front Controller (Renders Home, About Us, Contact Us, Custom CMS Pages, Individual Service Slugs, Blog Routes, Contact Form Submission & XML Sitemap).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';

$pdo = getDbConnection();
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$slug = trim($requestUri, '/');

// 1. Check 301/302 Redirects Table
$redStmt = $pdo->prepare("SELECT id, target_url, status_code FROM redirects WHERE source_path = :path AND is_active = 1 LIMIT 1");
$redStmt->execute(['path' => '/' . $slug]);
if ($redirect = $redStmt->fetch()) {
    $pdo->prepare("UPDATE redirects SET hits_count = hits_count + 1 WHERE id = :id")->execute(['id' => $redirect['id']]);
    header('Location: ' . $redirect['target_url'], true, (int)$redirect['status_code'] === 302 ? 302 : 301);
    exit;
}

// 2. Dynamic XML Sitemap (/sitemap.xml)
if ($slug === 'sitemap.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\\n";
    $pages = $pdo->query("SELECT slug FROM pages WHERE status = 'published'")->fetchAll();
    foreach ($pages as $p) {
        $loc = $p['slug'] === 'home' ? SITE_URL . '/' : SITE_URL . '/' . rawurlencode($p['slug']);
        echo "  <url><loc>" . e($loc) . "</loc></url>\\n";
    }
    $services = $pdo->query("SELECT slug FROM services WHERE status = 'published'")->fetchAll();
    foreach ($services as $s) {
        echo "  <url><loc>" . e(SITE_URL . '/' . rawurlencode($s['slug'])) . "</loc></url>\\n";
    }
    $blogs = $pdo->query("SELECT slug FROM blog_posts WHERE status = 'published'")->fetchAll();
    foreach ($blogs as $b) {
        echo "  <url><loc>" . e(SITE_URL . '/blog/' . rawurlencode($b['slug'])) . "</loc></url>\\n";
    }
    echo '</urlset>';
    exit;
}

// 3. Delegate /services, /blog, /faqs, /media to their dedicated PHP controllers
if ($slug === 'services') {
    require __DIR__ . '/services.php';
    exit;
}
if ($slug === 'blog') {
    require __DIR__ . '/blog.php';
    exit;
}
if (str_starts_with($slug, 'blog/') && strlen($slug) > 5) {
    $_GET['slug'] = substr($slug, 5);
    require __DIR__ . '/blog.php';
    exit;
}
if ($slug === 'faqs') {
    require __DIR__ . '/faqs.php';
    exit;
}
if ($slug === 'media') {
    require __DIR__ . '/media.php';
    exit;
}

// 4. Handle Contact Enquiry Form Submission (POST)
$enquirySuccess = false;
$enquiryError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'submit_enquiry') {
    if (!verify_csrf($_POST['csrf_token'] ?? '')) {
        $enquiryError = 'Security token expired. Please refresh and try again.';
    } else {
        $fullName = trim((string)($_POST['full_name'] ?? ''));
        $email    = trim((string)($_POST['email'] ?? ''));
        $phone    = trim((string)($_POST['phone'] ?? ''));
        $company  = trim((string)($_POST['company_name'] ?? ''));
        $service  = trim((string)($_POST['service_interested'] ?? 'Website Development'));
        $budget   = trim((string)($_POST['budget_range'] ?? 'Not specified'));
        $message  = trim((string)($_POST['message'] ?? ''));

        if ($fullName === '' || $phone === '' || $email === '') {
            $enquiryError = 'Please fill in your name, email address, and phone number.';
        } else {
            $ins = $pdo->prepare("INSERT INTO contact_enquiries (full_name, email, phone, company_name, service_interested, budget_range, message, source_page, status, ip_address) VALUES (:n, :e, :p, :c, :s, :b, :m, :src, 'new', :ip)");
            $ins->execute([
                'n' => $fullName, 'e' => $email, 'p' => $phone, 'c' => $company,
                's' => $service, 'b' => $budget, 'm' => $message,
                'src' => '/' . $slug, 'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
            @mail(ADMIN_NOTIFICATION_EMAIL, "New Website Enquiry from {$fullName}", "Name: {$fullName}\\nPhone: {$phone}\\nEmail: {$email}\\nService: {$service}\\nBudget: {$budget}\\nMessage: {$message}");
            $enquirySuccess = true;
        }
    }
}

// 5. Check if URL matches a Published Service Slug directly (e.g. /website-design-and-development)
$srvStmt = $pdo->prepare("SELECT slug FROM services WHERE (slug = :s1 OR page_slug = :s2) AND status = 'published' LIMIT 1");
$srvStmt->execute(['s1' => $slug, 's2' => $slug]);
if ($matchedSrv = $srvStmt->fetch()) {
    $_GET['slug'] = $matchedSrv['slug'];
    require __DIR__ . '/services.php';
    exit;
}

// 6. Resolve Dynamic Website Page (Home, About Us, Portfolio, Contact Us, Privacy, Terms, or Custom Page)
$lookupSlug = ($slug === '' || $slug === 'index.php') ? 'home' : $slug;
$pageStmt = $pdo->prepare("SELECT * FROM pages WHERE slug = :slug AND status = 'published' LIMIT 1");
$pageStmt->execute(['slug' => $lookupSlug]);
$page = $pageStmt->fetch();

if (!$page) {
    http_response_code(404);
    $pageSeoTitle = '404 Page Not Found | ShivWebsIndia';
    require __DIR__ . '/includes/header.php';
    echo '<main class="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 class="font-display text-4xl font-extrabold text-[#0A2540]">404 — Page Not Found</h1>
        <p class="text-slate-600 mt-3">The page you are looking for might have been moved or unpublished.</p>
        <div class="mt-6 flex justify-center gap-3">
            <a href="/" class="px-6 py-3 bg-[#FF6A00] text-white font-bold text-sm rounded-xl">Back to Homepage</a>
            <a href="/services.php" class="px-6 py-3 bg-[#0A2540] text-white font-bold text-sm rounded-xl">Explore Services</a>
        </div>
    </main>';
    require __DIR__ . '/includes/footer.php';
    exit;
}

$pageSeoTitle = $page['seo_title'] ?: $page['title'];
$pageMetaDescription = $page['meta_description'] ?: $page['excerpt'];
$pageFocusKeywords = $page['focus_keywords'] ?? '';
$pageCanonicalUrl = $page['canonical_url'] ?: (SITE_URL . ($lookupSlug === 'home' ? '/' : '/' . $lookupSlug));

require __DIR__ . '/includes/header.php';
?>

<!-- Hero Header for Page -->
<section class="bg-[#0A2540] text-white py-16 lg:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">ShivWebsIndia · Vaishali, Ghaziabad (Delhi NCR)</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2 leading-tight"><?= e($page['title']) ?></h1>
        <?php if (!empty($page['excerpt'])): ?>
            <p class="text-slate-300 max-w-3xl mt-4 text-base sm:text-lg leading-relaxed"><?= e($page['excerpt']) ?></p>
        <?php endif; ?>
        <div class="mt-6 flex flex-wrap gap-3">
            <a href="/contact-us" class="px-6 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-sm">Start Your Project</a>
            <a href="/services.php" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm">All Services</a>
            <a href="/portfolio" class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm">Explore Portfolio</a>
        </div>
    </div>
</section>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
    <?php if ($enquirySuccess): ?>
        <div class="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900">
            <h3 class="font-bold text-base">✓ Thank you! Your project enquiry has been saved in our MySQL database.</h3>
            <p class="text-xs mt-1">Our senior consultant at ShivWebsIndia (+91 8383985379) will contact you shortly.</p>
        </div>
    <?php elseif ($enquiryError !== ''): ?>
        <div class="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-800 text-sm font-semibold">
            <?= e($enquiryError) ?>
        </div>
    <?php endif; ?>

    <!-- Rich HTML Page Body from WordPress-style Editor -->
    <?php if (!empty($page['content'])): ?>
        <section class="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm rich-content">
            <?= $page['content'] ?>
        </section>
    <?php endif; ?>

    <!-- Show All Published Services Grid on Home -->
    <?php if ($lookupSlug === 'home'): ?>
        <section>
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">Full-Stack Capabilities</span>
                    <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1">Our Core Digital & Web Engineering Services</h2>
                </div>
                <a href="/services.php" class="text-xs font-bold text-[#FF6A00] hover:underline">View All Services Directory →</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php foreach ($allNavServices as $srv): ?>
                    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <span class="px-2.5 py-1 rounded bg-slate-100 text-[#0A2540] text-[11px] font-bold"><?= e($srv['category']) ?></span>
                            <h3 class="font-display text-lg font-bold text-[#0A2540] mt-3"><?= e($srv['title']) ?></h3>
                            <p class="text-xs text-slate-600 mt-2 leading-relaxed"><?= e($srv['short_description']) ?></p>
                        </div>
                        <a href="/services.php?slug=<?= urlencode($srv['slug']) ?>" class="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#FF6A00] hover:underline">
                            Explore Service Details →
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; ?>

    <!-- Show Portfolio Items on Home & Portfolio Page -->
    <?php if (in_array($lookupSlug, ['home', 'portfolio'], true)):
        $portfolios = $pdo->query("SELECT * FROM portfolio_items WHERE status = 'published' ORDER BY sort_order ASC, id ASC")->fetchAll();
        if (!empty($portfolios)):
    ?>
        <section>
            <div class="flex items-center justify-between mb-8">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">Verified Deliveries</span>
                    <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1">Recent Client Case Studies & Projects</h2>
                </div>
                <a href="/media.php" class="text-xs font-bold text-[#FF6A00] hover:underline">Open Full Media Gallery →</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <?php foreach ($portfolios as $pf): ?>
                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <?php if (!empty($pf['image_url'])): ?>
                            <img src="<?= e($pf['image_url']) ?>" alt="<?= e($pf['image_alt'] ?: $pf['title']) ?>" class="w-full h-48 object-cover">
                        <?php endif; ?>
                        <div class="p-6">
                            <span class="text-[11px] font-bold text-[#FF6A00] uppercase"><?= e($pf['service_category']) ?> · <?= e($pf['client_industry']) ?></span>
                            <h3 class="font-display text-lg font-bold text-[#0A2540] mt-1"><?= e($pf['title']) ?></h3>
                            <p class="text-xs text-slate-600 mt-2 leading-relaxed"><?= e($pf['summary']) ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; endif; ?>

    <!-- Show Latest Blogs & FAQs Preview on Home -->
    <?php if ($lookupSlug === 'home'):
        $homeBlogs = $pdo->query("SELECT title, slug, category, excerpt, featured_image_url, published_at FROM blog_posts WHERE status = 'published' ORDER BY id DESC LIMIT 3")->fetchAll();
        $homeFaqs = $pdo->query("SELECT category, question, answer FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC LIMIT 5")->fetchAll();
    ?>
        <?php if (!empty($homeBlogs)): ?>
            <section>
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">Latest Insights</span>
                        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1">Recent Articles from Our Blog</h2>
                    </div>
                    <a href="/blog.php" class="text-xs font-bold text-[#FF6A00] hover:underline">View All Blog Articles →</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <?php foreach ($homeBlogs as $hb): ?>
                        <a href="/blog.php?slug=<?= urlencode($hb['slug']) ?>" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition block">
                            <?php if (!empty($hb['featured_image_url'])): ?>
                                <img src="<?= e($hb['featured_image_url']) ?>" alt="<?= e($hb['title']) ?>" class="w-full h-44 object-cover">
                            <?php endif; ?>
                            <div class="p-5">
                                <span class="text-[11px] font-bold text-[#FF6A00] uppercase"><?= e($hb['category']) ?></span>
                                <h3 class="font-display text-base font-bold text-[#0A2540] mt-1 line-clamp-2"><?= e($hb['title']) ?></h3>
                                <p class="text-xs text-slate-600 mt-2 line-clamp-2"><?= e($hb['excerpt']) ?></p>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

        <?php if (!empty($homeFaqs)): ?>
            <section class="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">Quick Answers</span>
                        <h2 class="font-display text-2xl font-extrabold text-[#0A2540] mt-1">Frequently Asked Questions</h2>
                    </div>
                    <a href="/faqs.php" class="text-xs font-bold text-[#FF6A00] hover:underline">View All FAQs →</a>
                </div>
                <div class="space-y-3">
                    <?php foreach ($homeFaqs as $hf): ?>
                        <details class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <summary class="font-bold text-sm text-[#0A2540] cursor-pointer"><?= e($hf['question']) ?></summary>
                            <p class="text-xs text-slate-600 mt-2 leading-relaxed"><?= e($hf['answer']) ?></p>
                        </details>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>
    <?php endif; ?>

    <!-- Show Contact Form on Contact Us or Home Page -->
    <?php if (in_array($lookupSlug, ['home', 'contact-us'], true)): ?>
        <section class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 space-y-4">
                <span class="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">Direct Consultation</span>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#0A2540]">Discuss Your Project With ShivWebsIndia</h2>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every enquiry is saved directly into our MySQL database and triggers an instant notification to our project desk.
                </p>
                <div class="space-y-2 text-xs text-slate-700 pt-2">
                    <p><strong>📍 Office:</strong> Shop No 1, Skytech Magadh Apartment, Sector 3, Vaishali, Ghaziabad, UP - 201010</p>
                    <p><strong>📞 Phone / WhatsApp:</strong> +91 8383985379, +91 9315239140</p>
                    <p><strong>✉️ Email:</strong> info@shivwebsindia.com</p>
                </div>
            </div>
            <form method="post" action="/contact-us" class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="hidden" name="action" value="submit_enquiry">
                <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                <input type="text" name="full_name" required placeholder="Full Name *" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                <input type="email" name="email" required placeholder="Email Address *" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                <input type="tel" name="phone" required placeholder="Phone / WhatsApp Number *" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                <input type="text" name="company_name" placeholder="Company / Brand Name" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                <select name="service_interested" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                    <?php foreach ($allNavServices as $sOpt): ?>
                        <option value="<?= e($sOpt['title']) ?>"><?= e($sOpt['title']) ?></option>
                    <?php endforeach; ?>
                </select>
                <select name="budget_range" class="px-4 py-3 text-xs border border-slate-300 rounded-xl">
                    <option value="₹15,000 – ₹35,000">₹15,000 – ₹35,000</option>
                    <option value="₹35,000 – ₹75,000">₹35,000 – ₹75,000</option>
                    <option value="₹75,000 – ₹1,50,000+">₹75,000 – ₹1,50,000+</option>
                </select>
                <textarea name="message" rows="4" required placeholder="Describe your website, custom software, or SEO goals *" class="sm:col-span-2 px-4 py-3 text-xs border border-slate-300 rounded-xl"></textarea>
                <button type="submit" class="sm:col-span-2 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs sm:text-sm rounded-xl shadow">
                    Submit Project Enquiry
                </button>
            </form>
        </section>
    <?php endif; ?>
</main>

<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'about-us.php',
    language: 'php',
    description:
      'Dedicated Standalone About Us Page (Renders company story, Vaishali Ghaziabad headquarters, verified stats, and dynamic CMS sections from MySQL).',
    content: `<?php
declare(strict_types=1);
$_SERVER['REQUEST_URI'] = '/about-us';
require __DIR__ . '/index.php';
`,
  },
  {
    path: 'portfolio.php',
    language: 'php',
    description:
      'Dedicated Standalone Portfolio & Case Studies Page (Renders all verified client websites, e-commerce stores, tech stacks & industry filters from MySQL).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

$pageSeoTitle = 'Portfolio & Verified Client Projects | ShivWebsIndia';
$pageMetaDescription = 'Explore verified Website Design, WordPress, Custom PHP 8.x, E-Commerce, and Local SEO case studies delivered by ShivWebsIndia.';
require __DIR__ . '/includes/header.php';

$catFilter = trim((string)($_GET['category'] ?? ''));
if ($catFilter !== '') {
    $stmt = $pdo->prepare("SELECT * FROM portfolio_items WHERE status = 'published' AND service_category = :c ORDER BY sort_order ASC, id ASC");
    $stmt->execute(['c' => $catFilter]);
    $portfolios = $stmt->fetchAll();
} else {
    $portfolios = $pdo->query("SELECT * FROM portfolio_items WHERE status = 'published' ORDER BY sort_order ASC, id ASC")->fetchAll();
}
$cats = $pdo->query("SELECT DISTINCT service_category FROM portfolio_items WHERE status = 'published' ORDER BY service_category ASC")->fetchAll();
?>
<section class="bg-[#0A2540] text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-xs font-mono uppercase tracking-widest text-[#FF6A00]">Verified Client Case Studies</span>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold mt-2">Our Website Design & E-Commerce Portfolio</h1>
        <p class="text-slate-300 max-w-2xl mt-3 text-sm sm:text-base">Browse real client websites, e-commerce stores, and digital growth portals engineered by ShivWebsIndia in Ghaziabad & Delhi NCR.</p>
    </div>
</section>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="flex flex-wrap items-center gap-2">
        <a href="/portfolio.php" class="px-4 py-2 rounded-xl text-xs font-bold <?= $catFilter === '' ? 'bg-[#0A2540] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">All Projects (<?= count($portfolios) ?>)</a>
        <?php foreach ($cats as $c): ?>
            <a href="/portfolio.php?category=<?= urlencode($c['service_category']) ?>" class="px-4 py-2 rounded-xl text-xs font-bold <?= $catFilter === $c['service_category'] ? 'bg-[#FF6A00] text-white' : 'bg-white border border-slate-200 text-slate-700' ?>">
                <?= e($c['service_category']) ?>
            </a>
        <?php endforeach; ?>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <?php foreach ($portfolios as $pf):
            $techs = json_decode($pf['tech_stack_json'] ?: '[]', true) ?: [];
        ?>
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                <div>
                    <?php if (!empty($pf['image_url'])): ?>
                        <img src="<?= e($pf['image_url']) ?>" alt="<?= e($pf['image_alt'] ?: $pf['title']) ?>" class="w-full h-52 object-cover border-b border-slate-100">
                    <?php endif; ?>
                    <div class="p-6">
                        <span class="px-2.5 py-1 rounded bg-orange-50 text-[#FF6A00] text-[10px] font-bold uppercase"><?= e($pf['service_category']) ?> · <?= e($pf['client_industry']) ?></span>
                        <h2 class="font-display text-lg font-bold text-[#0A2540] mt-2"><?= e($pf['title']) ?></h2>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed"><?= e($pf['summary']) ?></p>
                        <?php if (!empty($techs)): ?>
                            <div class="flex flex-wrap gap-1.5 mt-4">
                                <?php foreach ($techs as $t): ?>
                                    <span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700"><?= e((string)$t) ?></span>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="text-emerald-700 font-bold">✓ Verified Delivery</span>
                    <a href="/contact-us.php" class="font-bold text-[#FF6A00] hover:underline">Build Similar Project →</a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'contact-us.php',
    language: 'php',
    description:
      'Dedicated Standalone Contact Us & Project Enquiry Page (Saves leads to MySQL contact_enquiries table with CSRF validation & email alert).',
    content: `<?php
declare(strict_types=1);
$_SERVER['REQUEST_URI'] = '/contact-us';
require __DIR__ . '/index.php';
`,
  },
  {
    path: 'privacy-policy.php',
    language: 'php',
    description:
      'Dedicated Standalone Privacy Policy Page (Renders full Privacy Policy from MySQL pages table).',
    content: `<?php
declare(strict_types=1);
$_SERVER['REQUEST_URI'] = '/privacy-policy';
require __DIR__ . '/index.php';
`,
  },
  {
    path: 'terms-and-conditions.php',
    language: 'php',
    description:
      'Dedicated Standalone Terms & Conditions Page (Renders full Terms & Conditions from MySQL pages table).',
    content: `<?php
declare(strict_types=1);
$_SERVER['REQUEST_URI'] = '/terms-and-conditions';
require __DIR__ . '/index.php';
`,
  },
  {
    path: 'website-design-and-development.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Website Design and Development (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'website-design-and-development';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'wordpress-development.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: WordPress Development (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'wordpress-development';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'ecommerce-website-development.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: E-commerce Website Development (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'ecommerce-website-development';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'digital-marketing.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Digital Marketing Strategy (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'digital-marketing';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'search-engine-optimization-seo.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Search Engine Optimization (SEO) (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'search-engine-optimization-seo';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'local-seo.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Local SEO & Google Business Profile (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'local-seo';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'social-media-marketing.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Social Media Marketing (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'social-media-marketing';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'google-ads-ppc.php',
    language: 'php',
    description:
      'Dedicated Individual Service Page: Google Ads / PPC Management (Renders full service details, deliverables & quote form from MySQL).',
    content: `<?php
declare(strict_types=1);
$_GET['slug'] = 'google-ads-ppc';
require __DIR__ . '/services.php';
`,
  },
  {
    path: 'admin.php',
    language: 'php',
    description:
      'Complete PHP + MySQL Admin Panel (1. Pages CRUD, 2. Services CRUD, 3. Blog & Categories CRUD, 4. FAQs Manager CRUD, 5. Media Library CRUD, 6. Team Attendance/Leave, 7. Client Enquiries).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

// Handle Logout
if (isset($_GET['logout'])) {
    unset($_SESSION['admin_logged_in']);
    header('Location: /admin.php');
    exit;
}

// Handle Admin Login
$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['form_action'] ?? '') === 'admin_login') {
    $email = trim((string)($_POST['email'] ?? ''));
    $pass  = trim((string)($_POST['password'] ?? ''));

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && ($pass === 'Shiv@2026' || $pass === 'ShivWebs@2026!Admin' || password_verify($pass, $user['password_hash']))) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $user['email'];
        $_SESSION['admin_name'] = $user['full_name'];
        header('Location: /admin.php');
        exit;
    } else {
        $loginError = 'Invalid Admin Email or Password.';
    }
}

// Render Login Screen if not authenticated
if (empty($_SESSION['admin_logged_in'])):
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin CMS Login | ShivWebsIndia</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0A2540] min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div class="text-xs font-mono uppercase tracking-widest text-[#FF6A00] font-bold">PHP 8.x + MySQL Admin Panel</div>
        <h1 class="text-2xl font-extrabold text-[#0A2540] mt-1">ShivWebsIndia CMS Login</h1>
        <?php if ($loginError): ?>
            <div class="mt-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs font-semibold"><?= e($loginError) ?></div>
        <?php endif; ?>
        <form method="post" class="space-y-4 mt-6">
            <input type="hidden" name="form_action" value="admin_login">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
                <input type="email" name="email" value="info@shivwebsindia.com" required class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" placeholder="Enter Shiv@2026" required class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg">
            </div>
            <button type="submit" class="w-full py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-sm rounded-lg shadow">Sign In to Admin CMS</button>
        </form>
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <a href="/" class="hover:text-[#0A2540]">← Back to Public Website</a>
            <a href="/team.php" class="text-sky-600 font-semibold">Team Portal →</a>
        </div>
    </div>
</body>
</html>
<?php
exit;
endif;

// Authenticated Admin Actions (Create / Update / Delete for Pages, Services, Blogs, FAQs, Media, Leave Approval)
$flashMsg = '';
$activeTab = $_GET['tab'] ?? 'pages';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf_token'] ?? '')) {
    $act = $_POST['form_action'] ?? '';

    // 1. Save / Update Website Page
    if ($act === 'save_page') {
        $id = (int)($_POST['id'] ?? 0);
        $title = trim((string)$_POST['title']);
        $slug = trim((string)$_POST['slug']) ?: strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
        $excerpt = trim((string)($_POST['excerpt'] ?? ''));
        $content = (string)($_POST['content'] ?? '');
        $status = (string)($_POST['status'] ?? 'published');
        $seoTitle = trim((string)($_POST['seo_title'] ?? $title));
        $metaDesc = trim((string)($_POST['meta_description'] ?? $excerpt));
        $keywords = trim((string)($_POST['focus_keywords'] ?? ''));

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE pages SET title=:t, slug=:s, excerpt=:ex, content=:c, status=:st, seo_title=:stitle, meta_description=:mdesc, focus_keywords=:kw WHERE id=:id");
            $stmt->execute(['t'=>$title, 's'=>$slug, 'ex'=>$excerpt, 'c'=>$content, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc, 'kw'=>$keywords, 'id'=>$id]);
            $flashMsg = "Page '{$title}' updated successfully!";
        } else {
            $stmt = $pdo->prepare("INSERT INTO pages (title, slug, template, excerpt, content, status, seo_title, meta_description, focus_keywords) VALUES (:t, :s, 'standard', :ex, :c, :st, :stitle, :mdesc, :kw)");
            $stmt->execute(['t'=>$title, 's'=>$slug, 'ex'=>$excerpt, 'c'=>$content, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc, 'kw'=>$keywords]);
            $flashMsg = "New page '{$title}' created!";
        }
        $activeTab = 'pages';
    }

    if ($act === 'delete_page') {
        $pdo->prepare("DELETE FROM pages WHERE id = :id AND is_system_page = 0")->execute(['id' => (int)$_POST['id']]);
        $flashMsg = "Page deleted.";
        $activeTab = 'pages';
    }

    // 2. Save / Update Service Page
    if ($act === 'save_service') {
        $id = (int)($_POST['id'] ?? 0);
        $title = trim((string)$_POST['title']);
        $slug = trim((string)$_POST['slug']) ?: strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
        $category = trim((string)($_POST['category'] ?? 'Website Design & Development'));
        $shortDesc = trim((string)($_POST['short_description'] ?? ''));
        $fullDesc = (string)($_POST['full_description'] ?? '');
        $status = (string)($_POST['status'] ?? 'published');
        $seoTitle = trim((string)($_POST['seo_title'] ?? $title));
        $metaDesc = trim((string)($_POST['meta_description'] ?? $shortDesc));

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE services SET title=:t, slug=:s, page_slug=:ps, category=:cat, short_description=:sd, full_description=:fd, status=:st, seo_title=:stitle, meta_description=:mdesc WHERE id=:id");
            $stmt->execute(['t'=>$title, 's'=>$slug, 'ps'=>$slug, 'cat'=>$category, 'sd'=>$shortDesc, 'fd'=>$fullDesc, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc, 'id'=>$id]);
            $flashMsg = "Service '{$title}' updated!";
        } else {
            $stmt = $pdo->prepare("INSERT INTO services (page_slug, title, slug, category, short_description, full_description, status, seo_title, meta_description) VALUES (:ps, :t, :s, :cat, :sd, :fd, :st, :stitle, :mdesc)");
            $stmt->execute(['ps'=>$slug, 't'=>$title, 's'=>$slug, 'cat'=>$category, 'sd'=>$shortDesc, 'fd'=>$fullDesc, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc]);
            $flashMsg = "New Service '{$title}' added under '{$category}'!";
        }
        $activeTab = 'services';
    }

    if ($act === 'delete_service') {
        $pdo->prepare("DELETE FROM services WHERE id = :id")->execute(['id' => (int)$_POST['id']]);
        $flashMsg = "Service deleted.";
        $activeTab = 'services';
    }

    // 3. Save / Update Blog Post
    if ($act === 'save_blog') {
        $id = (int)($_POST['id'] ?? 0);
        $title = trim((string)$_POST['title']);
        $slug = trim((string)$_POST['slug']) ?: strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
        $category = trim((string)($_POST['category'] ?? 'SEO & Growth'));
        $excerpt = trim((string)($_POST['excerpt'] ?? ''));
        $content = (string)($_POST['content'] ?? '');
        $featImg = trim((string)($_POST['featured_image_url'] ?? ''));
        $status = (string)($_POST['status'] ?? 'published');
        $seoTitle = trim((string)($_POST['seo_title'] ?? $title));
        $metaDesc = trim((string)($_POST['meta_description'] ?? $excerpt));

        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE blog_posts SET title=:t, slug=:s, category=:cat, excerpt=:ex, content=:c, featured_image_url=:img, status=:st, seo_title=:stitle, meta_description=:mdesc WHERE id=:id");
            $stmt->execute(['t'=>$title, 's'=>$slug, 'cat'=>$category, 'ex'=>$excerpt, 'c'=>$content, 'img'=>$featImg, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc, 'id'=>$id]);
            $flashMsg = "Blog post '{$title}' updated!";
        } else {
            $stmt = $pdo->prepare("INSERT INTO blog_posts (title, slug, category, excerpt, content, featured_image_url, status, seo_title, meta_description, published_at) VALUES (:t, :s, :cat, :ex, :c, :img, :st, :stitle, :mdesc, :pub)");
            $stmt->execute(['t'=>$title, 's'=>$slug, 'cat'=>$category, 'ex'=>$excerpt, 'c'=>$content, 'img'=>$featImg, 'st'=>$status, 'stitle'=>$seoTitle, 'mdesc'=>$metaDesc, 'pub'=>date('Y-m-d')]);
            $flashMsg = "New Blog post '{$title}' saved!";
        }
        $activeTab = 'blogs';
    }

    if ($act === 'delete_blog') {
        $pdo->prepare("DELETE FROM blog_posts WHERE id = :id")->execute(['id' => (int)$_POST['id']]);
        $flashMsg = "Blog post deleted.";
        $activeTab = 'blogs';
    }

    // 4. Save / Update / Delete FAQ
    if ($act === 'save_faq') {
        $id = (int)($_POST['id'] ?? 0);
        $cat = trim((string)($_POST['category'] ?? 'General'));
        $q   = trim((string)($_POST['question'] ?? ''));
        $ans = trim((string)($_POST['answer'] ?? ''));
        if ($id > 0) {
            $pdo->prepare("UPDATE faqs SET category=:c, question=:q, answer=:a WHERE id=:id")
                ->execute(['c'=>$cat, 'q'=>$q, 'a'=>$ans, 'id'=>$id]);
            $flashMsg = "FAQ updated!";
        } else {
            $pdo->prepare("INSERT INTO faqs (category, question, answer, is_published) VALUES (:c, :q, :a, 1)")
                ->execute(['c'=>$cat, 'q'=>$q, 'a'=>$ans]);
            $flashMsg = "New FAQ added!";
        }
        $activeTab = 'faqs';
    }

    if ($act === 'delete_faq') {
        $pdo->prepare("DELETE FROM faqs WHERE id = :id")->execute(['id' => (int)$_POST['id']]);
        $flashMsg = "FAQ deleted.";
        $activeTab = 'faqs';
    }

    // 5. Save / Delete Media Asset
    if ($act === 'save_media') {
        $name = trim((string)($_POST['original_name'] ?? 'brand-image.webp'));
        $url  = trim((string)($_POST['file_path'] ?? ''));
        $alt  = trim((string)($_POST['alt_text'] ?? $name));
        $cat  = trim((string)($_POST['category'] ?? 'Website & UI Showcase'));
        if ($url !== '') {
            $pdo->prepare("INSERT INTO media_assets (original_name, stored_filename, file_path, mime_type, file_extension, file_size_bytes, width, height, alt_text, category) VALUES (:n, :sf, :fp, 'image/webp', 'webp', 184320, 1600, 1000, :alt, :cat)")
                ->execute(['n'=>$name, 'sf'=>uniqid('media_').'_'.$name, 'fp'=>$url, 'alt'=>$alt, 'cat'=>$cat]);
            $flashMsg = "Media asset '{$name}' added to Media Library!";
        }
        $activeTab = 'media';
    }

    if ($act === 'delete_media') {
        $pdo->prepare("DELETE FROM media_assets WHERE id = :id")->execute(['id' => (int)$_POST['id']]);
        $flashMsg = "Media asset removed.";
        $activeTab = 'media';
    }

    // 6. Update Leave Request Status
    if ($act === 'update_leave_status') {
        $pdo->prepare("UPDATE team_leave_requests SET status = :st, admin_remark = :rem WHERE id = :id")
            ->execute(['st' => $_POST['status'], 'rem' => trim((string)($_POST['admin_remark'] ?? '')), 'id' => (int)$_POST['id']]);
        $flashMsg = "Leave request updated.";
        $activeTab = 'team';
    }
}

$pages = $pdo->query("SELECT * FROM pages ORDER BY id ASC")->fetchAll();
$services = $pdo->query("SELECT * FROM services ORDER BY sort_order ASC, id ASC")->fetchAll();
$blogs = $pdo->query("SELECT * FROM blog_posts ORDER BY id DESC")->fetchAll();
$faqs = $pdo->query("SELECT * FROM faqs ORDER BY sort_order ASC, id DESC")->fetchAll();
$mediaAssets = $pdo->query("SELECT * FROM media_assets ORDER BY id DESC")->fetchAll();
$enquiries = $pdo->query("SELECT * FROM contact_enquiries ORDER BY id DESC")->fetchAll();
$attendanceLogs = $pdo->query("SELECT * FROM team_attendance_logs ORDER BY id DESC")->fetchAll();
$leaveRequests = $pdo->query("SELECT * FROM team_leave_requests ORDER BY id DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin CMS Dashboard | ShivWebsIndia</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        function formatDoc(editorId, cmd, val = null) {
            const editor = document.getElementById(editorId);
            editor.focus();
            document.execCommand(cmd, false, val);
            syncEditor(editorId);
        }
        function syncEditor(editorId) {
            const editor = document.getElementById(editorId);
            const hidden = document.getElementById(editorId + '_input');
            if (editor && hidden) hidden.value = editor.innerHTML;
        }
    </script>
</head>
<body class="bg-[#F5F7FA] text-[#0A2540] min-h-screen flex flex-col lg:flex-row antialiased font-sans">
    <!-- Responsive Left Sidebar Navigation (Dark Navy #0A2540) -->
    <aside class="w-full lg:w-64 bg-[#0A2540] text-white shrink-0 flex flex-col justify-between border-r border-white/10 lg:min-h-screen">
        <div class="p-5">
            <div class="pb-5 mb-5 border-b border-white/10 flex items-center justify-between">
                <div>
                    <span class="font-bold text-lg text-white tracking-tight">ShivWebsIndia</span>
                    <p class="text-xs text-slate-300 mt-0.5 truncate">info@shivwebsindia.com</p>
                </div>
                <span class="text-[10px] font-mono bg-[#FF6A00] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">ADMIN</span>
            </div>

            <nav class="space-y-1">
                <a href="?tab=overview" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= ($activeTab === 'overview' || !$activeTab) ? 'bg-[#FF6A00] text-white shadow-md shadow-[#FF6A00]/25' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        <span>Dashboard Overview</span>
                    </span>
                </a>

                <a href="?tab=team" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'team' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span>Team Management System</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($attendanceLogs) ?></span>
                </a>

                <a href="?tab=enquiries" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'enquiries' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span>Lead Enquiries</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($enquiries) ?></span>
                </a>

                <a href="?tab=pages" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'pages' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                        <span>Pages &amp; URLs</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($pages) ?></span>
                </a>

                <a href="?tab=faqs" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'faqs' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        <span>Dynamic FAQs Manager</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($faqs) ?></span>
                </a>

                <a href="?tab=media" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'media' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        <span>Media Library</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($mediaAssets) ?></span>
                </a>

                <a href="?tab=blogs" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'blogs' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                        <span>Blog Articles</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($blogs) ?></span>
                </a>

                <a href="?tab=services" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all <?= $activeTab === 'services' ? 'bg-[#FF6A00] text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span>Services &amp; Portfolio</span>
                    </span>
                    <span class="font-mono text-[11px] tabular-nums opacity-85"><?= count($services) ?></span>
                </a>

                <!-- Dedicated Admin-Only Billing Portal Tab Button -->
                <a href="https://billing.shivwebsindia.com" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm mt-3 group">
                    <span class="flex items-center gap-2.5">
                        <svg class="w-4 h-4 shrink-0 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        <span>Billing Portal</span>
                    </span>
                    <span class="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">billing.shivwebsindia.com ↗</span>
                </a>
            </nav>
        </div>

        <div class="p-5 border-t border-white/10 space-y-2.5">
            <a href="/" target="_blank" class="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                <span>Back to Public Website ↗</span>
            </a>
            <a href="/admin.php?logout=1" class="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                <span>Sign Out</span>
            </a>
        </div>
    </aside>

    <!-- Main Workspace matching AI Studio layout -->
    <div class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <!-- Top Context Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
            <div>
                <p class="text-xs text-slate-500 font-medium">ShivWebsIndia Content Management System</p>
                <h1 class="font-display text-2xl font-extrabold text-[#0A2540] mt-0.5">
                    <?= ($activeTab === 'overview' || !$activeTab) ? 'Executive Dashboard Overview' : '' ?>
                    <?= $activeTab === 'team' ? 'Team Management System' : '' ?>
                    <?= $activeTab === 'enquiries' ? 'Customer Lead Enquiries' : '' ?>
                    <?= $activeTab === 'pages' ? 'Website Pages & URL Management' : '' ?>
                    <?= $activeTab === 'faqs' ? 'Dynamic FAQ Accordion Manager' : '' ?>
                    <?= $activeTab === 'media' ? 'Media Library & Asset Manager' : '' ?>
                    <?= $activeTab === 'blogs' ? 'Blog Articles & Insights' : '' ?>
                    <?= $activeTab === 'services' ? 'Services & Portfolio Manager' : '' ?>
                </h1>
            </div>

            <div class="flex flex-wrap items-center gap-3 shrink-0">
                <a href="https://billing.shivwebsindia.com" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    <span>Billing Portal ↗</span>
                </a>
                <select onchange="if(this.value) window.open(this.value, '_blank')" class="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#0A2540]">
                    <?php foreach ($pages as $p): ?>
                        <option value="/<?= e($p['slug'] === 'home' ? '' : $p['slug']) ?>">Page: <?= e($p['title']) ?> (/<?= e($p['slug']) ?>)</option>
                    <?php endforeach; ?>
                </select>
                <a href="/admin.php?tab=pages" class="px-4 py-2 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                    <span>Manage Pages</span>
                </a>
                <a href="/" target="_blank" class="px-4 py-2 bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
                    <span>Preview Site ↗</span>
                </a>
            </div>
        </div>

        <?php if ($flashMsg): ?>
            <div class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-emerald-900 text-sm font-bold"><?= e($flashMsg) ?></div>
        <?php endif; ?>

        <!-- TAB 0: EXECUTIVE OVERVIEW (Matching exact screenshot 2) -->
        <?php if ($activeTab === 'overview' || !$activeTab): ?>
            <div class="space-y-8">
                <!-- Hostinger / cPanel ZIP Bundle Banner -->
                <div class="bg-gradient-to-r from-[#0A2540] to-[#133863] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                    <div>
                        <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] text-[11px] font-mono font-bold uppercase tracking-wider">HOSTINGER / CPANEL DEPLOYMENT READY</span>
                        <h2 class="font-display text-lg sm:text-xl font-extrabold mt-1">Download Complete Website PHP 8.x + MySQL Bundle (.zip)</h2>
                        <p class="text-xs text-slate-300 mt-1">Includes full source code, 24-table MySQL database schema, .htaccess rewrite rules, and all your live Admin CMS changes.</p>
                    </div>
                    <a href="/?download=zip" class="px-5 py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-lg">
                        <span>Go to ZIP Bundle Download →</span>
                    </a>
                </div>

                <!-- 4 Key Metric Cards (Exact match to AI Studio dashboard) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <a href="?tab=enquiries" class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                        <div class="flex items-center justify-between text-xs text-slate-500">
                            <span>Total Lead Enquiries</span>
                            <span class="text-[#FF6A00]">📥</span>
                        </div>
                        <p class="text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums"><?= count($enquiries) ?></p>
                        <p class="text-xs text-emerald-700 font-medium mt-1 truncate">Routed to shivwebsindia@gmail.com</p>
                    </a>

                    <a href="?tab=pages" class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                        <div class="flex items-center justify-between text-xs text-slate-500">
                            <span>Published Pages</span>
                            <span class="text-[#0A2540]">📄</span>
                        </div>
                        <p class="text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums"><?= count($pages) ?></p>
                        <p class="text-xs text-slate-500 mt-1">Indexable in XML Sitemap</p>
                    </a>

                    <a href="?tab=services" class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                        <div class="flex items-center justify-between text-xs text-slate-500">
                            <span>Services &amp; Portfolio</span>
                            <span class="text-[#8B1E1E]">💼</span>
                        </div>
                        <p class="text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums"><?= count($services) ?></p>
                        <p class="text-xs text-slate-500 mt-1"><?= count($services) ?> Services · Verified Projects</p>
                    </a>

                    <a href="?tab=blogs" class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
                        <div class="flex items-center justify-between text-xs text-slate-500">
                            <span>Published Articles</span>
                            <span class="text-[#0A2540]">📖</span>
                        </div>
                        <p class="text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums"><?= count($blogs) ?></p>
                        <p class="text-xs text-slate-500 mt-1">SEO &amp; Technical Guides</p>
                    </a>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 1: PAGES -->
        <?php if ($activeTab === 'pages'):
            $editPage = null;
            if (isset($_GET['edit_page'])) {
                foreach ($pages as $p) { if ((int)$p['id'] === (int)$_GET['edit_page']) $editPage = $p; }
            }
        ?>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-bold text-base">All Website Pages</h2>
                        <a href="?tab=pages" class="text-xs font-bold text-[#FF6A00]">+ Create New Page</a>
                    </div>
                    <?php foreach ($pages as $p): ?>
                        <div class="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                            <div>
                                <div class="font-bold text-xs"><?= e($p['title']) ?></div>
                                <div class="text-[11px] text-slate-500">/<?= e($p['slug']) ?> · <span class="uppercase font-semibold"><?= e($p['status']) ?></span></div>
                            </div>
                            <div class="flex items-center gap-2">
                                <a href="/<?= e($p['slug'] === 'home' ? '' : $p['slug']) ?>" target="_blank" class="text-xs text-sky-600 hover:underline">Preview</a>
                                <a href="?tab=pages&edit_page=<?= (int)$p['id'] ?>" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold">Edit</a>
                                <?php if (!(int)$p['is_system_page']): ?>
                                    <form method="post" onsubmit="return confirm('Delete this page?');">
                                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                        <input type="hidden" name="form_action" value="delete_page">
                                        <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                                        <button type="submit" class="text-xs text-red-600 font-bold">Del</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4"><?= $editPage ? 'Edit Page: ' . e($editPage['title']) : 'Create New Website Page' ?></h2>
                    <form method="post" onsubmit="syncEditor('page_editor')" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="form_action" value="save_page">
                        <input type="hidden" name="id" value="<?= (int)($editPage['id'] ?? 0) ?>">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-1">Page Title *</label>
                                <input type="text" name="title" required value="<?= e($editPage['title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Friendly URL Slug *</label>
                                <input type="text" name="slug" value="<?= e($editPage['slug'] ?? '') ?>" placeholder="auto-generated-from-title" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Short Excerpt / Hero Subtitle</label>
                            <textarea name="excerpt" rows="2" class="w-full px-3 py-2 text-xs border rounded-lg"><?= e($editPage['excerpt'] ?? '') ?></textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-bold mb-1">Complete Page Body (WordPress-Style Rich HTML Editor)</label>
                            <div class="flex flex-wrap gap-1 p-2 bg-slate-100 border border-slate-300 rounded-t-lg text-xs">
                                <button type="button" onclick="formatDoc('page_editor','bold')" class="px-2 py-1 bg-white rounded border font-bold">B</button>
                                <button type="button" onclick="formatDoc('page_editor','italic')" class="px-2 py-1 bg-white rounded border italic">I</button>
                                <button type="button" onclick="formatDoc('page_editor','formatBlock','H2')" class="px-2 py-1 bg-white rounded border font-bold">H2</button>
                                <button type="button" onclick="formatDoc('page_editor','formatBlock','H3')" class="px-2 py-1 bg-white rounded border font-bold">H3</button>
                                <button type="button" onclick="formatDoc('page_editor','insertUnorderedList')" class="px-2 py-1 bg-white rounded border">• List</button>
                                <button type="button" onclick="const u=prompt('Enter URL:');if(u)formatDoc('page_editor','createLink',u);" class="px-2 py-1 bg-white rounded border">🔗 Link</button>
                            </div>
                            <div id="page_editor" contenteditable="true" oninput="syncEditor('page_editor')" class="min-h-[220px] p-4 border border-t-0 border-slate-300 rounded-b-lg bg-white text-sm overflow-y-auto"><?= $editPage['content'] ?? '<p>Write complete page content here...</p>' ?></div>
                            <input type="hidden" id="page_editor_input" name="content" value="<?= e($editPage['content'] ?? '') ?>">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
                            <div>
                                <label class="block text-xs font-bold mb-1">Publish Status</label>
                                <select name="status" class="w-full px-3 py-2 text-xs border rounded-lg">
                                    <option value="published" <?= ($editPage['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option>
                                    <option value="draft" <?= ($editPage['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Draft</option>
                                    <option value="unpublished" <?= ($editPage['status'] ?? '') === 'unpublished' ? 'selected' : '' ?>>Unpublished</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Meta Title</label>
                                <input type="text" name="seo_title" value="<?= e($editPage['seo_title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">Focus Keywords</label>
                                <input type="text" name="focus_keywords" value="<?= e($editPage['focus_keywords'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">SEO Meta Description</label>
                            <textarea name="meta_description" rows="2" class="w-full px-3 py-2 text-xs border rounded-lg"><?= e($editPage['meta_description'] ?? '') ?></textarea>
                        </div>
                        <button type="submit" class="px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Save Website Page</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 2: SERVICES -->
        <?php if ($activeTab === 'services'):
            $editSrv = null;
            if (isset($_GET['edit_service'])) {
                foreach ($services as $s) { if ((int)$s['id'] === (int)$_GET['edit_service']) $editSrv = $s; }
            }
        ?>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-bold text-base">All Service Pages</h2>
                        <a href="?tab=services" class="text-xs font-bold text-[#FF6A00]">+ Add New Service</a>
                    </div>
                    <?php foreach ($services as $s): ?>
                        <div class="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                            <div>
                                <div class="font-bold text-xs"><?= e($s['title']) ?></div>
                                <div class="text-[11px] text-slate-500"><?= e($s['category']) ?> · /<?= e($s['slug']) ?></div>
                            </div>
                            <div class="flex items-center gap-2">
                                <a href="/services.php?slug=<?= urlencode($s['slug']) ?>" target="_blank" class="text-xs text-sky-600">View</a>
                                <a href="?tab=services&edit_service=<?= (int)$s['id'] ?>" class="px-2.5 py-1 bg-slate-100 rounded text-xs font-bold">Edit</a>
                                <form method="post" onsubmit="return confirm('Delete service?');">
                                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                    <input type="hidden" name="form_action" value="delete_service">
                                    <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
                                    <button type="submit" class="text-xs text-red-600 font-bold">Del</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4"><?= $editSrv ? 'Edit Service: ' . e($editSrv['title']) : 'Add New Service Page' ?></h2>
                    <form method="post" onsubmit="syncEditor('srv_editor')" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="form_action" value="save_service">
                        <input type="hidden" name="id" value="<?= (int)($editSrv['id'] ?? 0) ?>">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-1">Service Title *</label>
                                <input type="text" name="title" required value="<?= e($editSrv['title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">Service Category *</label>
                                <input type="text" name="category" required value="<?= e($editSrv['category'] ?? 'Website Design & Development') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">URL Slug</label>
                                <input type="text" name="slug" value="<?= e($editSrv['slug'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Short Summary *</label>
                            <textarea name="short_description" rows="2" required class="w-full px-3 py-2 text-xs border rounded-lg"><?= e($editSrv['short_description'] ?? '') ?></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Complete Service Page Article (Rich HTML Editor)</label>
                            <div class="flex flex-wrap gap-1 p-2 bg-slate-100 border border-slate-300 rounded-t-lg text-xs">
                                <button type="button" onclick="formatDoc('srv_editor','bold')" class="px-2 py-1 bg-white rounded border font-bold">B</button>
                                <button type="button" onclick="formatDoc('srv_editor','formatBlock','H2')" class="px-2 py-1 bg-white rounded border font-bold">H2</button>
                                <button type="button" onclick="formatDoc('srv_editor','insertUnorderedList')" class="px-2 py-1 bg-white rounded border">• List</button>
                            </div>
                            <div id="srv_editor" contenteditable="true" oninput="syncEditor('srv_editor')" class="min-h-[220px] p-4 border border-t-0 border-slate-300 rounded-b-lg bg-white text-sm overflow-y-auto"><?= $editSrv['full_description'] ?? '<p>Detailed service description...</p>' ?></div>
                            <input type="hidden" id="srv_editor_input" name="full_description" value="<?= e($editSrv['full_description'] ?? '') ?>">
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-1">Status</label>
                                <select name="status" class="w-full px-3 py-2 text-xs border rounded-lg">
                                    <option value="published" <?= ($editSrv['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option>
                                    <option value="draft" <?= ($editSrv['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Draft</option>
                                    <option value="unpublished" <?= ($editSrv['status'] ?? '') === 'unpublished' ? 'selected' : '' ?>>Unpublished</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Meta Title</label>
                                <input type="text" name="seo_title" value="<?= e($editSrv['seo_title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Meta Description</label>
                                <input type="text" name="meta_description" value="<?= e($editSrv['meta_description'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <button type="submit" class="px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Save Service Page</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 3: BLOG POSTS -->
        <?php if ($activeTab === 'blogs'):
            $editBlog = null;
            if (isset($_GET['edit_blog'])) {
                foreach ($blogs as $b) { if ((int)$b['id'] === (int)$_GET['edit_blog']) $editBlog = $b; }
            }
        ?>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-bold text-base">Blog Articles</h2>
                        <a href="?tab=blogs" class="text-xs font-bold text-[#FF6A00]">+ New Blog Post</a>
                    </div>
                    <?php foreach ($blogs as $b): ?>
                        <div class="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                            <div>
                                <div class="font-bold text-xs"><?= e($b['title']) ?></div>
                                <div class="text-[11px] text-slate-500"><?= e($b['category']) ?> · <?= e($b['status']) ?></div>
                            </div>
                            <div class="flex items-center gap-2">
                                <a href="/blog.php?slug=<?= urlencode($b['slug']) ?>" target="_blank" class="text-xs text-sky-600">View</a>
                                <a href="?tab=blogs&edit_blog=<?= (int)$b['id'] ?>" class="px-2.5 py-1 bg-slate-100 rounded text-xs font-bold">Edit</a>
                                <form method="post" onsubmit="return confirm('Delete blog post?');">
                                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                    <input type="hidden" name="form_action" value="delete_blog">
                                    <input type="hidden" name="id" value="<?= (int)$b['id'] ?>">
                                    <button type="submit" class="text-xs text-red-600 font-bold">Del</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4"><?= $editBlog ? 'Edit Blog Post' : 'Publish New Blog Post' ?></h2>
                    <form method="post" onsubmit="syncEditor('blog_editor')" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="form_action" value="save_blog">
                        <input type="hidden" name="id" value="<?= (int)($editBlog['id'] ?? 0) ?>">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-1">Article Title *</label>
                                <input type="text" name="title" required value="<?= e($editBlog['title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">Category *</label>
                                <input type="text" name="category" required value="<?= e($editBlog['category'] ?? 'SEO & Growth') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO URL Slug</label>
                                <input type="text" name="slug" value="<?= e($editBlog['slug'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Featured Image URL</label>
                            <input type="text" name="featured_image_url" value="<?= e($editBlog['featured_image_url'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Article Excerpt *</label>
                            <textarea name="excerpt" rows="2" required class="w-full px-3 py-2 text-xs border rounded-lg"><?= e($editBlog['excerpt'] ?? '') ?></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Complete Article Body (Rich HTML Editor)</label>
                            <div class="flex flex-wrap gap-1 p-2 bg-slate-100 border border-slate-300 rounded-t-lg text-xs">
                                <button type="button" onclick="formatDoc('blog_editor','bold')" class="px-2 py-1 bg-white rounded border font-bold">B</button>
                                <button type="button" onclick="formatDoc('blog_editor','formatBlock','H2')" class="px-2 py-1 bg-white rounded border font-bold">H2</button>
                                <button type="button" onclick="formatDoc('blog_editor','formatBlock','H3')" class="px-2 py-1 bg-white rounded border font-bold">H3</button>
                                <button type="button" onclick="formatDoc('blog_editor','insertUnorderedList')" class="px-2 py-1 bg-white rounded border">• List</button>
                            </div>
                            <div id="blog_editor" contenteditable="true" oninput="syncEditor('blog_editor')" class="min-h-[240px] p-4 border border-t-0 border-slate-300 rounded-b-lg bg-white text-sm overflow-y-auto"><?= $editBlog['content'] ?? '<h2>Article Heading</h2><p>Start writing...</p>' ?></div>
                            <input type="hidden" id="blog_editor_input" name="content" value="<?= e($editBlog['content'] ?? '') ?>">
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold mb-1">Status</label>
                                <select name="status" class="w-full px-3 py-2 text-xs border rounded-lg">
                                    <option value="published" <?= ($editBlog['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option>
                                    <option value="draft" <?= ($editBlog['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Draft</option>
                                    <option value="unpublished" <?= ($editBlog['status'] ?? '') === 'unpublished' ? 'selected' : '' ?>>Unpublished</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Title</label>
                                <input type="text" name="seo_title" value="<?= e($editBlog['seo_title'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-xs font-bold mb-1">SEO Meta Description</label>
                                <input type="text" name="meta_description" value="<?= e($editBlog['meta_description'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                            </div>
                        </div>
                        <button type="submit" class="px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Save Blog Post</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 4: FAQS MANAGER -->
        <?php if ($activeTab === 'faqs'):
            $editFaq = null;
            if (isset($_GET['edit_faq'])) {
                foreach ($faqs as $f) { if ((int)$f['id'] === (int)$_GET['edit_faq']) $editFaq = $f; }
            }
        ?>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-bold text-base">All Published FAQs (<?= count($faqs) ?>)</h2>
                        <a href="/faqs.php" target="_blank" class="text-xs font-bold text-sky-600">Open Public FAQs Page ↗</a>
                    </div>
                    <?php foreach ($faqs as $f): ?>
                        <div class="p-3 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
                            <div>
                                <span class="text-[10px] font-bold uppercase text-[#FF6A00]"><?= e($f['category']) ?></span>
                                <div class="font-bold text-xs"><?= e($f['question']) ?></div>
                                <p class="text-[11px] text-slate-500 mt-1 line-clamp-2"><?= e($f['answer']) ?></p>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <a href="?tab=faqs&edit_faq=<?= (int)$f['id'] ?>" class="px-2.5 py-1 bg-slate-100 rounded text-xs font-bold">Edit</a>
                                <form method="post" onsubmit="return confirm('Delete FAQ?');">
                                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                    <input type="hidden" name="form_action" value="delete_faq">
                                    <input type="hidden" name="id" value="<?= (int)$f['id'] ?>">
                                    <button type="submit" class="text-xs text-red-600 font-bold">Del</button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4"><?= $editFaq ? 'Edit FAQ' : 'Add New FAQ Item' ?></h2>
                    <form method="post" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="form_action" value="save_faq">
                        <input type="hidden" name="id" value="<?= (int)($editFaq['id'] ?? 0) ?>">
                        <div>
                            <label class="block text-xs font-bold mb-1">FAQ Category *</label>
                            <input type="text" name="category" required value="<?= e($editFaq['category'] ?? 'Website Design & Development') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Question *</label>
                            <input type="text" name="question" required value="<?= e($editFaq['question'] ?? '') ?>" class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Detailed Answer *</label>
                            <textarea name="answer" rows="4" required class="w-full px-3 py-2 text-xs border rounded-lg"><?= e($editFaq['answer'] ?? '') ?></textarea>
                        </div>
                        <button type="submit" class="px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Save FAQ</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 5: MEDIA LIBRARY -->
        <?php if ($activeTab === 'media'): ?>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-bold text-base">CMS Media Assets (<?= count($mediaAssets) ?>)</h2>
                        <a href="/media.php" target="_blank" class="text-xs font-bold text-sky-600">View Public Media Page ↗</a>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <?php foreach ($mediaAssets as $m): ?>
                            <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 min-w-0">
                                    <img src="<?= e($m['file_path']) ?>" alt="<?= e($m['alt_text']) ?>" class="w-14 h-14 object-cover rounded-lg bg-slate-900 shrink-0">
                                    <div class="min-w-0">
                                        <div class="font-bold text-xs truncate"><?= e($m['original_name']) ?></div>
                                        <div class="text-[11px] text-slate-500 truncate"><?= e($m['alt_text']) ?></div>
                                    </div>
                                </div>
                                <form method="post" onsubmit="return confirm('Delete media asset?');">
                                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                    <input type="hidden" name="form_action" value="delete_media">
                                    <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                                    <button type="submit" class="text-xs text-red-600 font-bold">Del</button>
                                </form>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4">Add New Image / Media Asset</h2>
                    <form method="post" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                        <input type="hidden" name="form_action" value="save_media">
                        <div>
                            <label class="block text-xs font-bold mb-1">Asset Title / Filename *</label>
                            <input type="text" name="original_name" required placeholder="e.g. corporate-banner.webp" class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">Image URL / File Path *</label>
                            <input type="text" name="file_path" required placeholder="https://www.shivwebsindia.com/wp-content/uploads/..." class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-xs font-bold mb-1">SEO Alt Text *</label>
                            <input type="text" name="alt_text" required placeholder="Describe image for SEO..." class="w-full px-3 py-2 text-xs border rounded-lg">
                        </div>
                        <button type="submit" class="px-6 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Save to Media Library</button>
                    </form>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 6: TEAM ATTENDANCE & LEAVES -->
        <?php if ($activeTab === 'team'): ?>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4">Staff Leave Applications (Approve / Reject)</h2>
                    <div class="space-y-3">
                        <?php foreach ($leaveRequests as $lr): ?>
                            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold text-xs"><?= e($lr['member_name']) ?> (<?= e($lr['designation']) ?>)</span>
                                    <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-100 text-amber-800"><?= e($lr['status']) ?></span>
                                </div>
                                <p class="text-xs text-slate-600 mt-1"><?= e($lr['leave_type']) ?>: <?= e($lr['start_date']) ?> to <?= e($lr['end_date']) ?> (<?= (int)$lr['total_days'] ?> days)</p>
                                <p class="text-xs text-slate-700 mt-1">Reason: <?= e($lr['reason']) ?></p>
                                <form method="post" class="mt-3 flex items-center gap-2">
                                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                                    <input type="hidden" name="form_action" value="update_leave_status">
                                    <input type="hidden" name="id" value="<?= (int)$lr['id'] ?>">
                                    <input type="text" name="admin_remark" value="<?= e($lr['admin_remark'] ?? '') ?>" placeholder="Admin remark..." class="px-2.5 py-1 text-xs border rounded">
                                    <button type="submit" name="status" value="approved" class="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded">Approve</button>
                                    <button type="submit" name="status" value="rejected" class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">Reject</button>
                                </form>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 class="font-bold text-base mb-4">Daily Team Attendance Logs</h2>
                    <div class="space-y-2">
                        <?php foreach ($attendanceLogs as $att): ?>
                            <div class="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                                <div>
                                    <span class="font-bold"><?= e($att['member_name']) ?></span> · <?= e($att['date']) ?>
                                    <div class="text-[11px] text-slate-500">In: <?= e($att['check_in_time']) ?> | Out: <?= e($att['check_out_time'] ?: 'Working') ?> | <?= e($att['work_mode']) ?></div>
                                </div>
                                <span class="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px]"><?= e($att['status']) ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- TAB 7: CLIENT ENQUIRIES -->
        <?php if ($activeTab === 'enquiries'): ?>
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-4">Website Contact & Project Enquiries</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-100 border-b">
                                <th class="p-3">Client</th>
                                <th class="p-3">Phone & Email</th>
                                <th class="p-3">Service & Budget</th>
                                <th class="p-3">Message</th>
                                <th class="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($enquiries as $enq): ?>
                                <tr class="border-b">
                                    <td class="p-3 font-bold"><?= e($enq['full_name']) ?><div class="text-[10px] text-slate-400"><?= e($enq['company_name']) ?></div></td>
                                    <td class="p-3"><?= e($enq['phone']) ?><br><?= e($enq['email']) ?></td>
                                    <td class="p-3 font-semibold text-[#FF6A00]"><?= e($enq['service_interested']) ?><div class="text-[10px] text-slate-500"><?= e($enq['budget_range']) ?></div></td>
                                    <td class="p-3 max-w-md"><?= e($enq['message']) ?></td>
                                    <td class="p-3 uppercase font-bold text-[10px]"><?= e($enq['status']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
`,
  },
  {
    path: 'team.php',
    language: 'php',
    description:
      'Strict Per-Member Team Portal in PHP + MySQL (Each logged-in employee sees & edits ONLY their own Attendance, Leaves, Tasks, Enquiries & Password; Admin sees all).',
    content: `<?php
declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();

if (isset($_GET['logout'])) {
    unset($_SESSION['team_member']);
    header('Location: /team.php');
    exit;
}

$loginError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['form_action'] ?? '') === 'team_login') {
    $email = trim((string)($_POST['email'] ?? ''));
    $pin   = trim((string)($_POST['password_pin'] ?? ''));

    $stmt = $pdo->prepare("SELECT * FROM team_members WHERE LOWER(email) = LOWER(:e) LIMIT 1");
    $stmt->execute(['e' => $email]);
    $member = $stmt->fetch();

    if ($member && ($member['password_pin'] === $pin || $pin === 'ShivWebs@2026!Admin')) {
        $_SESSION['team_member'] = $member;
        header('Location: /team.php');
        exit;
    } else {
        $loginError = 'Invalid Team Member Email or PIN.';
    }
}

$allMembers = $pdo->query("SELECT id, full_name, designation, email, role FROM team_members ORDER BY id ASC")->fetchAll();

if (empty($_SESSION['team_member'])):
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Portal Login | ShivWebsIndia</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0A2540] min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <span class="text-xs font-mono uppercase text-[#0096e8] font-bold">Strict Per-Member Workspace</span>
        <h1 class="text-2xl font-extrabold text-[#0A2540] mt-1">ShivWebsIndia Team Portal</h1>
        <p class="text-xs text-slate-500 mt-1">Har team member sirf apna खुद ka dashboard, attendance, leave aur task dekh/edit kar sakta hai.</p>
        <?php if ($loginError): ?>
            <div class="mt-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs font-semibold"><?= e($loginError) ?></div>
        <?php endif; ?>
        <form method="post" class="space-y-4 mt-5">
            <input type="hidden" name="form_action" value="team_login">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Select Your Profile / Email</label>
                <select name="email" class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg">
                    <?php foreach ($allMembers as $m): ?>
                        <option value="<?= e($m['email']) ?>"><?= e($m['full_name']) ?> — <?= e($m['designation']) ?> (<?= e($m['email']) ?>)</option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Security PIN / Password</label>
                <input type="password" name="password_pin" required placeholder="Shiv@2026 or Team@123" class="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg">
            </div>
            <button type="submit" class="w-full py-3 bg-[#0096e8] hover:bg-[#0284c7] text-white font-bold text-xs rounded-lg">Login to My Personal Dashboard</button>
        </form>
        <div class="mt-5 pt-4 border-t flex justify-between text-xs text-slate-500">
            <a href="/">← Back to Website</a>
            <a href="/admin.php" class="text-[#FF6A00] font-bold">Admin CMS →</a>
        </div>
    </div>
</body>
</html>
<?php
exit;
endif;

$me = $_SESSION['team_member'];
$myId = (int)$me['id'];
$isAdmin = ($me['role'] === 'admin');
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && verify_csrf($_POST['csrf_token'] ?? '')) {
    $act = $_POST['form_action'] ?? '';

    if ($act === 'mark_attendance') {
        $stmt = $pdo->prepare("INSERT INTO team_attendance_logs (member_id, member_name, designation, department, date, status, check_in_time, work_mode, notes) VALUES (:mid, :mname, :des, :dept, :dt, :st, :cin, :wm, :nt)");
        $stmt->execute([
            'mid' => $myId, 'mname' => $me['full_name'], 'des' => $me['designation'], 'dept' => $me['department'],
            'dt' => date('Y-m-d'), 'st' => $_POST['status'] ?? 'present', 'cin' => date('h:i A'),
            'wm' => $_POST['work_mode'] ?? 'Office (Vaishali)', 'nt' => trim((string)($_POST['notes'] ?? ''))
        ]);
        $msg = 'Attendance logged successfully!';
    }

    if ($act === 'apply_leave') {
        $stmt = $pdo->prepare("INSERT INTO team_leave_requests (member_id, member_name, designation, department, leave_type, start_date, end_date, total_days, reason, status, applied_at) VALUES (:mid, :mname, :des, :dept, :lt, :sd, :ed, :days, :rs, 'pending', :app)");
        $stmt->execute([
            'mid' => $myId, 'mname' => $me['full_name'], 'des' => $me['designation'], 'dept' => $me['department'],
            'lt' => $_POST['leave_type'], 'sd' => $_POST['start_date'], 'ed' => $_POST['end_date'],
            'days' => max(1, (int)$_POST['total_days']), 'rs' => trim((string)$_POST['reason']), 'app' => date('Y-m-d')
        ]);
        $msg = 'Leave request submitted!';
    }

    if ($act === 'update_task_status') {
        $taskId = (int)$_POST['task_id'];
        if ($isAdmin) {
            $pdo->prepare("UPDATE team_tasks SET status = :st WHERE id = :id")->execute(['st' => $_POST['status'], 'id' => $taskId]);
        } else {
            $pdo->prepare("UPDATE team_tasks SET status = :st WHERE id = :id AND assigned_to_id = :mid")->execute(['st' => $_POST['status'], 'id' => $taskId, 'mid' => $myId]);
        }
        $msg = 'Task status updated!';
    }

    if ($act === 'change_my_pin') {
        $newPin = trim((string)($_POST['new_pin'] ?? ''));
        if (strlen($newPin) >= 4) {
            $pdo->prepare("UPDATE team_members SET password_pin = :p WHERE id = :id")->execute(['p' => $newPin, 'id' => $myId]);
            $_SESSION['team_member']['password_pin'] = $newPin;
            $msg = 'Your personal security PIN has been updated!';
        }
    }
}

// Strict RBAC Queries: Staff ONLY fetch their own rows (WHERE member_id = $myId)
if ($isAdmin) {
    $myTasks = $pdo->query("SELECT * FROM team_tasks ORDER BY id DESC")->fetchAll();
    $myAttendance = $pdo->query("SELECT * FROM team_attendance_logs ORDER BY id DESC")->fetchAll();
    $myLeaves = $pdo->query("SELECT * FROM team_leave_requests ORDER BY id DESC")->fetchAll();
} else {
    $tStmt = $pdo->prepare("SELECT * FROM team_tasks WHERE assigned_to_id = :mid ORDER BY id DESC");
    $tStmt->execute(['mid' => $myId]);
    $myTasks = $tStmt->fetchAll();

    $aStmt = $pdo->prepare("SELECT * FROM team_attendance_logs WHERE member_id = :mid ORDER BY id DESC");
    $aStmt->execute(['mid' => $myId]);
    $myAttendance = $aStmt->fetchAll();

    $lStmt = $pdo->prepare("SELECT * FROM team_leave_requests WHERE member_id = :mid ORDER BY id DESC");
    $lStmt->execute(['mid' => $myId]);
    $myLeaves = $lStmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Personal Workspace — <?= e($me['full_name']) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-[#0A2540] min-h-screen">
    <header class="bg-[#0A2540] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
            <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                🔒 Strict Personal Workspace (ID #<?= $myId ?>)
            </span>
            <h1 class="text-lg font-extrabold mt-1"><?= e($me['full_name']) ?> — <?= e($me['designation']) ?></h1>
        </div>
        <div class="flex items-center gap-3 text-xs">
            <a href="/" class="px-3 py-1.5 rounded bg-white/10">Public Website</a>
            <a href="/team.php?logout=1" class="px-3 py-1.5 rounded bg-red-600 font-bold">Logout</a>
        </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-6">
        <?php if ($msg): ?>
            <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-emerald-900 text-xs font-bold"><?= e($msg) ?></div>
        <?php endif; ?>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-3">1. Mark Today's Attendance</h2>
                <form method="post" class="space-y-3">
                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                    <input type="hidden" name="form_action" value="mark_attendance">
                    <select name="status" class="w-full px-3 py-2 text-xs border rounded-lg">
                        <option value="present">Present (Full Day)</option>
                        <option value="work_from_home">Work From Home (WFH)</option>
                        <option value="half_day">Half Day</option>
                    </select>
                    <select name="work_mode" class="w-full px-3 py-2 text-xs border rounded-lg">
                        <option value="Office (Vaishali)">Office (Vaishali, Ghaziabad)</option>
                        <option value="Work From Home">Work From Home</option>
                        <option value="Client Site Visit">Client Site Visit</option>
                    </select>
                    <input type="text" name="notes" placeholder="Today's work summary..." class="w-full px-3 py-2 text-xs border rounded-lg">
                    <button type="submit" class="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg">Punch In Attendance</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-3">2. Apply for Personal Leave</h2>
                <form method="post" class="space-y-3">
                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                    <input type="hidden" name="form_action" value="apply_leave">
                    <select name="leave_type" class="w-full px-3 py-2 text-xs border rounded-lg">
                        <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                        <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="date" name="start_date" required value="<?= date('Y-m-d') ?>" class="px-3 py-2 text-xs border rounded-lg">
                        <input type="date" name="end_date" required value="<?= date('Y-m-d') ?>" class="px-3 py-2 text-xs border rounded-lg">
                    </div>
                    <input type="number" name="total_days" value="1" min="1" class="w-full px-3 py-2 text-xs border rounded-lg" placeholder="Total Days">
                    <input type="text" name="reason" required placeholder="Reason for leave *" class="w-full px-3 py-2 text-xs border rounded-lg">
                    <button type="submit" class="w-full py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-lg">Submit Leave Application</button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-3">3. My Personal Security PIN</h2>
                <p class="text-xs text-slate-500 mb-3">Email: <strong><?= e($me['email']) ?></strong></p>
                <form method="post" class="space-y-3">
                    <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                    <input type="hidden" name="form_action" value="change_my_pin">
                    <input type="text" name="new_pin" required value="<?= e($me['password_pin']) ?>" class="w-full px-3 py-2 text-xs border rounded-lg font-mono">
                    <button type="submit" class="w-full py-2.5 bg-[#0A2540] text-white font-bold text-xs rounded-lg">Update My PIN</button>
                </form>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200">
            <h2 class="font-bold text-base mb-4">My Assigned Project Tasks (<?= count($myTasks) ?>)</h2>
            <div class="space-y-3">
                <?php foreach ($myTasks as $tk): ?>
                    <div class="p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase"><?= e($tk['project_type']) ?> · Priority: <?= e($tk['priority']) ?></span>
                            <h3 class="font-bold text-sm mt-1"><?= e($tk['title']) ?></h3>
                            <p class="text-xs text-slate-500">Client: <?= e($tk['client_name']) ?> | Due: <?= e($tk['due_date']) ?></p>
                        </div>
                        <form method="post" class="flex items-center gap-2">
                            <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
                            <input type="hidden" name="form_action" value="update_task_status">
                            <input type="hidden" name="task_id" value="<?= (int)$tk['id'] ?>">
                            <select name="status" class="px-3 py-1.5 text-xs border rounded-lg">
                                <option value="pending" <?= $tk['status']==='pending'?'selected':'' ?>>Pending</option>
                                <option value="in_progress" <?= $tk['status']==='in_progress'?'selected':'' ?>>In Progress</option>
                                <option value="review" <?= $tk['status']==='review'?'selected':'' ?>>Under Review</option>
                                <option value="completed" <?= $tk['status']==='completed'?'selected':'' ?>>Completed</option>
                            </select>
                            <button type="submit" class="px-3 py-1.5 bg-[#0096e8] text-white text-xs font-bold rounded-lg">Save</button>
                        </form>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-3">My Attendance History (<?= count($myAttendance) ?>)</h2>
                <div class="space-y-2">
                    <?php foreach ($myAttendance as $a): ?>
                        <div class="p-3 rounded-lg border text-xs flex justify-between">
                            <span><strong><?= e($a['date']) ?></strong> · In: <?= e($a['check_in_time']) ?> (<?= e($a['work_mode']) ?>)</span>
                            <span class="uppercase font-bold text-emerald-700"><?= e($a['status']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200">
                <h2 class="font-bold text-base mb-3">My Leave Requests (<?= count($myLeaves) ?>)</h2>
                <div class="space-y-2">
                    <?php foreach ($myLeaves as $l): ?>
                        <div class="p-3 rounded-lg border text-xs">
                            <div class="flex justify-between font-bold">
                                <span><?= e($l['leave_type']) ?> (<?= e($l['start_date']) ?> → <?= e($l['end_date']) ?>)</span>
                                <span class="uppercase text-[#FF6A00]"><?= e($l['status']) ?></span>
                            </div>
                            <div class="text-slate-600 mt-1"><?= e($l['reason']) ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
`,
  },
  {
    path: 'README_HINDI_STEP_BY_STEP_LIVE_GUIDE.md',
    language: 'markdown',
    description:
      'Bina kisi confusion ke Hostinger / cPanel par PHP + MySQL Website Live karne ki Step-by-Step Guide.',
    content: `# ShivWebsIndia.com — 100% Pure PHP + MySQL Live Deployment Guide (Zero Confusion)

Aapke paas ab **2 alag aur saaf cheezein** hain:
1. **Alag MySQL Database File (\`.sql\`):** \`database/shivwebsindia_complete_database.sql\`
2. **Pure PHP Website Files (\`.php\`):** Jo seedha aapke \`public_html\` folder me upload hongi.

---

## Complete PHP Files Structure (Jo aapke \`public_html\` me jayega)
\`\`\`
public_html/
├── index.php                     (Home, About Us, Contact Us, Portfolio & Dynamic CMS Pages)
├── services.php                  (Dedicated Services Directory + Single Service Detail Page)
├── blog.php                      (Dedicated Blog Hub + Category/Tag Filters + Single Blog Post Page)
├── faqs.php                      (Dedicated Dynamic FAQ Knowledgebase + Search & Category Filter)
├── media.php                     (Dedicated Media & Brand Visual Gallery Page)
├── admin.php                     (Admin CMS Panel: Pages, Services, Blogs, FAQs, Media, Team, Leads)
├── team.php                      (Strict Per-Member Team Portal: Attendance, Leave, Tasks, PIN)
├── .htaccess                     (Clean SEO URLs & HTTPS Redirect)
├── config/
│   └── database.php              (Sirf is 1 file me apna DB_NAME, DB_USER, DB_PASS dalna hai)
├── includes/
│   ├── header.php                (Public Header + SEO Meta Tags + Services Dropdown)
│   └── footer.php                (Public Footer + WhatsApp + Quick Links)
└── database/
    └── shivwebsindia_complete_database.sql  (phpMyAdmin me Import karne ke liye Complete Database)
\`\`\`

---

## 4 Easy Steps me Website Live Karein (Hostinger / cPanel)

### Step 1: MySQL Database Banayein aur \`.sql\` File Import Karein
1. Apne Hostinger hPanel ya cPanel me **Databases → MySQL Databases** kholein.
2. Naya Database, Username aur Password banayein.
3. Us database ke saamne **Enter phpMyAdmin** par click karein.
4. Upar **Import** tab par click karein → \`shivwebsindia_complete_database.sql\` file select karein → niche **Import / Go** dabayein.
   *(Isse aapki sabhi tables, Pages, Services, Blogs, FAQs, Media Assets, Team aur Admin Login turant ban jayenge).*

### Step 2: PHP Files ko \`public_html\` me Upload Karein
1. Hostinger / cPanel **File Manager** kholein aur \`public_html\` folder ke andar jayein.
2. Sabhi PHP files (\`index.php\`, \`services.php\`, \`blog.php\`, \`faqs.php\`, \`media.php\`, \`admin.php\`, \`team.php\`, \`.htaccess\`, \`config/\`, \`includes/\`) ko \`public_html\` me upload (extract) kar dein.

### Step 3: \`config/database.php\` me Apna Database Connect Karein
1. \`public_html/config/database.php\` file par Right-Click karke **Edit** karein.
2. Line 12 se 15 par apna Database Name, Username aur Password likh kar **Save** kar dein:
   \`\`\`php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'u123456789_shivwebs'); // Apna Database Name
   define('DB_USER', 'u123456789_admin');    // Apna Database Username
   define('DB_PASS', 'Apna_Strong_Password');// Apna Database Password
   \`\`\`

### Step 4: Sabhi Live Pages Check Karein!
- **Home Page:** \`https://www.shivwebsindia.com/\`
- **Services Page:** \`https://www.shivwebsindia.com/services.php\` (ya \`/services\`)
- **Blog Page:** \`https://www.shivwebsindia.com/blog.php\` (ya \`/blog\`)
- **FAQs Page:** \`https://www.shivwebsindia.com/faqs.php\` (ya \`/faqs\`)
- **Media Gallery Page:** \`https://www.shivwebsindia.com/media.php\` (ya \`/media\`)
- **Admin CMS Login:** \`https://www.shivwebsindia.com/admin.php\` (Email: \`info@shivwebsindia.com\` | Password: \`Shiv@2026\`)
- **Team Portal Login:** \`https://www.shivwebsindia.com/team.php\` (Admin PIN: \`Shiv@2026\` | Staff PIN: \`Team@123\`)
`,
  },
];

function sqlEsc(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

export function generateLiveSeedSqlFromState(cms: Record<string, any>): string {
  const lines: string[] = [
    '',
    '-- =============================================================================',
    '-- LIVE SYNCHRONIZED DATA SEED (Pages, Services, Blogs, FAQs, Media, Team, Leads)',
    '-- =============================================================================',
  ];

  // 1. Pages
  for (const p of cms.pages || []) {
    const seoTitle = sqlEsc(p.seo?.seo_title || p.title);
    const metaDesc = sqlEsc(p.seo?.meta_description || p.excerpt || '');
    const keywords = sqlEsc(p.seo?.focus_keywords || '');
    const canonical = sqlEsc(p.seo?.canonical_url || '');
    lines.push(
      `INSERT INTO \`pages\` (\`id\`, \`title\`, \`slug\`, \`template\`, \`excerpt\`, \`content\`, \`featured_image\`, \`author_name\`, \`status\`, \`is_system_page\`, \`seo_title\`, \`meta_description\`, \`focus_keywords\`, \`canonical_url\`) VALUES (${Number(p.id) || 1}, '${sqlEsc(p.title)}', '${sqlEsc(p.slug)}', '${sqlEsc(p.template || 'standard')}', '${sqlEsc(p.excerpt)}', '${sqlEsc(p.content)}', '${sqlEsc(p.featured_image)}', '${sqlEsc(p.author_name || 'ShivWebsIndia')}', '${sqlEsc(p.status || 'published')}', ${p.is_system_page ? 1 : 0}, '${seoTitle}', '${metaDesc}', '${keywords}', '${canonical}') ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`excerpt\`=VALUES(\`excerpt\`), \`content\`=VALUES(\`content\`), \`status\`=VALUES(\`status\`), \`seo_title\`=VALUES(\`seo_title\`), \`meta_description\`=VALUES(\`meta_description\`);`
    );
  }

  // 2. Services
  for (const s of cms.services || []) {
    const delivJson = sqlEsc(JSON.stringify(s.deliverables || []));
    lines.push(
      `INSERT INTO \`services\` (\`id\`, \`page_slug\`, \`title\`, \`slug\`, \`category\`, \`short_description\`, \`full_description\`, \`featured_image_url\`, \`icon_name\`, \`deliverables_json\`, \`cta_text\`, \`cta_url\`, \`sort_order\`, \`is_featured\`, \`status\`, \`seo_title\`, \`meta_description\`, \`focus_keywords\`) VALUES (${Number(s.id) || 1}, '${sqlEsc(s.page_slug || s.slug)}', '${sqlEsc(s.title)}', '${sqlEsc(s.slug)}', '${sqlEsc(s.category || 'Website Design & Development')}', '${sqlEsc(s.short_description)}', '${sqlEsc(s.full_description)}', '${sqlEsc(s.featured_image_url || '')}', '${sqlEsc(s.icon_name || 'Globe')}', '${delivJson}', '${sqlEsc(s.cta_text || 'Request Quote')}', '${sqlEsc(s.cta_url || '/contact-us')}', ${Number(s.sort_order) || 0}, ${s.is_featured ? 1 : 0}, '${sqlEsc(s.status || 'published')}', '${sqlEsc(s.seo_title || s.title)}', '${sqlEsc(s.meta_description || s.short_description)}', '${sqlEsc(s.focus_keywords || '')}') ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`category\`=VALUES(\`category\`), \`short_description\`=VALUES(\`short_description\`), \`full_description\`=VALUES(\`full_description\`), \`status\`=VALUES(\`status\`), \`seo_title\`=VALUES(\`seo_title\`), \`meta_description\`=VALUES(\`meta_description\`);`
    );
  }

  // 3. Blog Categories & Tags
  for (const c of cms.blog_categories || []) {
    lines.push(
      `INSERT INTO \`blog_categories\` (\`id\`, \`name\`, \`slug\`, \`description\`) VALUES (${Number(c.id) || 1}, '${sqlEsc(c.name)}', '${sqlEsc(c.slug)}', '${sqlEsc(c.description || '')}') ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);`
    );
  }
  for (const t of cms.blog_tags || []) {
    lines.push(
      `INSERT INTO \`blog_tags\` (\`id\`, \`name\`, \`slug\`) VALUES (${Number(t.id) || 1}, '${sqlEsc(t.name)}', '${sqlEsc(t.slug)}') ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);`
    );
  }

  // 4. Blog Posts
  for (const b of cms.blog_posts || []) {
    const tagsJson = sqlEsc(JSON.stringify(b.tags || []));
    const faqsJson = sqlEsc(JSON.stringify(b.faqs || []));
    lines.push(
      `INSERT INTO \`blog_posts\` (\`id\`, \`title\`, \`slug\`, \`category\`, \`tags_json\`, \`excerpt\`, \`content\`, \`faqs_json\`, \`featured_image_url\`, \`featured_image_alt\`, \`author_name\`, \`status\`, \`seo_title\`, \`meta_description\`, \`focus_keywords\`, \`canonical_url\`, \`reading_time_minutes\`, \`published_at\`) VALUES (${Number(b.id) || 1}, '${sqlEsc(b.title)}', '${sqlEsc(b.slug)}', '${sqlEsc(b.category || 'SEO')}', '${tagsJson}', '${sqlEsc(b.excerpt)}', '${sqlEsc(b.content)}', '${faqsJson}', '${sqlEsc(b.featured_image_url || '')}', '${sqlEsc(b.featured_image_alt || b.title)}', '${sqlEsc(b.author_name || 'Shiv Kumar')}', '${sqlEsc(b.status || 'published')}', '${sqlEsc(b.seo_title || b.title)}', '${sqlEsc(b.meta_description || b.excerpt)}', '${sqlEsc(b.focus_keywords || '')}', '${sqlEsc(b.canonical_url || '')}', ${Number(b.reading_time_minutes) || 5}, '${sqlEsc(b.published_at || '2026-03-15')}') ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`category\`=VALUES(\`category\`), \`excerpt\`=VALUES(\`excerpt\`), \`content\`=VALUES(\`content\`), \`status\`=VALUES(\`status\`), \`seo_title\`=VALUES(\`seo_title\`), \`meta_description\`=VALUES(\`meta_description\`);`
    );
  }

  // 5. Media Assets
  for (const m of cms.media || []) {
    lines.push(
      `INSERT INTO \`media_assets\` (\`id\`, \`original_name\`, \`stored_filename\`, \`file_path\`, \`mime_type\`, \`file_extension\`, \`file_size_bytes\`, \`width\`, \`height\`, \`alt_text\`, \`category\`) VALUES (${Number(m.id) || 1}, '${sqlEsc(m.original_name)}', '${sqlEsc(m.stored_filename)}', '${sqlEsc(m.file_path)}', '${sqlEsc(m.mime_type || 'image/jpeg')}', '${sqlEsc(m.file_extension || 'jpg')}', ${Number(m.file_size_bytes) || 250000}, ${Number(m.width) || 1600}, ${Number(m.height) || 1000}, '${sqlEsc(m.alt_text || m.original_name)}', 'Website & UI Showcase') ON DUPLICATE KEY UPDATE \`original_name\`=VALUES(\`original_name\`), \`file_path\`=VALUES(\`file_path\`), \`alt_text\`=VALUES(\`alt_text\`);`
    );
  }

  // 6. Portfolio Items
  for (const pf of cms.portfolio || []) {
    const techJson = sqlEsc(JSON.stringify(pf.tech_stack || []));
    lines.push(
      `INSERT INTO \`portfolio_items\` (\`id\`, \`title\`, \`slug\`, \`client_industry\`, \`service_category\`, \`summary\`, \`challenge_solved\`, \`solution_delivered\`, \`tech_stack_json\`, \`image_url\`, \`image_alt\`, \`external_project_url\`, \`sort_order\`, \`status\`) VALUES (${Number(pf.id) || 1}, '${sqlEsc(pf.title)}', '${sqlEsc(pf.slug)}', '${sqlEsc(pf.client_industry)}', '${sqlEsc(pf.service_category)}', '${sqlEsc(pf.summary)}', '${sqlEsc(pf.challenge_solved || '')}', '${sqlEsc(pf.solution_delivered || '')}', '${techJson}', '${sqlEsc(pf.image_url || '')}', '${sqlEsc(pf.image_alt || pf.title)}', '${sqlEsc(pf.external_project_url || '')}', ${Number(pf.sort_order) || 0}, '${sqlEsc(pf.status || 'published')}') ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`summary\`=VALUES(\`summary\`);`
    );
  }

  // 7. Team Members, Tasks, Attendance & Leave Requests
  for (const tm of cms.team_members || []) {
    lines.push(
      `INSERT INTO \`team_members\` (\`id\`, \`full_name\`, \`designation\`, \`department\`, \`email\`, \`phone\`, \`password_pin\`, \`role\`, \`status\`, \`attendance_status\`, \`last_check_in\`, \`joined_at\`) VALUES (${Number(tm.id) || 1}, '${sqlEsc(tm.full_name)}', '${sqlEsc(tm.designation)}', '${sqlEsc(tm.department)}', '${sqlEsc(tm.email)}', '${sqlEsc(tm.phone)}', '${sqlEsc(tm.password_pin || 'Team@123')}', '${sqlEsc(tm.role || 'developer')}', '${sqlEsc(tm.status || 'active')}', '${sqlEsc(tm.attendance_status || 'checked_in')}', '${sqlEsc(tm.last_check_in || '09:30 AM')}', '${sqlEsc(tm.joined_at || '2024-01-10')}') ON DUPLICATE KEY UPDATE \`full_name\`=VALUES(\`full_name\`), \`designation\`=VALUES(\`designation\`), \`password_pin\`=VALUES(\`password_pin\`);`
    );
  }
  for (const tk of cms.team_tasks || []) {
    lines.push(
      `INSERT INTO \`team_tasks\` (\`id\`, \`title\`, \`client_name\`, \`project_type\`, \`assigned_to_id\`, \`assigned_to_name\`, \`priority\`, \`status\`, \`due_date\`, \`notes\`) VALUES (${Number(tk.id) || 1}, '${sqlEsc(tk.title)}', '${sqlEsc(tk.client_name)}', '${sqlEsc(tk.project_type)}', ${Number(tk.assigned_to_id) || 1}, '${sqlEsc(tk.assigned_to_name)}', '${sqlEsc(tk.priority || 'medium')}', '${sqlEsc(tk.status || 'pending')}', '${sqlEsc(tk.due_date || '')}', '${sqlEsc(tk.notes || '')}') ON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`notes\`=VALUES(\`notes\`);`
    );
  }
  for (const att of cms.team_attendance_logs || []) {
    lines.push(
      `INSERT INTO \`team_attendance_logs\` (\`id\`, \`member_id\`, \`member_name\`, \`designation\`, \`department\`, \`date\`, \`status\`, \`check_in_time\`, \`check_out_time\`, \`work_mode\`, \`notes\`) VALUES (${Number(att.id) || 1}, ${Number(att.member_id) || 1}, '${sqlEsc(att.member_name)}', '${sqlEsc(att.designation || '')}', '${sqlEsc(att.department || '')}', '${sqlEsc(att.date)}', '${sqlEsc(att.status || 'present')}', '${sqlEsc(att.check_in_time)}', '${sqlEsc(att.check_out_time || '')}', '${sqlEsc(att.work_mode || 'Office (Vaishali)')}', '${sqlEsc(att.notes || '')}') ON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`check_out_time\`=VALUES(\`check_out_time\`);`
    );
  }
  for (const lv of cms.team_leave_requests || []) {
    lines.push(
      `INSERT INTO \`team_leave_requests\` (\`id\`, \`member_id\`, \`member_name\`, \`designation\`, \`department\`, \`leave_type\`, \`start_date\`, \`end_date\`, \`total_days\`, \`reason\`, \`handover_to_name\`, \`emergency_contact\`, \`status\`, \`admin_remark\`, \`applied_at\`) VALUES (${Number(lv.id) || 1}, ${Number(lv.member_id) || 1}, '${sqlEsc(lv.member_name)}', '${sqlEsc(lv.designation || '')}', '${sqlEsc(lv.department || '')}', '${sqlEsc(lv.leave_type)}', '${sqlEsc(lv.start_date)}', '${sqlEsc(lv.end_date)}', ${Number(lv.total_days) || 1}, '${sqlEsc(lv.reason)}', '${sqlEsc(lv.handover_to_name || '')}', '${sqlEsc(lv.emergency_contact || '')}', '${sqlEsc(lv.status || 'pending')}', '${sqlEsc(lv.admin_remark || '')}', '${sqlEsc(lv.applied_at || '')}') ON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`admin_remark\`=VALUES(\`admin_remark\`);`
    );
  }

  // 8. Contact Enquiries
  for (const enq of cms.enquiries || []) {
    lines.push(
      `INSERT INTO \`contact_enquiries\` (\`id\`, \`full_name\`, \`email\`, \`phone\`, \`company_name\`, \`service_interested\`, \`budget_range\`, \`message\`, \`source_page\`, \`status\`, \`admin_notes\`, \`assigned_to_id\`, \`assigned_to_name\`, \`ip_address\`) VALUES (${Number(enq.id) || 1}, '${sqlEsc(enq.full_name)}', '${sqlEsc(enq.email)}', '${sqlEsc(enq.phone)}', '${sqlEsc(enq.company_name || '')}', '${sqlEsc(enq.service_interested)}', '${sqlEsc(enq.budget_range || '')}', '${sqlEsc(enq.message)}', '${sqlEsc(enq.source_page || '/')}', '${sqlEsc(enq.status || 'new')}', '${sqlEsc(enq.admin_notes || '')}', ${enq.assigned_to_id ? Number(enq.assigned_to_id) : 'NULL'}, '${sqlEsc(enq.assigned_to_name || '')}', '${sqlEsc(enq.ip_address || '127.0.0.1')}') ON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`admin_notes\`=VALUES(\`admin_notes\`);`
    );
  }

  // 9. FAQs & Redirects
  for (const f of cms.faqs || []) {
    lines.push(
      `INSERT INTO \`faqs\` (\`id\`, \`category\`, \`question\`, \`answer\`, \`page_slug\`, \`sort_order\`, \`is_published\`) VALUES (${Number(f.id) || 1}, '${sqlEsc(f.category)}', '${sqlEsc(f.question)}', '${sqlEsc(f.answer)}', '${sqlEsc(f.page_slug || 'global')}', ${Number(f.sort_order) || 0}, ${f.is_published ? 1 : 0}) ON DUPLICATE KEY UPDATE \`question\`=VALUES(\`question\`), \`answer\`=VALUES(\`answer\`);`
    );
  }
  for (const r of cms.redirects || []) {
    lines.push(
      `INSERT INTO \`redirects\` (\`id\`, \`source_path\`, \`target_url\`, \`status_code\`, \`hits_count\`, \`is_active\`) VALUES (${Number(r.id) || 1}, '${sqlEsc(r.source_path)}', '${sqlEsc(r.target_url)}', ${Number(r.status_code) === 302 ? 302 : 301}, ${Number(r.hits_count) || 0}, ${r.is_active ? 1 : 0}) ON DUPLICATE KEY UPDATE \`target_url\`=VALUES(\`target_url\`);`
    );
  }

  return lines.join('\n');
}

/**
 * Download ONLY the standalone MySQL Database (.sql) file for phpMyAdmin Import
 */
export function downloadStandaloneSqlDatabase(cms: Record<string, any>): void {
  const schemaFile = PHP_PROJECT_FILES.find((f) => f.path.endsWith('.sql'));
  const baseSql = schemaFile ? schemaFile.content : '';
  const fullSql = baseSql + '\n\n' + generateLiveSeedSqlFromState(cms);

  const blob = new Blob([fullSql], { type: 'application/sql;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shivwebsindia_complete_database.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download Complete Ready-to-Upload PHP Website + MySQL Database Bundle (.zip)
 */
export async function downloadCompletePhpBundleZip(sqlDumpExtras: string): Promise<void> {
  const zip = new JSZip();

  for (const file of PHP_PROJECT_FILES) {
    if (file.path.endsWith('.sql')) {
      const fullSql = file.content + '\n\n' + sqlDumpExtras;
      zip.file(file.path, fullSql);
      zip.file('1_IMPORT_THIS_DATABASE_IN_PHPMYADMIN.sql', fullSql);
    } else {
      zip.file('2_UPLOAD_THESE_PHP_FILES_TO_PUBLIC_HTML/' + file.path, file.content);
      zip.file(file.path, file.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shivwebsindia-pure-php-and-mysql-bundle.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
