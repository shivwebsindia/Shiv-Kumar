<?php
declare(strict_types=1);

use App\Helpers\Security;

/**
 * Dynamic Section Block Renderer (resources/views/sections/block_renderer.php)
 * Strictly renders validated JSON keys into predefined agency HTML templates.
 * Never executes raw PHP or untrusted scripts from database storage.
 *
 * @var array $section
 * @var array $payload
 * @var string $sectionType
 */
?>
<section class="py-16 px-6 border-b border-slate-200/70" data-section-type="<?= Security::e($sectionType) ?>">
    <div class="max-w-7xl mx-auto">
        <?php if (!empty($section['title'])): ?>
            <h2 class="text-3xl font-bold text-[#0A2540] tracking-tight"><?= Security::e($section['title']) ?></h2>
        <?php endif; ?>
        <?php if (!empty($section['subtitle'])): ?>
            <p class="text-slate-600 mt-2 max-w-3xl"><?= Security::e($section['subtitle']) ?></p>
        <?php endif; ?>

        <?php if ($sectionType === 'hero_banner'): ?>
            <div class="mt-6">
                <h1 class="text-4xl md:text-5xl font-extrabold text-[#0A2540]"><?= Security::e($payload['headline'] ?? '') ?></h1>
                <p class="mt-4 text-lg text-slate-700 max-w-2xl"><?= Security::e($payload['subheadline'] ?? '') ?></p>
                <div class="mt-6 flex flex-wrap gap-4">
                    <a href="<?= Security::e($payload['primary_cta_url'] ?? '/contact-us') ?>" class="px-6 py-3 bg-[#FF6A00] text-white font-semibold rounded-lg">
                        <?= Security::e($payload['primary_cta_text'] ?? 'Request a Quote') ?>
                    </a>
                    <a href="<?= Security::e($payload['secondary_cta_url'] ?? 'https://wa.me/918667666429') ?>" class="px-6 py-3 border border-[#0A2540] text-[#0A2540] font-semibold rounded-lg">
                        <?= Security::e($payload['secondary_cta_text'] ?? 'WhatsApp Us') ?>
                    </a>
                </div>
            </div>
        <?php elseif ($sectionType === 'heading_richtext'): ?>
            <div class="prose max-w-4xl mt-6 text-slate-700">
                <?= Security::sanitizeRichText((string)($payload['body_html'] ?? '')) ?>
            </div>
        <?php endif; ?>
    </div>
</section>
