# ShivWebsIndia.com — Complete Dynamic Business Website & CMS (PHP 8.x + MySQL)

## 1. Architecture & Directory Structure

```text
shivwebsindia/                  <-- Place outside public_html (e.g. /home/u123456789/shivwebsindia)
├── app/
│   ├── Controllers/
│   │   ├── PublicController.php
│   │   └── AdminController.php
│   ├── Helpers/
│   │   ├── Database.php
│   │   └── Security.php
├── database/
│   └── migrations/
│       └── 001_create_shivwebsindia_schema.sql
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── public.php
│       └── sections/
│           └── block_renderer.php
├── storage/
│   ├── logs/
│   └── private/
├── public/                     <-- Symlink or copy contents to /home/u123456789/domains/shivwebsindia.com/public_html
│   ├── .htaccess
│   ├── index.php
│   ├── assets/
│   └── uploads/
├── .env.example
├── composer.json
└── README.md
```

## 2. Hostinger Shared Hosting / cPanel Installation Guide

1. **Create MySQL Database (`utf8mb4`)**:
   - Log in to **Hostinger hPanel** (or cPanel) -> **Databases** -> **Management**.
   - Create a database (e.g., `u123456789_shivwebs`) and database user.
   - Open **phpMyAdmin** and import `database/migrations/001_create_shivwebsindia_schema.sql`.

2. **Upload Application Files Securely**:
   - Upload `app/`, `database/`, `resources/`, `storage/`, `.env`, and `composer.json` to `/home/u123456789/shivwebsindia/` (one level above `public_html` so private source files and `.env` are never publicly web-accessible).
   - Upload the contents of `public/` (`index.php`, `.htaccess`, `assets/`, `uploads/`) into `/home/u123456789/domains/shivwebsindia.com/public_html/`.
   - *If your shared hosting plan forces all files inside `public_html`*: Keep the root `.htaccess` rule `RewriteRule ^(app|config|database|resources|storage|vendor|\.env) - [F,L,NC]` active to block direct HTTP access with `403 Forbidden`.

3. **Configure `.env` & Administrator Account**:
   - Copy `.env.example` to `.env` and fill in your MySQL database credentials.
   - Generate a secure administrator password hash using PHP CLI or one-time setup script:
     ```bash
     php -r "echo password_hash('YourStrongAdminPass!', PASSWORD_DEFAULT) . PHP_EOL;"
     ```
   - Update the `users` table row for `info@shivwebsindia.com` with the generated hash.

4. **File Permissions & Upload Hardening**:
   - Directories: `750` (`chmod 750 storage/logs public/uploads`)
   - Files: `640` (`chmod 640 .env`)
   - Verify that `public/.htaccess` blocks PHP execution inside `public/uploads/`.

## 3. Backup & Disaster Recovery Procedure
- **Database Backups**: Run `mysqldump --single-transaction --routines -u USER -p DB_NAME > backup_$(date +%F).sql` daily via Hostinger Cron Jobs.
- **Media Backups**: Archive `public/uploads/` weekly.
- **URL Preservation Check**: Before switching DNS or going live, verify all 301 redirects in the Admin Redirect Manager and confirm `/sitemap.xml` returns HTTP 200.
