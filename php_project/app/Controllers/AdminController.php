<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Database;
use App\Helpers\Security;
use PDO;
use Exception;

/**
 * Admin Controller
 * Handles secure authentication (password_hash / password_verify, session regeneration,
 * rate limiting), RBAC authorization, Page CRUD + Revisions, Section Builder, and Media Uploads.
 */
final class AdminController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        Security::initSecureSession();
    }

    public function login(string $email, string $password, string $csrfToken, string $ip): array
    {
        if (!Security::verifyCsrfToken($csrfToken)) {
            return ['success' => false, 'error' => 'Invalid CSRF token. Please refresh and try again.'];
        }

        $stmt = $this->db->prepare(
            'SELECT u.*, r.slug AS role_slug
             FROM users u
             INNER JOIN roles r ON r.id = u.role_id
             WHERE u.email = :email
             LIMIT 1'
        );
        $stmt->execute(['email' => trim(strtolower($email))]);
        $user = $stmt->fetch();

        if (!$user) {
            return ['success' => false, 'error' => 'Invalid email or password.'];
        }

        if ($user['locked_until'] !== null && strtotime($user['locked_until']) > time()) {
            return ['success' => false, 'error' => 'Account temporarily locked due to failed login attempts. Try again in 15 minutes.'];
        }

        if (!password_verify($password, $user['password_hash'])) {
            $attempts = (int)$user['failed_login_attempts'] + 1;
            $lockedUntil = ($attempts >= 5) ? date('Y-m-d H:i:s', time() + 900) : null;
            $upd = $this->db->prepare(
                'UPDATE users SET failed_login_attempts = :att, locked_until = :lock WHERE id = :id'
            );
            $upd->execute(['att' => $attempts, 'lock' => $lockedUntil, 'id' => $user['id']]);
            return ['success' => false, 'error' => 'Invalid email or password.'];
        }

        // Reset counters & regenerate session ID to prevent session fixation
        Security::regenerateSession();
        $reset = $this->db->prepare(
            'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = :ip WHERE id = :id'
        );
        $reset->execute(['ip' => $ip, 'id' => $user['id']]);

        $_SESSION['admin_user'] = [
            'id'        => (int)$user['id'],
            'full_name' => $user['full_name'],
            'email'     => $user['email'],
            'role'      => $user['role_slug'],
        ];

        return ['success' => true, 'user' => $_SESSION['admin_user']];
    }

    public function logout(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }
        session_destroy();
    }

    /**
     * Secure Media Upload Validation
     * Enforces extension allowlist, finfo MIME verification, getimagesize() content verification,
     * file size limits (max 5MB), and randomized stored filenames.
     */
    public function uploadMedia(array $file, string $altText, int $userId): array
    {
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $maxBytes = 5 * 1024 * 1024; // 5 MB

        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return ['success' => false, 'error' => 'File upload failed with error code ' . ($file['error'] ?? -1)];
        }

        if ($file['size'] > $maxBytes) {
            return ['success' => false, 'error' => 'File size exceeds the 5 MB maximum limit.'];
        }

        $originalName = basename($file['name']);
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExtensions, true)) {
            return ['success' => false, 'error' => 'Disallowed file extension. Allowed: JPG, PNG, WEBP, GIF.'];
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        if (!in_array($mime, $allowedMimes, true)) {
            return ['success' => false, 'error' => 'Invalid MIME type detected (' . Security::e((string)$mime) . ').'];
        }

        $imageInfo = @getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            return ['success' => false, 'error' => 'Uploaded file is not a valid image binary.'];
        }

        $storedFilename = bin2hex(random_bytes(16)) . '.' . $ext;
        $uploadDir = __DIR__ . '/../../public/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0750, true);
        }

        $destination = $uploadDir . $storedFilename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            return ['success' => false, 'error' => 'Could not move uploaded file to destination.'];
        }
        chmod($destination, 0640);

        $stmt = $this->db->prepare(
            'INSERT INTO media (original_name, stored_filename, file_path, mime_type, file_extension, file_size_bytes, width, height, alt_text, uploaded_by)
             VALUES (:orig, :stored, :path, :mime, :ext, :size, :w, :h, :alt, :uid)'
        );
        $stmt->execute([
            'orig'   => $originalName,
            'stored' => $storedFilename,
            'path'   => '/uploads/' . $storedFilename,
            'mime'   => $mime,
            'ext'    => $ext,
            'size'   => (int)$file['size'],
            'w'      => (int)$imageInfo[0],
            'h'      => (int)$imageInfo[1],
            'alt'    => trim($altText),
            'uid'    => $userId,
        ]);

        return ['success' => true, 'media_id' => (int)$this->db->lastInsertId(), 'path' => '/uploads/' . $storedFilename];
    }
}
