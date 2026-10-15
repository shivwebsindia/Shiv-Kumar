<?php
declare(strict_types=1);

namespace App\Helpers;

/**
 * Security Helper for CSRF tokens, XSS context-aware escaping,
 * rich-text HTML allowlist sanitization, and session hardening.
 */
final class Security
{
    public static function initSecureSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                || ($_SERVER['SERVER_PORT'] ?? 80) == 443;

            session_set_cookie_params([
                'lifetime' => 0,
                'path'     => '/',
                'domain'   => '',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Strict',
            ]);
            session_name('SHIVWEBS_SESSID');
            session_start();
        }
    }

    public static function regenerateSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }

    public static function generateCsrfToken(): string
    {
        self::initSecureSession();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrfToken(?string $token): bool
    {
        self::initSecureSession();
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    /**
     * Context-aware HTML output escaping (prevents XSS)
     */
    public static function e(?string $value): string
    {
        return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Sanitize rich-text HTML using strict tag allowlist and stripping event handlers / scripts
     */
    public static function sanitizeRichText(string $html): string
    {
        $allowedTags = '<p><br><h2><h3><h4><strong><em><ul><ol><li><a><blockquote><code><pre>';
        $clean = strip_tags($html, $allowedTags);
        // Strip inline event handlers like onload=, onclick=, onerror= and javascript: URIs
        $clean = preg_replace('/\bon\w+\s*=\s*(["\']).*?\1/i', '', $clean) ?? '';
        $clean = preg_replace('/javascript\s*:/i', '', $clean) ?? '';
        return trim($clean);
    }

    /**
     * Normalize URL slug
     */
    public static function slugify(string $text): string
    {
        $slug = strtolower(trim($text));
        $slug = preg_replace('/[^a-z0-9-]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');
        return $slug ?: 'page-' . bin2hex(random_bytes(3));
    }
}
