import React, { useState, useEffect } from 'react';
import {
  Code2,
  LayoutTemplate,
  ShoppingBag,
  TrendingUp,
  Search,
  MapPin,
  Share2,
  MousePointerClick,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
  Shield,
  AlertCircle,
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  Plus,
  Minus,
  Star,
  Globe,
  Server,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Users,
  Lock,
} from 'lucide-react';
import {
  CMSDatabaseState,
  CMSPage,
  PageSection,
  BlogPost,
  ASSETS,
} from '../data/initialCmsData';
import { FooterChatbotWidget } from './FooterChatbotWidget';
import {
  ShivKumarVisitingCardView,
  OFFICIAL_BROCHURE_PDF_URL,
} from './ShivKumarVisitingCardView';

interface PublicWebsiteViewProps {
  cms: CMSDatabaseState;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAdmin: () => void;
  onOpenTeam: () => void;
  onSubmitEnquiry: (enquiry: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    service_interested: string;
    budget_range: string;
    message: string;
    source_page: string;
    csrf_token: string;
    honeypot: string;
  }) => { success: boolean; error?: string };
  csrfToken: string;
  isPreviewMode?: boolean;
  onExitPreview?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  LayoutTemplate,
  ShoppingBag,
  TrendingUp,
  Search,
  MapPin,
  Share2,
  MousePointerClick,
  Globe,
  Server,
  Wrench,
};

const TRICOLOR_SCROLL_ITEMS = [
  { label: 'Web Development', url: '/website-design-and-development', active: true },
  { label: 'Web Design', url: '/website-design-and-development', active: false },
  { label: 'E-commerce', url: '/ecommerce-website-development', active: false },
  { label: 'Maintenance', url: '/website-design-and-development', active: false },
  { label: 'Optimization', url: '/search-engine-optimization-seo', active: false },
  { label: 'Security', url: '/wordpress-development', active: false },
  { label: 'Social Media', url: '/social-media-marketing', active: false },
  { label: 'PPC Ads', url: '/google-ads-ppc', active: false },
  { label: 'Content Marketing', url: '/digital-marketing', active: false },
  { label: 'Influencer Marketing', url: '/social-media-marketing', active: false },
  { label: 'Reputation Management', url: '/digital-marketing', active: false },
  { label: 'Marketing Automation', url: '/digital-marketing', active: false },
  { label: 'Local SEO', url: '/local-seo', active: false },
  { label: 'Technical SEO', url: '/search-engine-optimization-seo', active: false },
  { label: 'On-Page SEO', url: '/search-engine-optimization-seo', active: false },
  { label: 'Off-Page SEO', url: '/search-engine-optimization-seo', active: false },
];

const HERO_BANNERS = [
  {
    src: 'https://www.shivwebsindia.com/wp-content/uploads/2026/09/banner_shivwebsindia.webp',
    fallback: ASSETS.heroStudioImg,
    alt: 'ShivWebsIndia – Professional Website Design & Development in Delhi NCR',
    url: '/contact-us',
  },
  {
    src: 'https://www.shivwebsindia.com/wp-content/uploads/2026/09/Digital-Marketing-services_shivwebsindia.webp',
    fallback: ASSETS.portfolioSeoImg,
    alt: 'ShivWebsIndia – Digital Marketing & SEO Services in Ghaziabad & Delhi NCR',
    url: '/digital-marketing',
  },
];

const LIVE_CORE_SERVICES_9 = [
  {
    title: 'Website Development',
    description:
      'Website Development: Build fast, secure, responsive, and SEO-friendly websites tailored to your business goals and customer needs.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/Website-Development.png',
    slug: '/website-design-and-development',
  },
  {
    title: 'Website Designing',
    description:
      'Website Designing: Create modern, attractive, user-friendly website designs that enhance brand identity and improve visitor engagement.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/1.-Website-Design.png',
    slug: '/website-design-and-development',
  },
  {
    title: 'Website Maintenance',
    description:
      'Website Maintenance: Keep your website secure, updated, optimized, and running smoothly with regular maintenance and technical support.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/Website-Maintenance.png',
    slug: '/website-design-and-development',
  },
  {
    title: 'Ecommerce Website Developer',
    description:
      'E-commerce Website Development: Launch scalable online stores with Razorpay/UPI payment gateways, cart management, and product SEO.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Ecommerce-Website-Developer.webp',
    slug: '/ecommerce-website-development',
  },
  {
    title: 'WordPress Website Developer',
    description:
      'WordPress Website Development: Build fast, secure, and fully responsive WordPress websites with custom designs and SEO-friendly architecture.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/WordPress-Website-Developer.webp',
    slug: '/wordpress-development',
  },
  {
    title: 'Domain & Hosting Services',
    description:
      'Domain & Hosting Services: Secure reliable domain registration and high-performance web hosting with fast loading speeds, robust security, and 99.9% uptime.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Domain-Hosting-Services.webp',
    slug: '/contact-us',
  },
  {
    title: 'Search Engine Optimization (SEO)',
    description:
      'Search Engine Optimization (SEO): Improve Google rankings, increase organic traffic, and generate quality leads with data-driven SEO strategies.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/Search-Engine-Optimization-SEO.png',
    slug: '/search-engine-optimization-seo',
  },
  {
    title: 'Social Media Marketing',
    description:
      'Social Media Marketing: Grow your brand, engage customers, and increase sales through targeted social media marketing campaigns.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/Social-Media-Marketing.png',
    slug: '/social-media-marketing',
  },
  {
    title: 'PPC (Pay-Per-Click) Services',
    description:
      'PPC (Pay-Per-Click) Services: Maximize ROI with targeted Google Ads and PPC campaigns that drive qualified traffic and quality leads.',
    image: 'https://www.shivwebsindia.com/wp-content/uploads/2026/04/PPC-Pay-Per-Click-Services.png',
    slug: '/google-ads-ppc',
  },
];

const WHO_WE_WORK_WITH_LIST = [
  'Startups',
  'Small and Medium Businesses',
  'Local Service Providers',
  'E-commerce Stores',
  'Healthcare Clinics',
  'Educational Institutions',
  'Real Estate Companies',
  'Manufacturing Businesses',
  'Professional Consultants',
  'Corporate Organizations',
];

const WORKING_PROCESS_5 = [
  {
    no: '01',
    title: 'Consultation',
    desc: 'We discuss your business goals, website requirements and expectations.',
    icon: '💬',
  },
  {
    no: '02',
    title: 'Planning',
    desc: 'Creating project roadmap, sitemap and implementation strategy.',
    icon: '💡',
  },
  {
    no: '03',
    title: 'Designing & Development',
    desc: 'Designing modern UI and developing a fast responsive website.',
    icon: '💻',
  },
  {
    no: '04',
    title: 'Testing',
    desc: 'Checking functionality, security, speed and mobile responsiveness.',
    icon: '🧪',
  },
  {
    no: '05',
    title: 'Launch',
    desc: 'Final deployment and making your website live online.',
    icon: '🚀',
  },
];

const GOOGLE_REVIEWS = [
  {
    name: 'Chhaya Jain',
    time: '10 months ago',
    rating: 5,
    text: '“Professional team and timely delivery. The website is easy to use and looks excellent.”',
  },
  {
    name: 'Harry Hallewell',
    time: 'Verified Client',
    rating: 5,
    text: 'I was searching for a web designing company for SEO and SMO for my business in New Delhi. I found ShivWebsIndia, and I am very happy with their excellent web support and working intelligence.',
  },
  {
    name: 'ELE Times',
    time: 'Verified Client',
    rating: 5,
    text: 'Shivwebsindia is the Best website designing and development company in Delhi NCR. Totally convinced with their skills, services and team. Thank you so much!',
  },
  {
    name: 'Sharmistha Dutta',
    time: 'Verified Client',
    rating: 5,
    text: 'I have used their services and recommend them to everyone interested in web designing. The team members are really cooperative and customized the packages to fit my budget.',
  },
  {
    name: 'Devchandra Kumar',
    time: 'Verified Client',
    rating: 5,
    text: 'Nice experience with team ShivWebsIndia Founder—they are really amazing. Very thanks for this website, your team is very helpful.',
  },
];

