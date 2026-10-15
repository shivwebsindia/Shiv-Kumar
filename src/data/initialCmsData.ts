import heroStudioImg from '../assets/images/hero_digital_agency_studio_1791626434356.jpg';
import portfolioEcommerceImg from '../assets/images/portfolio_ecommerce_platform_1791626446616.jpg';
import portfolioCorporateImg from '../assets/images/portfolio_corporate_portal_1791626463970.jpg';
import portfolioSeoImg from '../assets/images/portfolio_seo_analytics_growth_1791626476718.jpg';

export type SectionType =
  | 'hero_banner'
  | 'heading_richtext'
  | 'text_with_image'
  | 'image_gallery'
  | 'service_cards'
  | 'features_grid'
  | 'verified_statistics'
  | 'portfolio_grid'
  | 'testimonials'
  | 'faq_accordion'
  | 'cta_banner'
  | 'contact_form'
  | 'pricing_table'
  | 'related_services'
  | 'blog_listing'
  | 'process_workflow';

export interface PageSection {
  id: number;
  page_id: number;
  section_type: SectionType;
  title: string;
  subtitle: string;
  content_json: Record<string, any>;
  sort_order: number;
  is_enabled: boolean;
}

export interface PageSEO {
  seo_title: string;
  meta_description: string;
  focus_keywords?: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string;
  og_description: string;
  og_image_url: string;
  schema_type: string;
  custom_schema_json?: string;
  breadcrumb_title: string;
  include_in_sitemap: boolean;
}

export interface PageRevision {
  id: number;
  page_id: number;
  version_number: number;
  title: string;
  slug: string;
  edited_by: string;
  change_summary: string;
  created_at: string;
  sections_snapshot: PageSection[];
  seo_snapshot: PageSEO;
}

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  template: 'home' | 'service' | 'standard' | 'portfolio' | 'blog' | 'contact' | 'legal' | 'faq';
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  status: 'published' | 'draft' | 'unpublished' | 'trashed';
  is_system_page: boolean;
  updated_at: string;
  seo: PageSEO;
  sections: PageSection[];
}

export interface ServiceItem {
  id: number;
  page_slug: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  featured_image_url?: string;
  icon_name: string;
  deliverables: string[];
  cta_text: string;
  cta_url: string;
  sort_order: number;
  is_featured: boolean;
  status: 'published' | 'draft' | 'unpublished';
  seo_title?: string;
  meta_description?: string;
  focus_keywords?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  client_industry: string;
  service_category: string;
  summary: string;
  challenge_solved: string;
  solution_delivered: string;
  tech_stack: string[];
  image_url: string;
  image_alt: string;
  external_project_url: string;
  is_verified_authorization: boolean;
  sort_order: number;
  status: 'published' | 'draft';
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  featured_image_alt: string;
  author_name: string;
  status: 'published' | 'draft' | 'scheduled' | 'unpublished';
  seo_title: string;
  meta_description: string;
  focus_keywords?: string;
  canonical_url: string;
  robots_index: boolean;
  reading_time_minutes: number;
  published_at: string;
  faqs?: BlogFAQ[];
}

export interface MediaAsset {
  id: number;
  original_name: string;
  stored_filename: string;
  file_path: string;
  mime_type: string;
  file_extension: string;
  file_size_bytes: number;
  width: number;
  height: number;
  alt_text: string;
  used_in_pages: string[];
  created_at: string;
}

export interface ContactEnquiry {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  service_interested: string;
  budget_range: string;
  message: string;
  source_page: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'closed_won' | 'spam';
  admin_notes: string;
  assigned_to_id?: number;
  assigned_to_name?: string;
  ip_address: string;
  created_at: string;
}

export interface RedirectRule {
  id: number;
  source_path: string;
  target_url: string;
  status_code: 301 | 302;
  hits_count: number;
  is_active: boolean;
  created_at: string;
}

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  page_slug: string;
  sort_order: number;
  is_published: boolean;
}

export interface MenuItem {
  id: number;
  menu_location: 'header_primary' | 'footer_services' | 'footer_company';
  parent_id: number | null;
  label: string;
  url: string;
  sort_order: number;
  is_enabled: boolean;
}

export interface SiteSettings {
  brand_name: string;
  website_url: string;
  contact_email: string;
  contact_phone: string;
  secondary_phone: string;
  whatsapp_number: string;
  location_focus: string;
  office_address: string;
  footer_credit: string;
  global_cta_text: string;
  global_cta_url: string;
  color_dark_blue: string;
  color_orange: string;
  color_dark_red: string;
  color_light_bg: string;
  smtp_notifications_enabled: boolean;
  notification_recipient_email: string;
  show_verified_testimonials_only: boolean;
}

export interface AuditLogEntry {
  id: number;
  user_email: string;
  role: 'admin' | 'editor';
  action: string;
  entity_type: string;
  entity_id: string;
  timestamp: string;
}

export interface TeamMember {
  id: number;
  full_name: string;
  designation: string;
  department: 'Management' | 'Web Development' | 'SEO & Digital Marketing' | 'UI/UX Design' | 'Sales & Support';
  email: string;
  phone: string;
  password_pin: string;
  role: 'admin' | 'team_lead' | 'developer' | 'seo_specialist' | 'sales_exec';
  avatar_url: string;
  status: 'active' | 'on_leave' | 'inactive';
  attendance_status?: 'checked_in' | 'checked_out';
  last_check_in?: string;
  skills: string[];
  joined_at: string;
}

export interface TeamTask {
  id: number;
  title: string;
  client_name: string;
  project_type: string;
  assigned_to_id: number;
  assigned_to_name: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  due_date: string;
  notes: string;
  created_at: string;
}

export interface TeamAttendanceRecord {
  id: number;
  member_id: number;
  member_name: string;
  designation: string;
  department: string;
  date: string;
  status: 'present' | 'half_day' | 'work_from_home' | 'on_leave' | 'absent';
  check_in_time: string;
  check_out_time?: string;
  work_mode: 'Office (Vaishali)' | 'Work From Home' | 'Client Site Visit';
  notes: string;
}

export interface TeamLeaveRequest {
  id: number;
  member_id: number;
  member_name: string;
  designation: string;
  department: string;
  leave_type: 'Casual Leave (CL)' | 'Sick / Medical Leave' | 'Earned / Paid Leave' | 'Half-Day Leave' | 'Emergency Leave';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  handover_to_name?: string;
  emergency_contact?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_remark?: string;
  applied_at: string;
}

export interface QuoteCatalogItem {
  id: string;
  name: string;
  category: 'Web Development' | 'Digital Marketing' | 'Add-Ons';
  basePrice: number;
  timelineWeeks: number;
  deliverables: string[];
  is_active: boolean;
}

export interface BrochureConfig {
  headline: string;
  subheadline: string;
  pdf_url: string;
  experience_years: string;
  projects_delivered: string;
  industries_served: string;
  client_retention: string;
  payment_terms: string;
  roadmap_summary: string;
  authorized_signatory: string;
}

export interface SavedProposalQuote {
  id: number;
  reference_no: string;
  doc_type: 'Quotation' | 'Proposal';
  client_name: string;
  company_name: string;
  client_email: string;
  client_phone: string;
  client_city: string;
  project_goal: string;
  selected_service_ids: string[];
  discount_amount: number;
  include_gst: boolean;
  subtotal: number;
  gst_amount: number;
  grand_total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_at: string;
}

export interface CMSDatabaseState {
  settings: SiteSettings;
  pages: CMSPage[];
  revisions: PageRevision[];
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  blog_posts: BlogPost[];
  blog_categories?: BlogCategory[];
  blog_tags?: BlogTag[];
  media: MediaAsset[];
  enquiries: ContactEnquiry[];
  redirects: RedirectRule[];
  faqs: FAQItem[];
  menu_items: MenuItem[];
  team_members?: TeamMember[];
  team_tasks?: TeamTask[];
  team_attendance_logs?: TeamAttendanceRecord[];
  team_leave_requests?: TeamLeaveRequest[];
  quote_catalog?: QuoteCatalogItem[];
  brochure_config?: BrochureConfig;
  saved_quotes?: SavedProposalQuote[];
  audit_logs: AuditLogEntry[];
}

