<?php
declare(strict_types=1);

use App\Helpers\Security;

/**
 * Shared Public Layout Template (resources/views/layouts/public.php)
 * Renders SEO metadata, OpenGraph, JSON-LD, Top Navigation, Dynamic Sections, and Footer.
 *
 * @var array $page
 * @var array $sections
 * @var array $settings
 */

$seoTitle = $page['seo_title'] ?: ($page['title'] . ' | ShivWebsIndia');
$metaDesc = $page['meta_description'] ?: ($settings['default_meta_description'] ?? '');
$canonical = $page['canonical_url'] ?: ('https://www.shivwebsindia.com/' . ($page['slug'] === 'home' ? '' : $page['slug']));
$robots = (($page['robots_index'] ?? 1) ? 'index' : 'noindex') . ', ' . (($page['robots_follow'] ?? 1) ? 'follow' : 'nofollow');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= Security::e($seoTitle) ?></title>
    <meta name="description" content="<?= Security::e($metaDesc) ?>">
    <meta name="robots" content="<?= Security::e($robots) ?>">
    <link rel="canonical" href="<?= Security::e($canonical) ?>">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= Security::e($settings['brand_name'] ?? 'ShivWebsIndia') ?>">
    <meta property="og:title" content="<?= Security::e($page['og_title'] ?: $seoTitle) ?>">
    <meta property="og:description" content="<?= Security::e($page['og_description'] ?: $metaDesc) ?>">
    <meta property="og:url" content="<?= Security::e($canonical) ?>">
    <?php if (!empty($page['og_image_url'])): ?>
    <meta property="og:image" content="<?= Security::e($page['og_image_url']) ?>">
    <?php endif; ?>

    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="bg-[#F5F7FA] text-[#0A2540]">
    <header class="site-header bg-[#0A2540] text-white">
        <div class="container mx-auto flex items-center justify-between gap-8 px-6 py-4">
            <a href="/" class="text-xl font-bold tracking-tight whitespace-nowrap shrink-0">
                <?= Security::e($settings['brand_name'] ?? 'ShivWebsIndia') ?>
            </a>
            <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
                <a href="/" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">Home</a>
                <a href="/about-us" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">About Us</a>
                <a href="/website-design-and-development" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">Web Development</a>
                <a href="/digital-marketing" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">Digital Marketing</a>
                <a href="/portfolio" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">Portfolio</a>
                <a href="/blog" class="hover:text-[#FF6A00] whitespace-nowrap shrink-0">Blog</a>
            </nav>
            <div class="shrink-0">
                <a href="/contact-us" class="px-5 py-2.5 bg-[#FF6A00] text-white font-semibold rounded-lg whitespace-nowrap shrink-0">
                    <?= Security::e($settings['global_cta_text'] ?? 'Request a Quote') ?>
                </a>
            </div>
        </div>
    </header>

    <main>
        <?php foreach ($sections as $section): ?>
            <?php
            $payload = json_decode($section['content_json'] ?? '{}', true) ?: [];
            $sectionType = $section['section_type'];
            require __DIR__ . '/../sections/block_renderer.php';
            ?>
        <?php endforeach; ?>
    </main>

    <footer class="bg-[#0A2540] text-white py-12 mt-16 border-t border-white/10">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
            <div>
                <p class="font-bold text-lg"><?= Security::e($settings['brand_name'] ?? 'ShivWebsIndia') ?></p>
                <p class="text-sm text-slate-300 mt-2">
                    Location Focus: <?= Security::e($settings['location_focus'] ?? 'Ghaziabad and Delhi NCR') ?>
                </p>
                <p class="text-sm text-slate-300">
                    Email: <?= Security::e($settings['contact_email'] ?? 'info@shivwebsindia.com') ?> |
                    Phone: <?= Security::e($settings['contact_phone'] ?? '+91-8667666429') ?>
                </p>
            </div>
            <div class="text-sm text-slate-400 self-end">
                <?= Security::e($settings['footer_credit'] ?? 'Designed & Developed by ShivWebsIndia') ?>
            </div>
        </div>
    </footer>

    <!-- Self-Contained Offline Footer Chatbot Widget (100% Client-Side JS, Zero External API) -->
    <div id="shivwebs-chatbot" class="fixed bottom-5 right-5 z-50">
        <div id="shivwebs-chat-window" class="hidden mb-3 w-80 bg-white text-[#0A2540] border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div class="bg-[#0A2540] text-white px-4 py-3 flex items-center justify-between">
                <span class="font-bold text-xs"><?= Security::e($settings['brand_name'] ?? 'ShivWebsIndia') ?> Support Desk</span>
                <button type="button" onclick="document.getElementById('shivwebs-chat-window').classList.add('hidden')" class="text-xs text-slate-300 hover:text-white">&times;</button>
            </div>
            <div id="shivwebs-chat-messages" class="p-3 space-y-2 text-xs max-h-64 overflow-y-auto bg-[#F5F7FA]">
                <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
                    Namaste! How can we help you with Website Design, SEO, or Google Ads today?
                </div>
            </div>
            <form onsubmit="event.preventDefault(); window.shivwebsOfflineChatSubmit();" class="p-2 bg-white border-t border-slate-200 flex gap-1.5">
                <input id="shivwebs-chat-input" type="text" placeholder="Ask about web design, SEO, pricing..." class="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs">
                <button type="submit" class="px-3 py-1.5 bg-[#FF6A00] text-white font-semibold rounded text-xs">Send</button>
            </form>
        </div>
        <button type="button" onclick="document.getElementById('shivwebs-chat-window').classList.toggle('hidden')" class="px-4 py-3 bg-[#FF6A00] text-white font-bold text-xs rounded-xl shadow-lg">
            Chat With Us
        </button>
    </div>
    <script>
    window.shivwebsOfflineChatSubmit = function() {
        var input = document.getElementById('shivwebs-chat-input');
        var box = document.getElementById('shivwebs-chat-messages');
        var q = (input.value || '').trim();
        if (!q) return;
        box.innerHTML += '<div class="bg-[#0A2540] text-white p-2 rounded-lg ml-6">' + q.replace(/</g, '&lt;') + '</div>';
        var lower = q.toLowerCase();
        var reply = 'Call us at +91-8667666429 or visit /contact-us for a custom quote!';
        if (lower.indexOf('seo') !== -1) reply = 'We offer Technical SEO & Local Google Business Profile optimization in Ghaziabad & Delhi NCR.';
        else if (lower.indexOf('web') !== -1 || lower.indexOf('design') !== -1) reply = 'We build responsive PHP 8.x, MySQL, WordPress & E-commerce websites.';
        else if (lower.indexOf('price') !== -1 || lower.indexOf('cost') !== -1) reply = 'Packages start from ₹15,000–₹30,000 depending on scope. Request a quote at /contact-us.';
        box.innerHTML += '<div class="bg-white border border-slate-200 p-2.5 rounded-lg mr-6">' + reply + '</div>';
        input.value = '';
        box.scrollTop = box.scrollHeight;
    };
    </script>
</body>
</html>
