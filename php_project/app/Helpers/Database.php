<?php
declare(strict_types=1);

namespace App\Helpers;

use PDO;
use PDOException;

/**
 * Database Connection Singleton using PDO with strict prepared statements
 * Enforces utf8mb4 and exception mode for SQL injection immunity.
 */
final class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $dbName = $_ENV['DB_DATABASE'] ?? 'u123456789_shivwebs';
            $user = $_ENV['DB_USERNAME'] ?? 'u123456789_admin';
            $pass = $_ENV['DB_PASSWORD'] ?? '';

            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $dbName);

            try {
                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, time_zone = '+05:30'",
                ]);
            } catch (PDOException $e) {
                error_log('[Database Connection Error] ' . $e->getMessage());
                http_response_code(500);
                exit('A database error occurred. Please try again later.');
            }
        }

        return self::$instance;
    }
}