export const ASSETS = {
  heroStudioImg,
  portfolioEcommerceImg,
  portfolioCorporateImg,
  portfolioSeoImg,
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 1,
    page_slug: 'website-design-and-development',
    title: 'Website Design and Development',
    slug: 'website-design-and-development',
    category: 'Website Design & Development',
    short_description: 'Custom, mobile-responsive HTML5, CSS3, and PHP 8.x business websites engineered for speed, accessibility, and lead conversion.',
    full_description: 'We architect bespoke corporate websites, dynamic business portals, and responsive landing pages tailored for startups and established enterprises across Ghaziabad and Delhi NCR. Every project is built with semantic HTML5, clean URL hierarchy, fast server response times, and structured lead-generation workflows.',
    icon_name: 'Code2',
    deliverables: [
      'Custom responsive UI/UX wireframing & brand alignment',
      'Clean PHP 8.x & MySQL InnoDB backend architecture',
      'Core Web Vitals optimization & technical SEO foundation',
      'Secure contact forms with CSRF & spam protection',
    ],
    cta_text: 'Explore Web Development',
    cta_url: '/website-design-and-development',
    sort_order: 1,
    is_featured: true,
    status: 'published',
  },
  {
    id: 2,
    page_slug: 'wordpress-development',
    title: 'WordPress Development',
    slug: 'wordpress-development',
    category: 'Website Design & Development',
    short_description: 'Lightweight custom WordPress themes, plugin customization, security hardening, and high-speed cPanel migration.',
    full_description: 'Our WordPress engineering team builds clean, bloat-free custom themes and Gutenberg block systems so your marketing team can publish content effortlessly without sacrificing page speed or security.',
    icon_name: 'LayoutTemplate',
    deliverables: [
      'Custom WordPress theme architecture (zero bloated page-builder lock-in)',
      'Custom post types, ACF/meta fields & editorial workflows',
      'WordPress security hardening, firewall & automated backups',
      'Speed optimization & database query indexing',
    ],
    cta_text: 'Explore WordPress Services',
    cta_url: '/wordpress-development',
    sort_order: 2,
    is_featured: true,
    status: 'published',
  },
  {
    id: 3,
    page_slug: 'ecommerce-website-development',
    title: 'E-commerce Website Development',
    slug: 'ecommerce-website-development',
    category: 'Website Design & Development',
    short_description: 'Scalable online stores with UPI/Razorpay payment gateways, inventory management, GST invoicing, and streamlined checkout.',
    full_description: 'Launch and scale direct-to-consumer (D2C) and B2B e-commerce storefronts with intuitive product filtering, mobile-first cart drawers, Indian payment gateway integrations (Razorpay, Cashfree, PayU), and automated shipping logistics.',
    icon_name: 'ShoppingBag',
    deliverables: [
      'Custom product catalog, variant filters & search indexing',
      'Razorpay / UPI / NetBanking / Card checkout integration',
      'Inventory, order lifecycle & GST invoice automation',
      'Product Schema.org JSON-LD markup for Google Shopping visibility',
    ],
    cta_text: 'Build Your Online Store',
    cta_url: '/ecommerce-website-development',
    sort_order: 3,
    is_featured: true,
    status: 'published',
  },
  {
    id: 4,
    page_slug: 'digital-marketing',
    title: 'Digital Marketing Strategy',
    slug: 'digital-marketing',
    category: 'Digital Marketing & SEO',
    short_description: 'Integrated multi-channel inbound marketing combining organic search, paid acquisition, and conversion rate optimization.',
    full_description: 'Our digital marketing programs align search visibility, paid media, and landing page conversion architecture around transparent lead tracking and business enquiry growth.',
    icon_name: 'TrendingUp',
    deliverables: [
      'Full-funnel competitor & market opportunity audit',
      'Multi-channel campaign roadmap (SEO + Google Ads + Social)',
      'GA4 & Google Tag Manager conversion event instrumentation',
      'Monthly transparent lead & call attribution reporting',
    ],
    cta_text: 'View Digital Marketing',
    cta_url: '/digital-marketing',
    sort_order: 4,
    is_featured: true,
    status: 'published',
  },
  {
    id: 5,
    page_slug: 'search-engine-optimization-seo',
    title: 'Search Engine Optimization (SEO)',
    slug: 'search-engine-optimization-seo',
    category: 'Digital Marketing & SEO',
    short_description: 'Technical SEO audits, on-page content architecture, Schema.org structured data, and sustainable organic search visibility.',
    full_description: 'We execute standards-compliant technical and on-page SEO focused on crawlability, indexation hygiene, search intent alignment, and authoritative content structure—without black-hat shortcuts or unrealistic ranking guarantees.',
    icon_name: 'Search',
    deliverables: [
      'Comprehensive technical crawl, indexability & canonical audit',
      'Search-intent keyword mapping & editorial content briefs',
      'Schema.org JSON-LD structured data & XML sitemap governance',
      'Google Search Console performance & query monitoring',
    ],
    cta_text: 'Explore SEO Services',
    cta_url: '/search-engine-optimization-seo',
    sort_order: 5,
    is_featured: true,
    status: 'published',
  },
  {
    id: 6,
    page_slug: 'local-seo',
    title: 'Local SEO & Google Business Profile',
    slug: 'local-seo',
    category: 'Digital Marketing & SEO',
    short_description: 'Capture high-intent local searches in Ghaziabad, Noida, and Delhi NCR with Google Business Profile optimization and local citations.',
    full_description: 'Designed specifically for clinics, service providers, retail showrooms, and regional B2B companies in Vaishali, Indirapuram, Ghaziabad, and across Delhi NCR looking to increase map pack visibility, direction requests, and phone enquiries.',
    icon_name: 'MapPin',
    deliverables: [
      'Google Business Profile (GBP) category, service & media optimization',
      'NAP (Name, Address, Phone) citation consistency across Indian directories',
      'Location-specific landing pages with LocalBusiness Schema markup',
      'Authentic customer review acquisition workflow & response management',
    ],
    cta_text: 'Grow Local Visibility',
    cta_url: '/local-seo',
    sort_order: 6,
    is_featured: true,
    status: 'published',
  },
  {
    id: 7,
    page_slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    slug: 'social-media-marketing',
    category: 'Digital Marketing & SEO',
    short_description: 'Brand storytelling, creative design systems, and targeted meta/LinkedIn campaigns that build audience trust and inbound enquiries.',
    full_description: 'We manage cohesive organic social calendars and targeted paid social campaigns across Instagram, Facebook, and LinkedIn with custom brand graphics and clear audience targeting.',
    icon_name: 'Share2',
    deliverables: [
      'Monthly content calendar & custom brand graphic templates',
      'Meta (Instagram & Facebook) and LinkedIn B2B audience targeting',
      'Lead-generation form campaigns & WhatsApp click-to-chat funnels',
      'Engagement & audience demographic performance insights',
    ],
    cta_text: 'Explore Social Media',
    cta_url: '/social-media-marketing',
    sort_order: 7,
    is_featured: true,
    status: 'published',
  },
  {
    id: 8,
    page_slug: 'google-ads-ppc',
    title: 'Google Ads / PPC Management',
    slug: 'google-ads-ppc',
    category: 'Digital Marketing & SEO',
    short_description: 'High-intent Search, Display, and Remarketing campaigns engineered for negative-keyword discipline and measurable cost-per-lead.',
    full_description: 'Stop wasting ad spend on broad, irrelevant clicks. We structure tightly themed Google Search and Performance Max campaigns paired with dedicated conversion landing pages.',
    icon_name: 'MousePointerClick',
    deliverables: [
      'High-intent keyword structuring & continuous negative keyword pruning',
      'Ad copy testing with callout, sitelink & lead form extensions',
      'Dedicated conversion landing page alignment & call tracking',
      'Transparent ROAS & Cost-Per-Acquisition (CPA) budget reporting',
    ],
    cta_text: 'Launch PPC Campaigns',
    cta_url: '/google-ads-ppc',
    sort_order: 8,
    is_featured: true,
    status: 'published',
  },
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    title: 'Education Website (Sperowz)',
    slug: 'education-website-sperowz',
    client_industry: 'Preschool & Education',
    service_category: 'Website Design and Development',
    summary: 'Interactive preschool and early-education website featuring admission inquiry workflows, curriculum showcase, and mobile-first parent portal.',
    challenge_solved: 'Created an engaging, parent-friendly digital admission funnel with fast mobile loading and local search visibility.',
    solution_delivered: 'Custom responsive design, admission enquiry capture, photo gallery, and SEO-friendly structure.',
    tech_stack: ['WordPress / PHP', 'HTML5 & CSS3', 'Responsive UI', 'Local SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/sperowz.png',
    image_alt: 'Sperowz Preschool & Education Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 1,
    status: 'published',
  },
  {
    id: 2,
    title: 'Magazine Website (Technology Era)',
    slug: 'magazine-website-technology-era',
    client_industry: 'Digital Media & Magazine',
    service_category: 'WordPress Development',
    summary: 'High-speed digital magazine and technology news publishing portal with category layouts, editorial workflows, and ad-slot optimization.',
    challenge_solved: 'Structured multi-category news publishing with fast page loads and clean mobile reading experience.',
    solution_delivered: 'Custom magazine layout, category archives, Schema.org NewsArticle markup, and caching optimization.',
    tech_stack: ['WordPress CMS', 'PHP 8.x', 'MySQL', 'Technical SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/technologyera.png',
    image_alt: 'Technology Era Magazine Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 2,
    status: 'published',
  },
  {
    id: 3,
    title: 'Logistic Website (Sarathi Packers & Movers)',
    slug: 'logistic-website-sarathi-packers',
    client_industry: 'Logistics, Packers & Movers',
    service_category: 'Website Design and Development',
    summary: 'Lead-focused relocation and logistics portal with instant moving cost quote requests, city-wise service pages, and WhatsApp integration.',
    challenge_solved: 'Built high-converting city and route landing pages to capture relocation enquiries across India.',
    solution_delivered: 'Responsive web design, instant quote form, click-to-call bar, and Local SEO architecture.',
    tech_stack: ['PHP & MySQL', 'Bootstrap / CSS3', 'Lead Capture', 'Local SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/sarathipackersandmovers.png',
    image_alt: 'Sarathi Packers and Movers Logistic Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 3,
    status: 'published',
  },
  {
    id: 4,
    title: 'Signboard Website (The Saini Glow Sign)',
    slug: 'signboard-website-saini-glow-sign',
    client_industry: 'Signboard & Outdoor Branding',
    service_category: 'Website Design and Development',
    summary: 'B2B commercial signage and LED display showcase website featuring project galleries and corporate RFQ forms.',
    challenge_solved: 'Showcased visual signage portfolio with fast-loading WebP galleries and direct B2B inquiry capture.',
    solution_delivered: 'Custom portfolio showcase, service category pages, and Google Business Profile integration.',
    tech_stack: ['HTML5 / CSS3', 'WordPress', 'Image Optimization', 'SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/thesainiglowsign.png',
    image_alt: 'The Saini Glow Sign Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 4,
    status: 'published',
  },
  {
    id: 5,
    title: 'Travel Website (Traviso Travels)',
    slug: 'travel-website-traviso-travels',
    client_industry: 'Travel & Tour Packages',
    service_category: 'Website Design and Development',
    summary: 'Destination tour package and travel booking portal with itinerary breakdowns, custom trip inquiry forms, and WhatsApp chat.',
    challenge_solved: 'Presented multi-day tour itineraries clearly on mobile devices with one-click booking inquiries.',
    solution_delivered: 'Dynamic package showcase, itinerary tabs, and fast mobile lead generation.',
    tech_stack: ['PHP / WordPress', 'Responsive Design', 'WhatsApp Funnel', 'SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/travisotravels.png',
    image_alt: 'Traviso Travels Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 5,
    status: 'published',
  },
  {
    id: 6,
    title: 'E-commerce Website (KidbitKart)',
    slug: 'ecommerce-website-kidbitkart',
    client_industry: 'Retail & E-commerce',
    service_category: 'E-commerce Website Development',
    summary: 'Full-featured online shopping store with category filtering, shopping cart drawer, UPI/Razorpay payment gateway, and order tracking.',
    challenge_solved: 'Streamlined mobile product browsing and secure online checkout for Indian shoppers.',
    solution_delivered: 'WooCommerce / PHP storefront, payment gateway integration, and Product Schema markup.',
    tech_stack: ['WooCommerce', 'PHP 8.x', 'Razorpay / UPI', 'Product SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/kidbitkart.png',
    image_alt: 'KidbitKart E-Commerce Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 6,
    status: 'published',
  },
  {
    id: 7,
    title: 'Real Estate Website (Bhadani Realtor)',
    slug: 'real-estate-website-bhadani-realtor',
    client_industry: 'Real Estate & Property',
    service_category: 'Website Design and Development',
    summary: 'Property listing and real estate consultancy website with location filters, project brochures, and site-visit scheduling.',
    challenge_solved: 'Organized residential and commercial property listings for high-intent buyers in NCR.',
    solution_delivered: 'Property showcase grid, lead capture forms, and local real estate SEO.',
    tech_stack: ['PHP / WordPress', 'Custom Listings', 'Lead Routing', 'Local SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/bhadanirealtor.png',
    image_alt: 'Bhadani Realtor Real Estate Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 7,
    status: 'published',
  },
  {
    id: 8,
    title: 'Packers and Movers Website (Avatar Packers)',
    slug: 'packers-and-movers-avatar',
    client_industry: 'Packers & Movers',
    service_category: 'Website Design and Development',
    summary: 'Conversion-optimized relocation service website with instant quote calculator, branch directory, and Google Ads landing pages.',
    challenge_solved: 'Increased inbound phone calls and quote requests from local and domestic shifting customers.',
    solution_delivered: 'Fast mobile landing pages, sticky call/WhatsApp CTAs, and Search Ads alignment.',
    tech_stack: ['HTML5 / PHP', 'Responsive UI', 'Google Ads Ready', 'Local SEO'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/avatarpackersandmovers.png',
    image_alt: 'Avatar Packers and Movers Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 8,
    status: 'published',
  },
  {
    id: 9,
    title: 'Astrology Website (Umesh Astro)',
    slug: 'astrology-website-umesh-astro',
    client_industry: 'Astrology & Consultation',
    service_category: 'Website Design and Development',
    summary: 'Personal brand and astrology consultation portal featuring appointment booking, horoscope articles, and service packages.',
    challenge_solved: 'Enabled seamless online consultation booking and content publishing for an astrology specialist.',
    solution_delivered: 'Custom consultation booking workflow, multilingual blog support, and SEO optimization.',
    tech_stack: ['WordPress / PHP', 'Booking Workflow', 'Content SEO', 'Mobile UI'],
    image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/06/umeshastro.png',
    image_alt: 'Umesh Astro Consultation Website by ShivWebsIndia',
    external_project_url: 'https://www.shivwebsindia.com/',
    is_verified_authorization: true,
    sort_order: 9,
    status: 'published',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: '2026 में हर बिजनेस के लिए प्रोफेशनल वेबसाइट क्यों जरूरी है? (Why Every Business Needs a Website)',
    slug: 'why-every-business-needs-a-professional-website-2026',
    excerpt: 'जानिए 2026 में एक प्रोफेशनल, मोबाइल-फ्रेंडली और SEO-ऑप्टिमाइज्ड वेबसाइट आपके बिजनेस की विश्वसनीयता और सेल्स को कैसे बढ़ाती है।',
    content: `<h2>डिजिटल युग में आपके बिजनेस की पहली पहचान</h2>
<p>आज के समय में ग्राहक किसी भी सर्विस या प्रोडक्ट को खरीदने से पहले Google पर सर्च करते हैं। एक प्रोफेशनल वेबसाइट आपके बिजनेस के डिजिटल शोरूम की तरह काम करती है जो 24/7 खुला रहता है।</p>
<h3>1. ग्राहकों का भरोसा और ब्रांड क्रेडिबिलिटी</h3>
<p>जब आपके पास एक साफ-सुथरी, फास्ट और मोबाइल-रिस्पॉन्सिव वेबसाइट होती है, तो ग्राहक आपके ब्रांड पर तुरंत भरोसा करते हैं।</p>
<h3>2. Website Type Comparison Table (2026 Guide)</h3>
<table>
  <thead>
    <tr>
      <th>Website Type</th>
      <th>Best For</th>
      <th>Delivery Timeline</th>
      <th>Key Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dynamic Business CMS Website</td>
      <td>Service Providers, Clinics, Startups</td>
      <td>7 – 12 Days</td>
      <td>Admin Panel, SEO Ready &amp; Lead Capture</td>
    </tr>
    <tr>
      <td>Custom WordPress Website</td>
      <td>Corporate Brands, Consultants, Blogs</td>
      <td>7 – 10 Days</td>
      <td>Easy Content Publishing &amp; Fast Speed</td>
    </tr>
    <tr>
      <td>E-Commerce Online Store</td>
      <td>Retailers, D2C Brands, Wholesalers</td>
      <td>15 – 25 Days</td>
      <td>Razorpay/UPI Checkout &amp; GST Invoicing</td>
    </tr>
  </tbody>
</table>
<h3>3. Local SEO और Google Maps से लगातार लीड्स</h3>
<p>गाजियाबाद, नोएडा और दिल्ली NCR के लोकल ग्राहक जब आपकी सर्विस सर्च करते हैं, तो वेबसाइट और Google Business Profile मिलकर आपको सीधे कॉल और WhatsApp इंक्वायरी दिलाते हैं।</p>
<ul>
  <li>मोबाइल-रिस्पॉन्सिव और तेज लोडिंग स्पीड (Core Web Vitals 90+)</li>
  <li>Schema.org JSON-LD और ऑन-पेज SEO स्ट्रक्चर</li>
  <li>सीधे WhatsApp और Email पर लीड नोटिफिकेशन</li>
</ul>`,
    category: 'Website Design',
    tags: ['Website Design', 'Business Growth', 'Ghaziabad', 'Digital Presence'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Professional-Website-in-Ghaziabad-270x188.webp',
    featured_image_alt: '2026 में हर बिजनेस के लिए प्रोफेशनल वेबसाइट क्यों जरूरी है',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: '2026 में हर बिजनेस के लिए प्रोफेशनल वेबसाइट क्यों जरूरी है? | ShivWebsIndia',
    meta_description: 'जानिए 2026 में हर छोटे और बड़े बिजनेस के लिए प्रोफेशनल वेबसाइट और लोकल SEO क्यों जरूरी है।',
    focus_keywords: 'professional website in ghaziabad, website design company delhi ncr, business website 2026',
    canonical_url: 'https://www.shivwebsindia.com/blog/why-every-business-needs-a-professional-website-2026',
    robots_index: true,
    reading_time_minutes: 5,
    published_at: '2026-07-24T10:00:00Z',
    faqs: [
      {
        question: 'एक प्रोफेशनल बिजनेस वेबसाइट बनने में कितना समय लगता है?',
        answer: 'एक स्टैंडर्ड डायनामिक बिजनेस वेबसाइट 7 से 12 कार्यदिवसों में पूरी तरह डिजाइन, टेस्ट और लाइव हो जाती है।',
      },
      {
        question: 'क्या मैं खुद अपनी वेबसाइट के पेज और ब्लॉग अपडेट कर सकता हूँ?',
        answer: 'हाँ, ShivWebsIndia के डायनामिक एडमिन पैनल की मदद से आप बिना कोडिंग के नए पेज, सर्विसेज और ब्लॉग जोड़ या एडिट कर सकते हैं।',
      },
    ],
  },
  {
    id: 2,
    title: 'Business Sales कैसे बढ़ाएं? Website Design & Digital Marketing के 7 तरीके',
    slug: 'how-to-increase-business-sales-website-design-digital-marketing',
    excerpt: 'अपने बिजनेस की ऑनलाइन लीड्स और सेल्स बढ़ाने के लिए हाई-कन्वर्टिंग वेबसाइट डिजाइन, SEO और Google Ads की प्रैक्टिकल गाइड।',
    content: `<h2>वेबसाइट विजिटर्स को ग्राहकों में कैसे बदलें?</h2>
<p>सिर्फ वेबसाइट बनाना काफी नहीं है—आपकी वेबसाइट ऐसी होनी चाहिए जो विजिटर को तुरंत कॉल करने, फॉर्म भरने या WhatsApp पर जुड़ने के लिए प्रेरित करे।</p>
<h3>1. स्पष्ट Call-to-Action (CTA) और फास्ट लोडिंग</h3>
<p>मोबाइल यूजर्स के लिए स्पष्ट बटन, तेज लोडिंग स्पीड और आसान नेविगेशन कन्वर्जन रेट को दोगुना कर देते हैं।</p>
<h3>2. Digital Marketing Channels ROI Comparison</h3>
<table>
  <thead>
    <tr>
      <th>Marketing Channel</th>
      <th>Primary Goal</th>
      <th>Time to Results</th>
      <th>Ideal Audience</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Local SEO &amp; Google Business Profile</td>
      <td>Map Pack Calls &amp; Walk-ins</td>
      <td>4 – 8 Weeks</td>
      <td>Clinics, Local Services, Showrooms in NCR</td>
    </tr>
    <tr>
      <td>Organic Technical SEO</td>
      <td>Long-Term Sustainable Traffic</td>
      <td>3 – 6 Months</td>
      <td>B2B Companies, E-Commerce, National Brands</td>
    </tr>
    <tr>
      <td>Google Search Ads (PPC)</td>
      <td>Immediate High-Intent Leads</td>
      <td>24 – 48 Hours</td>
      <td>Urgent Services, Real Estate, Healthcare</td>
    </tr>
  </tbody>
</table>
<h3>3. टारगेटेड SEO और Google Ads</h3>
<p>सही कीवर्ड्स पर रैंक करके और हाई-इंटेंट सर्च ऐड्स चलाकर आप सीधे उन ग्राहकों तक पहुंच सकते हैं जो अभी आपकी सर्विस खरीदना चाहते हैं।</p>`,
    category: 'Digital Marketing',
    tags: ['Business Sales', 'Digital Marketing', 'Lead Generation', 'SEO'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/httpswww.shivwebsindia.comwebsite-designing-270x188.webp',
    featured_image_alt: 'Business Sales कैसे बढ़ाएं Website Design & Digital Marketing',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: 'Business Sales कैसे बढ़ाएं? Website Design & Digital Marketing | ShivWebsIndia',
    meta_description: 'Website Design, Local SEO और Digital Marketing की मदद से अपने बिजनेस की सेल्स और लीड्स कैसे बढ़ाएं।',
    focus_keywords: 'increase business sales online, digital marketing agency ghaziabad, lead generation website',
    canonical_url: 'https://www.shivwebsindia.com/blog/how-to-increase-business-sales-website-design-digital-marketing',
    robots_index: true,
    reading_time_minutes: 6,
    published_at: '2026-07-15T14:30:00Z',
    faqs: [
      {
        question: 'लीड्स बढ़ाने के लिए SEO बेहतर है या Google Ads?',
        answer: 'तुरंत लीड्स के लिए Google Ads (PPC) और लंबे समय तक मुफ्त ऑर्गेनिक लीड्स के लिए SEO दोनों का संतुलित उपयोग सबसे बेहतर परिणाम देता है।',
      },
    ],
  },
  {
    id: 3,
    title: 'Best Website Design Company in India (2026 Guide): सही एजेंसी कैसे चुनें?',
    slug: 'best-website-design-company-in-india-2026-guide',
    excerpt: 'अपने बिजनेस के लिए बेस्ट वेबसाइट डिजाइनिंग और डेवलपमेंट कंपनी चुनते समय पोर्टफोलियो, टेक्नोलॉजी, SEO और सपोर्ट की जांच कैसे करें।',
    content: `<h2>सही वेब डेवलपमेंट पार्टनर का चुनाव</h2>
<p>एक अच्छी वेबसाइट कंपनी सिर्फ टेम्पलेट नहीं लगाती, बल्कि आपके बिजनेस मॉडल को समझकर कस्टम, सुरक्षित और स्केलेबल समाधान तैयार करती है।</p>
<h3>किन बातों का ध्यान रखें?</h3>
<ul>
  <li><strong>मोबाइल रिस्पॉन्सिवनेस:</strong> 75% से अधिक ट्रैफिक मोबाइल से आता है।</li>
  <li><strong>क्लीन कोड और स्पीड:</strong> तेज लोडिंग से यूजर एक्सपीरियंस और Google रैंकिंग दोनों बेहतर होते हैं।</li>
  <li><strong>ऑन-पेज SEO और Schema:</strong> हर पेज का मेटा टाइटल, डिस्क्रिप्शन और JSON-LD स्कीमा होना चाहिए।</li>
  <li><strong>डायनामिक एडमिन पैनल:</strong> ताकि आप खुद पेज, सर्विसेज और ब्लॉग मैनेज कर सकें।</li>
</ul>`,
    category: 'Website Design',
    tags: ['Website Design Company', 'India', 'Web Development Guide'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Web-Design-and-Web-Development-270x188.webp',
    featured_image_alt: 'Best Website Design Company in India 2026 Guide',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: 'Best Website Design Company in India (2026 Guide) | ShivWebsIndia',
    meta_description: 'Complete 2026 guide to choosing the best website design and development company in Delhi NCR and India.',
    focus_keywords: 'best website design company in india, web development agency delhi ncr',
    canonical_url: 'https://www.shivwebsindia.com/blog/best-website-design-company-in-india-2026-guide',
    robots_index: true,
    reading_time_minutes: 5,
    published_at: '2026-07-13T09:15:00Z',
    faqs: [
      {
        question: 'क्या वेबसाइट का सोर्स कोड और डोमेन क्लाइंट के नाम पर होता है?',
        answer: 'जी हाँ, ShivWebsIndia में प्रोजेक्ट पूरा होने पर 100% सोर्स कोड, डोमेन और होस्टिंग एक्सेस क्लाइंट के पास रहता है।',
      },
    ],
  },
  {
    id: 4,
    title: 'How to Choose the Best SEO Company? (The Ultimate Business Checklist)',
    slug: 'how-to-choose-the-best-seo-company-ultimate-guide',
    excerpt: 'Learn how to evaluate technical SEO expertise, transparent reporting, white-hat link building, and local search strategies.',
    content: `<h2>Evaluating an SEO Partner Without the Jargon</h2>
<p>Search Engine Optimization is a long-term investment in your brand's organic lead pipeline. When choosing an SEO company in Delhi NCR, look for transparent technical audits, realistic timelines, and measurable lead tracking rather than overnight ranking promises.</p>
<h3>Core Pillars of Modern SEO</h3>
<table>
  <thead>
    <tr>
      <th>SEO Pillar</th>
      <th>What We Optimize</th>
      <th>Business Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Technical SEO</td>
      <td>Core Web Vitals, XML Sitemap, Canonical URLs, Schema.org</td>
      <td>Faster indexing &amp; higher crawl efficiency</td>
    </tr>
    <tr>
      <td>On-Page Content</td>
      <td>Search-intent headings, service deliverables, FAQ sections</td>
      <td>Higher conversion rate from organic visitors</td>
    </tr>
    <tr>
      <td>Local SEO (GBP)</td>
      <td>Google Business Profile, local citations, NCR area pages</td>
      <td>Direct phone calls &amp; WhatsApp enquiries</td>
    </tr>
  </tbody>
</table>`,
    category: 'SEO & Search',
    tags: ['SEO Company', 'Digital Marketing', 'Organic Traffic', 'Delhi NCR'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/SEO-Company-270x188.webp',
    featured_image_alt: 'How to Choose the Best SEO Company Guide',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: 'How to Choose the Best SEO Company? Ultimate Guide | ShivWebsIndia',
    meta_description: 'Practical checklist for business owners on how to choose a reliable, results-focused SEO company in India.',
    focus_keywords: 'best seo company in delhi ncr, seo checklist for business, local seo ghaziabad',
    canonical_url: 'https://www.shivwebsindia.com/blog/how-to-choose-the-best-seo-company-ultimate-guide',
    robots_index: true,
    reading_time_minutes: 5,
    published_at: '2026-07-11T11:00:00Z',
    faqs: [
      {
        question: 'How long does it take to see measurable SEO results?',
        answer: 'Local SEO improvements often appear within 4 to 8 weeks, while competitive organic search keywords typically build momentum over 3 to 6 months.',
      },
    ],
  },
  {
    id: 5,
    title: 'वेबसाइट बनवाने से पहले पूछे जाने वाले 20 जरूरी सवाल (20 Essential Questions)',
    slug: '20-essential-questions-to-ask-before-building-a-website',
    excerpt: 'वेबसाइट डेवलपर्स को हायर करने से पहले डोमेन ओनरशिप, होस्टिंग, मोबाइल स्पीड, SEO और मेंटेनेंस से जुड़े ये 20 सवाल जरूर पूछें।',
    content: `<h2>वेबसाइट प्रोजेक्ट शुरू करने से पहले की तैयारी</h2>
<p>अपने वेब डेवलपर से कोडिंग टेक्नोलॉजी, एडमिन पैनल एक्सेस, सिक्योरिटी बैकअप और भविष्य में पेज अपडेट करने की सुविधा के बारे में स्पष्ट जानकारी लें।</p>
<ul>
  <li>क्या वेबसाइट मोबाइल, टैबलेट और डेस्कटॉप पर पूरी तरह रिस्पॉन्सिव होगी?</li>
  <li>क्या हर पेज और सर्विस के लिए अलग SEO Meta Title और Description सेट करने का विकल्प मिलेगा?</li>
  <li>क्या लीड फॉर्म सबमिट होने पर WhatsApp और Email दोनों पर अलर्ट मिलेगा?</li>
</ul>`,
    category: 'Website Design',
    tags: ['Website Checklist', 'Web Design Questions', 'Business Owners'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/best-website-development-company-270x188.webp',
    featured_image_alt: 'वेबसाइट बनवाने से पहले पूछे जाने वाले 20 जरूरी सवाल',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: 'वेबसाइट बनवाने से पहले पूछे जाने वाले 20 जरूरी सवाल | ShivWebsIndia',
    meta_description: 'वेबसाइट बनवाने से पहले पूछे जाने वाले 20 जरूरी सवाल जो हर बिजनेस ओनर को पता होने चाहिए।',
    focus_keywords: 'questions to ask web developer, website development checklist india',
    canonical_url: 'https://www.shivwebsindia.com/blog/20-essential-questions-to-ask-before-building-a-website',
    robots_index: true,
    reading_time_minutes: 6,
    published_at: '2026-07-10T10:30:00Z',
    faqs: [
      {
        question: 'क्या वेबसाइट लॉन्च के बाद टेक्निकल सपोर्ट मिलता है?',
        answer: 'हाँ, हम वेबसाइट लॉन्च के बाद भी सिक्योरिटी अपडेट्स, बैकअप और टेक्निकल मेंटेनेंस सपोर्ट प्रदान करते हैं।',
      },
    ],
  },
  {
    id: 6,
    title: 'What Is Google AI Overviews? The Future of Search & SEO Strategy',
    slug: 'what-is-google-ai-overviews-future-of-search-seo',
    excerpt: 'Understand how Google AI Overviews work and how structured content, FAQ schema, and authoritative answers keep your business visible.',
    content: `<h2>Adapting Your Website for AI-Assisted Search Results</h2>
<p>Google AI Overviews synthesize direct answers at the top of search results. By structuring your service pages with clear headings, factual answers, FAQ accordions, and Schema.org JSON-LD markup, your business remains a trusted source in modern search.</p>`,
    category: 'SEO & Search',
    tags: ['Google AI Overviews', 'Future of Search', 'Technical SEO'],
    featured_image_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/What-Is-Google-AI-Overviews-270x188.webp',
    featured_image_alt: 'What Is Google AI Overviews Future of Search',
    author_name: 'ShivWebsIndia Editorial Team',
    status: 'published',
    seo_title: 'What Is Google AI Overviews? The Future of Search | ShivWebsIndia',
    meta_description: 'Learn how Google AI Overviews impact organic search and how to optimize your business website for modern SEO.',
    focus_keywords: 'google ai overviews seo, structured data schema seo, future of search',
    canonical_url: 'https://www.shivwebsindia.com/blog/what-is-google-ai-overviews-future-of-search-seo',
    robots_index: true,
    reading_time_minutes: 4,
    published_at: '2026-07-08T09:00:00Z',
    faqs: [
      {
        question: 'How does FAQ Schema help with Google AI Overviews?',
        answer: 'FAQPage and Article JSON-LD structured data help search engines extract concise, verified Q&A pairs directly from your pages.',
      },
    ],
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'Website Design & Development',
    question: '1. Why does every business need a professional website?',
    answer: 'A professional website acts as your digital storefront and helps customers learn about your products, services, and credibility. It increases trust, improves online visibility, and allows potential customers to contact your business 24/7. A well-designed website can also generate leads and sales without requiring constant manual effort.',
    page_slug: 'global',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 2,
    category: 'Pricing & ROI',
    question: '2. How much does a business website cost in India?',
    answer: 'The cost depends on the type of website, number of pages, design complexity, features, and functionality. A basic business website generally costs less than an eCommerce or custom web application. Businesses should focus on value, performance, and long-term ROI rather than choosing the cheapest option.',
    page_slug: 'global',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 3,
    category: 'Website Design & Development',
    question: '3. What is the difference between website design and website development?',
    answer: 'Website design focuses on appearance, layout, branding, and user experience. Website development involves coding, functionality, database integration, and technical implementation. Design determines how a website looks, while development determines how it works.',
    page_slug: 'global',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 4,
    category: 'Mobile & UX',
    question: '4. Why is mobile-friendly website design important?',
    answer: 'More than half of internet users browse websites through smartphones. A mobile-friendly website improves user experience, reduces bounce rates, and helps achieve better rankings in search engines. It also increases conversions and customer satisfaction.',
    page_slug: 'global',
    sort_order: 4,
    is_published: true,
  },
  {
    id: 5,
    category: 'Lead Generation',
    question: '5. How can a website generate more business leads?',
    answer: 'A website can generate leads through clear calls-to-action, contact forms, landing pages, chat support, lead magnets, SEO, and targeted content. The goal is to guide visitors toward taking action, such as making inquiries, requesting quotes, or scheduling consultations.',
    page_slug: 'global',
    sort_order: 5,
    is_published: true,
  },
  {
    id: 6,
    category: 'Digital Marketing & SEO',
    question: '6. What is SEO and why is it important for businesses?',
    answer: "Search Engine Optimization (SEO) is the process of improving a website's visibility in search results. SEO helps businesses attract qualified visitors, increase brand awareness, generate leads, and reduce dependency on paid advertising.",
    page_slug: 'global',
    sort_order: 6,
    is_published: true,
  },
  {
    id: 7,
    category: 'Digital Marketing & SEO',
    question: '7. How long does SEO take to show results?',
    answer: 'SEO is a long-term strategy. Depending on competition, website quality, and industry, businesses may start seeing improvements within a few months. Consistent optimization and content creation produce stronger long-term results.',
    page_slug: 'global',
    sort_order: 7,
    is_published: true,
  },
  {
    id: 8,
    category: 'Local SEO',
    question: '8. What is Local SEO and how does it help businesses?',
    answer: 'Local SEO helps businesses appear in location-based searches such as "website design company near me" or "digital marketing agency in Noida." It improves visibility on Google Maps, local search results, and attracts nearby customers actively searching for services.',
    page_slug: 'global',
    sort_order: 8,
    is_published: true,
  },
  {
    id: 9,
    category: 'Hindi FAQ',
    question: '9. छोटे व्यवसाय के लिए सबसे अच्छी डिजिटल मार्केटिंग रणनीति क्या है?',
    answer: 'एक प्रोफेशनल वेबसाइट, लोकल SEO, Google Business Profile, कंटेंट मार्केटिंग और सोशल मीडिया मार्केटिंग का संयोजन छोटे व्यवसायों के लिए सबसे प्रभावी माना जाता है।',
    page_slug: 'global',
    sort_order: 9,
    is_published: true,
  },
  {
    id: 10,
    category: 'Hindi FAQ',
    question: '10. वेबसाइट ट्रैफिक कैसे बढ़ाएं?',
    answer: 'SEO, ब्लॉगिंग, सोशल मीडिया प्रमोशन, Google Ads, ईमेल मार्केटिंग और गुणवत्तापूर्ण कंटेंट के माध्यम से वेबसाइट ट्रैफिक बढ़ाया जा सकता है।',
    page_slug: 'global',
    sort_order: 10,
    is_published: true,
  },
];

function buildAllPages(): CMSPage[] {
  const baseUrl = 'https://www.shivwebsindia.com';

  const homePage: CMSPage = {
    id: 1,
    title: 'Home',
    slug: 'home',
    template: 'home',
    excerpt: 'Website Design, Web Development & Digital Marketing Agency in Ghaziabad and Delhi NCR.',
    content: '',
    featured_image: heroStudioImg,
    author_name: 'ShivWebsIndia Admin',
    status: 'published',
    is_system_page: true,
    updated_at: '2026-10-10T09:00:00Z',
    seo: {
      seo_title: 'ShivWebsIndia – Website Design & Digital Marketing Agency in Ghaziabad',
      meta_description: 'ShivWebsIndia is a full-service website design, PHP/WordPress web development, SEO, and digital marketing agency in Vaishali, Ghaziabad & Delhi NCR.',
      canonical_url: `${baseUrl}/`,
      robots_index: true,
      robots_follow: true,
      og_title: 'ShivWebsIndia – Website Design & Digital Marketing Agency in Ghaziabad',
      og_description: 'Custom website development, e-commerce stores, Local SEO, and Google Ads PPC management in Ghaziabad and Delhi NCR.',
      og_image_url: heroStudioImg,
      schema_type: 'ProfessionalService',
      breadcrumb_title: 'Home',
      include_in_sitemap: true,
    },
    sections: [
      {
        id: 101,
        page_id: 1,
        section_type: 'hero_banner',
        title: 'Hero Banner',
        subtitle: 'Vaishali, Sector 3, Ghaziabad · Serving Delhi NCR & India',
        sort_order: 1,
        is_enabled: true,
        content_json: {
          kicker: 'Vaishali, Ghaziabad · Serving Delhi NCR',
          headline: 'Website Design, Custom Web Development & Measurable Digital Marketing',
          subheadline: 'We build fast, secure, search-optimized business websites, e-commerce platforms, and transparent lead-generation campaigns for startups, local businesses, and growing enterprises.',
          primary_cta_text: 'Request a Quote',
          primary_cta_url: '/contact-us',
          secondary_cta_text: 'WhatsApp +91-8667666429',
          secondary_cta_url: 'https://wa.me/918667666429',
          hero_image: heroStudioImg,
          highlights: [
            'Custom PHP 8.x, MySQL & WordPress Architecture',
            'Technical SEO, Local GBP & Google Ads Management',
            'Responsive Mobile-First Design & cPanel Deployment',
          ],
        },
      },
      {
        id: 102,
        page_id: 1,
        section_type: 'service_cards',
        title: 'Core Website & Digital Marketing Capabilities',
        subtitle: 'End-to-end engineering and inbound marketing tailored to your business goals.',
        sort_order: 2,
        is_enabled: true,
        content_json: {
          display_mode: 'featured_8',
          show_deliverables: true,
        },
      },
      {
        id: 103,
        page_id: 1,
        section_type: 'features_grid',
        title: 'Why Businesses Across Ghaziabad & Delhi NCR Choose ShivWebsIndia',
        subtitle: 'Built on verifiable engineering standards, transparent communication, and full client ownership.',
        sort_order: 3,
        is_enabled: true,
        content_json: {
          items: [
            {
              number: '01',
              title: 'Clean, Maintainable Architecture',
              description: 'Every project uses semantic HTML5, responsive CSS, and structured PHP/MySQL or lightweight WordPress codebases built for Hostinger and cPanel.',
            },
            {
              number: '02',
              title: 'Search & Conversion Ready From Day One',
              description: 'Proper heading hierarchy, canonical tags, Schema.org JSON-LD, XML sitemaps, and validated lead capture forms are built into the foundation.',
            },
            {
              number: '03',
              title: 'Direct Access & Local Accountability',
              description: 'Based in Vaishali, Sector 3, Ghaziabad, our team provides direct phone and WhatsApp collaboration without opaque agency layers.',
            },
            {
              number: '04',
              title: '100% Code, Database & Asset Ownership',
              description: 'No proprietary vendor lock-in. You own your domain, hosting account, database schema, and admin credentials permanently.',
            },
          ],
        },
      },
      {
        id: 104,
        page_id: 1,
        section_type: 'portfolio_grid',
        title: 'Selected Project Showcase',
        subtitle: 'Explore recent web development, e-commerce, and local search architecture engagements managed via our CMS.',
        sort_order: 4,
        is_enabled: true,
        content_json: {
          max_items: 3,
        },
      },
      {
        id: 105,
        page_id: 1,
        section_type: 'process_workflow',
        title: 'Our 4-Stage Execution Workflow',
        subtitle: 'A structured, predictable delivery model from discovery to post-launch growth.',
        sort_order: 5,
        is_enabled: true,
        content_json: {
          steps: [
            {
              step: '01. Discovery & Architecture',
              detail: 'We audit your current web presence, define target customer search intent, and map out URL hierarchy and database requirements.',
            },
            {
              step: '02. Brand-Aligned UI & Prototyping',
              detail: 'We design clean, accessible layouts for mobile, tablet, and desktop that preserve your brand identity and prioritize clear CTAs.',
            },
            {
              step: '03. Development, CMS & Security Hardening',
              detail: 'We build the frontend and PHP/MySQL backend with PDO prepared statements, CSRF protection, and full SEO metadata controls.',
            },
            {
              step: '04. Quality Assurance, Launch & Growth',
              detail: 'After testing forms, redirects, and mobile responsiveness, we deploy to your hosting and initiate ongoing SEO or PPC campaigns.',
            },
          ],
        },
      },
      {
        id: 106,
        page_id: 1,
        section_type: 'faq_accordion',
        title: 'Frequently Asked Questions',
        subtitle: 'Clear answers about our web development standards, pricing transparency, and SEO methodology.',
        sort_order: 6,
        is_enabled: true,
        content_json: {
          category_filter: 'all',
        },
      },
      {
        id: 107,
        page_id: 1,
        section_type: 'cta_banner',
        title: 'Ready to Upgrade Your Website or Launch a Lead-Generation Campaign?',
        subtitle: 'Speak directly with our Ghaziabad web development and digital marketing specialists for a transparent project scope.',
        sort_order: 7,
        is_enabled: true,
        content_json: {
          primary_cta_text: 'Request a Project Quote',
          primary_cta_url: '/contact-us',
          secondary_cta_text: 'Call +91-8667666429',
          secondary_cta_url: 'tel:+918667666429',
        },
      },
    ],
  };

  const aboutPage: CMSPage = {
    id: 2,
    title: 'About Us',
    slug: 'about-us',
    template: 'standard',
    excerpt: 'Learn about ShivWebsIndia, a Ghaziabad-based website design, custom web development, and digital marketing agency serving Delhi NCR.',
    content: '',
    featured_image: heroStudioImg,
    author_name: 'ShivWebsIndia Admin',
    status: 'published',
    is_system_page: true,
    updated_at: '2026-10-10T09:00:00Z',
    seo: {
      seo_title: 'About ShivWebsIndia – Web Design & Digital Marketing Agency in Ghaziabad',
      meta_description: 'Discover ShivWebsIndia in Vaishali, Sector 3, Ghaziabad. We partner with startups, SMEs, and enterprises across Delhi NCR for web development and SEO.',
      canonical_url: `${baseUrl}/about-us`,
      robots_index: true,
      robots_follow: true,
      og_title: 'About ShivWebsIndia – Web Design & Digital Marketing Agency',
      og_description: 'Based in Vaishali, Ghaziabad, ShivWebsIndia delivers custom websites, e-commerce platforms, and transparent digital marketing.',
      og_image_url: heroStudioImg,
      schema_type: 'AboutPage',
      breadcrumb_title: 'About Us',
      include_in_sitemap: true,
    },
    sections: [
      {
        id: 201,
        page_id: 2,
        section_type: 'text_with_image',
        title: 'Engineering Dependable Digital Foundations for Growing Businesses',
        subtitle: 'Headquartered in Vaishali, Sector 3, Ghaziabad · Serving Delhi NCR & Pan-India Clients',
        sort_order: 1,
        is_enabled: true,
        content_json: {
          body: 'ShivWebsIndia was founded with a straightforward mission: help startups, local service businesses, manufacturers, and growing brands establish a credible, high-performing digital presence without agency jargon or inflated retainers. We combine disciplined software engineering (PHP 8.x, MySQL, WordPress, E-commerce) with measurable search and paid marketing execution.',
          image_url: heroStudioImg,
          image_alt: 'ShivWebsIndia design and development team workspace',
          highlights: [
            'Transparent scope, milestone delivery, and clear documentation',
            'Ethical white-hat Technical SEO and Local SEO practices',
            'Verified business location: Vaishali, Sector 3, Ghaziabad, UP',
          ],
        },
      },
      {
        id: 202,
        page_id: 2,
        section_type: 'verified_statistics',
        title: 'Verified Business Profile & Configurable Agency Facts',
        subtitle: 'All business credentials below are managed in the CMS and contain zero fabricated awards or unverified claims.',
        sort_order: 2,
        is_enabled: true,
        content_json: {
          stats: [
            { label: 'Primary Hub', value: 'Ghaziabad, NCR', note: 'Vaishali, Sector 3 Office' },
            { label: 'Core Stack', value: 'PHP 8.x & MySQL', note: 'InnoDB utf8mb4 + WordPress' },
            { label: 'Service Scope', value: '8 Core Practices', note: 'Web, E-Com, SEO, Local, PPC, SMM' },
            { label: 'Direct Support', value: '+91-8667666429', note: 'info@shivwebsindia.com' },
          ],
        },
      },
      {
        id: 203,
        page_id: 2,
        section_type: 'cta_banner',
        title: 'Partner With a Technical Team That Values Long-Term Reliability',
        subtitle: 'Schedule a discovery conversation or request a detailed proposal for your website or marketing goals.',
        sort_order: 3,
        is_enabled: true,
        content_json: {
          primary_cta_text: 'Contact Our Team',
          primary_cta_url: '/contact-us',
          secondary_cta_text: 'View Our Portfolio',
          secondary_cta_url: '/portfolio',
        },
      },
    ],
  };

  // Generate dedicated pages for all 8 required services (IDs 3..10)
  const servicePages: CMSPage[] = INITIAL_SERVICES.map((svc, idx) => {
    const pageId = 3 + idx;
    return {
      id: pageId,
      title: svc.title,
      slug: svc.slug,
      template: 'service',
      excerpt: svc.short_description,
      content: svc.full_description,
      featured_image: idx % 2 === 0 ? portfolioCorporateImg : portfolioEcommerceImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: `${svc.title} Services in Ghaziabad & Delhi NCR | ShivWebsIndia`,
        meta_description: `${svc.short_description} Contact ShivWebsIndia at +91-8667666429 for a custom quote.`,
        canonical_url: `${baseUrl}/${svc.slug}`,
        robots_index: true,
        robots_follow: true,
        og_title: `${svc.title} – ShivWebsIndia`,
        og_description: svc.short_description,
        og_image_url: heroStudioImg,
        schema_type: 'Service',
        breadcrumb_title: svc.title,
        include_in_sitemap: true,
      },
      sections: [
        {
          id: pageId * 100 + 1,
          page_id: pageId,
          section_type: 'text_with_image',
          title: svc.title,
          subtitle: `${svc.category} · Ghaziabad & Delhi NCR`,
          sort_order: 1,
          is_enabled: true,
          content_json: {
            body: svc.full_description,
            image_url: idx % 2 === 0 ? portfolioCorporateImg : portfolioEcommerceImg,
            image_alt: `${svc.title} showcase by ShivWebsIndia`,
            highlights: svc.deliverables,
          },
        },
        {
          id: pageId * 100 + 2,
          page_id: pageId,
          section_type: 'pricing_table',
          title: 'Transparent Engagement Models',
          subtitle: 'Customizable project scopes based on your technical requirements—editable via the Admin Page Builder.',
          sort_order: 2,
          is_enabled: true,
          content_json: {
            plans: [
              {
                name: 'Starter Business Scope',
                audience: 'For local businesses & early-stage startups',
                price_label: 'Custom Quote',
                features: [
                  'Core responsive design & mobile optimization',
                  'Essential on-page SEO & metadata setup',
                  'Validated lead capture & WhatsApp integration',
                ],
              },
              {
                name: 'Growth & Dynamic CMS Scope',
                audience: 'For expanding SMEs & multi-service brands',
                price_label: 'Custom Quote',
                features: [
                  'Full dynamic CMS / custom service & blog modules',
                  'Comprehensive Schema.org & XML sitemap setup',
                  'Conversion tracking & speed optimization',
                ],
              },
              {
                name: 'Enterprise / Custom Portal',
                audience: 'For high-volume catalogs & bespoke workflows',
                price_label: 'Custom Quote',
                features: [
                  'Custom database architecture & role permissions',
                  'API / Payment / ERP webhook integrations',
                  'Dedicated priority SLA & security audits',
                ],
              },
            ],
          },
        },
        {
          id: pageId * 100 + 3,
          page_id: pageId,
          section_type: 'related_services',
          title: 'Complementary Capabilities',
          subtitle: 'Combine web engineering with targeted digital marketing for sustainable inbound leads.',
          sort_order: 3,
          is_enabled: true,
          content_json: {
            exclude_slug: svc.slug,
          },
        },
        {
          id: pageId * 100 + 4,
          page_id: pageId,
          section_type: 'cta_banner',
          title: `Discuss Your ${svc.title} Requirements`,
          subtitle: 'Request a tailored scope and timeline from our Vaishali, Ghaziabad team.',
          sort_order: 4,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Request a Quote',
            primary_cta_url: '/contact-us',
            secondary_cta_text: 'WhatsApp Us',
            secondary_cta_url: 'https://wa.me/918667666429',
          },
        },
      ],
    };
  });

  const otherPages: CMSPage[] = [
    {
      id: 11,
      title: 'Portfolio & Projects',
      slug: 'portfolio',
      template: 'portfolio',
      excerpt: 'Explore verified website design, e-commerce, and Local SEO projects delivered by ShivWebsIndia.',
      content: '',
      featured_image: portfolioCorporateImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Portfolio & Web Development Projects | ShivWebsIndia',
        meta_description: 'Browse recent custom website design, PHP/MySQL portals, e-commerce stores, and Local SEO projects by ShivWebsIndia.',
        canonical_url: `${baseUrl}/portfolio`,
        robots_index: true,
        robots_follow: true,
        og_title: 'Portfolio & Projects – ShivWebsIndia',
        og_description: 'Recent website design, e-commerce, and digital marketing projects.',
        og_image_url: portfolioCorporateImg,
        schema_type: 'CollectionPage',
        breadcrumb_title: 'Portfolio',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1101,
          page_id: 11,
          section_type: 'portfolio_grid',
          title: 'Verified Client Projects & Technical Implementations',
          subtitle: 'Every portfolio entry is managed through the Admin CMS and includes only authorized screenshots and factual project descriptions.',
          sort_order: 1,
          is_enabled: true,
          content_json: { max_items: 12 },
        },
        {
          id: 1102,
          page_id: 11,
          section_type: 'cta_banner',
          title: 'Have a Similar Website or Marketing Project in Mind?',
          subtitle: 'Let us walk you through relevant architecture patterns and a realistic delivery timeline.',
          sort_order: 2,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Request a Project Quote',
            primary_cta_url: '/contact-us',
            secondary_cta_text: 'Call +91-8667666429',
            secondary_cta_url: 'tel:+918667666429',
          },
        },
      ],
    },
    {
      id: 12,
      title: 'Blog & Insights',
      slug: 'blog',
      template: 'blog',
      excerpt: 'Practical guides on website architecture, PHP/MySQL security, Technical SEO, and Local SEO for Indian businesses.',
      content: '',
      featured_image: portfolioSeoImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Web Development & Digital Marketing Blog | ShivWebsIndia',
        meta_description: 'Read technical articles on website design, PHP 8 security, Local SEO in Ghaziabad & Delhi NCR, and conversion optimization.',
        canonical_url: `${baseUrl}/blog`,
        robots_index: true,
        robots_follow: true,
        og_title: 'ShivWebsIndia Blog – Web Development & SEO Insights',
        og_description: 'Practical guides on web development, SEO, and digital growth.',
        og_image_url: portfolioSeoImg,
        schema_type: 'Blog',
        breadcrumb_title: 'Blog',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1201,
          page_id: 12,
          section_type: 'blog_listing',
          title: 'Engineering & Digital Marketing Insights',
          subtitle: 'Actionable articles written by our web development and search specialists.',
          sort_order: 1,
          is_enabled: true,
          content_json: { posts_per_page: 9 },
        },
      ],
    },
    {
      id: 13,
      title: 'Frequently Asked Questions',
      slug: 'faqs',
      template: 'faq',
      excerpt: 'Answers to common questions about website design, hosting ownership, SEO methodology, and support.',
      content: '',
      featured_image: heroStudioImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Frequently Asked Questions (FAQs) | ShivWebsIndia',
        meta_description: 'Find clear answers regarding website design timelines, PHP/MySQL hosting on Hostinger/cPanel, code ownership, and ethical SEO services.',
        canonical_url: `${baseUrl}/faqs`,
        robots_index: true,
        robots_follow: true,
        og_title: 'FAQs – ShivWebsIndia Website Design & Digital Marketing',
        og_description: 'Answers about web development, hosting, SEO, and project workflows.',
        og_image_url: heroStudioImg,
        schema_type: 'FAQPage',
        breadcrumb_title: 'FAQs',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1301,
          page_id: 13,
          section_type: 'faq_accordion',
          title: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know before starting a web development or digital marketing engagement with ShivWebsIndia.',
          sort_order: 1,
          is_enabled: true,
          content_json: { category_filter: 'all' },
        },
        {
          id: 1302,
          page_id: 13,
          section_type: 'cta_banner',
          title: 'Still Have a Specific Technical Question?',
          subtitle: 'Reach out to our team in Vaishali, Ghaziabad by phone, email, or WhatsApp.',
          sort_order: 2,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Ask Our Team',
            primary_cta_url: '/contact-us',
            secondary_cta_text: 'WhatsApp +91-8667666429',
            secondary_cta_url: 'https://wa.me/918667666429',
          },
        },
      ],
    },
    {
      id: 14,
      title: 'Contact Us',
      slug: 'contact-us',
      template: 'contact',
      excerpt: 'Get in touch with ShivWebsIndia in Vaishali, Sector 3, Ghaziabad for website design, web development, and digital marketing.',
      content: '',
      featured_image: heroStudioImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Contact ShivWebsIndia – Request a Website or SEO Quote in Ghaziabad',
        meta_description: 'Contact ShivWebsIndia at +91-8667666429 or info@shivwebsindia.com. Located in Vaishali, Sector 3, Ghaziabad, serving Delhi NCR.',
        canonical_url: `${baseUrl}/contact-us`,
        robots_index: true,
        robots_follow: true,
        og_title: 'Contact ShivWebsIndia – Website Design & Digital Marketing',
        og_description: 'Request a quote for website design, e-commerce, SEO, or Google Ads PPC.',
        og_image_url: heroStudioImg,
        schema_type: 'ContactPage',
        breadcrumb_title: 'Contact Us',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1401,
          page_id: 14,
          section_type: 'contact_form',
          title: 'Request a Project Quote or Consultation',
          subtitle: 'Submit your project details below. All enquiries are validated server-side, protected by CSRF tokens, and stored securely in our Lead Management database.',
          sort_order: 1,
          is_enabled: true,
          content_json: {
            show_office_details: true,
          },
        },
      ],
    },
    {
      id: 15,
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      template: 'legal',
      excerpt: 'How ShivWebsIndia collects, processes, and safeguards personal contact enquiries and website analytics.',
      content: '',
      featured_image: '',
      author_name: 'ShivWebsIndia Legal',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Privacy Policy | ShivWebsIndia',
        meta_description: 'Read the ShivWebsIndia Privacy Policy detailing how we protect customer enquiries, personal data, and cookies.',
        canonical_url: `${baseUrl}/privacy-policy`,
        robots_index: true,
        robots_follow: true,
        og_title: 'Privacy Policy – ShivWebsIndia',
        og_description: 'Data protection and privacy policy for ShivWebsIndia.com.',
        og_image_url: '',
        schema_type: 'WebPage',
        breadcrumb_title: 'Privacy Policy',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1501,
          page_id: 15,
          section_type: 'heading_richtext',
          title: 'Privacy Policy',
          subtitle: 'Effective Date: October 2026 · ShivWebsIndia (https://www.shivwebsindia.com/)',
          sort_order: 1,
          is_enabled: true,
          content_json: {
            body_html: `<h3>1. Information We Collect</h3>
<p>When you submit a quote request or contact form on ShivWebsIndia.com, we collect your full name, email address, phone number, company name, service of interest, and project message solely to respond to your business enquiry.</p>
<h3>2. How We Store and Protect Your Data</h3>
<p>Customer enquiries are stored in our access-controlled database using parameterized PDO queries and encrypted transport (HTTPS). Personal enquiry data is restricted strictly to authorized ShivWebsIndia staff and is never exposed on public URLs or sold to third-party list brokers.</p>
<h3>3. Cookies and Analytics</h3>
<p>We use essential session cookies (<code>SHIVWEBS_SESSID</code>) with <code>HttpOnly</code> and <code>SameSite=Strict</code> flags for security and CSRF protection, along with aggregated analytics to improve website performance.</p>
<h3>4. Contact for Privacy Requests</h3>
<p>To request access, correction, or deletion of your contact enquiry record, email <a href="mailto:info@shivwebsindia.com">info@shivwebsindia.com</a> or call +91-8667666429.</p>`,
          },
        },
      ],
    },
    {
      id: 16,
      title: 'Terms and Conditions',
      slug: 'terms-and-conditions',
      template: 'legal',
      excerpt: 'Standard terms of service governing website usage, project proposals, intellectual property, and hosting deployments.',
      content: '',
      featured_image: '',
      author_name: 'ShivWebsIndia Legal',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-10T09:00:00Z',
      seo: {
        seo_title: 'Terms and Conditions | ShivWebsIndia',
        meta_description: 'Review the Terms and Conditions governing the use of ShivWebsIndia.com and our web development and digital marketing services.',
        canonical_url: `${baseUrl}/terms-and-conditions`,
        robots_index: true,
        robots_follow: true,
        og_title: 'Terms and Conditions – ShivWebsIndia',
        og_description: 'Terms governing ShivWebsIndia web development and marketing engagements.',
        og_image_url: '',
        schema_type: 'WebPage',
        breadcrumb_title: 'Terms and Conditions',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1601,
          page_id: 16,
          section_type: 'heading_richtext',
          title: 'Terms and Conditions',
          subtitle: 'Governing Use of https://www.shivwebsindia.com/ and Project Engagements',
          sort_order: 1,
          is_enabled: true,
          content_json: {
            body_html: `<h3>1. Scope of Services</h3>
<p>All website design, custom PHP/MySQL development, WordPress, e-commerce, and digital marketing deliverables are governed by the written statement of work (SOW) or quotation agreed upon with each client.</p>
<h3>2. Intellectual Property & Code Handover</h3>
<p>Upon full settlement of agreed project milestones, clients receive full rights to the custom website templates, source code, and content created specifically for their engagement.</p>
<h3>3. Search Engine & Advertising Disclaimers</h3>
<p>ShivWebsIndia follows search engine webmaster guidelines. Because third-party search algorithms and auction dynamics are outside any agency's control, we do not guarantee specific organic ranking positions, and third-party ad spend (e.g., Google Ads or Meta Ads) is billed directly by the respective platform.</p>
<h3>4. Governing Law</h3>
<p>These terms are governed by the laws of India, with jurisdiction in Ghaziabad, Uttar Pradesh.</p>`,
          },
        },
      ],
    },
    {
      id: 17,
      title: 'All Services Directory',
      slug: 'services',
      template: 'service',
      excerpt: 'Explore our complete suite of Website Design, Custom PHP 8.x Web Development, WordPress, E-Commerce, Technical SEO, Local SEO, Social Media, and Google Ads PPC services.',
      content: `<h2>Complete Website Design, Custom PHP Development & Digital Marketing Services</h2>
<p>At <strong>ShivWebsIndia</strong> (Vaishali, Sector 3, Ghaziabad), we deliver end-to-end web engineering and performance marketing solutions tailored for startups, clinics, manufacturers, retailers, and enterprises across Delhi NCR and India.</p>
<ul>
  <li><strong>Web Design & Development:</strong> Custom HTML5, CSS3, PHP 8.x & MySQL Dynamic Websites, WordPress CMS, and WooCommerce / Razorpay E-Commerce Stores.</li>
  <li><strong>Search & Performance Marketing:</strong> Technical & Organic SEO, Local Google Business Profile (Map Pack) Optimization, Social Media Marketing, and High-ROI Google Ads (PPC).</li>
</ul>`,
      featured_image: heroStudioImg,
      author_name: 'ShivWebsIndia Admin',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-12T09:00:00Z',
      seo: {
        seo_title: 'All Services – Website Design, PHP Development, SEO & Digital Marketing | ShivWebsIndia',
        meta_description: 'Browse all web design, custom PHP/MySQL development, WordPress, e-commerce, SEO, Local SEO, and Google Ads services offered by ShivWebsIndia in Ghaziabad & Delhi NCR.',
        canonical_url: `${baseUrl}/services`,
        robots_index: true,
        robots_follow: true,
        og_title: 'All Services – ShivWebsIndia Web & Digital Marketing Agency',
        og_description: 'Complete directory of website development and digital marketing services.',
        og_image_url: heroStudioImg,
        schema_type: 'Service',
        breadcrumb_title: 'Services',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1701,
          page_id: 17,
          section_type: 'service_cards',
          title: 'All Website Design, Development & Digital Marketing Services',
          subtitle: 'Select any service below to view detailed deliverables, pricing packages, and technical specifications.',
          sort_order: 1,
          is_enabled: true,
          content_json: {
            display_mode: 'all',
            show_deliverables: true,
          },
        },
        {
          id: 1702,
          page_id: 17,
          section_type: 'faq_accordion',
          title: 'Service & Engagement FAQs',
          subtitle: 'Answers to common questions about our web development and digital marketing services.',
          sort_order: 2,
          is_enabled: true,
          content_json: { category_filter: 'all' },
        },
        {
          id: 1703,
          page_id: 17,
          section_type: 'cta_banner',
          title: 'Need a Custom Website + Digital Marketing Package?',
          subtitle: 'Speak directly with our Ghaziabad engineering and SEO specialists for a tailored proposal.',
          sort_order: 3,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Request Custom Quote',
            primary_cta_url: '/contact-us',
            secondary_cta_text: 'Call +91-8667666429',
            secondary_cta_url: 'tel:+918667666429',
          },
        },
      ],
    },
    {
      id: 18,
      title: 'Media & Brand Gallery',
      slug: 'media',
      template: 'portfolio',
      excerpt: 'Explore official brand media assets, UI/UX design showcases, project screenshots, and studio visuals from ShivWebsIndia.',
      content: `<h2>Official Brand Media, Project Visuals & Press Kit</h2>
<p>Welcome to the <strong>ShivWebsIndia Media & Visual Gallery</strong>. All project screenshots, banners, WebP graphics, and studio media assets below are managed directly from our CMS Media Library with SEO-friendly alt attributes.</p>`,
      featured_image: portfolioCorporateImg,
      author_name: 'ShivWebsIndia Media Desk',
      status: 'published',
      is_system_page: true,
      updated_at: '2026-10-12T09:00:00Z',
      seo: {
        seo_title: 'Media Gallery & Project Visuals | ShivWebsIndia',
        meta_description: 'Explore ShivWebsIndia official media gallery, website design screenshots, e-commerce UI showcases, and digital marketing visuals.',
        canonical_url: `${baseUrl}/media`,
        robots_index: true,
        robots_follow: true,
        og_title: 'Media Gallery & Visual Showcase – ShivWebsIndia',
        og_description: 'Official media assets, web design visuals, and project gallery.',
        og_image_url: portfolioCorporateImg,
        schema_type: 'CollectionPage',
        breadcrumb_title: 'Media',
        include_in_sitemap: true,
      },
      sections: [
        {
          id: 1801,
          page_id: 18,
          section_type: 'image_gallery',
          title: 'Official Media Library & Project Visual Showcase',
          subtitle: 'All uploaded media assets, project showcases, and brand visuals managed in the CMS Media Library.',
          sort_order: 1,
          is_enabled: true,
          content_json: {
            show_all_media: true,
          },
        },
        {
          id: 1802,
          page_id: 18,
          section_type: 'portfolio_grid',
          title: 'Live Website & E-Commerce Screenshots',
          subtitle: 'Verified client interfaces designed and developed by ShivWebsIndia.',
          sort_order: 2,
          is_enabled: true,
          content_json: { max_items: 9 },
        },
        {
          id: 1803,
          page_id: 18,
          section_type: 'cta_banner',
          title: 'Want Visuals & UI Like This for Your Business Website?',
          subtitle: 'Let our UI/UX and PHP engineering team craft a high-converting digital identity for your brand.',
          sort_order: 3,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Start Your Project',
            primary_cta_url: '/contact-us',
            secondary_cta_text: 'WhatsApp +91-8667666429',
            secondary_cta_url: 'https://wa.me/918667666429',
          },
        },
      ],
    },
  ];

  return [homePage, aboutPage, ...servicePages, ...otherPages];
}