const TECH_STACK_ITEMS = [
  { name: 'HTML5', color: '#E34F26', badge: 'HTML5' },
  { name: 'CSS3', color: '#1572B6', badge: 'CSS3' },
  { name: 'Bootstrap', color: '#7952B3', badge: 'BS5' },
  { name: 'PHP', color: '#777BB4', badge: 'PHP 8' },
  { name: 'Magento', color: '#EE672F', badge: 'M2' },
  { name: 'WordPress', color: '#21759B', badge: 'WP' },
  { name: 'Android', color: '#3DDC84', badge: 'APK' },
  { name: 'iOS', color: '#000000', badge: 'iOS' },
  { name: 'Laravel', color: '#FF2D20', badge: 'L11' },
  { name: 'ReactJS', color: '#61DAFB', badge: 'React' },
  { name: 'NodeJS', color: '#339933', badge: 'Node' },
];

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  cms,
  currentPath,
  onNavigate,
  onOpenAdmin,
  onOpenTeam,
  onSubmitEnquiry,
  csrfToken,
  isPreviewMode = false,
  onExitPreview,
}) => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState<boolean>(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState<boolean>(false);
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<string>('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [blogTagFilter, setBlogTagFilter] = useState<string>('all');
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('all');
  const [openBlogFaqIdx, setOpenBlogFaqIdx] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Auto-advance hero banner slider every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Contact form state
  const [formState, setFormState] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interested: 'Website Design',
    budget_range: '₹30,000 – ₹60,000',
    message: '',
    honeypot: '',
  });
  const [formFeedback, setFormFeedback] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
    submittedLead?: {
      full_name: string;
      email: string;
      phone: string;
      company_name: string;
      service_interested: string;
      budget_range: string;
      message: string;
      source_page: string;
    };
  }>({ type: 'idle', message: '' });
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState<boolean>(true);
  const [autoSendEmail, setAutoSendEmail] = useState<boolean>(false);

  // Resolve current route
  const cleanPath = currentPath.replace(/^\/+|\/+$/g, '');
  const isBlogPostRoute = cleanPath.startsWith('blog/') && cleanPath.length > 5;
  const blogSlug = isBlogPostRoute ? cleanPath.replace(/^blog\//, '') : '';
  const activeBlogPost: BlogPost | undefined = isBlogPostRoute
    ? cms.blog_posts.find((b) => b.slug === blogSlug && (b.status === 'published' || isPreviewMode))
    : undefined;

  const targetPageSlug = cleanPath === '' ? 'home' : cleanPath;
  const isShivKumarRoute =
    cleanPath === 'shivkumar' || cleanPath === 'our-team' || cleanPath === 'visiting-card';

  const activePage: CMSPage | undefined =
    !isBlogPostRoute && !isShivKumarRoute
      ? cms.pages.find(
          (p) => p.slug === targetPageSlug && (p.status === 'published' || isPreviewMode)
        )
      : undefined;

  const is404 = !activePage && !activeBlogPost && !isShivKumarRoute;

  const handleNavClick = (url: string) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setAboutDropdownOpen(false);
    onNavigate(url);
  };

  // Dynamic SEO Head & Schema.org JSON-LD Structured Data Engine for Every Page
  useEffect(() => {
    const seoTitle = activeBlogPost
      ? activeBlogPost.seo_title || `${activeBlogPost.title} | ${cms.settings.brand_name}`
      : isShivKumarRoute
      ? `Shiv Kumar – Founder & CEO Digital Visiting Card | ${cms.settings.brand_name}`
      : activePage?.seo?.seo_title ||
        `${cms.settings.brand_name} – Website Design & Digital Marketing Agency in Ghaziabad`;

    const metaDesc = activeBlogPost
      ? activeBlogPost.meta_description || activeBlogPost.excerpt
      : isShivKumarRoute
      ? 'Official Digital Visiting Card of Shiv Kumar, Founder & CEO at ShivWebsIndia — Website Design, WordPress, E-Commerce & SEO Experts in Ghaziabad & Delhi NCR.'
      : activePage?.seo?.meta_description ||
        'ShivWebsIndia is a premier website design, custom web development, SEO, and digital marketing agency in Vaishali, Ghaziabad & Delhi NCR.';

    const canonicalUrl = activeBlogPost
      ? activeBlogPost.canonical_url || `https://www.shivwebsindia.com/blog/${activeBlogPost.slug}`
      : isShivKumarRoute
      ? 'https://www.shivwebsindia.com/shivkumar/'
      : activePage?.seo?.canonical_url ||
        `https://www.shivwebsindia.com/${targetPageSlug === 'home' ? '' : targetPageSlug}`;

    const robotsDirective = activePage?.seo
      ? `${activePage.seo.robots_index ? 'index' : 'noindex'}, ${
          activePage.seo.robots_follow ? 'follow' : 'nofollow'
        }`
      : 'index, follow';

    document.title = seoTitle;

    const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', metaDesc);
    setMeta('meta[name="robots"]', 'name', 'robots', robotsDirective);
    if (activePage?.seo?.focus_keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', activePage.seo.focus_keywords);
    }
    setMeta(
      'meta[property="og:title"]',
      'property',
      'og:title',
      activePage?.seo?.og_title || seoTitle
    );
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      activePage?.seo?.og_description || metaDesc
    );
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Build Dynamic JSON-LD Schema Graph (ProfessionalService + WebPage/Service/FAQPage/BlogPosting + BreadcrumbList + Custom Override)
    let schemaPayload: any = null;
    if (activePage?.seo?.custom_schema_json && activePage.seo.custom_schema_json.trim() !== '') {
      try {
        schemaPayload = JSON.parse(activePage.seo.custom_schema_json);
      } catch {
        schemaPayload = null;
      }
    }

    if (!schemaPayload) {
      const orgNode = {
        '@type': ['ProfessionalService', 'LocalBusiness'],
        '@id': 'https://www.shivwebsindia.com/#organization',
        name: cms.settings.brand_name,
        url: 'https://www.shivwebsindia.com/',
        email: cms.settings.contact_email,
        telephone: cms.settings.contact_phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: cms.settings.office_address || 'Vaishali, 3F, Sector 3',
          addressLocality: 'Ghaziabad',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201010',
          addressCountry: 'IN',
        },
        areaServed: ['Ghaziabad', 'Delhi NCR', 'Noida', 'Greater Noida', 'Gurugram', 'India'],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '185',
        },
      };

      const breadcrumbNode = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.shivwebsindia.com/',
          },
          ...(targetPageSlug !== 'home'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name:
                    activePage?.seo?.breadcrumb_title ||
                    activePage?.title ||
                    activeBlogPost?.title ||
                    'Page',
                  item: canonicalUrl,
                },
              ]
            : []),
        ],
      };

      const pageSchemaType = activeBlogPost
        ? 'BlogPosting'
        : activePage?.seo?.schema_type || 'WebPage';

      const mainPageNode: Record<string, any> = {
        '@type': pageSchemaType,
        '@id': `${canonicalUrl}#webpage`,
        name: seoTitle,
        headline: seoTitle,
        description: metaDesc,
        url: canonicalUrl,
        provider: { '@id': 'https://www.shivwebsindia.com/#organization' },
      };

      const graphNodes: any[] = [orgNode, mainPageNode, breadcrumbNode];

      // Include FAQPage JSON-LD whenever FAQs exist on Home or FAQs page
      if (targetPageSlug === 'home' || targetPageSlug === 'faqs' || pageSchemaType === 'FAQPage') {
        const activeFaqs = cms.faqs.filter((f) => f.is_published).slice(0, 10);
        if (activeFaqs.length > 0) {
          graphNodes.push({
            '@type': 'FAQPage',
            mainEntity: activeFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          });
        }
      }

      schemaPayload = {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
      };
    }

    let scriptEl = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-jsonld-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaPayload, null, 2);
  }, [
    currentPath,
    activePage,
    activeBlogPost,
    isShivKumarRoute,
    targetPageSlug,
    cms.settings,
    cms.faqs,
  ]);

  const buildLeadWhatsAppUrl = (lead: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    service_interested: string;
    budget_range: string;
    message: string;
    source_page: string;
  }) => {
    const waNumber = (cms.settings.whatsapp_number || '918667666429').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `*New Project Lead – ShivWebsIndia*\n` +
        `----------------------------------\n` +
        `*Name:* ${lead.full_name}\n` +
        `*Phone/WhatsApp:* ${lead.phone}\n` +
        `*Email:* ${lead.email}\n` +
        `*Company:* ${lead.company_name || 'N/A'}\n` +
        `*Service Required:* ${lead.service_interested}\n` +
        `*Estimated Budget:* ${lead.budget_range}\n` +
        `*Source Page:* ${lead.source_page}\n` +
        `*Project Details:* ${lead.message}`
    );
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  const buildLeadMailtoUrl = (lead: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    service_interested: string;
    budget_range: string;
    message: string;
    source_page: string;
  }) => {
    const targetEmail = cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com';
    const subject = encodeURIComponent(
      `[New Website Lead] ${lead.service_interested} – ${lead.full_name} (${lead.phone})`
    );
    const body = encodeURIComponent(
      `New Website Lead Received on ShivWebsIndia:\n\n` +
        `Full Name: ${lead.full_name}\n` +
        `Phone / WhatsApp: ${lead.phone}\n` +
        `Email: ${lead.email}\n` +
        `Company: ${lead.company_name || 'N/A'}\n` +
        `Service Interested: ${lead.service_interested}\n` +
        `Estimated Budget: ${lead.budget_range}\n` +
        `Source Page: ${lead.source_page}\n\n` +
        `Project Requirement:\n${lead.message}`
    );
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage =
      formState.message.trim().length >= 10
        ? formState.message
        : `Enquiry for ${formState.service_interested} from ${formState.full_name} (${formState.phone})`;
    const leadData = {
      full_name: formState.full_name,
      email: formState.email,
      phone: formState.phone,
      company_name: formState.company_name,
      service_interested: formState.service_interested,
      budget_range: formState.budget_range,
      message: finalMessage,
      source_page: currentPath || '/',
    };

    const res = onSubmitEnquiry({
      ...leadData,
      csrf_token: csrfToken,
      honeypot: formState.honeypot,
    });
    if (res.success) {
      const targetEmail = cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com';
      const targetWa = cms.settings.contact_phone || '+91-8667666429';
      setFormFeedback({
        type: 'success',
        message: `Thank you ${leadData.full_name}! Your enquiry is saved in the Lead CRM and routed for Email (${targetEmail}) & WhatsApp (${targetWa}). Click the buttons below for instant dispatch:`,
        submittedLead: leadData,
      });

      if (autoSendEmail) {
        const mailLink = document.createElement('a');
        mailLink.href = buildLeadMailtoUrl(leadData);
        mailLink.click();
      }
      if (autoSendWhatsApp) {
        const waLink = document.createElement('a');
        waLink.href = buildLeadWhatsAppUrl(leadData);
        waLink.target = '_blank';
        waLink.rel = 'noopener noreferrer';
        waLink.click();
      }

      setFormState({
        full_name: '',
        email: '',
        phone: '',
        company_name: '',
        service_interested: 'Website Design',
        budget_range: '₹30,000 – ₹60,000',
        message: '',
        honeypot: '',
      });
    } else {
      setFormFeedback({
        type: 'error',
        message: res.error || 'Please check all required fields and try again.',
      });
    }
  };

  const publishedServicesList = cms.services
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  const publishedPortfolioList = cms.portfolio
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);

  const publishedFaqsList = cms.faqs
    .filter((f) => f.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);

  const faqCategories = [
    'all',
    ...Array.from(new Set(publishedFaqsList.map((f) => f.category).filter(Boolean))),
  ];

  const filteredFaqsList = publishedFaqsList.filter((f) => {
    const matchesCategory = faqCategoryFilter === 'all' || f.category === faqCategoryFilter;
    const q = faqSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const headerPrimaryMenus = cms.menu_items
    .filter((m) => m.menu_location === 'header_primary' && m.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  const footerServicesMenus = cms.menu_items
    .filter((m) => m.menu_location === 'footer_services' && m.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  const footerCompanyMenus = cms.menu_items
    .filter((m) => m.menu_location === 'footer_company' && m.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  const publishedBlogsList = cms.blog_posts.filter((b) => b.status === 'published');

  // Render the exact ShivWebsIndia.com Live Homepage Layout
  const renderLiveShivWebsHomePage = () => (
    <div>
      {/* 1. Indian Tricolor Infinite Scroll Service Marquee (.swi-scroll-menu) */}
      <div className="swi-scroll-menu">
        <div className="swi-scroll-track">
          {[...TRICOLOR_SCROLL_ITEMS, ...TRICOLOR_SCROLL_ITEMS].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleNavClick(item.url)}
              className={`swi-scroll-item ${item.active && idx < 16 ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hero Banner Slider (banner_shivwebsindia.webp & Digital-Marketing-services_shivwebsindia.webp) */}
      <section className="relative bg-[#0A2540] overflow-hidden border-b border-slate-200">
        <div className="relative w-full max-h-[540px] overflow-hidden">
          <div
            onClick={() => handleNavClick(HERO_BANNERS[activeSlide].url)}
            className="cursor-pointer block relative group"
          >
            <img
              src={HERO_BANNERS[activeSlide].src}
              alt={HERO_BANNERS[activeSlide].alt}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = HERO_BANNERS[activeSlide].fallback;
              }}
              className="w-full h-auto min-h-[220px] sm:min-h-[340px] md:max-h-[520px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>

          {/* Slider Prev/Next Controls */}
          <button
            type="button"
            onClick={() =>
              setActiveSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
            }
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#FF6A00] text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#FF6A00] text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === i ? 'w-7 bg-[#FF6A00]' : 'w-2.5 bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Centered SEO Headline Section (.hero from shivwebsindia.com) */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-white text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl md:text-[32px] font-bold leading-snug text-[#111111] transition-transform duration-300 hover:scale-[1.01]">
            HIRE SEO EXPERT IN DELHI, INDIA |{' '}
            <span className="text-[#b30000] hover:text-[#ff1a1a] transition-colors">
              EXPERT SEO, WEBSITE DESIGN AND DEVELOPMENT
            </span>{' '}
            SERVICES IN DELHI NCR!
          </h1>
          <div className="swi-hero-divider" />
          <p className="text-sm sm:text-base text-[#222222] max-w-3xl mx-auto mt-4 leading-relaxed">
            <strong>Shivwebsindia :-</strong> Trusted Website Designer in Delhi NCR offering Website
            Designing, SEO Services, Web Development, Digital Marketing, graphic design and Content
            marketing.
          </p>
        </div>
      </section>

      {/* 4. Maroon-to-Dark 4-Item Stats Card (.swi-stats-card) */}
      <section className="py-6 px-4 sm:px-6 bg-white">
        <div className="swi-stats-card">
          <div className="swi-stat-item">
            <div className="swi-stat-icon">👨‍💼</div>
            <div className="text-sm text-slate-200">
              <strong className="block text-lg sm:text-xl text-white font-bold">10+ Years</strong>
              Experience
            </div>
          </div>
          <div className="swi-stat-item">
            <div className="swi-stat-icon">📄</div>
            <div className="text-sm text-slate-200">
              <strong className="block text-lg sm:text-xl text-white font-bold">1500+</strong>
              Projects Completed
            </div>
          </div>
          <div className="swi-stat-item">
            <div className="swi-stat-icon">🏢</div>
            <div className="text-sm text-slate-200">
              <strong className="block text-lg sm:text-xl text-white font-bold">30+</strong>
              Industries Served
            </div>
          </div>
          <div className="swi-stat-item">
            <div className="swi-stat-icon">🤝</div>
            <div className="text-sm text-slate-200">
              <strong className="block text-lg sm:text-xl text-white font-bold">95%</strong>
              Client Retention
            </div>
          </div>
        </div>
      </section>

      {/* 5. About Section ("Grow Your Business with Shivwebsindia" / "What Does ShivWebsIndia Do?") */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Two vertical images side-by-side just like shivwebsindia.com */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
              <img
                src="https://www.shivwebsindia.com/wp-content/uploads/2026/04/about1.webp"
                alt="About ShivWebsIndia Team"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = ASSETS.heroStudioImg;
                }}
                className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 mt-6 sm:mt-10 group">
              <img
                src="https://www.shivwebsindia.com/wp-content/uploads/2026/04/about.webp"
                alt="ShivWebsIndia Web Development"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                }}
                className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#522c2a]/10 text-[#8B1E1E] text-xs font-bold uppercase tracking-wider mb-2">
              Grow Your Business with <span className="text-[#FF6A00]">Shivwebsindia</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A2540] tracking-tight">
              What Does ShivWebsIndia Do?
            </h2>
            <div className="mt-4 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
              <p>
                At <strong>ShivWebsIndia</strong>, we believe every business deserves a professional
                online presence that attracts customers and drives real growth. Based in{' '}
                <strong>Ghaziabad, India</strong>, we provide complete digital solutions that help
                startups, local businesses, entrepreneurs, and growing brands establish, improve,
                and expand their presence across the web.
              </p>
              <p>
                Shivwebsindia has been the leading Website Development, Website Designing, Digital
                Marketing Solutions Company helping companies to create and manage their online
                presence. We are specialized in providing digital marketing solutions to our Web
                Development or Web Design Clients. Digital Marketing Solutions like SEO, SMO, and
                other online marketing services are provided by Great Web Solutions. We provide
                services based on Web Development, WordPress CMS, and Website Design.
              </p>
              <p>
                We offer website development solutions in accordance with the specific requirements
                for Website Development, Website Designer, Digital Marketing and complete IT
                industry. We help them to achieve their potential by providing an online presence.
              </p>
            </div>
            <div className="mt-7">
              <button
                type="button"
                onClick={() => handleNavClick('/about-us')}
                className="px-7 py-3 bg-[#0A2540] hover:bg-[#FF6A00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Core Services — 3x3 Image Card Grid ("SERVICES ( WHAT WE DO? )") */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F5F7FA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FF6A00]">
              Our Core Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
              SERVICES ( WHAT WE DO? )
            </h2>
            <div className="swi-hero-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              ...LIVE_CORE_SERVICES_9,
              ...publishedServicesList
                .filter(
                  (s) =>
                    !LIVE_CORE_SERVICES_9.some(
                      (core) => core.slug.replace(/^\/+|\/+$/g, '') === s.slug.replace(/^\/+|\/+$/g, '')
                    )
                )
                .map((s) => ({
                  title: s.title,
                  slug: `/${s.slug.replace(/^\/+/, '')}`,
                  image: s.featured_image_url || ASSETS.portfolioCorporateImg,
                  description: s.short_description,
                })),
            ].map((svc, idx) => (
              <div
                key={idx}
                onClick={() => handleNavClick(svc.slug)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#FF6A00]/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer agency-card-hover text-center"
              >
                <div>
                  <div className="w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          idx % 2 === 0 ? ASSETS.portfolioCorporateImg : ASSETS.portfolioEcommerceImg;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{svc.description}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex justify-center">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A2540] group-hover:bg-[#FF6A00] text-white text-xs font-semibold transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Learn more</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. "Who We Work With" + Quick Requirement Form & "Are you ready to Discuss" Image */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E1E]">
                Industries &amp; Clients
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                Who We Work With
              </h2>
              <p className="text-slate-600 mt-3 leading-relaxed text-sm sm:text-base">
                We don’t just build websites or run marketing campaigns. We work to understand your
                business, identify opportunities for growth, and create digital solutions that
                generate measurable results. Whether your objective is increasing website traffic,
                generating qualified leads, improving local visibility, or building a stronger
                brand, every strategy is tailored to support your business goals.
              </p>
              <p className="text-sm font-semibold text-[#0A2540] mt-4">
                Our services are designed for businesses of all sizes, including:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WHO_WE_WORK_WITH_LIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F5F7FA] border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#0A2540]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src="https://www.shivwebsindia.com/wp-content/uploads/2026/07/WordPress-Website-Development.webp"
                  alt="WordPress & Web Development Services"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                  }}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Inline WPForms-style Quick Lead Form + "Are-you-ready-to-Discuss.webp" */}
          <div className="bg-gradient-to-r from-[#0A2540] to-[#13385e] rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Send Us Your Requirement
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 mb-6">
                Get an instant callback and custom quotation from our Ghaziabad experts (leads sent
                directly to {cms.settings.notification_recipient_email}).
              </p>

              {formFeedback.type !== 'idle' && (
                <div
                  className={`mb-5 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    formFeedback.type === 'success'
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100'
                      : 'bg-red-500/20 border-red-400/50 text-red-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6A00]" />
                  <span>{formFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <input
                  type="text"
                  required
                  placeholder="Enter full name *"
                  value={formState.full_name}
                  onChange={(e) => setFormState({ ...formState, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#0A2540] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Enter mobile no. *"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#0A2540] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
                <input
                  type="email"
                  required
                  placeholder="Enter email id *"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#0A2540] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
                <select
                  value={formState.service_interested}
                  onChange={(e) =>
                    setFormState({ ...formState, service_interested: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#0A2540] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                >
                  <option value="Website Design">Website Design</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Digital Marketing Services">Digital Marketing Services</option>
                  <option value="Search engine optimization Services">
                    Search engine optimization Services
                  </option>
                  <option value="Social media marketing Services">
                    Social media marketing Services
                  </option>
                  <option value="Google Adwords Services">Google Adwords Services</option>
                  <option value="Website Redesign">Website Redesign</option>
                  <option value="Website maintenance">Website maintenance</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-sm rounded-xl btn-hover-lift shadow-lg cursor-pointer"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                <img
                  src="https://www.shivwebsindia.com/wp-content/uploads/2026/04/Are-you-ready-to-Discuss.webp"
                  alt="Are you ready to Discuss your project with ShivWebsIndia"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ASSETS.heroStudioImg;
                  }}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Businesses Choose ShivWebsIndia Banner */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-[#522c2a] via-[#2b1817] to-[#0A2540] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Why Businesses Choose ShivWebsIndia
          </h2>
          <p className="text-slate-200 mt-4 leading-relaxed text-sm sm:text-base">
            Businesses choose ShivWebsIndia because we focus on quality, transparency, and
            long-term relationships. We combine modern website development, SEO best practices,
            performance optimization, and digital marketing strategies to help our clients improve
            visibility, attract the right audience, and achieve sustainable business growth.
          </p>
          <p className="text-slate-300 mt-3 leading-relaxed text-sm sm:text-base">
            Whether you need a brand-new website, better Google rankings, effective advertising
            campaigns, or complete digital marketing support, ShivWebsIndia is committed to helping
            your business grow with reliable, practical, and results-focused solutions.
          </p>
        </div>
      </section>

      {/* 8B. CEO Shiv Kumar Digital Visiting Card (/shivkumar/) & Official Company Brochure PDF */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: CEO Shiv Kumar Digital Visiting Card (https://www.shivwebsindia.com/shivkumar/) */}
            <div
              className="lg:col-span-7 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6 border border-white/15"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #0f4c81 100%)',
              }}
            >
              <div className="shrink-0 text-center">
                <img
                  src="https://www.shivwebsindia.com/wp-content/uploads/2025/09/shiv-kumar.jpeg"
                  alt="Shiv Kumar - Chief Executive Officer"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg mx-auto"
                />
                <span className="inline-block mt-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Chief Executive Officer
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Leadership &amp; Official Digital Card
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Shiv Kumar — CEO, ShivWebsIndia
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  Connect directly with our Founder &amp; CEO, save official contact details (.vcf),
                  view Indian Overseas Bank / UPI QR payment details, or share our digital visiting
                  card on WhatsApp.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavClick('/shivkumar')}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold flex items-center gap-2 shadow-lg btn-hover-lift cursor-pointer"
                  >
                    <span>🪪 Open CEO Visiting Card (/shivkumar)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="https://wa.me/918667666429"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <span>📲 WhatsApp CEO</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Card: Official Company Brochure PDF (Company-Brochure-ShivWebsIndia.pdf) */}
            <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#522c2a] via-[#2b1817] to-[#0A2540] text-white shadow-xl flex flex-col justify-between border border-white/15">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-[#FF9933]">
                    Official Agency Document
                  </span>
                  <span className="text-xs font-mono text-slate-300">PDF Brochure</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white">
                  Company Brochure — ShivWebsIndia
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  View or download our official corporate brochure PDF covering Website Design,
                  WordPress, E-Commerce, SEO, SMO, PPC packages, and Delhi NCR portfolio.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-3">
                <a
                  href={OFFICIAL_BROCHURE_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold text-center shadow-md transition-colors"
                >
                  👁 View Brochure PDF
                </a>
                <a
                  href={OFFICIAL_BROCHURE_PDF_URL}
                  download="Company-Brochure-ShivWebsIndia.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-bold text-center shadow-md transition-colors"
                >
                  ⬇ Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Recent Projects — 3x3 Hover-Overlay Grid (.swi-portfolio-area) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#0d6efd] font-bold tracking-[2px] text-xs sm:text-sm uppercase">
              OUR PORTFOLIO
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#222222] mt-2">
              Recent Projects
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Explore some of our latest website design and development projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedPortfolioList.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleNavClick('/contact-us')}
                className="swi-project-card group"
              >
                <img
                  src={proj.image_url}
                  alt={proj.image_alt}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                  }}
                />
                <div className="swi-project-overlay">
                  <h3 className="text-white font-display text-xl font-bold mb-1">{proj.title}</h3>
                  <p className="text-slate-200 text-xs sm:text-sm mb-4">{proj.client_industry}</p>
                  <span className="inline-block px-5 py-2 rounded-full bg-[#0d6efd] group-hover:bg-[#FF6A00] text-white text-xs font-semibold w-max transition-colors">
                    View Project
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Our Working Process — 5-Step Dark Navy Workflow (.work-process) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#00d4ff] text-xs sm:text-sm font-semibold tracking-[2px] uppercase">
              OUR PROCESS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              Our Working Process
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Our Professional Website Design &amp; Development Workflow
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-4">
            {WORKING_PROCESS_5.map((st, idx) => (
              <React.Fragment key={st.no}>
                <div className="flex-1 bg-white text-[#1e293b] rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#007cf0] flex items-center justify-center text-2xl text-white shadow-md group-hover:scale-110 transition-transform">
                    {st.icon}
                  </div>
                  <span className="block text-[#00d4ff] text-2xl font-extrabold mb-1">{st.no}</span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1e293b] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
                {idx < WORKING_PROCESS_5.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-[#00d4ff] text-2xl font-bold swi-process-arrow px-1">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Google Reviews Widget Section (4.9 ★ Based on 67 reviews) */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#F5F7FA] border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center font-display font-extrabold text-xl shrink-0">
                  SWI
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#0A2540]">
                    Shivwebsindia : Freelance Website Designing in Ghaziabad | Digital Marketing
                    Services in Vaishali
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-amber-500 text-base">4.9</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">Based on 67 reviews · powered by Google</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleNavClick('/contact-us')}
                className="px-5 py-2.5 rounded-full bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold cursor-pointer shrink-0"
              >
                Review Us / Get Quote
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {GOOGLE_REVIEWS.map((rev, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-xs text-[#0A2540]">{rev.name}</span>
                      <span className="text-[11px] text-slate-400">{rev.time}</span>
                    </div>
                    <div className="flex items-center text-amber-400 mb-2">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12. Technology Showcase Slider ("Technology / Our Latest Technologies") */}
      <section className="py-14 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h6 className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">Technology</h6>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0A2540] mt-1">
            Our Latest Technologies
          </h3>
        </div>
        <div className="swi-tech-slider overflow-hidden">
          <div className="swi-tech-track">
            {[...TECH_STACK_ITEMS, ...TECH_STACK_ITEMS].map((tech, idx) => (
              <div
                key={idx}
                className="w-36 sm:w-40 bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all shrink-0"
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.badge}
                </div>
                <h4 className="font-display text-sm font-bold text-[#0A2540] mt-2.5">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Dynamic FAQ Section ("FAQ / Find Out Answers Here" — Category Tabs + Live Search + Bilingual FAQs) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">
                DYNAMIC FAQ KNOWLEDGEBASE
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                Find Out Answers Here
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Browse {publishedFaqsList.length} verified answers on Website Design, SEO, Pricing &amp; Delivery
              </p>
            </div>

            {/* Live Search + View All FAQs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g. SEO, Cost, Time)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0A2540] focus:outline-none focus:border-[#0d6efd]"
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleNavClick('/faqs')}
                className="px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                All FAQs Page →
              </button>
            </div>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFaqCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  faqCategoryFilter === cat
                    ? 'bg-[#FF6A00] text-white shadow-sm'
                    : 'bg-slate-100 text-[#0A2540] hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? `All Topics (${publishedFaqsList.length})` : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md sticky top-28 bg-[#F5F7FA]">
                <img
                  src="https://www.shivwebsindia.com/wp-content/uploads/2026/06/Best-FAQ_shivwebsindia.png"
                  alt="Frequently Asked Questions ShivWebsIndia"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioSeoImg;
                  }}
                  className="w-full h-auto object-cover"
                />
                <div className="p-5 border-t border-slate-200">
                  <p className="font-display text-sm font-extrabold text-[#0A2540]">
                    Still have a custom question?
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Talk directly with our Ghaziabad web &amp; SEO specialists for a free consultation.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('/contact-us')}
                      className="px-4 py-2 rounded-lg bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold cursor-pointer"
                    >
                      Ask a Question
                    </button>
                    <a
                      href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                      className="px-4 py-2 rounded-lg bg-[#0A2540] text-white text-xs font-bold"
                    >
                      Call {cms.settings.contact_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {filteredFaqsList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                  <p className="font-display text-base font-bold text-[#0A2540]">
                    No matching FAQs found for &ldquo;{faqSearchQuery}&rdquo;
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try clearing your search filter or ask our team directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqSearchQuery('');
                      setFaqCategoryFilter('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                  >
                    Reset FAQ Filters
                  </button>
                </div>
              ) : (
                filteredFaqsList.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-xl border transition-all ${
                        isOpen
                          ? 'bg-[#F5F7FA] border-[#0d6efd] shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                      >
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-200/80 text-[#0A2540] text-[10px] font-bold uppercase tracking-wider mb-1">
                            {faq.category}
                          </span>
                          <span className="block font-display text-sm sm:text-base font-bold text-[#0A2540]">
                            {faq.question}
                          </span>
                        </div>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen ? 'bg-[#FF6A00] text-white' : 'bg-[#0A2540] text-white'
                          }`}
                        >
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-200/70">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 14. Our Latest Posts — Bilingual Blog Masonry Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">
                Blog &amp; Updates
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                Our Latest Posts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleNavClick('/blog')}
              className="px-5 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              View All Posts →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {publishedBlogsList.slice(0, 6).map((post) => (
              <article
                key={post.id}
                onClick={() => handleNavClick(`/blog/${post.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={post.featured_image_url}
                      alt={post.featured_image_alt}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioSeoImg;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span className="text-[#0d6efd] font-medium">{post.category}</span>
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A2540] group-hover:text-[#FF6A00]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderContactFormBlock = (title?: string, subtitle?: string) => (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-wider text-[#8B1E1E] uppercase">
            Direct Consultation · Ghaziabad &amp; Delhi NCR
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-2 tracking-tight leading-tight">
            {title || 'Request a Custom Website or Digital Marketing Proposal'}
          </h2>
          <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
            {subtitle ||
              'Connect directly with our web development and search marketing specialists in Vaishali, Sector 3, Ghaziabad for a clear project roadmap and transparent quote.'}
          </p>

          <div className="mt-8 space-y-5 pt-6 border-t border-slate-200">
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-[#0A2540] group-hover:bg-[#FF6A00] transition-colors text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540]">Office Address</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Vaishali, 3F, Sector 3, Ghaziabad, (201010)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Serving {cms.settings.location_focus}
                </p>
              </div>
            </div>

            <a
              href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0A2540] group-hover:bg-[#FF6A00] transition-colors text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors">
                  Phone &amp; WhatsApp
                </h3>
                <p className="text-sm text-slate-600 mt-0.5 tabular-nums">
                  {cms.settings.contact_phone} | {cms.settings.secondary_phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${cms.settings.contact_email}`}
              className="flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0A2540] group-hover:bg-[#FF6A00] transition-colors text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors">
                  Official Email
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">{cms.settings.contact_email}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#F5F7FA] border border-slate-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="pb-5 mb-6 border-b border-slate-200">
            <h3 className="font-display text-xl font-bold text-[#0A2540]">
              Tell Us About Your Project
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Fill out the details below and our team will respond within 2 business hours.
            </p>
          </div>

          {formFeedback.type !== 'idle' && (
            <div
              className={`mb-6 p-4 rounded-xl border text-sm space-y-3 ${
                formFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>{formFeedback.message}</div>
              </div>
              {formFeedback.type === 'success' && formFeedback.submittedLead && (
                <div className="flex flex-wrap items-center gap-2.5 pt-2 pl-8">
                  <a
                    href={buildLeadWhatsAppUrl(formFeedback.submittedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>💬 Send Lead on WhatsApp ({cms.settings.contact_phone})</span>
                  </a>
                  <a
                    href={buildLeadMailtoUrl(formFeedback.submittedLead)}
                    className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>
                      Send Lead on Email (
                      {cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com'})
                    </span>
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <input
              type="text"
              name="website_url_honeypot"
              value={formState.honeypot}
              onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formState.full_name}
                  onChange={(e) => setFormState({ ...formState, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91-98XXXXXXXX"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="Your company name"
                  value={formState.company_name}
                  onChange={(e) => setFormState({ ...formState, company_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Service Required *
                </label>
                <select
                  value={formState.service_interested}
                  onChange={(e) =>
                    setFormState({ ...formState, service_interested: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                >
                  {cms.services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Complete Website + SEO Package">
                    Complete Website + SEO Package
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                  Estimated Budget
                </label>
                <select
                  value={formState.budget_range}
                  onChange={(e) => setFormState({ ...formState, budget_range: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="₹15,000 – ₹30,000">₹15,000 – ₹30,000</option>
                  <option value="₹30,000 – ₹60,000">₹30,000 – ₹60,000</option>
                  <option value="₹60,000 – ₹1,20,000">₹60,000 – ₹1,20,000</option>
                  <option value="₹1,20,000+ Custom Portal">₹1,20,000+ Custom Portal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Project Details &amp; Goals *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your website requirements, target audience, or marketing goals..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-[#0A2540] transition-colors focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            {/* Instant Delivery Channel Checkboxes (WhatsApp + Email) */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-[#0A2540]">
                Instant Lead Delivery Channels:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-emerald-700">
                  <input
                    type="checkbox"
                    checked={autoSendWhatsApp}
                    onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                    className="rounded accent-[#25D366]"
                  />
                  <span>💬 Instant WhatsApp ({cms.settings.contact_phone})</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-[#0A2540]">
                  <input
                    type="checkbox"
                    checked={autoSendEmail}
                    onChange={(e) => setAutoSendEmail(e.target.checked)}
                    className="rounded accent-[#FF6A00]"
                  />
                  <span>
                    ✉️ Direct Email ({cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com'})
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-md shadow-[#FF6A00]/20 cursor-pointer whitespace-nowrap"
              >
                Send Project Enquiry (CRM + WhatsApp / Email)
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

  const renderSection = (section: PageSection) => {
    const payload = section.content_json || {};

    switch (section.section_type) {
      case 'hero_banner':
        return (
          <section
            key={section.id}
            className="bg-[#0A2540] text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs font-semibold tracking-wider uppercase text-[#FF6A00]">
                  {payload.kicker || cms.settings.location_focus}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3 tracking-tight leading-[1.15]">
                  {payload.headline || section.title}
                </h1>
                <p className="text-base sm:text-lg text-slate-200 mt-5 max-w-2xl leading-relaxed">
                  {payload.subheadline || section.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleNavClick(payload.primary_cta_url || '/contact-us')}
                    className="px-7 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>{payload.primary_cta_text || cms.settings.global_cta_text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5">
                <img
                  src={payload.hero_image || ASSETS.heroStudioImg}
                  alt={section.title}
                  className="w-full h-full object-cover rounded-2xl border border-white/15"
                />
              </div>
            </div>
          </section>
        );

      case 'service_cards': {
        const allServicesCards = [
          ...publishedServicesList.map((s) => ({
            title: s.title,
            slug: `/${s.slug.replace(/^\/+/, '')}`,
            image: s.featured_image_url || ASSETS.portfolioCorporateImg,
            description: s.short_description,
            category: s.category || 'Web Development',
            startingPrice: s.starting_price_inr || 'Custom Quote',
            deliverables: Array.isArray(s.deliverables) ? s.deliverables.slice(0, 3) : [],
          })),
          ...LIVE_CORE_SERVICES_9.filter(
            (core) =>
              !publishedServicesList.some(
                (s) =>
                  s.slug.replace(/^\/+|\/+$/g, '') === core.slug.replace(/^\/+|\/+$/g, '')
              )
          ).map((core) => ({
            title: core.title,
            slug: core.slug,
            image: core.image,
            description: core.description,
            category: 'Web & Digital Solutions',
            startingPrice: 'Request Quote',
            deliverables: [],
          })),
        ];

        const svcCategories = [
          'all',
          ...Array.from(new Set(allServicesCards.map((c) => c.category))),
        ];
        const filteredServices =
          serviceCategoryFilter === 'all'
            ? allServicesCards
            : allServicesCards.filter((c) => c.category === serviceCategoryFilter);

        return (
          <section
            key={section.id}
            className="py-16 lg:py-20 px-4 sm:px-6 bg-[#F5F7FA] border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">
                  COMPLETE SERVICES DIRECTORY
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                  {section.title}
                </h2>
                <p className="text-slate-600 mt-2">{section.subtitle}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {svcCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setServiceCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      serviceCategoryFilter === cat
                        ? 'bg-[#FF6A00] text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-[#0A2540] hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'all' ? `All Services (${allServicesCards.length})` : cat}
                  </button>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredServices.map((svc, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavClick(svc.slug)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <img
                          src={svc.image}
                          alt={svc.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A2540]/90 text-white text-[10px] font-bold uppercase tracking-wider">
                          {svc.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl font-bold text-[#0A2540] group-hover:text-[#FF6A00]">
                          {svc.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {svc.description}
                        </p>
                        {svc.deliverables.length > 0 && (
                          <ul className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                            {svc.deliverables.map((del, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A00] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{del}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Starting From
                        </span>
                        <span className="text-xs font-extrabold text-[#0A2540]">
                          {svc.startingPrice}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A2540] group-hover:bg-[#FF6A00] text-white text-xs font-semibold transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'features_grid': {
        const items = Array.isArray(payload.items) ? payload.items : [];
        return (
          <section
            key={section.id}
            className="py-16 lg:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540]">
                {section.title}
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">{section.subtitle}</p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-7 rounded-2xl bg-[#F5F7FA] border border-slate-200 agency-card-hover"
                  >
                    <p className="font-mono text-xs font-bold text-[#FF6A00]">
                      {item.number || `0${idx + 1}`}
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#0A2540] mt-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'portfolio_grid': {
        const categories = [
          'all',
          ...Array.from(new Set(publishedPortfolioList.map((p) => p.service_category))),
        ];
        const filtered =
          portfolioCategoryFilter === 'all'
            ? publishedPortfolioList
            : publishedPortfolioList.filter((p) => p.service_category === portfolioCategoryFilter);

        return (
          <section
            key={section.id}
            className="py-16 lg:py-20 px-4 sm:px-6 bg-[#f8fafc] border-b border-slate-200"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <span className="text-[#0d6efd] font-bold tracking-[2px] text-xs uppercase">
                    OUR PORTFOLIO
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 mt-2 max-w-2xl">{section.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPortfolioCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        portfolioCategoryFilter === cat
                          ? 'bg-[#0A2540] text-white shadow-sm'
                          : 'text-slate-700 hover:text-[#0A2540]'
                      }`}
                    >
                      {cat === 'all' ? 'All Projects (9)' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavClick('/contact-us')}
                    className="swi-project-card group"
                  >
                    <img
                      src={item.image_url}
                      alt={item.image_alt}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                      }}
                    />
                    <div className="swi-project-overlay">
                      <h3 className="text-white font-display text-xl font-bold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-200 text-xs sm:text-sm mb-3">
                        {item.client_industry}
                      </p>
                      <span className="inline-block px-5 py-2 rounded-full bg-[#0d6efd] group-hover:bg-[#FF6A00] text-white text-xs font-semibold w-max">
                        Request Similar Project
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'process_workflow':
        return (
          <section key={section.id} className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0f172a] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#00d4ff] text-xs font-semibold tracking-[2px] uppercase">
                  OUR PROCESS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
                  Our Working Process
                </h2>
              </div>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-4">
                {WORKING_PROCESS_5.map((st, idx) => (
                  <React.Fragment key={st.no}>
                    <div className="flex-1 bg-white text-[#1e293b] rounded-2xl p-6 text-center shadow-lg">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#007cf0] flex items-center justify-center text-xl text-white">
                        {st.icon}
                      </div>
                      <span className="block text-[#00d4ff] text-2xl font-extrabold mb-1">
                        {st.no}
                      </span>
                      <h3 className="font-display text-base font-bold text-[#1e293b] mb-2">
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                    </div>
                    {idx < WORKING_PROCESS_5.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center text-[#00d4ff] text-2xl font-bold">
                        →
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        );

      case 'text_with_image':
        return (
          <section
            key={section.id}
            className="py-16 lg:py-24 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B1E1E]">
                  {section.subtitle}
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-2 tracking-tight">
                  {section.title}
                </h1>
                <div
                  className="text-base text-slate-600 mt-4 leading-relaxed space-y-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2540] [&_h2]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0A2540] [&_h3]:mt-4 [&_a]:text-[#FF6A00] [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF6A00] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:py-2 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-[#0A2540] [&_th]:text-white [&_th]:p-2.5 [&_th]:text-left [&_th]:text-xs [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5 [&_td]:text-xs [&_img]:rounded-xl [&_img]:my-4"
                  dangerouslySetInnerHTML={{ __html: payload.body || '' }}
                />

                {Array.isArray(payload.highlights) && payload.highlights.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-[#0A2540] mb-3">What Is Included:</h3>
                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {payload.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => handleNavClick('/contact-us')}
                    className="px-7 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-md cursor-pointer"
                  >
                    Request Service Proposal
                  </button>
                  <button
                    onClick={() => handleNavClick('/portfolio')}
                    className="px-7 py-3.5 border border-slate-300 hover:border-[#0A2540] text-[#0A2540] font-semibold text-sm rounded-xl btn-hover-lift cursor-pointer"
                  >
                    View Recent Projects
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group">
                  <img
                    src={payload.image_url || ASSETS.portfolioCorporateImg}
                    alt={payload.image_alt || section.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioCorporateImg;
                    }}
                    className="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      case 'verified_statistics': {
        return (
          <section key={section.id} className="py-10 px-4 sm:px-6 bg-white">
            <div className="swi-stats-card">
              <div className="swi-stat-item">
                <div className="swi-stat-icon">👨‍💼</div>
                <div className="text-sm text-slate-200">
                  <strong className="block text-xl text-white font-bold">10+ Years</strong>
                  Experience
                </div>
              </div>
              <div className="swi-stat-item">
                <div className="swi-stat-icon">📄</div>
                <div className="text-sm text-slate-200">
                  <strong className="block text-xl text-white font-bold">1500+</strong>
                  Projects Completed
                </div>
              </div>
              <div className="swi-stat-item">
                <div className="swi-stat-icon">🏢</div>
                <div className="text-sm text-slate-200">
                  <strong className="block text-xl text-white font-bold">30+</strong>
                  Industries Served
                </div>
              </div>
              <div className="swi-stat-item">
                <div className="swi-stat-icon">🤝</div>
                <div className="text-sm text-slate-200">
                  <strong className="block text-xl text-white font-bold">95%</strong>
                  Client Retention
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'pricing_table': {
        const plans = Array.isArray(payload.plans) ? payload.plans : [];
        return (
          <section
            key={section.id}
            className="py-16 lg:py-24 px-4 sm:px-6 bg-[#F5F7FA] border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
                {section.title}
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">{section.subtitle}</p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {plans.map((plan: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-7 border flex flex-col justify-between agency-card-hover ${
                      i === 1
                        ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xl'
                        : 'bg-white text-[#0A2540] border-slate-200'
                    }`}
                  >
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          i === 1 ? 'text-[#FF6A00]' : 'text-[#8B1E1E]'
                        }`}
                      >
                        {plan.audience}
                      </p>
                      <h3 className="font-display text-xl font-bold mt-1">{plan.name}</h3>
                      <p className="font-mono text-2xl font-bold mt-4 tabular-nums">
                        {plan.price_label}
                      </p>
                      <ul className="mt-6 space-y-3 text-sm">
                        {Array.isArray(plan.features) &&
                          plan.features.map((f: string, j: number) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <CheckCircle2
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  i === 1 ? 'text-[#FF6A00]' : 'text-[#0A2540]'
                                }`}
                              />
                              <span className={i === 1 ? 'text-slate-200' : 'text-slate-600'}>
                                {f}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleNavClick('/contact-us')}
                      className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold text-xs btn-hover-lift cursor-pointer ${
                        i === 1
                          ? 'bg-[#FF6A00] hover:bg-[#e55f00] text-white'
                          : 'bg-[#0A2540] hover:bg-[#FF6A00] text-white'
                      }`}
                    >
                      Request Detailed Estimate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'related_services': {
        const excludeSlug = payload.exclude_slug || '';
        const related = cms.services
          .filter((s) => s.status === 'published' && s.slug !== excludeSlug)
          .slice(0, 4);

        return (
          <section
            key={section.id}
            className="py-16 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A2540]">
                {section.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{section.subtitle}</p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => handleNavClick(`/${svc.slug}`)}
                    className="group p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-[#FF6A00]/60 flex flex-col justify-between agency-card-hover cursor-pointer"
                  >
                    <div>
                      <p className="text-xs text-[#8B1E1E] font-medium">{svc.category}</p>
                      <h3 className="font-display text-base font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors mt-1">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {svc.short_description}
                      </p>
                    </div>
                    <div className="mt-5 text-xs font-semibold text-[#0A2540] group-hover:text-[#FF6A00] flex items-center gap-1">
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'blog_listing': {
        const managedCategories = (cms.blog_categories || []).map((c) => c.name);
        const postCategories = publishedBlogsList.map((b) => b.category).filter(Boolean);
        const categories = [
          'all',
          ...Array.from(new Set([...managedCategories, ...postCategories])),
        ];

        const managedTags = (cms.blog_tags || []).map((t) => t.name);
        const postTags = publishedBlogsList.flatMap((b) => b.tags || []);
        const allTags = ['all', ...Array.from(new Set([...managedTags, ...postTags]))];

        const filteredPosts = publishedBlogsList.filter((b) => {
          const matchesCat = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;
          const matchesTag =
            blogTagFilter === 'all' || (Array.isArray(b.tags) && b.tags.includes(blogTagFilter));
          const q = blogSearchQuery.trim().toLowerCase();
          const matchesQuery =
            !q ||
            b.title.toLowerCase().includes(q) ||
            b.excerpt.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            (b.tags || []).some((t) => t.toLowerCase().includes(q));
          return matchesCat && matchesTag && matchesQuery;
        });

        return (
          <section
            key={section.id}
            className="py-16 lg:py-24 px-4 sm:px-6 bg-[#F5F7FA] border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8B1E1E]">
                    Insights &amp; Technical Guides
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-2">
                    {section.title}
                  </h1>
                  <p className="text-slate-600 mt-2 max-w-2xl">{section.subtitle}</p>
                </div>

                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={blogSearchQuery}
                    onChange={(e) => setBlogSearchQuery(e.target.value)}
                    placeholder="Search articles, topics..."
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#0A2540] focus:outline-none focus:border-[#FF6A00]"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBlogCategoryFilter(cat)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          blogCategoryFilter === cat
                            ? 'bg-[#0A2540] text-white shadow-sm'
                            : 'text-slate-700 hover:text-[#0A2540]'
                        }`}
                      >
                        {cat === 'all' ? `All (${publishedBlogsList.length})` : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tag Filter Pills */}
              {allTags.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Topics / Tags:
                  </span>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setBlogTagFilter(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        blogTagFilter === tag
                          ? 'bg-[#FF6A00] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0A2540]'
                      }`}
                    >
                      {tag === 'all' ? 'All Tags' : `#${tag}`}
                    </button>
                  ))}
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center">
                  <p className="font-display text-lg font-bold text-[#0A2540]">
                    No blog articles match your selected filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBlogCategoryFilter('all');
                      setBlogTagFilter('all');
                      setBlogSearchQuery('');
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#0A2540] text-white text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => handleNavClick(`/blog/${post.slug}`)}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between agency-card-hover cursor-pointer"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-200 relative">
                          <img
                            src={post.featured_image_url}
                            alt={post.featured_image_alt || post.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioSeoImg;
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A2540]/90 text-white text-[11px] font-bold">
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="tabular-nums font-medium text-[#8B1E1E]">
                              📅 {new Date(post.published_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span>·</span>
                            <span className="tabular-nums">{post.reading_time_minutes} min read</span>
                          </div>
                          <h2 className="font-display text-lg font-bold text-[#0A2540] group-hover:text-[#FF6A00] transition-colors mt-2 leading-snug">
                            {post.title}
                          </h2>
                          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                          {Array.isArray(post.tags) && post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 3).map((t, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <span className="text-slate-500 truncate max-w-[140px]">
                          {post.author_name}
                        </span>
                        <span className="font-bold text-[#0A2540] group-hover:text-[#FF6A00] flex items-center gap-1">
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      }

      case 'faq_accordion': {
        return (
          <section
            key={section.id}
            className="py-16 lg:py-24 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">
                    DYNAMIC FAQ KNOWLEDGEBASE
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                    {section.title || 'Find Out Answers Here'}
                  </h2>
                  {section.subtitle && (
                    <p className="text-sm text-slate-600 mt-1">{section.subtitle}</p>
                  )}
                </div>

                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                    placeholder="Search FAQs by keyword..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0A2540] focus:outline-none focus:border-[#0d6efd]"
                  />
                  {faqSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setFaqSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-8">
                {faqCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFaqCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      faqCategoryFilter === cat
                        ? 'bg-[#FF6A00] text-white shadow-sm'
                        : 'bg-slate-100 text-[#0A2540] hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? `All Topics (${publishedFaqsList.length})` : cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredFaqsList.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                    <p className="font-display text-base font-bold text-[#0A2540]">
                      No FAQs match your search criteria.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFaqSearchQuery('');
                        setFaqCategoryFilter('all');
                      }}
                      className="mt-3 px-4 py-2 rounded-lg bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                    >
                      Show All FAQs
                    </button>
                  </div>
                ) : (
                  filteredFaqsList.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`rounded-xl border transition-colors ${
                          isOpen
                            ? 'bg-[#F5F7FA] border-[#0d6efd]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                        >
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-200/80 text-[#0A2540] text-[10px] font-bold uppercase tracking-wider mb-1">
                              {faq.category}
                            </span>
                            <h3 className="font-display text-base font-bold text-[#0A2540]">
                              {faq.question}
                            </h3>
                          </div>
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                              isOpen ? 'bg-[#FF6A00] text-white' : 'bg-[#0A2540] text-white'
                            }`}
                          >
                            {isOpen ? (
                              <Minus className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        );
      }

      case 'heading_richtext':
        return (
          <section
            key={section.id}
            className="py-16 lg:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-5xl mx-auto">
              {section.title && (
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540]">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-sm text-slate-500 mt-2 pb-6 border-b border-slate-200">
                  {section.subtitle}
                </p>
              )}
              <div
                className="mt-8 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#0A2540] [&_h1]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2540] [&_h2]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0A2540] [&_h3]:mt-6 [&_h4]:font-display [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A2540] [&_h4]:mt-4 [&_a]:text-[#FF6A00] [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF6A00] [&_blockquote]:pl-4 [&_blockquote]:py-2.5 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:rounded-r-xl [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:rounded-xl [&_table]:overflow-hidden [&_th]:bg-[#0A2540] [&_th]:text-white [&_th]:p-3.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-200 [&_td]:p-3.5 [&_td]:text-xs sm:[&_td]:text-sm [&_tr:nth-child(even)]:bg-slate-50 [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-slate-200 [&_hr]:my-6 [&_hr]:border-slate-200"
                dangerouslySetInnerHTML={{ __html: payload.body_html || '' }}
              />
            </div>
          </section>
        );

      case 'contact_form':
        return (
          <React.Fragment key={section.id}>
            {renderContactFormBlock(section.title, section.subtitle)}
          </React.Fragment>
        );

      case 'image_gallery': {
        const mediaItems = cms.media || [];
        const mimeCategories = [
          'all',
          ...Array.from(new Set(mediaItems.map((m) => m.mime_type))),
        ];
        const filteredMedia = mediaItems.filter((asset) => {
          const matchesType =
            mediaTypeFilter === 'all' || asset.mime_type === mediaTypeFilter;
          const q = mediaSearchQuery.trim().toLowerCase();
          const matchesQuery =
            q === '' ||
            asset.original_name.toLowerCase().includes(q) ||
            asset.file_name.toLowerCase().includes(q) ||
            (asset.alt_text || '').toLowerCase().includes(q);
          return matchesType && matchesQuery;
        });

        return (
          <section
            key={section.id}
            className="py-16 lg:py-20 px-4 sm:px-6 bg-white border-b border-slate-200/80"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A00]">
                    CMS MEDIA LIBRARY &amp; VISUAL ASSETS
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] mt-1">
                    {section.title || 'Media & Brand Visual Gallery'}
                  </h2>
                  {section.subtitle && (
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">{section.subtitle}</p>
                  )}
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    placeholder="Search media by filename or alt text..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-[#0A2540] focus:outline-none focus:border-[#0d6efd]"
                  />
                  {mediaSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMediaSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  {mimeCategories.map((mime) => (
                    <button
                      key={mime}
                      type="button"
                      onClick={() => setMediaTypeFilter(mime)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        mediaTypeFilter === mime
                          ? 'bg-[#FF6A00] text-white shadow-sm'
                          : 'bg-slate-100 text-[#0A2540] hover:bg-slate-200'
                      }`}
                    >
                      {mime === 'all' ? `All Formats (${mediaItems.length})` : mime}
                    </button>
                  ))}
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-[#0A2540]">
                  Showing {filteredMedia.length} of {mediaItems.length} Verified Assets
                </span>
              </div>

              {filteredMedia.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                  <p className="font-display text-base font-bold text-[#0A2540]">
                    No media assets match your search filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaSearchQuery('');
                      setMediaTypeFilter('all');
                    }}
                    className="mt-3 px-4 py-2 rounded-lg bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                  >
                    Show All Media Assets
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMedia.map((asset) => (
                    <div
                      key={asset.id}
                      className="group bg-[#F5F7FA] border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-200">
                          <img
                            src={asset.file_path}
                            alt={asset.alt_text || asset.original_name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                ASSETS.portfolioCorporateImg;
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#0A2540]/10 text-[#0A2540] text-[10px] font-mono font-bold uppercase">
                            {asset.mime_type} · {asset.width}×{asset.height}
                          </span>
                          <h3 className="font-display text-sm font-bold text-[#0A2540] mt-2 truncate">
                            {asset.original_name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {asset.alt_text}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t border-slate-200/70 bg-white flex items-center justify-between text-[11px] text-slate-500">
                        <span>{(asset.file_size_bytes / 1024).toFixed(0)} KB</span>
                        <a
                          href={asset.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#FF6A00] hover:underline"
                        >
                          Open Full Asset ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      }

      case 'cta_banner':
        return (
          <section key={section.id} className="py-16 lg:py-20 px-4 sm:px-6 bg-[#0A2540] text-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                  Start Your Project With ShivWebsIndia
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {section.title}
                </h2>
                <p className="text-slate-300 mt-2 text-sm sm:text-base">{section.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <button
                  onClick={() => handleNavClick(payload.primary_cta_url || '/contact-us')}
                  className="px-7 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-lg cursor-pointer"
                >
                  {payload.primary_cta_text || 'Request a Quote'}
                </button>
                <a
                  href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm rounded-xl btn-hover-lift"
                >
                  Call {cms.settings.contact_phone}
                </a>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A2540]">
      {isPreviewMode && (
        <div className="bg-[#8B1E1E] text-white px-6 py-2.5 text-xs flex items-center justify-between">
          <span>
            <strong>Live Preview Mode:</strong> Viewing page from Admin CMS.
          </span>
          {onExitPreview && (
            <button
              onClick={onExitPreview}
              className="underline font-semibold cursor-pointer whitespace-nowrap"
            >
              Return to Admin Dashboard
            </button>
          )}
        </div>
      )}

      {/* ====================================================================
          1. EXACT SHIVWEBSINDIA.COM TOP MAROON BAR (#top_head : #522c2a)
         ==================================================================== */}
      <div className="bg-[#522c2a] text-white text-xs py-2.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#FF9933] transition-colors font-semibold tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{cms.settings.contact_phone}</span>
            </a>
            <a
              href={`mailto:${cms.settings.contact_email}`}
              className="flex items-center gap-1.5 hover:text-[#FF9933] transition-colors font-semibold"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{cms.settings.contact_email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleNavClick('/shivkumar')}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-[#06b6d4] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Shiv Kumar CEO Digital Visiting Card"
            >
              <span>🪪 CEO Visiting Card</span>
            </button>
            <a
              href={OFFICIAL_BROCHURE_PDF_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex px-2.5 py-1 rounded bg-[#FF6A00] hover:bg-[#e55f00] text-white text-[11px] font-bold items-center gap-1 transition-colors"
              title="Download Official Company Brochure PDF"
            >
              <span>📄 Brochure PDF</span>
            </a>
            <div className="hidden sm:flex items-center gap-2.5 text-white/90 pl-2 border-l border-white/15">
              <a
                href="https://www.facebook.com/shivwebindia"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors text-[11px] font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://www.instagram.com/shivwebsindia"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-colors text-[11px] font-bold"
                title="Instagram"
              >
                in
              </a>
              <a
                href="https://twitter.com/shivwebsindia"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-colors text-[11px] font-bold"
                title="X / Twitter"
              >
                X
              </a>
              <a
                href="https://www.youtube.com/c/shivwebsindia"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition-colors text-[11px] font-bold"
                title="YouTube"
              >
                ▶
              </a>
            </div>
            <div className="flex items-center gap-1.5 pl-1">
              <button
                type="button"
                onClick={() => handleNavClick('/download-sql')}
                className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Direct One-Click Download: Standalone MySQL Database (.sql) for phpMyAdmin"
              >
                <span>⬇ MySQL (.sql)</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('/download-zip')}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Direct One-Click Download: All Pure PHP Website Files + MySQL (.zip)"
              >
                <span>⬇ PHP Files (.zip)</span>
              </button>
              <button
                type="button"
                onClick={onOpenTeam}
                className="px-2.5 py-1 rounded bg-[#0096e8] hover:bg-[#0284c7] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Password-Protected Team Management Portal (/team)"
              >
                <Users className="w-3 h-3" />
                <span>Team Panel</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-2.5 py-1 rounded bg-black/30 hover:bg-[#FF6A00] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Password-Protected Admin Dashboard (/admin)"
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. EXACT SHIVWEBSINDIA.COM WHITE MAIN HEADER (#h-style-3 .main-header)
         ==================================================================== */}
      <header className="bg-white text-[#111111] sticky top-0 z-40 shadow-[0_4px_18px_rgba(0,0,0,0.07)] border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 h-20 sm:h-[92px]">
          {/* Official Logo (logo2026.png) */}
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-left cursor-pointer shrink-0 py-1"
          >
            <img
              src="https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png"
              alt="Shivwebsindia"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
              className="h-14 sm:h-[74px] w-auto object-contain"
            />
          </button>

          {/* Dynamic Desktop Navigation Menu driven by cms.menu_items (header_primary) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-extrabold uppercase tracking-wide text-[#111111]">
            {headerPrimaryMenus.map((item) => {
              const lowerLabel = item.label.toLowerCase();
              const isAboutMenu =
                item.url === '/about-us' || lowerLabel.includes('about');
              const isServicesMenu =
                lowerLabel.includes('service') ||
                (item.url === '/website-design-and-development' && lowerLabel.includes('service'));

              if (isAboutMenu) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.url)}
                      className={`flex items-center gap-1 hover:text-[#DD0B0B] transition-colors cursor-pointer py-2 uppercase ${
                        cleanPath === 'about-us' || isShivKumarRoute
                          ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]'
                          : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {aboutDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1 w-60 z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-xs font-bold text-[#0A2540] normal-case">
                          <button
                            type="button"
                            onClick={() => handleNavClick('/about-us')}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B] cursor-pointer"
                          >
                            About ShivWebsIndia
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavClick('/shivkumar')}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B] cursor-pointer"
                          >
                            Our Team / CEO Visiting Card (/shivkumar)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavClick('/faqs')}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B] cursor-pointer"
                          >
                            Frequently Asked Questions (FAQs)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNavClick('/media')}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#DD0B0B] cursor-pointer"
                          >
                            Media &amp; Visual Gallery (/media)
                          </button>
                          <a
                            href={OFFICIAL_BROCHURE_PDF_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[#FF6A00] hover:text-[#DD0B0B]"
                          >
                            📄 Official Company Brochure (PDF)
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (isServicesMenu) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick('/services')}
                      className={`flex items-center gap-1 hover:text-[#DD0B0B] transition-colors cursor-pointer py-2 uppercase ${
                        cleanPath === 'services' ||
                        publishedServicesList.some((s) => s.slug === cleanPath)
                          ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]'
                          : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-full pt-1 w-[540px] z-50">
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-2 gap-6 normal-case">
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#DD0B0B] pb-2 mb-2.5 border-b border-slate-200">
                              Website Design &amp; Development
                            </p>
                            <ul className="space-y-2.5 text-xs font-bold text-[#0A2540]">
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/website-design-and-development')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Website Design and Development
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/wordpress-development')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  WordPress Development
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/ecommerce-website-development')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  E-Commerce Website Development
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/website-design-and-development')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Static &amp; Dynamic Website Service
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/website-design-and-development')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Website Maintenance Services
                                </button>
                              </li>
                              <li className="pt-1 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/services')}
                                  className="text-[#FF6A00] hover:text-[#DD0B0B] text-left cursor-pointer font-extrabold"
                                >
                                  View All Services Directory →
                                </button>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0d6efd] pb-2 mb-2.5 border-b border-slate-200">
                              Digital Marketing
                            </p>
                            <ul className="space-y-2.5 text-xs font-bold text-[#0A2540]">
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/digital-marketing')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Digital Marketing Services
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/search-engine-optimization-seo')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Search Engine Optimization (SEO)
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/local-seo')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Local SEO &amp; GMB Ranking
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/social-media-marketing')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Social Media Marketing (SMM)
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleNavClick('/google-ads-ppc')}
                                  className="hover:text-[#DD0B0B] text-left cursor-pointer"
                                >
                                  Google Ads (PPC) Services
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const itemClean = item.url.replace(/^\/+|\/+$/g, '');
              const isActive =
                (item.url === '/' && currentPath === '/') ||
                (itemClean !== '' &&
                  (cleanPath === itemClean ||
                    (itemClean === 'blog' && cleanPath.startsWith('blog'))));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.url)}
                  className={`hover:text-[#DD0B0B] transition-colors cursor-pointer py-2 uppercase ${
                    isActive ? 'text-[#DD0B0B] border-t-2 border-[#DD0B0B]' : ''
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('/contact-us')}
              className="hidden sm:inline-flex px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#FF6A00] hover:bg-[#DD0B0B] rounded-full btn-hover-lift shadow-md cursor-pointer"
            >
              Request A Quote
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#0A2540] text-white cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dynamic Mobile Responsive Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-3 shadow-xl">
            <div className="flex flex-col space-y-2 text-sm font-bold text-[#0A2540]">
              {headerPrimaryMenus.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.url)}
                  className="text-left py-1.5 hover:text-[#DD0B0B] cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('/shivkumar')}
                className="text-left py-1.5 text-[#0d6efd] hover:text-[#DD0B0B] cursor-pointer"
              >
                🪪 Shiv Kumar — CEO Visiting Card (/shivkumar)
              </button>
              <a
                href={OFFICIAL_BROCHURE_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="text-left py-1.5 text-[#FF6A00] hover:text-[#DD0B0B]"
              >
                📄 Official Company Brochure (PDF)
              </a>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTeam();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0096e8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Panel (PIN Protected)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-extrabold uppercase text-[#DD0B0B] mb-2">Our Services</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {publishedServicesList.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleNavClick(`/${svc.slug}`)}
                    className="text-left text-xs font-semibold text-slate-700 hover:text-[#DD0B0B] py-1 cursor-pointer"
                  >
                    • {svc.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          3. MAIN CONTENT VIEWPORT
         ==================================================================== */}
      <main className="flex-1">
        {is404 ? (
          <section className="py-24 px-6 text-center max-w-3xl mx-auto">
            <p className="font-mono text-sm font-bold text-[#8B1E1E]">HTTP 404 · PAGE NOT FOUND</p>
            <h1 className="font-display text-4xl font-extrabold text-[#0A2540] mt-3">
              Page Not Found
            </h1>
            <p className="text-slate-600 mt-4 leading-relaxed">
              The page <code className="font-mono text-[#8B1E1E]">{currentPath}</code> could not be
              found.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleNavClick('/')}
                className="px-6 py-3 bg-[#FF6A00] text-white font-semibold text-sm rounded-xl btn-hover-lift cursor-pointer"
              >
                Return to Home Page
              </button>
              <button
                onClick={() => handleNavClick('/contact-us')}
                className="px-6 py-3 bg-[#0A2540] text-white font-semibold text-sm rounded-xl btn-hover-lift cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </section>
        ) : activeBlogPost ? (
          <article className="py-16 px-4 sm:px-6 bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
                <button
                  onClick={() => handleNavClick('/blog')}
                  className="text-[#0A2540] hover:text-[#FF6A00] font-semibold cursor-pointer"
                >
                  Blog
                </button>
                <span>/</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E] font-bold">
                  {activeBlogPost.category}
                </span>
                <span>·</span>
                <span className="tabular-nums">
                  {activeBlogPost.reading_time_minutes} min read
                </span>
                {activeBlogPost.status !== 'published' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                    {activeBlogPost.status} Preview
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight leading-tight">
                {activeBlogPost.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span>
                    By <strong className="text-[#0A2540]">{activeBlogPost.author_name}</strong>
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">
                    Published{' '}
                    {new Date(activeBlogPost.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => handleNavClick('/blog')}
                  className="font-semibold text-[#0A2540] hover:text-[#FF6A00] cursor-pointer"
                >
                  ← Back to All Articles
                </button>
              </div>

              {activeBlogPost.featured_image_url && (
                <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 shadow-sm">
                  <img
                    src={activeBlogPost.featured_image_url}
                    alt={activeBlogPost.featured_image_alt || activeBlogPost.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioSeoImg;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Rich Article Body with Headings, Paragraphs, Images, Tables, Lists & Links */}
              <div
                className="space-y-4 text-slate-700 leading-relaxed text-base [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2540] [&_h2]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0A2540] [&_h3]:mt-6 [&_a]:text-[#FF6A00] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF6A00] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:py-2 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:rounded-xl [&_table]:overflow-hidden [&_th]:bg-[#0A2540] [&_th]:text-white [&_th]:p-3.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-200 [&_td]:p-3.5 [&_td]:text-xs sm:[&_td]:text-sm [&_tr:nth-child(even)]:bg-slate-50 [&_img]:rounded-2xl [&_img]:my-6 [&_img]:border [&_img]:border-slate-200"
                dangerouslySetInnerHTML={{ __html: activeBlogPost.content }}
              />

              {/* Article-Specific FAQ Accordion */}
              {Array.isArray(activeBlogPost.faqs) && activeBlogPost.faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
                    Article FAQs
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-[#0A2540] mt-1 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {activeBlogPost.faqs.map((faq, idx) => {
                      const isOpen = openBlogFaqIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border transition-colors ${
                            isOpen
                              ? 'bg-[#F5F7FA] border-[#0d6efd]'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenBlogFaqIdx(isOpen ? null : idx)}
                            className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                          >
                            <h3 className="font-display text-sm sm:text-base font-bold text-[#0A2540]">
                              {faq.question}
                            </h3>
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                                isOpen ? 'bg-[#FF6A00]' : 'bg-[#0A2540]'
                              }`}
                            >
                              {isOpen ? (
                                <Minus className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5" />
                              )}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-2 text-sm text-slate-600 border-t border-slate-200/60 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags & Share Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#0A2540]">Tags:</span>
                  {(activeBlogPost.tags || []).map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setBlogTagFilter(tag);
                        handleNavClick('/blog');
                      }}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#FF6A00] hover:text-white text-slate-700 font-semibold transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleNavClick('/blog')}
                  className="font-semibold text-[#0A2540] hover:text-[#FF6A00] cursor-pointer"
                >
                  ← Back to All Articles
                </button>
              </div>

              {/* Related Articles Section */}
              {publishedBlogsList.filter((b) => b.id !== activeBlogPost.id).length > 0 && (
                <div className="mt-14 pt-10 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E1E]">
                        Keep Reading
                      </span>
                      <h2 className="font-display text-2xl font-extrabold text-[#0A2540] mt-1">
                        Related Articles &amp; Guides
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/blog')}
                      className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                    >
                      View All Articles →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {publishedBlogsList
                      .filter((b) => b.id !== activeBlogPost.id)
                      .sort((a, b) =>
                        (a.category === activeBlogPost.category ? -1 : 1) -
                        (b.category === activeBlogPost.category ? -1 : 1)
                      )
                      .slice(0, 3)
                      .map((rel) => (
                        <div
                          key={rel.id}
                          onClick={() => handleNavClick(`/blog/${rel.slug}`)}
                          className="group bg-[#F5F7FA] border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer agency-card-hover"
                        >
                          <div>
                            <div className="aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-200">
                              <img
                                src={rel.featured_image_url}
                                alt={rel.featured_image_alt || rel.title}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = ASSETS.portfolioSeoImg;
                                }}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-4">
                              <span className="text-[11px] font-bold text-[#8B1E1E]">
                                {rel.category}
                              </span>
                              <h3 className="font-display text-sm font-bold text-[#0A2540] group-hover:text-[#FF6A00] mt-1 line-clamp-2">
                                {rel.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                                {rel.excerpt}
                              </p>
                            </div>
                          </div>
                          <div className="px-4 py-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-[#0A2540] group-hover:text-[#FF6A00]">
                            <span>Read More</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : isShivKumarRoute ? (
          <ShivKumarVisitingCardView cms={cms} onNavigate={handleNavClick} />
        ) : targetPageSlug === 'home' ? (
          <div>
            {renderLiveShivWebsHomePage()}
            {/* Also render any custom Rich Text / Article blocks added to the Homepage via Page Builder */}
            {activePage &&
              activePage.sections
                .filter((sec) => sec.is_enabled && sec.section_type === 'heading_richtext')
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((sec) => renderSection(sec))}
          </div>
        ) : (
          <div>
            {activePage!.content &&
              activePage!.content.trim() !== '' &&
              !activePage!.sections.some(
                (sec) => sec.is_enabled && (sec.section_type === 'heading_richtext' || sec.section_type === 'text_with_image')
              ) && (
                <section className="py-12 px-4 sm:px-6 bg-white border-b border-slate-200/80">
                  <div className="max-w-5xl mx-auto">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0A2540]">
                      {activePage!.title}
                    </h1>
                    {activePage!.excerpt && (
                      <p className="text-sm text-slate-600 mt-2 pb-6 border-b border-slate-200">
                        {activePage!.excerpt}
                      </p>
                    )}
                    <div
                      className="mt-8 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#0A2540] [&_h1]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2540] [&_h2]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0A2540] [&_h3]:mt-6 [&_a]:text-[#FF6A00] [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_th]:bg-[#0A2540] [&_th]:text-white [&_th]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:p-3"
                      dangerouslySetInnerHTML={{ __html: activePage!.content }}
                    />
                  </div>
                </section>
              )}
            {activePage!.sections
              .filter((sec) => sec.is_enabled)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((sec) => renderSection(sec))}
          </div>
        )}
      </main>

      {/* ====================================================================
          4. STYLISH EXECUTIVE AGENCY FOOTER (Multi-Tier Gradient + Interactive Cards)
         ==================================================================== */}
      <footer className="relative overflow-hidden">
        <FooterChatbotWidget
          cms={cms}
          currentPath={currentPath}
          onNavigate={handleNavClick}
          onSubmitEnquiry={onSubmitEnquiry}
          csrfToken={csrfToken}
        />

        {/* Top Indian Tricolor & Brand Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6A00] via-[#0096e8] to-[#138808]" />

        {/* Main Executive Footer Body */}
        <div className="bg-gradient-to-b from-[#07192F] via-[#0A2540] to-[#05101F] text-white pt-16 pb-12 px-4 sm:px-8 relative">
          {/* Subtle decorative radial glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0096e8]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FF6A00]/10 blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Upper CTA Strip inside Footer */}
            <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0096e8] via-[#0284c7] to-[#0A2540] border border-white/15 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                  🚀 Ready to Grow Your Business Online?
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  Let&apos;s Build Your High-Converting Website &amp; SEO Campaign
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mt-1">
                  Get a free consultation &amp; custom project roadmap from Ghaziabad &amp; Delhi NCR&apos;s trusted web agency.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNavClick('/contact-us')}
                  className="px-6 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs sm:text-sm shadow-lg btn-hover-lift cursor-pointer flex items-center gap-2"
                >
                  <span>Request Free Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={OFFICIAL_BROCHURE_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all"
                >
                  📄 Download Brochure PDF
                </a>
              </div>
            </div>

            {/* 4-Column Stylish Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
              {/* Column 1 (4 cols): Brand Identity, Google Rating Badge & Socials */}
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-block bg-white rounded-2xl p-3 shadow-md">
                  <img
                    src="https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png"
                    alt="ShivWebsIndia"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white">ShivWebsIndia</strong> — Trusted Website Designer
                  in Ghaziabad &amp; Delhi NCR offering custom Website Designing, WordPress &amp;
                  E-Commerce Development, Technical SEO Services, Digital Marketing, and Graphic
                  Branding.
                </p>

                {/* Verified Google Rating Pill */}
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">4.9 / 5.0 Google Rating</span>
                </div>

                {/* Social Media Hover Icons */}
                <div className="pt-2 flex items-center gap-2.5">
                  <a
                    href="https://www.facebook.com/shivwebindia"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs transition-all hover:-translate-y-1"
                    title="Facebook"
                  >
                    f
                  </a>
                  <a
                    href="https://www.instagram.com/shivwebsindia"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center font-bold text-xs transition-all hover:-translate-y-1"
                    title="Instagram"
                  >
                    IG
                  </a>
                  <a
                    href="https://twitter.com/shivwebsindia"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-black text-white flex items-center justify-center font-bold text-xs transition-all hover:-translate-y-1"
                    title="Twitter / X"
                  >
                    X
                  </a>
                  <a
                    href="https://www.youtube.com/c/shivwebsindia"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs transition-all hover:-translate-y-1"
                    title="YouTube"
                  >
                    ▶
                  </a>
                </div>
              </div>

              {/* Column 2 (3 cols): Our Services (Dynamic from footer_services) */}
              <div className="lg:col-span-3">
                <h3 className="font-display text-base font-extrabold uppercase tracking-wider text-[#FF6A00] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                  <span>Our Core Services</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {footerServicesMenus.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.url)}
                        className="group flex items-center gap-2 hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <span className="text-[#0096e8] group-hover:translate-x-1 transition-transform">
                          ›
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 (2 cols): Quick Links & Staff Portals */}
              <div className="lg:col-span-2">
                <h3 className="font-display text-base font-extrabold uppercase tracking-wider text-[#00d4ff] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                  <span>Quick Links</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  {footerCompanyMenus.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.url)}
                        className="group flex items-center gap-2 hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <span className="text-[#FF6A00] group-hover:translate-x-1 transition-transform">
                          ›
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <a
                      href={OFFICIAL_BROCHURE_PDF_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold text-xs pt-1"
                    >
                      📄 Official Brochure PDF
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4 (3 cols): Touch With Us & Password-Protected Portals */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="font-display text-base font-extrabold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Touch With Us</span>
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <MapPin className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Head Office (Delhi NCR):</strong>
                      <span>Vaishali, 3F, Sector 3, Ghaziabad, UP (201010)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Phone className="w-4 h-4 text-[#00d4ff] shrink-0 mt-0.5" />
                    <div className="tabular-nums">
                      <strong className="text-white block text-xs">Direct Helpline:</strong>
                      <a
                        href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                        className="hover:text-[#FF6A00]"
                      >
                        {cms.settings.contact_phone}
                      </a>{' '}
                      | {cms.settings.secondary_phone}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Official Email:</strong>
                      <a
                        href={`mailto:${cms.settings.contact_email}`}
                        className="hover:text-[#FF6A00] break-all"
                      >
                        {cms.settings.contact_email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Password-Protected Admin & Team Portal Quick Access */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onOpenTeam}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0096e8]/25 hover:bg-[#0096e8] border border-[#0096e8]/50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Panel</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#FF6A00] border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin CMS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Copyright & Service Locations Bar */}
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>
                Copyright 2026 ©{' '}
                <button
                  onClick={() => handleNavClick('/')}
                  className="text-white font-bold hover:text-[#FF6A00] cursor-pointer"
                >
                  ShivWebsIndia
                </button>{' '}
                | All Rights Reserved · Serving Ghaziabad, Vaishali, Indirapuram, Noida, Greater Noida &amp; Delhi NCR.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleNavClick('/shivkumar')}
                  className="text-amber-300 hover:text-white font-semibold cursor-pointer"
                >
                  🪪 CEO Visiting Card (/shivkumar)
                </button>
                <span>·</span>
                <button
                  onClick={() => handleNavClick('/privacy-policy')}
                  className="hover:text-white cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>·</span>
                <button
                  onClick={() => handleNavClick('/terms-and-conditions')}
                  className="hover:text-white cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Direct Chat Button (Bottom-Left) */}
      <a
        href="https://wa.me/918667666429?text=Namaste%20ShivWebsIndia%2C%20I%20need%20a%20quote%20for%20Website%20Design%20%2F%20SEO%20Services."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs shadow-xl btn-hover-lift"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </div>
  );
};
