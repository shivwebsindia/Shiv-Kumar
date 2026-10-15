<?php
declare(strict_types=1);

/**
 * ShivWebsIndia.com — Front Controller (public/index.php)
 * Compatible with PHP 8.1+ on Hostinger Shared / Cloud Hosting & cPanel
 */

// Disable public error display in production; log privately to storage/logs/app.log
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', dirname(__DIR__) . '/storage/logs/php-error.log');

require_once dirname(__DIR__) . '/app/Helpers/Database.php';
require_once dirname(__DIR__) . '/app/Helpers/Security.php';
require_once dirname(__DIR__) . '/app/Controllers/PublicController.php';
require_once dirname(__DIR__) . '/app/Controllers/AdminController.php';

use App\Controllers\PublicController;
use App\Helpers\Security;

Security::initSecureSession();

$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$controller = new PublicController();
$controller->handleRequest($requestUri);