export const INITIAL_CMS_STATE: CMSDatabaseState = {
  settings: {
    brand_name: 'ShivWebsIndia',
    website_url: 'https://www.shivwebsindia.com/',
    contact_email: 'info@shivwebsindia.com',
    contact_phone: '+91-8667666429',
    secondary_phone: '+91-8595670136',
    whatsapp_number: '918667666429',
    location_focus: 'Ghaziabad and Delhi NCR',
    office_address: 'Vaishali, Sector 3, Ghaziabad, Uttar Pradesh, India',
    footer_credit: 'Designed & Developed by ShivWebsIndia',
    global_cta_text: 'Request a Quote',
    global_cta_url: '/contact-us',
    color_dark_blue: '#0A2540',
    color_orange: '#FF6A00',
    color_dark_red: '#8B1E1E',
    color_light_bg: '#F5F7FA',
    smtp_notifications_enabled: true,
    notification_recipient_email: 'shivwebsindia@gmail.com',
    show_verified_testimonials_only: true,
  },
  pages: buildAllPages(),
  revisions: [
    {
      id: 1,
      page_id: 1,
      version_number: 1,
      title: 'Home',
      slug: 'home',
      edited_by: 'info@shivwebsindia.com',
      change_summary: 'Initial production release with 7 structured agency sections and Schema.org metadata',
      created_at: '2026-10-10T08:30:00Z',
      sections_snapshot: buildAllPages()[0].sections,
      seo_snapshot: buildAllPages()[0].seo,
    },
  ],
  services: INITIAL_SERVICES,
  portfolio: INITIAL_PORTFOLIO,
  blog_posts: INITIAL_BLOG_POSTS,
  blog_categories: [
    { id: 1, name: 'Website Design', slug: 'website-design', description: 'UI/UX design, responsive layouts, and custom web portals' },
    { id: 2, name: 'Web Development', slug: 'web-development', description: 'PHP 8, MySQL, WordPress, and E-Commerce engineering' },
    { id: 3, name: 'SEO & Search', slug: 'seo-search', description: 'Technical SEO, Local SEO, and Google AI Overviews' },
    { id: 4, name: 'Digital Marketing', slug: 'digital-marketing', description: 'Google Ads PPC, Social Media Marketing, and Lead Generation' },
  ],
  blog_tags: [
    { id: 1, name: 'Website Design', slug: 'website-design' },
    { id: 2, name: 'Business Growth', slug: 'business-growth' },
    { id: 3, name: 'Ghaziabad', slug: 'ghaziabad' },
    { id: 4, name: 'Delhi NCR', slug: 'delhi-ncr' },
    { id: 5, name: 'Technical SEO', slug: 'technical-seo' },
    { id: 6, name: 'Lead Generation', slug: 'lead-generation' },
    { id: 7, name: 'WordPress', slug: 'wordpress' },
    { id: 8, name: 'E-Commerce', slug: 'ecommerce' },
  ],
  media: [
    {
      id: 1,
      original_name: 'shivwebsindia-agency-studio-hero.jpg',
      stored_filename: 'a94f82e1c3b74091d8e2_studio.jpg',
      file_path: heroStudioImg,
      mime_type: 'image/jpeg',
      file_extension: 'jpg',
      file_size_bytes: 412800,
      width: 1920,
      height: 1080,
      alt_text: 'ShivWebsIndia web design and digital marketing studio in Ghaziabad',
      used_in_pages: ['home', 'about-us', 'contact-us'],
      created_at: '2026-10-10T08:00:00Z',
    },
    {
      id: 2,
      original_name: 'vastraheritage-ecommerce-showcase.jpg',
      stored_filename: 'c72b19a04e853129f4a1_ecom.jpg',
      file_path: portfolioEcommerceImg,
      mime_type: 'image/jpeg',
      file_extension: 'jpg',
      file_size_bytes: 358400,
      width: 1600,
      height: 1200,
      alt_text: 'Laptop displaying luxury e-commerce website interface',
      used_in_pages: ['home', 'portfolio', 'ecommerce-website-development'],
      created_at: '2026-10-10T08:05:00Z',
    },
    {
      id: 3,
      original_name: 'ncr-industrial-b2b-portal.jpg',
      stored_filename: 'e41d90f32b671845a2c9_portal.jpg',
      file_path: portfolioCorporateImg,
      mime_type: 'image/jpeg',
      file_extension: 'jpg',
      file_size_bytes: 389120,
      width: 1600,
      height: 1200,
      alt_text: 'Ultrawide monitor displaying corporate web portal and analytics dashboard',
      used_in_pages: ['home', 'portfolio', 'website-design-and-development'],
      created_at: '2026-10-10T08:10:00Z',
    },
    {
      id: 4,
      original_name: 'local-seo-analytics-growth.jpg',
      stored_filename: 'f83a51c79d204638b1e7_seo.jpg',
      file_path: portfolioSeoImg,
      mime_type: 'image/jpeg',
      file_extension: 'jpg',
      file_size_bytes: 329600,
      width: 1600,
      height: 1200,
      alt_text: 'Tablet and strategy notebook showing organic search traffic and local map pack rankings',
      used_in_pages: ['home', 'portfolio', 'local-seo', 'blog'],
      created_at: '2026-10-10T08:15:00Z',
    },
  ],
  enquiries: [
    {
      id: 101,
      full_name: 'Rajesh Sharma',
      email: 'r.sharma@ncrprecisionvalves.in',
      phone: '+91-9811234567',
      company_name: 'NCR Precision Valves Pvt Ltd',
      service_interested: 'Website Design and Development',
      budget_range: '₹45,000 – ₹85,000',
      message: 'We need to redesign our industrial product catalog website in Sahibabad with PDF spec downloads and distributor inquiry forms.',
      source_page: '/website-design-and-development',
      status: 'qualified',
      admin_notes: 'Spoke on phone; scheduled technical scope walkthrough for Tuesday.',
      assigned_to_id: 2,
      assigned_to_name: 'Rohit Verma',
      ip_address: '103.21.124.88',
      created_at: '2026-10-08T11:20:00Z',
    },
    {
      id: 102,
      full_name: 'Dr. Neha Verma',
      email: 'clinic@vaishalidentalcare.com',
      phone: '+91-9873019283',
      company_name: 'Vaishali Orthodontic & Dental Centre',
      service_interested: 'Local SEO & Google Business Profile',
      budget_range: '₹15,000 – ₹30,000 / month',
      message: 'Looking for Local SEO and Google Business Profile management for our Sector 4 Vaishali and Indirapuram clinics.',
      source_page: '/local-seo',
      status: 'new',
      admin_notes: 'Audit GBP listing before discovery call.',
      assigned_to_id: 3,
      assigned_to_name: 'Priya Nair',
      ip_address: '49.36.142.19',
      created_at: '2026-10-09T16:45:00Z',
    },
    {
      id: 103,
      full_name: 'Vikram Singhania',
      email: 'vikram@delhiluxuryinteriors.com',
      phone: '+91-9910456789',
      company_name: 'Delhi Luxury Interiors Studio',
      service_interested: 'UI/UX Design & Brand Website',
      budget_range: '₹60,000 – ₹1,10,000',
      message: 'Need a modern luxury interior portfolio website with high-resolution project galleries and interactive quote calculator.',
      source_page: '/website-design-and-development',
      status: 'contacted',
      admin_notes: 'Shared initial Figma moodboard and wireframe structure.',
      assigned_to_id: 4,
      assigned_to_name: 'Anjali Gupta',
      ip_address: '122.161.48.92',
      created_at: '2026-10-10T14:15:00Z',
    },
    {
      id: 104,
      full_name: 'Sandeep Malhotra',
      email: 'sandeep@malhotralogisticsncr.in',
      phone: '+91-9818223344',
      company_name: 'Malhotra Logistics & Warehousing',
      service_interested: 'Corporate Website & Google Ads PPC',
      budget_range: '₹50,000 – ₹90,000',
      message: 'Looking for corporate website revamp and B2B lead generation campaign across Ghaziabad and Noida.',
      source_page: '/contact-us',
      status: 'proposal_sent',
      admin_notes: 'Quotation sent via WhatsApp and Email; follow up on Friday.',
      assigned_to_id: 5,
      assigned_to_name: 'Aman Khanna',
      ip_address: '103.48.91.14',
      created_at: '2026-10-11T09:30:00Z',
    },
  ],
  redirects: [
    {
      id: 1,
      source_path: '/seo-services.html',
      target_url: '/search-engine-optimization-seo',
      status_code: 301,
      hits_count: 42,
      is_active: true,
      created_at: '2026-10-01T10:00:00Z',
    },
    {
      id: 2,
      source_path: '/web-designing-company-ghaziabad.php',
      target_url: '/website-design-and-development',
      status_code: 301,
      hits_count: 89,
      is_active: true,
      created_at: '2026-10-01T10:05:00Z',
    },
    {
      id: 3,
      source_path: '/contact.php',
      target_url: '/contact-us',
      status_code: 301,
      hits_count: 31,
      is_active: true,
      created_at: '2026-10-01T10:10:00Z',
    },
  ],
  faqs: INITIAL_FAQS,
  menu_items: [
    { id: 1, menu_location: 'header_primary', parent_id: null, label: 'Home', url: '/', sort_order: 1, is_enabled: true },
    { id: 2, menu_location: 'header_primary', parent_id: null, label: 'About us', url: '/about-us', sort_order: 2, is_enabled: true },
    { id: 3, menu_location: 'header_primary', parent_id: null, label: 'Our Services', url: '/services', sort_order: 3, is_enabled: true },
    { id: 4, menu_location: 'header_primary', parent_id: null, label: 'Our Work', url: '/portfolio', sort_order: 4, is_enabled: true },
    { id: 5, menu_location: 'header_primary', parent_id: null, label: 'Blog', url: '/blog', sort_order: 5, is_enabled: true },
    { id: 6, menu_location: 'header_primary', parent_id: null, label: 'Contact Us', url: '/contact-us', sort_order: 6, is_enabled: true },
    { id: 9, menu_location: 'footer_services', parent_id: null, label: 'All Services Directory', url: '/services', sort_order: 1, is_enabled: true },
    { id: 10, menu_location: 'footer_services', parent_id: null, label: 'Website Designing & Development', url: '/website-design-and-development', sort_order: 2, is_enabled: true },
    { id: 11, menu_location: 'footer_services', parent_id: null, label: 'WordPress Development', url: '/wordpress-development', sort_order: 3, is_enabled: true },
    { id: 12, menu_location: 'footer_services', parent_id: null, label: 'E-commerce Website Development', url: '/ecommerce-website-development', sort_order: 4, is_enabled: true },
    { id: 13, menu_location: 'footer_services', parent_id: null, label: 'Search Engine Optimization (SEO)', url: '/search-engine-optimization-seo', sort_order: 5, is_enabled: true },
    { id: 14, menu_location: 'footer_services', parent_id: null, label: 'Social Media Marketing', url: '/social-media-marketing', sort_order: 6, is_enabled: true },
    { id: 15, menu_location: 'footer_services', parent_id: null, label: 'PPC (Pay-Per-Click) Services', url: '/google-ads-ppc', sort_order: 7, is_enabled: true },
    { id: 16, menu_location: 'footer_company', parent_id: null, label: 'Home', url: '/', sort_order: 1, is_enabled: true },
    { id: 17, menu_location: 'footer_company', parent_id: null, label: 'About Us', url: '/about-us', sort_order: 2, is_enabled: true },
    { id: 18, menu_location: 'footer_company', parent_id: null, label: 'Media Gallery (/media)', url: '/media', sort_order: 3, is_enabled: true },
    { id: 19, menu_location: 'footer_company', parent_id: null, label: 'Blog (/blog)', url: '/blog', sort_order: 4, is_enabled: true },
    { id: 20, menu_location: 'footer_company', parent_id: null, label: 'FAQs (/faqs)', url: '/faqs', sort_order: 5, is_enabled: true },
    { id: 21, menu_location: 'footer_company', parent_id: null, label: 'Contact Us', url: '/contact-us', sort_order: 6, is_enabled: true },
    { id: 22, menu_location: 'footer_company', parent_id: null, label: 'Privacy Policy', url: '/privacy-policy', sort_order: 7, is_enabled: true },
    { id: 23, menu_location: 'footer_company', parent_id: null, label: 'Term & condition', url: '/terms-and-conditions', sort_order: 8, is_enabled: true },
  ],
  team_members: [
    {
      id: 1,
      full_name: 'Shiv Kumar',
      designation: 'Founder & CEO · Lead Solutions Architect',
      department: 'Management',
      email: 'info@shivwebsindia.com',
      phone: '+91 8667666429',
      password_pin: 'Shiv@2026',
      role: 'admin',
      avatar_url: 'https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png',
      status: 'active',
      attendance_status: 'checked_in',
      last_check_in: '2026-10-11 09:30 AM',
      skills: ['Full-Stack Architecture', 'Technical SEO', 'Client Strategy', 'WordPress & PHP'],
      joined_at: '2018-04-01',
    },
    {
      id: 2,
      full_name: 'Rahul Sharma',
      designation: 'Senior Full-Stack & WordPress Developer',
      department: 'Web Development',
      email: 'dev@shivwebsindia.com',
      phone: '+91 9315843537',
      password_pin: 'Team@123',
      role: 'developer',
      avatar_url: '',
      status: 'active',
      attendance_status: 'checked_in',
      last_check_in: '2026-10-11 09:45 AM',
      skills: ['WordPress', 'Custom PHP 8', 'WooCommerce', 'ReactJS', 'Speed Optimization'],
      joined_at: '2022-06-15',
    },
    {
      id: 3,
      full_name: 'Priya Verma',
      designation: 'Senior SEO & Google Ads Specialist',
      department: 'SEO & Digital Marketing',
      email: 'seo@shivwebsindia.com',
      phone: '+91 9811456789',
      password_pin: 'Team@123',
      role: 'seo_specialist',
      avatar_url: '',
      status: 'active',
      attendance_status: 'checked_in',
      last_check_in: '2026-10-11 10:00 AM',
      skills: ['Local SEO (GMB)', 'Technical SEO', 'Google Ads PPC', 'Keyword Research'],
      joined_at: '2023-01-10',
    },
    {
      id: 4,
      full_name: 'Aman Gupta',
      designation: 'UI/UX Designer & Social Media Strategist',
      department: 'UI/UX Design',
      email: 'design@shivwebsindia.com',
      phone: '+91 9873214560',
      password_pin: 'Team@123',
      role: 'team_lead',
      avatar_url: '',
      status: 'active',
      attendance_status: 'checked_out',
      last_check_in: '2026-10-10 06:30 PM',
      skills: ['Figma UI/UX', 'Brand Identity', 'Social Media Creatives', 'Landing Pages'],
      joined_at: '2023-08-20',
    },
    {
      id: 5,
      full_name: 'Neha Singh',
      designation: 'Client Success & Business Development Executive',
      department: 'Sales & Support',
      email: 'sales@shivwebsindia.com',
      phone: '+91 8667666429',
      password_pin: 'Team@123',
      role: 'sales_exec',
      avatar_url: '',
      status: 'active',
      attendance_status: 'checked_in',
      last_check_in: '2026-10-11 09:50 AM',
      skills: ['Lead Qualification', 'Client Onboarding', 'Quotation & Proposals', 'CRM Follow-ups'],
      joined_at: '2024-02-01',
    },
  ],
  team_tasks: [
    {
      id: 101,
      title: 'Complete E-Commerce Checkout & Razorpay Integration',
      client_name: 'Apex Industrial Valves (Noida)',
      project_type: 'E-Commerce Website Development',
      assigned_to_id: 2,
      assigned_to_name: 'Rahul Sharma',
      priority: 'high',
      status: 'in_progress',
      due_date: '2026-10-14',
      notes: 'Configure GST invoice auto-generation and test mobile responsiveness.',
      created_at: '2026-10-09T10:00:00Z',
    },
    {
      id: 102,
      title: 'Local SEO & Google Business Profile Optimization (Ghaziabad)',
      client_name: 'Metro Care Multispeciality Clinic (Vaishali)',
      project_type: 'Local SEO & GMB Ranking',
      assigned_to_id: 3,
      assigned_to_name: 'Priya Verma',
      priority: 'high',
      status: 'in_progress',
      due_date: '2026-10-13',
      notes: 'Target top 3 map pack for "Multispeciality Clinic in Vaishali Ghaziabad".',
      created_at: '2026-10-09T11:30:00Z',
    },
    {
      id: 103,
      title: 'Design Interactive Hero Banner & Service Icons',
      client_name: 'Sunrise Global Academy (Indirapuram)',
      project_type: 'Corporate Website Redesign',
      assigned_to_id: 4,
      assigned_to_name: 'Aman Gupta',
      priority: 'medium',
      status: 'review',
      due_date: '2026-10-12',
      notes: 'Figma prototype shared with Shiv Sir for final approval.',
      created_at: '2026-10-08T14:20:00Z',
    },
    {
      id: 104,
      title: 'Send Website + SEO Proposal & Follow-up on WhatsApp',
      client_name: 'Rajesh Khanna ( Khanna Builders NCR )',
      project_type: 'Lead Follow-up & Proposal',
      assigned_to_id: 5,
      assigned_to_name: 'Neha Singh',
      priority: 'high',
      status: 'pending',
      due_date: '2026-10-11',
      notes: 'Client requested corporate website + 6 months Delhi NCR SEO package estimate.',
      created_at: '2026-10-10T09:15:00Z',
    },
    {
      id: 105,
      title: 'Core Web Vitals & PageSpeed 95+ Audit',
      client_name: 'ShivWebsIndia Official Portal',
      project_type: 'Technical SEO & Performance',
      assigned_to_id: 1,
      assigned_to_name: 'Shiv Kumar',
      priority: 'medium',
      status: 'completed',
      due_date: '2026-10-10',
      notes: 'All WebP assets and schema markup verified.',
      created_at: '2026-10-07T16:00:00Z',
    },
  ],
  team_attendance_logs: [
    {
      id: 301,
      member_id: 1,
      member_name: 'Shiv Kumar',
      designation: 'Founder & CEO',
      department: 'Management',
      date: '2026-10-11',
      status: 'present',
      check_in_time: '09:15 AM',
      check_out_time: '— (Active)',
      work_mode: 'Office (Vaishali)',
      notes: 'Reviewing enterprise PHP & SEO project milestones.',
    },
    {
      id: 302,
      member_id: 2,
      member_name: 'Rahul Sharma',
      designation: 'Senior Full-Stack & WordPress Developer',
      department: 'Web Development',
      date: '2026-10-11',
      status: 'present',
      check_in_time: '09:30 AM',
      check_out_time: '— (Active)',
      work_mode: 'Office (Vaishali)',
      notes: 'Working on Apex Industrial Valves e-commerce checkout.',
    },
    {
      id: 303,
      member_id: 3,
      member_name: 'Priya Verma',
      designation: 'Lead SEO & Digital Marketing Strategist',
      department: 'SEO & Digital Marketing',
      date: '2026-10-11',
      status: 'work_from_home',
      check_in_time: '09:45 AM',
      check_out_time: '— (Active)',
      work_mode: 'Work From Home',
      notes: 'Local SEO & GMB audit for Vaishali & Noida clients.',
    },
    {
      id: 304,
      member_id: 4,
      member_name: 'Aman Gupta',
      designation: 'Senior UI/UX & Brand Designer',
      department: 'UI/UX Design',
      date: '2026-10-11',
      status: 'on_leave',
      check_in_time: 'On Leave',
      check_out_time: '—',
      work_mode: 'Office (Vaishali)',
      notes: 'Approved Casual Leave — UI files handed over to Rahul Sharma.',
    },
    {
      id: 305,
      member_id: 5,
      member_name: 'Neha Singh',
      designation: 'Client Growth & Proposal Executive',
      department: 'Sales & Support',
      date: '2026-10-11',
      status: 'present',
      check_in_time: '09:50 AM',
      check_out_time: '— (Active)',
      work_mode: 'Office (Vaishali)',
      notes: 'Following up on WhatsApp & Gmail website enquiries.',
    },
  ],
  team_leave_requests: [
    {
      id: 401,
      member_id: 4,
      member_name: 'Aman Gupta',
      designation: 'Senior UI/UX & Brand Designer',
      department: 'UI/UX Design',
      leave_type: 'Casual Leave (CL)',
      start_date: '2026-10-11',
      end_date: '2026-10-12',
      total_days: 2,
      reason: 'Family function in Meerut — all Figma UI layouts uploaded to shared drive.',
      handover_to_name: 'Rahul Sharma',
      emergency_contact: '+91 8667666429',
      status: 'approved',
      admin_remark: 'Approved by Shiv Kumar (CEO). Design handover verified.',
      applied_at: '2026-10-09 04:30 PM',
    },
    {
      id: 402,
      member_id: 2,
      member_name: 'Rahul Sharma',
      designation: 'Senior Full-Stack & WordPress Developer',
      department: 'Web Development',
      leave_type: 'Earned / Paid Leave',
      start_date: '2026-10-19',
      end_date: '2026-10-21',
      total_days: 3,
      reason: 'Festival travel to hometown — all pending PHP & WordPress deployments will be completed before 18th Oct.',
      handover_to_name: 'Shiv Kumar',
      emergency_contact: '+91 9217179924',
      status: 'pending',
      admin_remark: 'Awaiting Admin review after E-Commerce sprint completion.',
      applied_at: '2026-10-11 10:15 AM',
    },
    {
      id: 403,
      member_id: 3,
      member_name: 'Priya Verma',
      designation: 'Lead SEO & Digital Marketing Strategist',
      department: 'SEO & Digital Marketing',
      leave_type: 'Half-Day Leave',
      start_date: '2026-10-14',
      end_date: '2026-10-14',
      total_days: 0.5,
      reason: 'Dental appointment in second half (post 2:30 PM). Morning GMB & Search Console reports will be delivered.',
      handover_to_name: 'Neha Singh',
      emergency_contact: '+91 8667666429',
      status: 'pending',
      admin_remark: '',
      applied_at: '2026-10-11 11:05 AM',
    },
  ],
  quote_catalog: [
    {
      id: 'biz-web',
      name: 'Professional Business Website (Dynamic CMS)',
      category: 'Web Development',
      basePrice: 18000,
      timelineWeeks: 2,
      deliverables: [
        'Up to 10 Mobile-Responsive Pages (HTML5 / CSS3 / PHP 8.x)',
        'Admin Panel CMS with Dynamic Page Builder & Lead Inbox',
        'On-Page SEO Setup, XML Sitemap & Schema.org JSON-LD',
        'WhatsApp Chat, AI Assistant & Direct Gmail Lead Alerts',
      ],
      is_active: true,
    },
    {
      id: 'wp-web',
      name: 'Custom WordPress Corporate Website',
      category: 'Web Development',
      basePrice: 15000,
      timelineWeeks: 2,
      deliverables: [
        'Custom Lightweight Theme & Elementor / Gutenberg Blocks',
        'Blog & Portfolio Management with Speed Optimization',
        'Security Firewall, SSL Setup & Automated Backups',
      ],
      is_active: true,
    },
    {
      id: 'ecom-web',
      name: 'E-Commerce Online Store (Razorpay / UPI + GST)',
      category: 'Web Development',
      basePrice: 32000,
      timelineWeeks: 4,
      deliverables: [
        'Product Catalog, Category Filters & Mobile Cart Drawer',
        'Razorpay / UPI / NetBanking / Card Payment Gateway',
        'Inventory Management, Order Tracking & GST Invoicing',
        'Google Shopping Product Schema Markup',
      ],
      is_active: true,
    },
    {
      id: 'local-seo',
      name: 'Local SEO & Google Business Profile (Monthly)',
      category: 'Digital Marketing',
      basePrice: 10000,
      timelineWeeks: 4,
      deliverables: [
        'Google Business Profile (Map Pack) Optimization in NCR',
        'Local Citations, NAP Consistency & Review Strategy',
        '15 High-Intent Local Keywords Tracking & Monthly Report',
      ],
      is_active: true,
    },
    {
      id: 'nat-seo',
      name: 'Complete Technical & Organic SEO Package (Monthly)',
      category: 'Digital Marketing',
      basePrice: 15000,
      timelineWeeks: 4,
      deliverables: [
        'Full Technical Website Audit & Core Web Vitals Fix',
        'On-Page Content Optimization & High-Authority Backlinks',
        '30 Target Keywords + Google Search Console Reporting',
      ],
      is_active: true,
    },
    {
      id: 'ppc-ads',
      name: 'Google Ads (PPC) Lead Generation Setup & Mgmt',
      category: 'Digital Marketing',
      basePrice: 12000,
      timelineWeeks: 1,
      deliverables: [
        'High-Intent Search Campaign & Negative Keyword Pruning',
        'Conversion Landing Page & Call/WhatsApp Tracking Setup',
        'Transparent ROAS & Cost-Per-Lead Optimization (Ad spend extra)',
      ],
      is_active: true,
    },
    {
      id: 'domain-host',
      name: 'Premium cPanel / Cloud Hosting + SSL + Maintenance (1 Yr)',
      category: 'Add-Ons',
      basePrice: 5500,
      timelineWeeks: 1,
      deliverables: [
        '99.9% Uptime NVMe SSD Hosting + Free SSL Certificate',
        'Business Emails (info@yourdomain.com) & Weekly Backups',
        '1 Year Technical Support & Security Updates',
      ],
      is_active: true,
    },
  ],
  brochure_config: {
    headline: 'ShivWebsIndia — Official Company Brochure (PDF)',
    subheadline: 'Website Designing, Web Development, SEO & Digital Marketing Agency in Ghaziabad & Delhi NCR',
    pdf_url: 'https://www.shivwebsindia.com/wp-content/uploads/2025/05/Company-Brochure-ShivWebsIndia.pdf',
    experience_years: '10+ Yrs',
    projects_delivered: '1500+',
    industries_served: '30+',
    client_retention: '95%',
    payment_terms:
      '50% Advance upon project initiation · 30% upon design & staging review · 20% prior to final live deployment. 100% source code and domain ownership remains with the client.',
    roadmap_summary:
      '01. Consultation & Discovery → 02. Sitemap & Planning → 03. UI Design & Development → 04. Speed & Security Testing → 05. Live cPanel/Cloud Launch.',
    authorized_signatory: 'Shiv Kumar — Founder & CEO, ShivWebsIndia',
  },
  saved_quotes: [
    {
      id: 501,
      reference_no: 'SWI-2026-4812',
      doc_type: 'Proposal',
      client_name: 'Rajesh Khanna',
      company_name: 'Khanna Builders & Developers NCR',
      client_email: 'rajesh@khannabuilders.in',
      client_phone: '+91 9811223344',
      client_city: 'Indirapuram, Ghaziabad',
      project_goal:
        'Design a luxury real estate project showcase portal with WhatsApp lead capture and Local SEO ranking in Ghaziabad & Noida.',
      selected_service_ids: ['biz-web', 'local-seo', 'domain-host'],
      discount_amount: 2500,
      include_gst: true,
      subtotal: 31000,
      gst_amount: 5580,
      grand_total: 36580,
      status: 'sent',
      created_at: '2026-10-10T11:20:00Z',
    },
    {
      id: 502,
      reference_no: 'SWI-2026-5904',
      doc_type: 'Quotation',
      client_name: 'Dr. Anjali Mehta',
      company_name: 'Metro Care Multispeciality Clinic',
      client_email: 'info@metrocareclinic.com',
      client_phone: '+91 9873445566',
      client_city: 'Vaishali Sector 4, Ghaziabad',
      project_goal:
        'Doctor appointment booking website + Google Business Profile Top 3 Map Pack SEO.',
      selected_service_ids: ['wp-web', 'local-seo'],
      discount_amount: 0,
      include_gst: true,
      subtotal: 25000,
      gst_amount: 4500,
      grand_total: 29500,
      status: 'approved',
      created_at: '2026-10-09T15:45:00Z',
    },
  ],
  audit_logs: [
    {
      id: 1,
      user_email: 'info@shivwebsindia.com',
      role: 'admin',
      action: 'Database Schema & Initial 18 Public Routes Provisioned',
      entity_type: 'system',
      entity_id: '001_schema',
      timestamp: '2026-10-10T08:00:00Z',
    },
  ],
};
