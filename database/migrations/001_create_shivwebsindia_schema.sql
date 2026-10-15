-- =============================================================================
-- ShivWebsIndia.com — Complete Production MySQL Database Schema & Initial Seed
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Target: Hostinger / cPanel MySQL 8.0+ / MariaDB 10.6+
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- -----------------------------------------------------------------------------
-- 1. roles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `slug` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. permissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_permissions_slug` (`slug`),
  KEY `idx_permissions_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. role_permissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` INT UNSIGNED NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hashed via PHP password_hash(PASSWORD_ARGON2ID or PASSWORD_BCRYPT)',
  `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `failed_login_attempts` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `locked_until` TIMESTAMP NULL DEFAULT NULL,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `last_login_ip` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_status` (`status`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. password_reset_tokens
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token_hash` CHAR(64) NOT NULL COMMENT 'SHA-256 hash of single-use reset token',
  `expires_at` TIMESTAMP NOT NULL,
  `used_at` TIMESTAMP NULL DEFAULT NULL,
  `request_ip` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_prt_token_hash` (`token_hash`),
  KEY `idx_prt_user_expires` (`user_id`, `expires_at`),
  CONSTRAINT `fk_prt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. media
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `original_name` VARCHAR(255) NOT NULL,
  `stored_filename` VARCHAR(255) NOT NULL COMMENT 'Randomized safe filename',
  `file_path` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_extension` VARCHAR(20) NOT NULL,
  `file_size_bytes` INT UNSIGNED NOT NULL,
  `width` SMALLINT UNSIGNED DEFAULT NULL,
  `height` SMALLINT UNSIGNED DEFAULT NULL,
  `alt_text` VARCHAR(255) NOT NULL DEFAULT '',
  `title_text` VARCHAR(255) DEFAULT '',
  `uploaded_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_media_stored_filename` (`stored_filename`),
  KEY `idx_media_mime` (`mime_type`),
  KEY `idx_media_uploaded_by` (`uploaded_by`),
  CONSTRAINT `fk_media_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. pages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `template` VARCHAR(80) NOT NULL DEFAULT 'default',
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `featured_media_id` INT UNSIGNED DEFAULT NULL,
  `author_id` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('draft', 'published', 'unpublished', 'trashed') NOT NULL DEFAULT 'draft',
  `is_system_page` TINYINT(1) NOT NULL DEFAULT 0,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `trashed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pages_slug` (`slug`),
  KEY `idx_pages_status_pub` (`status`, `published_at`),
  KEY `idx_pages_template` (`template`),
  CONSTRAINT `fk_pages_media` FOREIGN KEY (`featured_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pages_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. page_revisions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `page_revisions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` INT UNSIGNED NOT NULL,
  `version_number` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `sections_snapshot_json` LONGTEXT DEFAULT NULL COMMENT 'Validated JSON snapshot of page_sections',
  `seo_snapshot_json` TEXT DEFAULT NULL,
  `edited_by` INT UNSIGNED DEFAULT NULL,
  `change_summary` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_revisions_page_ver` (`page_id`, `version_number`),
  CONSTRAINT `fk_revisions_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_revisions_editor` FOREIGN KEY (`edited_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. page_sections (Dynamic Page Builder Blocks)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` INT UNSIGNED NOT NULL,
  `section_type` ENUM(
    'hero_banner',
    'heading_richtext',
    'text_with_image',
    'image_gallery',
    'service_cards',
    'features_grid',
    'verified_statistics',
    'portfolio_grid',
    'testimonials',
    'faq_accordion',
    'cta_banner',
    'contact_form',
    'pricing_table',
    'related_services',
    'blog_listing',
    'process_workflow'
  ) NOT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `subtitle` VARCHAR(350) DEFAULT NULL,
  `content_json` JSON NOT NULL COMMENT 'Validated structured JSON block payload — never raw PHP/scripts',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sections_page_order` (`page_id`, `is_enabled`, `sort_order`),
  CONSTRAINT `fk_sections_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. page_seo
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `page_seo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` INT UNSIGNED NOT NULL,
  `seo_title` VARCHAR(160) NOT NULL,
  `meta_description` VARCHAR(320) NOT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `robots_index` TINYINT(1) NOT NULL DEFAULT 1,
  `robots_follow` TINYINT(1) NOT NULL DEFAULT 1,
  `og_title` VARCHAR(160) DEFAULT NULL,
  `og_description` VARCHAR(320) DEFAULT NULL,
  `og_image_url` VARCHAR(500) DEFAULT NULL,
  `og_type` VARCHAR(50) NOT NULL DEFAULT 'website',
  `twitter_card` VARCHAR(50) NOT NULL DEFAULT 'summary_large_image',
  `schema_type` VARCHAR(80) NOT NULL DEFAULT 'WebPage',
  `breadcrumb_title` VARCHAR(120) DEFAULT NULL,
  `include_in_sitemap` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_page_seo_page` (`page_id`),
  CONSTRAINT `fk_seo_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. services
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id` INT UNSIGNED DEFAULT NULL COMMENT 'Linked dedicated service page',
  `title` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `category` ENUM('web_development', 'digital_marketing', 'branding') NOT NULL DEFAULT 'web_development',
  `short_description` VARCHAR(350) NOT NULL,
  `full_description` TEXT NOT NULL,
  `icon_name` VARCHAR(60) NOT NULL DEFAULT 'Globe',
  `featured_media_id` INT UNSIGNED DEFAULT NULL,
  `deliverables_json` JSON DEFAULT NULL,
  `cta_text` VARCHAR(80) NOT NULL DEFAULT 'Request Service Quote',
  `cta_url` VARCHAR(255) NOT NULL DEFAULT '/contact-us',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_services_slug` (`slug`),
  KEY `idx_services_order` (`status`, `sort_order`),
  CONSTRAINT `fk_services_page` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_services_media` FOREIGN KEY (`featured_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. portfolio_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(180) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `client_industry` VARCHAR(120) NOT NULL,
  `service_category` VARCHAR(100) NOT NULL,
  `summary` VARCHAR(400) NOT NULL,
  `challenge_solved` TEXT DEFAULT NULL,
  `solution_delivered` TEXT DEFAULT NULL,
  `tech_stack_json` JSON DEFAULT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `image_alt` VARCHAR(255) NOT NULL,
  `external_project_url` VARCHAR(500) DEFAULT NULL,
  `is_verified_authorization` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `status` ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_portfolio_slug` (`slug`),
  KEY `idx_portfolio_status_order` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. blog_categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` VARCHAR(300) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_cat_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. blog_tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_tags` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_tag_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. blog_posts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(220) NOT NULL,
  `slug` VARCHAR(220) NOT NULL,
  `excerpt` VARCHAR(450) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image_url` VARCHAR(500) DEFAULT NULL,
  `featured_image_alt` VARCHAR(255) DEFAULT NULL,
  `author_id` INT UNSIGNED DEFAULT NULL,
  `status` ENUM('draft', 'scheduled', 'published', 'unpublished') NOT NULL DEFAULT 'draft',
  `seo_title` VARCHAR(160) DEFAULT NULL,
  `meta_description` VARCHAR(320) DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `robots_index` TINYINT(1) NOT NULL DEFAULT 1,
  `robots_follow` TINYINT(1) NOT NULL DEFAULT 1,
  `reading_time_minutes` SMALLINT UNSIGNED NOT NULL DEFAULT 4,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_blog_posts_slug` (`slug`),
  KEY `idx_blog_status_pub` (`status`, `published_at`),
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. blog_post_categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_post_categories` (
  `post_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `category_id`),
  CONSTRAINT `fk_bpc_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bpc_cat` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 17. blog_post_tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_post_tags` (
  `post_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  CONSTRAINT `fk_bpt_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bpt_tag` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 18. menus
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `menus` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(60) NOT NULL COMMENT 'header_primary, footer_services, footer_company',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_menus_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 19. menu_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `menu_id` INT UNSIGNED NOT NULL,
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(350) NOT NULL,
  `target` ENUM('_self', '_blank') NOT NULL DEFAULT '_self',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_menu_items_menu_order` (`menu_id`, `parent_id`, `sort_order`),
  CONSTRAINT `fk_mi_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mi_parent` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 20. site_settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  `setting_group` VARCHAR(60) NOT NULL DEFAULT 'general',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_site_settings_key` (`setting_key`),
  KEY `idx_site_settings_group` (`setting_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 21. redirects (301 & 302 Redirect Manager)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `redirects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_path` VARCHAR(350) NOT NULL COMMENT 'Relative path starting with /',
  `target_url` VARCHAR(500) NOT NULL,
  `status_code` SMALLINT UNSIGNED NOT NULL DEFAULT 301 COMMENT '301 Moved Permanently or 302 Found',
  `hits_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_redirects_source` (`source_path`),
  KEY `idx_redirects_active` (`is_active`, `source_path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 22. faqs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(80) NOT NULL DEFAULT 'General',
  `question` VARCHAR(350) NOT NULL,
  `answer` TEXT NOT NULL,
  `page_slug` VARCHAR(150) DEFAULT 'global',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faqs_page_order` (`is_published`, `page_slug`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 23. contact_enquiries (Lead Management)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_enquiries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `company_name` VARCHAR(150) DEFAULT NULL,
  `service_interested` VARCHAR(150) NOT NULL,
  `budget_range` VARCHAR(80) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `source_page` VARCHAR(255) DEFAULT '/',
  `status` ENUM('new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'spam') NOT NULL DEFAULT 'new',
  `admin_notes` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enquiries_status_date` (`status`, `created_at`),
  KEY `idx_enquiries_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 24. audit_logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(120) NOT NULL,
  `entity_type` VARCHAR(80) NOT NULL,
  `entity_id` VARCHAR(80) DEFAULT NULL,
  `details_json` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_created` (`created_at`),
  KEY `idx_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
