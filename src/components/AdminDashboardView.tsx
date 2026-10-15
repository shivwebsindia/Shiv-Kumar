import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Globe,
  Image as ImageIcon,
  BookOpen,
  Briefcase,
  Settings,
  Inbox,
  LayoutDashboard,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  AlertTriangle,
  Lock,
  LogOut,
  ExternalLink,
  Code2,
  Menu,
  X,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Calculator,
  HelpCircle,
  Users,
  CreditCard,
} from 'lucide-react';
import {
  CMSDatabaseState,
  CMSPage,
  PageSection,
  SectionType,
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogFAQ,
  ServiceItem,
  PortfolioItem,
  MediaAsset,
  ContactEnquiry,
  RedirectRule,
  FAQItem,
  MenuItem,
} from '../data/initialCmsData';
import { PhpArchitectureView } from './PhpArchitectureView';
import { BrochureQuotationProposalSuite } from './BrochureQuotationProposalSuite';
import { TeamManagementPortal } from './TeamManagementPortal';
import { WordPressRichEditor } from './WordPressRichEditor';

interface AdminDashboardViewProps {
  cms: CMSDatabaseState;
  setCms: React.Dispatch<React.SetStateAction<CMSDatabaseState>>;
  adminSession: {
    isAuthenticated: boolean;
    email: string;
    role: 'admin' | 'editor';
    sessionId: string;
    failedAttempts: number;
    lockedUntil: number | null;
  };
  onLogin: (
    email: string,
    pass: string,
    role: 'admin' | 'editor'
  ) => { success: boolean; error?: string };
  onLogout: () => void;
  onPreviewPage: (slug: string) => void;
  onBackToWebsite: () => void;
  csrfToken: string;
}

type AdminModuleTab =
  | 'overview'
  | 'team_management'
  | 'brochure_quote_proposal'
  | 'leads'
  | 'pages'
  | 'builder'
  | 'faqs_manager'
  | 'seo'
  | 'media'
  | 'blog'
  | 'services_portfolio'
  | 'menus_settings'
  | 'source_export';

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  cms,
  setCms,
  adminSession,
  onLogin,
  onLogout,
  onPreviewPage,
  onBackToWebsite,
  csrfToken,
}) => {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedPageId, setSelectedPageId] = useState<number>(1);
  const [loginEmail, setLoginEmail] = useState('info@shivwebsindia.com');
  const [loginPassword, setLoginPassword] = useState('ShivWebs@2026!Admin');
  const [loginRole, setLoginRole] = useState<'admin' | 'editor'>('admin');
  const [loginError, setLoginError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Page creation & manual editor state
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [pageStatusFilter, setPageStatusFilter] = useState<string>('all');
  const [confirmDeletePageId, setConfirmDeletePageId] = useState<number | null>(null);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);

  // Builder state
  const [newSectionType, setNewSectionType] = useState<SectionType>('heading_richtext');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);

  // SEO Manager sub-view
  const [seoSubTab, setSeoSubTab] = useState<
    'page_meta' | 'all_pages_seo' | 'redirects' | 'sitemap_robots'
  >('page_meta');
  const [newRedirectSource, setNewRedirectSource] = useState('');
  const [newRedirectTarget, setNewRedirectTarget] = useState('');
  const [newRedirectCode, setNewRedirectCode] = useState<301 | 302>(301);

  // Media upload state
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<{
    type: 'idle' | 'ok' | 'err';
    msg: string;
  }>({
    type: 'idle',
    msg: '',
  });

  // Blog Management state (Posts, Categories & Tags, Rich Editor, FAQs, SEO)
  const [blogSubTab, setBlogSubTab] = useState<'posts' | 'categories_tags'>('posts');
  const [blogStatusFilter, setBlogStatusFilter] = useState<string>('all');
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState<number | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSlug, setNewBlogSlug] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Website Design');
  const [newBlogTagsInput, setNewBlogTagsInput] = useState('Website Design, Ghaziabad, SEO');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState(
    '<h2>Key Highlights &amp; Overview</h2>\n<p>Write your complete article content here using headings, lists, links, images, and tables.</p>'
  );
  const [newBlogFeaturedImage, setNewBlogFeaturedImage] = useState(
    'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Professional-Website-in-Ghaziabad-270x188.webp'
  );
  const [newBlogStatus, setNewBlogStatus] = useState<'published' | 'draft'>('published');
  const [newBlogSeoTitle, setNewBlogSeoTitle] = useState('');
  const [newBlogMetaDesc, setNewBlogMetaDesc] = useState('');
  const [newBlogKeywords, setNewBlogKeywords] = useState('');
  const [newBlogFaqs, setNewBlogFaqs] = useState<BlogFAQ[]>([]);
  const [draftBlogFaqQ, setDraftBlogFaqQ] = useState('');
  const [draftBlogFaqA, setDraftBlogFaqA] = useState('');

  // Blog Category & Tag Manager state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  // Service & Portfolio Management state (Multiple service pages per category, Edit, Delete, SEO)
  const [serviceSubTab, setServiceSubTab] = useState<'services' | 'portfolio'>('services');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<number | null>(null);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceSlug, setNewServiceSlug] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Website Design & Development');
  const [newServiceShortDesc, setNewServiceShortDesc] = useState('');
  const [newServiceFullDesc, setNewServiceFullDesc] = useState('');
  const [newServiceDeliverables, setNewServiceDeliverables] = useState(
    'Custom Mobile-Responsive UI/UX Design\nClean PHP 8.x & MySQL Dynamic CMS\nOn-Page Technical SEO & Schema.org JSON-LD\nDirect WhatsApp & Email Lead Capture'
  );
  const [newServiceImage, setNewServiceImage] = useState(
    'https://www.shivwebsindia.com/wp-content/uploads/2026/07/WordPress-Website-Development.webp'
  );
  const [newServiceSeoTitle, setNewServiceSeoTitle] = useState('');
  const [newServiceMetaDesc, setNewServiceMetaDesc] = useState('');
  const [newServiceKeywords, setNewServiceKeywords] = useState('');

  // Portfolio item creation state
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioIndustry, setNewPortfolioIndustry] = useState('');
  const [newPortfolioCategory, setNewPortfolioCategory] = useState('Website Design and Development');
  const [newPortfolioImage, setNewPortfolioImage] = useState(
    'https://www.shivwebsindia.com/wp-content/uploads/2026/06/sperowz.png'
  );
  const [newPortfolioSummary, setNewPortfolioSummary] = useState('');

  // Page creation template & SEO state
  const [newPageTemplate, setNewPageTemplate] = useState<CMSPage['template']>('standard');
  const [newPageSeoTitle, setNewPageSeoTitle] = useState('');
  const [newPageMetaDesc, setNewPageMetaDesc] = useState('');
  const [newPageContent, setNewPageContent] = useState(
    '<h2>Page Overview &amp; Key Highlights</h2>\n<p>Write your complete page article body here using headings, paragraphs, images, links, lists, and tables.</p>'
  );

  // Lead filter
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');

  // Dynamic FAQ Manager state
  const [newFaqCategory, setNewFaqCategory] = useState<string>('Website Design & Pricing');
  const [newFaqQuestion, setNewFaqQuestion] = useState<string>('');
  const [newFaqAnswer, setNewFaqAnswer] = useState<string>('');
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);

  // Dynamic Navigation Menu Manager state
  const [newMenuLocation, setNewMenuLocation] =
    useState<MenuItem['menu_location']>('header_primary');
  const [newMenuLabel, setNewMenuLabel] = useState<string>('');
  const [newMenuUrl, setNewMenuUrl] = useState<string>('/');

  const selectedPage = cms.pages.find((p) => p.id === selectedPageId) || cms.pages[0];

  const logAudit = (action: string, entityType: string, entityId: string) => {
    setCms((prev) => ({
      ...prev,
      audit_logs: [
        {
          id: Date.now(),
          user_email: adminSession.email,
          role: adminSession.role,
          action,
          entity_type: entityType,
          entity_id: entityId,
          timestamp: new Date().toISOString(),
        },
        ...prev.audit_logs,
      ],
    }));
  };

  if (!adminSession.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8B1E1E]">
                Administrator Portal
              </p>
              <h1 className="font-display text-2xl font-extrabold text-[#0A2540] mt-1">
                ShivWebsIndia CMS
              </h1>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#FF6A00]" />
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {resetEmailSent && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              Password reset link generated and sent to your registered administrator email.
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = onLogin(loginEmail, loginPassword, loginRole);
              if (!res.success) {
                setLoginError(res.error || 'Authentication failed');
              } else {
                setLoginError('');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                Access Role
              </label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as 'admin' | 'editor')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#FF6A00]"
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="editor">Editor (Content &amp; SEO Access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold text-sm rounded-xl btn-hover-lift shadow-md cursor-pointer"
            >
              Sign In to Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                const res = onLogin('info@shivwebsindia.com', 'ShivWebs@2026!Admin', 'admin');
                if (!res.success) {
                  onLogin('info@shivwebsindia.com', 'Shiv@2026', 'admin');
                }
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>1-Click Direct Admin Sign In (Demo Mode)</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setResetEmailSent(true)}
              className="text-[#0A2540] hover:text-[#FF6A00] underline cursor-pointer"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={onBackToWebsite}
              className="text-[#0A2540] hover:text-[#FF6A00] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handlers for Page Management
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const rawSlug = (newPageSlug || newPageTitle)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');

    if (cms.pages.some((p) => p.slug === rawSlug)) {
      setUploadFeedback({
        type: 'err',
        msg: `Slug "/${rawSlug}" already exists. Unique slug required.`,
      });
      return;
    }

    const newId = Math.max(0, ...cms.pages.map((p) => p.id)) + 1;
    const finalTitle = newPageTitle.trim();
    const finalSeoTitle = newPageSeoTitle.trim() || `${finalTitle} | ShivWebsIndia`;
    const finalMetaDesc =
      newPageMetaDesc.trim() ||
      `Explore ${finalTitle} services and solutions by ShivWebsIndia in Ghaziabad & Delhi NCR.`;

    const initialRichBody =
      newPageContent.trim() ||
      `<h2>${finalTitle}</h2>\n<p>${finalMetaDesc}</p>\n<ul>\n  <li>100% Mobile-Responsive &amp; SEO-Ready Architecture</li>\n  <li>Dedicated Support from Vaishali, Ghaziabad Team</li>\n</ul>`;

    const newPage: CMSPage = {
      id: newId,
      title: finalTitle,
      slug: rawSlug,
      template: newPageTemplate,
      excerpt: finalMetaDesc,
      content: initialRichBody,
      featured_image: '',
      author_name: adminSession.email,
      status: 'published',
      is_system_page: false,
      updated_at: new Date().toISOString(),
      seo: {
        seo_title: finalSeoTitle,
        meta_description: finalMetaDesc,
        focus_keywords: `${finalTitle.toLowerCase()}, shivwebsindia, ghaziabad, delhi ncr`,
        canonical_url: `https://www.shivwebsindia.com/${rawSlug}`,
        robots_index: true,
        robots_follow: true,
        og_title: finalSeoTitle,
        og_description: finalMetaDesc,
        og_image_url: '',
        schema_type: newPageTemplate === 'service' ? 'Service' : 'WebPage',
        breadcrumb_title: finalTitle,
        include_in_sitemap: true,
      },
      sections: [
        {
          id: Date.now(),
          page_id: newId,
          section_type: newPageTemplate === 'service' ? 'text_with_image' : 'heading_richtext',
          title: finalTitle,
          subtitle: 'ShivWebsIndia · Ghaziabad & Delhi NCR',
          sort_order: 1,
          is_enabled: true,
          content_json:
            newPageTemplate === 'service'
              ? {
                  body: initialRichBody,
                  image_url:
                    'https://www.shivwebsindia.com/wp-content/uploads/2026/07/WordPress-Website-Development.webp',
                  highlights: [
                    'Custom Mobile-Responsive Design & Architecture',
                    'On-Page SEO, Schema.org JSON-LD & Fast Loading',
                    'Direct WhatsApp & Email Lead Capture Integration',
                  ],
                }
              : {
                  body_html: initialRichBody,
                },
        },
        {
          id: Date.now() + 1,
          page_id: newId,
          section_type: 'cta_banner',
          title: `Ready to Discuss ${finalTitle}?`,
          subtitle: 'Connect with our Ghaziabad & Delhi NCR team for a custom quotation.',
          sort_order: 2,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Request a Quote',
            primary_cta_url: '/contact-us',
          },
        },
      ],
    };

    setCms((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    logAudit(`Created page /${rawSlug}`, 'page', String(newId));
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageSeoTitle('');
    setNewPageMetaDesc('');
    setSelectedPageId(newId);
  };

  const handleUpdatePageStatus = (pageId: number, status: CMSPage['status']) => {
    setCms((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, status, updated_at: new Date().toISOString() } : p
      ),
    }));
    logAudit(`Updated page #${pageId} status to ${status}`, 'page', String(pageId));
  };

  const handlePermanentDeletePage = (pageId: number) => {
    const targetPage = cms.pages.find((p) => p.id === pageId);
    setCms((prev) => ({
      ...prev,
      pages: prev.pages.filter((p) => p.id !== pageId),
      services: targetPage
        ? prev.services.filter((s) => s.slug !== targetPage.slug && s.page_slug !== targetPage.slug)
        : prev.services,
    }));
    setConfirmDeletePageId(null);
    if (selectedPageId === pageId) {
      setSelectedPageId(1);
    }
    logAudit(`Permanently deleted page #${pageId}`, 'page', String(pageId));
  };

  // Create a new Service AND automatically provision its dedicated CMSPage so multiple service pages can exist per category
  const handleCreateServiceWithPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;
    const rawSlug = (newServiceSlug || newServiceTitle)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');

    if (cms.services.some((s) => s.slug === rawSlug) || cms.pages.some((p) => p.slug === rawSlug)) {
      setUploadFeedback({
        type: 'err',
        msg: `Service URL slug "/${rawSlug}" already exists. Please use a unique slug.`,
      });
      return;
    }

    const title = newServiceTitle.trim();
    const category = newServiceCategory.trim() || 'Website Design & Development';
    const shortDesc =
      newServiceShortDesc.trim() ||
      `Professional ${title} services in Ghaziabad, Noida, and Delhi NCR by ShivWebsIndia.`;
    const fullDesc =
      newServiceFullDesc.trim() ||
      `ShivWebsIndia delivers results-driven ${title} solutions under our ${category} practice. Engineered for fast loading, mobile responsiveness, technical SEO, and measurable lead generation.`;
    const deliverables = newServiceDeliverables
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);
    const seoTitle = newServiceSeoTitle.trim() || `${title} Services in Ghaziabad & Delhi NCR | ShivWebsIndia`;
    const metaDesc = newServiceMetaDesc.trim() || shortDesc;
    const keywords =
      newServiceKeywords.trim() || `${title.toLowerCase()}, ${category.toLowerCase()}, shivwebsindia`;

    const nextSvcId = Math.max(0, ...cms.services.map((s) => s.id)) + 1;
    const nextPageId = Math.max(0, ...cms.pages.map((p) => p.id)) + 1;

    const newService: ServiceItem = {
      id: nextSvcId,
      page_slug: rawSlug,
      title,
      slug: rawSlug,
      category,
      short_description: shortDesc,
      full_description: fullDesc,
      featured_image_url:
        newServiceImage.trim() ||
        'https://www.shivwebsindia.com/wp-content/uploads/2026/07/WordPress-Website-Development.webp',
      icon_name: 'Briefcase',
      deliverables:
        deliverables.length > 0
          ? deliverables
          : [
              'Custom UI/UX & Mobile-First Architecture',
              'Technical SEO & Schema.org JSON-LD Setup',
              'Direct WhatsApp & Email Lead Routing',
            ],
      cta_text: `Explore ${title}`,
      cta_url: `/${rawSlug}`,
      sort_order: cms.services.length + 1,
      is_featured: true,
      status: 'published',
      seo_title: seoTitle,
      meta_description: metaDesc,
      focus_keywords: keywords,
    };

    const newServicePage: CMSPage = {
      id: nextPageId,
      title,
      slug: rawSlug,
      template: 'service',
      excerpt: shortDesc,
      content: fullDesc,
      featured_image: newService.featured_image_url || '',
      author_name: adminSession.email,
      status: 'published',
      is_system_page: false,
      updated_at: new Date().toISOString(),
      seo: {
        seo_title: seoTitle,
        meta_description: metaDesc,
        focus_keywords: keywords,
        canonical_url: `https://www.shivwebsindia.com/${rawSlug}`,
        robots_index: true,
        robots_follow: true,
        og_title: seoTitle,
        og_description: metaDesc,
        og_image_url: newService.featured_image_url || '',
        schema_type: 'Service',
        breadcrumb_title: title,
        include_in_sitemap: true,
      },
      sections: [
        {
          id: nextPageId * 100 + 1,
          page_id: nextPageId,
          section_type: 'text_with_image',
          title,
          subtitle: `${category} · Ghaziabad & Delhi NCR`,
          sort_order: 1,
          is_enabled: true,
          content_json: {
            body: fullDesc,
            image_url: newService.featured_image_url,
            image_alt: title,
            highlights: newService.deliverables,
          },
        },
        {
          id: nextPageId * 100 + 2,
          page_id: nextPageId,
          section_type: 'pricing_table',
          title: `${title} Engagement Packages`,
          subtitle: 'Transparent milestone-based pricing with 100% source code ownership.',
          sort_order: 2,
          is_enabled: true,
          content_json: {
            plans: [
              {
                name: 'Starter Package',
                audience: 'For startups & local businesses',
                price_label: '₹15,000 – ₹25,000',
                features: [
                  'Mobile-responsive custom layout',
                  'On-page SEO & Schema setup',
                  'WhatsApp & Email lead form',
                ],
              },
              {
                name: 'Growth / Dynamic CMS',
                audience: 'For scaling brands & multi-page funnels',
                price_label: '₹28,000 – ₹55,000',
                features: [
                  'Full Admin CMS with Page & Blog Manager',
                  'Advanced Schema.org & speed optimization',
                  'Priority support & training',
                ],
              },
              {
                name: 'Enterprise Custom',
                audience: 'For custom portals & high-volume workflows',
                price_label: 'Custom Quote',
                features: [
                  'Custom database & API integrations',
                  'Dedicated account manager',
                  'Annual maintenance & SLA',
                ],
              },
            ],
          },
        },
        {
          id: nextPageId * 100 + 3,
          page_id: nextPageId,
          section_type: 'related_services',
          title: 'Related Agency Services',
          subtitle: 'Explore more services under our Website & Digital Marketing practice.',
          sort_order: 3,
          is_enabled: true,
          content_json: {
            exclude_slug: rawSlug,
          },
        },
        {
          id: nextPageId * 100 + 4,
          page_id: nextPageId,
          section_type: 'cta_banner',
          title: `Discuss Your ${title} Project`,
          subtitle: 'Get a free consultation and custom quotation from our Vaishali, Ghaziabad experts.',
          sort_order: 4,
          is_enabled: true,
          content_json: {
            primary_cta_text: 'Request a Quote',
            primary_cta_url: '/contact-us',
          },
        },
      ],
    };

    setCms((prev) => ({
      ...prev,
      services: [...prev.services, newService],
      pages: [...prev.pages, newServicePage],
    }));

    logAudit(`Created service & page /${rawSlug} in ${category}`, 'service', String(nextSvcId));
    setNewServiceTitle('');
    setNewServiceSlug('');
    setNewServiceShortDesc('');
    setNewServiceFullDesc('');
    setNewServiceSeoTitle('');
    setNewServiceMetaDesc('');
    setNewServiceKeywords('');
  };

  // Sync edits made to a ServiceItem with its corresponding CMSPage
  const updateServiceAndPage = (serviceId: number, patch: Partial<ServiceItem>) => {
    setCms((prev) => {
      const targetSvc = prev.services.find((s) => s.id === serviceId);
      if (!targetSvc) return prev;
      const oldSlug = targetSvc.slug;
      const updatedSvc: ServiceItem = { ...targetSvc, ...patch };
      const newSlug = updatedSvc.slug;

      return {
        ...prev,
        services: prev.services.map((s) => (s.id === serviceId ? updatedSvc : s)),
        pages: prev.pages.map((p) => {
          if (p.slug !== oldSlug && p.slug !== targetSvc.page_slug) return p;
          return {
            ...p,
            title: updatedSvc.title,
            slug: newSlug,
            excerpt: updatedSvc.short_description,
            content: updatedSvc.full_description,
            status:
              updatedSvc.status === 'published'
                ? 'published'
                : updatedSvc.status === 'draft'
                ? 'draft'
                : 'unpublished',
            seo: {
              ...p.seo,
              seo_title: updatedSvc.seo_title || p.seo.seo_title,
              meta_description: updatedSvc.meta_description || updatedSvc.short_description,
              focus_keywords: updatedSvc.focus_keywords || p.seo.focus_keywords,
              canonical_url: `https://www.shivwebsindia.com/${newSlug}`,
              breadcrumb_title: updatedSvc.title,
            },
            sections: p.sections.map((sec, idx) =>
              idx === 0 && sec.section_type === 'text_with_image'
                ? {
                    ...sec,
                    title: updatedSvc.title,
                    subtitle: `${updatedSvc.category} · Ghaziabad & Delhi NCR`,
                    content_json: {
                      ...sec.content_json,
                      body: updatedSvc.full_description,
                      image_url:
                        updatedSvc.featured_image_url || sec.content_json.image_url,
                      highlights: updatedSvc.deliverables,
                    },
                  }
                : sec
            ),
          };
        }),
      };
    });
  };

  const handleDeleteServiceAndPage = (serviceId: number) => {
    const targetSvc = cms.services.find((s) => s.id === serviceId);
    setCms((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== serviceId),
      pages: targetSvc
        ? prev.pages.filter((p) => p.slug !== targetSvc.slug && p.slug !== targetSvc.page_slug)
        : prev.pages,
    }));
    setConfirmDeleteServiceId(null);
    if (editingServiceId === serviceId) setEditingServiceId(null);
    logAudit(`Deleted service #${serviceId}`, 'service', String(serviceId));
  };

  const handleMoveSection = (sectionId: number, direction: 'up' | 'down') => {
    const ordered = [...selectedPage.sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = ordered.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === ordered.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const tempOrder = ordered[idx].sort_order;
    ordered[idx] = { ...ordered[idx], sort_order: ordered[swapIdx].sort_order };
    ordered[swapIdx] = { ...ordered[swapIdx], sort_order: tempOrder };

    setCms((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === selectedPage.id
          ? { ...p, sections: ordered, updated_at: new Date().toISOString() }
          : p
      ),
    }));
  };

  const handleToggleSection = (sectionId: number) => {
    setCms((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === selectedPage.id
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.id === sectionId ? { ...s, is_enabled: !s.is_enabled } : s
              ),
            }
          : p
      ),
    }));
  };

  const handleDuplicateSection = (sec: PageSection) => {
    const maxOrder = Math.max(0, ...selectedPage.sections.map((s) => s.sort_order));
    const copy: PageSection = {
      ...JSON.parse(JSON.stringify(sec)),
      id: Date.now(),
      title: `${sec.title} (Copy)`,
      sort_order: maxOrder + 1,
    };
    setCms((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === selectedPage.id ? { ...p, sections: [...p.sections, copy] } : p
      ),
    }));
  };

  const handleAddSectionBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const maxOrder = Math.max(0, ...selectedPage.sections.map((s) => s.sort_order));
    const defaultPayload: Record<string, any> =
      newSectionType === 'heading_richtext'
        ? {
            body_html:
              '<p>New structured content block added via Dynamic Page Builder.</p>',
          }
        : newSectionType === 'cta_banner'
        ? {
            primary_cta_text: 'Request a Quote',
            primary_cta_url: '/contact-us',
          }
        : { max_items: 4, show_deliverables: true };

    const newSec: PageSection = {
      id: Date.now(),
      page_id: selectedPage.id,
      section_type: newSectionType,
      title: newSectionTitle.trim() || `New ${newSectionType.replace(/_/g, ' ')} Block`,
      subtitle: newSectionSubtitle.trim() || 'Configured via ShivWebsIndia CMS',
      sort_order: maxOrder + 1,
      is_enabled: true,
      content_json: defaultPayload,
    };

    setCms((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === selectedPage.id ? { ...p, sections: [...p.sections, newSec] } : p
      ),
    }));
    setNewSectionTitle('');
    setNewSectionSubtitle('');
  };

  const handleSimulateMediaUpload = (filenameToTest: string, altTextToUse: string) => {
    const cleanName = filenameToTest.trim();
    if (!cleanName) return;

    const ext = cleanName.split('.').pop()?.toLowerCase() || '';
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (
      !allowed.includes(ext) ||
      cleanName.includes('.php') ||
      cleanName.includes('.sh') ||
      cleanName.includes('.exe')
    ) {
      setUploadFeedback({
        type: 'err',
        msg: `Security Alert: "${cleanName}" rejected! Only verified image files (JPG, PNG, WEBP, GIF) are permitted.`,
      });
      return;
    }

    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const storedName = `${randomHex}.${ext}`;

    const newAsset: MediaAsset = {
      id: Date.now(),
      original_name: cleanName,
      stored_filename: storedName,
      file_path: cms.media[0].file_path,
      mime_type: ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
      file_extension: ext,
      file_size_bytes: 284500,
      width: 1600,
      height: 1000,
      alt_text: altTextToUse.trim() || 'ShivWebsIndia media asset',
      used_in_pages: [],
      created_at: new Date().toISOString(),
    };

    setCms((prev) => ({
      ...prev,
      media: [newAsset, ...prev.media],
    }));
    setUploadFeedback({
      type: 'ok',
      msg: `Upload Successful: Saved as "/uploads/${storedName}".`,
    });
    setUploadFilename('');
    setUploadAltText('');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'team_management',
      label: 'Team Management System',
      icon: Users,
      count: cms.team_members?.length || 5,
    },
    {
      id: 'brochure_quote_proposal',
      label: 'Brochure, Quotation & Proposal',
      icon: Calculator,
    },
    { id: 'leads', label: 'Lead Enquiries', icon: Inbox, count: cms.enquiries.length },
    { id: 'pages', label: 'Pages & URLs', icon: FileText, count: cms.pages.length },
    {
      id: 'builder',
      label: 'Page Section Builder',
      icon: Layers,
      count: selectedPage.sections.length,
    },
    { id: 'faqs_manager', label: 'Dynamic FAQs Manager', icon: HelpCircle, count: cms.faqs.length },
    { id: 'seo', label: 'SEO & Redirects', icon: Globe, count: cms.redirects.length },
    { id: 'media', label: 'Media Library', icon: ImageIcon, count: cms.media.length },
    { id: 'blog', label: 'Blog Articles', icon: BookOpen, count: cms.blog_posts.length },
    {
      id: 'services_portfolio',
      label: 'Services & Portfolio',
      icon: Briefcase,
      count: cms.services.length + cms.portfolio.length,
    },
    {
      id: 'menus_settings',
      label: 'Navigation & Brand Settings',
      icon: Settings,
      count: cms.menu_items.length,
    },
    { id: 'source_export', label: 'PHP & MySQL Export', icon: Code2 },
  ];

  const handleSelectTab = (tabId: AdminModuleTab) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0A2540] flex flex-col lg:flex-row">
      {/* Mobile Admin Top Bar */}
      <div className="lg:hidden bg-[#0A2540] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-bold text-base">ShivWebsIndia Admin</span>
        </div>
        <button
          onClick={onBackToWebsite}
          className="px-3 py-1.5 bg-[#FF6A00] text-white text-xs font-semibold rounded-lg"
        >
          View Live Site
        </button>
      </div>

      {/* Responsive Left Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } lg:flex w-full lg:w-64 bg-[#0A2540] text-white shrink-0 flex-col justify-between border-r border-white/10 lg:min-h-screen`}
      >
        <div className="p-5">
          <div className="pb-5 mb-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-white tracking-tight">
                ShivWebsIndia
              </span>
              <span className="text-[11px] font-mono text-[#FF6A00] font-semibold uppercase">
                {adminSession.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 truncate">{adminSession.email}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as AdminModuleTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FF6A00] text-white shadow-md shadow-[#FF6A00]/25'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="font-mono text-[11px] tabular-nums opacity-85">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Direct Admin-Only Billing Portal Link */}
            <a
              href="https://billing.shivwebsindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm mt-3 group"
              title="Open Official Billing & Invoicing Portal in New Tab"
            >
              <span className="flex items-center gap-2.5 truncate">
                <CreditCard className="w-4 h-4 shrink-0 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span className="truncate">Billing Portal</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md text-white font-bold">
                <span>billing.shivwebsindia.com</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </span>
            </a>
          </nav>
        </div>

        <div className="p-5 border-t border-white/10 space-y-2.5">
          <button
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <p className="text-xs text-slate-500 font-medium">
              ShivWebsIndia Content Management System
            </p>
            <h1 className="font-display text-2xl font-extrabold text-[#0A2540] mt-0.5">
              {activeTab === 'overview' && 'Executive Dashboard Overview'}
              {activeTab === 'team_management' &&
                'Team Management System — Tasks, Attendance & Password Access'}
              {activeTab === 'brochure_quote_proposal' &&
                'Admin Only: Official Brochure, Quotation & Proposal Desk'}
              {activeTab === 'leads' && 'Customer Lead Enquiries'}
              {activeTab === 'pages' && 'Website Pages & URL Management'}
              {activeTab === 'builder' && `Dynamic Page Builder — ${selectedPage.title}`}
              {activeTab === 'faqs_manager' &&
                'Dynamic FAQ Accordion Manager (English & Hindi Support)'}
              {activeTab === 'seo' && 'SEO Metadata, Sitemap & Redirects'}
              {activeTab === 'media' && 'Media Library & Asset Manager'}
              {activeTab === 'blog' && 'Blog Articles & Insights'}
              {activeTab === 'services_portfolio' && 'Services & Portfolio Manager'}
              {activeTab === 'menus_settings' &&
                'Dynamic Header/Footer Navigation & Brand Settings'}
              {activeTab === 'source_export' && 'PHP 8.x & MySQL Deployment Package'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://billing.shivwebsindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Open Billing Portal (billing.shivwebsindia.com)"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Billing Portal ↗</span>
            </a>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(Number(e.target.value))}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#0A2540]"
            >
              {cms.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  Page: {p.title} (/{p.slug})
                </option>
              ))}
            </select>
            <button
              onClick={() => setActiveTab('source_export')}
              className="px-4 py-2 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl btn-hover-lift flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Download ZIP Bundle (.zip)</span>
            </button>
            <button
              onClick={() => onPreviewPage(selectedPage.slug)}
              className="px-4 py-2 bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-semibold rounded-xl btn-hover-lift flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview /{selectedPage.slug}</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick One-Click Hostinger / cPanel ZIP Bundle Banner */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#133863] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] text-[11px] font-mono font-bold uppercase tracking-wider">
                  Hostinger / cPanel Deployment Ready
                </span>
                <h2 className="font-display text-lg sm:text-xl font-extrabold mt-1">
                  Download Complete Website PHP 8.x + MySQL Bundle (.zip)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Includes full source code, 24-table MySQL database schema, .htaccess rewrite rules, and all your live Admin CMS changes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('source_export')}
                className="px-5 py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-lg"
              >
                <Code2 className="w-4 h-4" />
                <span>Go to ZIP Bundle Download →</span>
              </button>
            </div>

            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab('leads')}
                className="bg-white border border-slate-200 rounded-2xl p-6 agency-card-hover cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Total Lead Enquiries</span>
                  <Inbox className="w-4 h-4 text-[#FF6A00]" />
                </div>
                <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums">
                  {cms.enquiries.length}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-1 truncate">
                  Routed to {cms.settings.notification_recipient_email}
                </p>
              </div>

              <div
                onClick={() => setActiveTab('pages')}
                className="bg-white border border-slate-200 rounded-2xl p-6 agency-card-hover cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Published Pages</span>
                  <FileText className="w-4 h-4 text-[#0A2540]" />
                </div>
                <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums">
                  {cms.pages.filter((p) => p.status === 'published').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Indexable in XML Sitemap
                </p>
              </div>

              <div
                onClick={() => setActiveTab('services_portfolio')}
                className="bg-white border border-slate-200 rounded-2xl p-6 agency-card-hover cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Services &amp; Portfolio</span>
                  <Briefcase className="w-4 h-4 text-[#8B1E1E]" />
                </div>
                <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums">
                  {cms.services.length + cms.portfolio.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {cms.services.length} Services · {cms.portfolio.length} Projects
                </p>
              </div>

              <div
                onClick={() => setActiveTab('blog')}
                className="bg-white border border-slate-200 rounded-2xl p-6 agency-card-hover cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Published Articles</span>
                  <BookOpen className="w-4 h-4 text-[#0A2540]" />
                </div>
                <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2 tabular-nums">
                  {cms.blog_posts.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  SEO &amp; Technical Guides
                </p>
              </div>
            </div>

            {/* Recent Enquiries Quick View */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-[#0A2540]">
                    Recent Customer Leads
                  </h2>
                  <p className="text-xs text-slate-500">
                    Automatically emailed to{' '}
                    <strong className="text-[#8B1E1E]">
                      {cms.settings.notification_recipient_email}
                    </strong>
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-semibold text-[#FF6A00] hover:underline cursor-pointer"
                >
                  View All Leads →
                </button>
              </div>

              <div className="divide-y divide-slate-200">
                {cms.enquiries.slice(0, 4).map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <div className="font-display font-bold text-sm text-[#0A2540]">
                        {enq.full_name}{' '}
                        <span className="font-normal text-xs text-slate-500">
                          · {enq.phone} · {enq.email}
                        </span>
                      </div>
                      <div className="text-xs text-[#8B1E1E] font-medium mt-0.5">
                        {enq.service_interested} ({enq.budget_range})
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{enq.message}</p>
                    </div>
                    <span className="text-xs font-semibold capitalize px-3 py-1 rounded-lg bg-slate-100 text-[#0A2540] self-start sm:self-center shrink-0">
                      {enq.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Quick View: Live Team Attendance & Pending Leave Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Team Attendance Card in Admin Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0A2540]">
                      Today&apos;s Team Attendance Status
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live punch-in &amp; work mode synced from the Team Management Portal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('team_management')}
                    className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    Open Attendance Register →
                  </button>
                </div>

                <div className="divide-y divide-slate-200">
                  {(cms.team_members || []).map((member) => {
                    const isPresent = member.attendance_status === 'checked_in';
                    const isOnLeave = member.status === 'on_leave';
                    return (
                      <div
                        key={member.id}
                        className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70"
                      >
                        <div>
                          <div className="font-display text-sm font-bold text-[#0A2540]">
                            {member.full_name}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              ({member.department})
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Last Punch: {member.last_check_in || '09:30 AM'}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isOnLeave
                              ? 'bg-amber-100 text-amber-800'
                              : isPresent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isOnLeave ? '🏖️ On Leave' : isPresent ? '✅ Present' : '○ Checked Out'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Leave Applications & Quick Admin Approval Card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0A2540]">
                      Team Leave Requests ({(cms.team_leave_requests || []).length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Approve or reject leave applications submitted by team members
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('team_management')}
                    className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    Manage All Leaves →
                  </button>
                </div>

                <div className="divide-y divide-slate-200">
                  {(cms.team_leave_requests || []).slice(0, 4).map((leave) => (
                    <div
                      key={leave.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-bold text-[#0A2540]">
                            {leave.member_name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0d6efd] text-[11px] font-bold">
                            {leave.leave_type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              leave.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : leave.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {leave.start_date} → {leave.end_date} ({leave.total_days} Days) · Handover:{' '}
                          {leave.handover_to_name || 'Shiv Kumar'}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{leave.reason}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setCms((prev) => ({
                              ...prev,
                              team_leave_requests: (prev.team_leave_requests || []).map((l) =>
                                l.id === leave.id
                                  ? {
                                      ...l,
                                      status: 'approved',
                                      admin_remark: 'Approved from Admin Dashboard',
                                    }
                                  : l
                              ),
                              team_members: (prev.team_members || []).map((m) =>
                                m.id === leave.member_id
                                  ? { ...m, status: 'on_leave', attendance_status: 'checked_out' }
                                  : m
                              ),
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCms((prev) => ({
                              ...prev,
                              team_leave_requests: (prev.team_leave_requests || []).map((l) =>
                                l.id === leave.id
                                  ? {
                                      ...l,
                                      status: 'rejected',
                                      admin_remark: 'Declined from Admin Dashboard',
                                    }
                                  : l
                              ),
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white text-xs font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGES MANAGEMENT */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            <form
              onSubmit={handleCreatePage}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    Create New Website Page (With Individual SEO &amp; Template Layout)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create standard pages, landing pages, or additional service pages without coding.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                    New Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Website Designing in Noida"
                    value={newPageTitle}
                    onChange={(e) => {
                      setNewPageTitle(e.target.value);
                      setNewPageSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]+/g, '-')
                          .replace(/^-|-$/g, '')
                      );
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                    SEO-Friendly URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPageSlug}
                    onChange={(e) =>
                      setNewPageSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]+/g, '-')
                          .replace(/^-|-$/g, '')
                      )
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#0A2540] mb-1.5">
                    Page Template
                  </label>
                  <select
                    value={newPageTemplate}
                    onChange={(e) => setNewPageTemplate(e.target.value as CMSPage['template'])}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="standard">Standard Content Page</option>
                    <option value="service">Service Landing Page</option>
                    <option value="portfolio">Portfolio Showcase</option>
                    <option value="faq">FAQ Page</option>
                    <option value="contact">Contact / Lead Page</option>
                    <option value="legal">Legal / Policy Page</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-semibold rounded-xl btn-hover-lift flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Page</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                    SEO Meta Title (Optional — Auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website Designing in Noida | ShivWebsIndia"
                    value={newPageSeoTitle}
                    onChange={(e) => setNewPageSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A2540] mb-1">
                    SEO Meta Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief SEO summary for Google search results..."
                    value={newPageMetaDesc}
                    onChange={(e) => setNewPageMetaDesc(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <WordPressRichEditor
                  label="Complete Page Content / Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                  value={newPageContent}
                  onChange={setNewPageContent}
                  mediaLibrary={cms.media}
                  minHeight="220px"
                  helperText="Supports Visual WordPress Editor, HTML Code Editor, and Split Live Preview for your new page."
                />
              </div>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-base font-bold text-[#0A2540]">
                  All Website Pages ({cms.pages.length})
                </h2>
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
                  {['all', 'published', 'draft', 'unpublished', 'trashed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setPageStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer ${
                        pageStatusFilter === st
                          ? 'bg-[#0A2540] text-white'
                          : 'text-slate-600 hover:text-[#0A2540]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                      <th className="py-3.5 px-4">Title &amp; URL</th>
                      <th className="py-3.5 px-4">Template</th>
                      <th className="py-3.5 px-4">Blocks</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cms.pages
                      .filter((p) => pageStatusFilter === 'all' || p.status === pageStatusFilter)
                      .map((page) => (
                        <React.Fragment key={page.id}>
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#0A2540] text-sm">{page.title}</div>
                              <div className="font-mono text-slate-500">
                                /{page.slug === 'home' ? '' : page.slug}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono">{page.template}</td>
                            <td className="py-3.5 px-4 font-mono tabular-nums">
                              {page.sections.length}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`font-semibold capitalize ${
                                  page.status === 'published'
                                    ? 'text-emerald-700'
                                    : page.status === 'trashed'
                                    ? 'text-red-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {page.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingPageId(editingPageId === page.id ? null : page.id)
                                }
                                className="px-3 py-1.5 bg-[#0096e8] hover:bg-[#0284c7] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                {editingPageId === page.id ? 'Close Edit' : '✏️ Edit Page & SEO'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPageId(page.id);
                                  setActiveTab('builder');
                                }}
                                className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#FF6A00] text-white font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                Manage Content Blocks ({page.sections.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => onPreviewPage(page.slug)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-semibold rounded-lg cursor-pointer"
                              >
                                Preview
                              </button>
                              {page.status !== 'published' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePageStatus(page.id, 'published')}
                                  className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg cursor-pointer"
                                >
                                  Publish
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePageStatus(page.id, 'unpublished')}
                                  className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg cursor-pointer"
                                >
                                  Unpublish
                                </button>
                              )}
                              {confirmDeletePageId === page.id ? (
                                <button
                                  type="button"
                                  onClick={() => handlePermanentDeletePage(page.id)}
                                  className="px-3 py-1.5 bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                                >
                                  Confirm Delete
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeletePageId(page.id)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-semibold rounded-lg cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>

                          {/* INLINE MANUAL PAGE & SEO EDITOR DRAWER */}
                          {editingPageId === page.id && (
                            <tr className="bg-slate-50/90 border-b border-slate-200">
                              <td colSpan={5} className="p-6">
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                                    <h4 className="font-display text-sm font-bold text-[#0A2540]">
                                      Manual Page &amp; Quick SEO Editor — {page.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedPageId(page.id);
                                          setActiveTab('seo');
                                        }}
                                        className="px-3 py-1 rounded-lg bg-[#FF6A00] text-white text-xs font-bold cursor-pointer"
                                      >
                                        Open Full Schema &amp; SEO Studio →
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingPageId(null)}
                                        className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        Page Title
                                      </label>
                                      <input
                                        type="text"
                                        value={page.title}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id ? { ...p, title: val } : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        URL Slug
                                      </label>
                                      <input
                                        type="text"
                                        value={page.slug}
                                        onChange={(e) => {
                                          const val = e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]+/g, '-');
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id ? { ...p, slug: val } : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        Template Layout
                                      </label>
                                      <select
                                        value={page.template}
                                        onChange={(e) => {
                                          const val = e.target.value as CMSPage['template'];
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id ? { ...p, template: val } : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                                      >
                                        <option value="standard">Standard Page</option>
                                        <option value="service">Service Page</option>
                                        <option value="home">Home Page</option>
                                        <option value="portfolio">Portfolio</option>
                                        <option value="blog">Blog</option>
                                        <option value="faq">FAQ Knowledgebase</option>
                                        <option value="contact">Contact Page</option>
                                        <option value="legal">Legal / Policy</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        SEO Meta Title
                                      </label>
                                      <input
                                        type="text"
                                        value={page.seo.seo_title}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id
                                                ? { ...p, seo: { ...p.seo, seo_title: val } }
                                                : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        Schema.org Type (JSON-LD)
                                      </label>
                                      <select
                                        value={page.seo.schema_type || 'WebPage'}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id
                                                ? { ...p, seo: { ...p.seo, schema_type: val } }
                                                : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono bg-white"
                                      >
                                        <option value="WebPage">WebPage</option>
                                        <option value="ProfessionalService">
                                          ProfessionalService (Agency)
                                        </option>
                                        <option value="LocalBusiness">LocalBusiness</option>
                                        <option value="Service">Service</option>
                                        <option value="FAQPage">FAQPage</option>
                                        <option value="AboutPage">AboutPage</option>
                                        <option value="ContactPage">ContactPage</option>
                                        <option value="CollectionPage">CollectionPage</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">
                                        Focus Keywords (Comma Separated)
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="website design ghaziabad, seo agency delhi ncr"
                                        value={page.seo.focus_keywords || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id
                                                ? { ...p, seo: { ...p.seo, focus_keywords: val } }
                                                : p
                                            ),
                                          }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold mb-1">
                                      Meta Description
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={page.seo.meta_description}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          pages: prev.pages.map((p) =>
                                            p.id === page.id
                                              ? { ...p, seo: { ...p.seo, meta_description: val } }
                                              : p
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>

                                  {/* WordPress-Style Rich Content Editor & Text Block Manager for This Page */}
                                  <div className="pt-3 border-t border-slate-200 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <h5 className="text-xs font-extrabold text-[#0A2540]">
                                          Page Text Block &amp; Complete Article Body (WordPress Visual + HTML Editor)
                                        </h5>
                                        <p className="text-[11px] text-slate-500">
                                          Edit this page&apos;s main rich HTML content block or add additional Rich Text blocks directly to the page.
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const maxOrder = Math.max(
                                            0,
                                            ...page.sections.map((s) => s.sort_order)
                                          );
                                          const newTextSec: PageSection = {
                                            id: Date.now(),
                                            page_id: page.id,
                                            section_type: 'heading_richtext',
                                            title: `${page.title} — Content Block`,
                                            subtitle: 'ShivWebsIndia · Ghaziabad & Delhi NCR',
                                            sort_order: maxOrder + 1,
                                            is_enabled: true,
                                            content_json: {
                                              body_html:
                                                '<h2>New Content Section Heading</h2>\n<p>Enter your rich text, images, links, lists, and tables here...</p>',
                                            },
                                          };
                                          setCms((prev) => ({
                                            ...prev,
                                            pages: prev.pages.map((p) =>
                                              p.id === page.id
                                                ? { ...p, sections: [...p.sections, newTextSec] }
                                                : p
                                            ),
                                          }));
                                          setSelectedPageId(page.id);
                                          setEditingSectionId(newTextSec.id);
                                          setActiveTab('builder');
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold cursor-pointer transition-colors"
                                      >
                                        + Add New Text Block Section to Page
                                      </button>
                                    </div>

                                    <WordPressRichEditor
                                      label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                                      value={
                                        page.content ||
                                        page.sections.find(
                                          (s) => s.section_type === 'heading_richtext'
                                        )?.content_json?.body_html ||
                                        page.sections.find(
                                          (s) => s.section_type === 'text_with_image'
                                        )?.content_json?.body ||
                                        ''
                                      }
                                      onChange={(html) => {
                                        setCms((prev) => ({
                                          ...prev,
                                          pages: prev.pages.map((p) => {
                                            if (p.id !== page.id) return p;
                                            const hasRichSec = p.sections.some(
                                              (s) => s.section_type === 'heading_richtext'
                                            );
                                            const updatedSections = hasRichSec
                                              ? p.sections.map((s, idx) =>
                                                  s.section_type === 'heading_richtext' &&
                                                  idx ===
                                                    p.sections.findIndex(
                                                      (x) => x.section_type === 'heading_richtext'
                                                    )
                                                    ? {
                                                        ...s,
                                                        content_json: {
                                                          ...(s.content_json || {}),
                                                          body_html: html,
                                                        },
                                                      }
                                                    : s
                                                )
                                              : p.sections;
                                            return {
                                              ...p,
                                              content: html,
                                              updated_at: new Date().toISOString(),
                                              sections: updatedSections,
                                            };
                                          }),
                                        }));
                                      }}
                                      mediaLibrary={cms.media}
                                      minHeight="260px"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC PAGE BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-display text-base font-bold text-[#0A2540]">
                Add Content Section to &ldquo;{selectedPage.title}&rdquo;
              </h2>
              <form
                onSubmit={handleAddSectionBlock}
                className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
              >
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold mb-1.5">Section Type</label>
                  <select
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="hero_banner">Hero Banner</option>
                    <option value="heading_richtext">Heading &amp; Rich Text</option>
                    <option value="text_with_image">Text with Image &amp; Deliverables</option>
                    <option value="service_cards">Service Cards Grid</option>
                    <option value="features_grid">Features / Why Choose Us Grid</option>
                    <option value="verified_statistics">Verified Business Statistics</option>
                    <option value="portfolio_grid">Portfolio Showcase Grid</option>
                    <option value="process_workflow">4-Stage Process Workflow</option>
                    <option value="pricing_table">Pricing / Engagement Tiers</option>
                    <option value="faq_accordion">FAQ Accordion</option>
                    <option value="related_services">Related Services</option>
                    <option value="blog_listing">Blog Listing</option>
                    <option value="cta_banner">CTA Banner</option>
                    <option value="contact_form">Lead Capture Contact Form</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold mb-1.5">Section Heading</label>
                  <input
                    type="text"
                    placeholder="Section heading..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    placeholder="Supporting subtitle..."
                    value={newSectionSubtitle}
                    onChange={(e) => setNewSectionSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 bg-[#FF6A00] text-white font-semibold text-xs rounded-xl btn-hover-lift cursor-pointer"
                  >
                    + Add Section
                  </button>
                </div>
              </form>
            </div>

            {/* Page Switcher Bar inside Builder so Admin can switch between any page immediately */}
            <div className="bg-[#0A2540] text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase text-[#FF6A00] font-bold">
                  Manual Page Content Builder (Add / Edit / Delete Sections)
                </div>
                <div className="text-sm font-bold mt-0.5">
                  Editing Page: {selectedPage.title} (/{selectedPage.slug === 'home' ? '' : selectedPage.slug})
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const maxOrder = Math.max(
                      0,
                      ...selectedPage.sections.map((s) => s.sort_order)
                    );
                    const newSec: PageSection = {
                      id: Date.now(),
                      page_id: selectedPage.id,
                      section_type: 'heading_richtext',
                      title: `${selectedPage.title} — Rich Text Block`,
                      subtitle: 'ShivWebsIndia · Ghaziabad & Delhi NCR',
                      sort_order: maxOrder + 1,
                      is_enabled: true,
                      content_json: {
                        body_html:
                          '<h2>Section Heading</h2>\n<p>Write your complete content here using the WordPress-style visual &amp; HTML editor...</p>',
                      },
                    };
                    setCms((prev) => ({
                      ...prev,
                      pages: prev.pages.map((p) =>
                        p.id === selectedPage.id
                          ? { ...p, sections: [...p.sections, newSec] }
                          : p
                      ),
                    }));
                    setEditingSectionId(newSec.id);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  + Quick Add Rich Text Block
                </button>
                <select
                  value={selectedPage.id}
                  onChange={(e) => setSelectedPageId(Number(e.target.value))}
                  className="px-3.5 py-2 rounded-xl bg-white text-[#0A2540] text-xs font-bold"
                >
                  {cms.pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (/{p.slug === 'home' ? '' : p.slug})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onPreviewPage(selectedPage.slug)}
                  className="px-3.5 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold cursor-pointer"
                >
                  Preview Live Page ↗
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[...selectedPage.sections]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((sec, idx, arr) => {
                  const isEditingSec = editingSectionId === sec.id;
                  const payload = sec.content_json || {};

                  const updateSectionPayload = (patch: Record<string, any>) => {
                    setCms((prev) => ({
                      ...prev,
                      pages: prev.pages.map((p) =>
                        p.id === selectedPage.id
                          ? {
                              ...p,
                              sections: p.sections.map((s) =>
                                s.id === sec.id
                                  ? { ...s, content_json: { ...(s.content_json || {}), ...patch } }
                                  : s
                              ),
                            }
                          : p
                      ),
                    }));
                  };

                  return (
                    <div
                      key={sec.id}
                      className={`bg-white border rounded-2xl p-5 transition-all ${
                        sec.is_enabled
                          ? 'border-slate-200'
                          : 'border-slate-200 opacity-60 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-[240px] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="font-bold text-[#8B1E1E] tabular-nums">
                              #{sec.sort_order}
                            </span>
                            <span>·</span>
                            <span className="text-[#0A2540] font-semibold">{sec.section_type}</span>
                            <span>·</span>
                            <span>{sec.is_enabled ? 'Visible' : 'Hidden'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Section Heading"
                              value={sec.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCms((prev) => ({
                                  ...prev,
                                  pages: prev.pages.map((p) =>
                                    p.id === selectedPage.id
                                      ? {
                                          ...p,
                                          sections: p.sections.map((s) =>
                                            s.id === sec.id ? { ...s, title: val } : s
                                          ),
                                        }
                                      : p
                                  ),
                                }));
                              }}
                              className="font-display text-sm font-bold text-[#0A2540] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full"
                            />
                            <input
                              type="text"
                              placeholder="Section Subtitle"
                              value={sec.subtitle}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCms((prev) => ({
                                  ...prev,
                                  pages: prev.pages.map((p) =>
                                    p.id === selectedPage.id
                                      ? {
                                          ...p,
                                          sections: p.sections.map((s) =>
                                            s.id === sec.id ? { ...s, subtitle: val } : s
                                          ),
                                        }
                                      : p
                                  ),
                                }));
                              }}
                              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSectionId(isEditingSec ? null : sec.id)
                            }
                            className="px-3 py-1.5 bg-[#0096e8] hover:bg-[#0284c7] text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            {isEditingSec ? 'Close Content Editor' : '✏️ Edit Content'}
                          </button>
                          <button
                            onClick={() => handleMoveSection(sec.id, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(sec.id, 'down')}
                            disabled={idx === arr.length - 1}
                            title="Move Down"
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateSection(sec)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={() => handleToggleSection(sec.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                              sec.is_enabled
                                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {sec.is_enabled ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => {
                              setCms((prev) => ({
                                ...prev,
                                pages: prev.pages.map((p) =>
                                  p.id === selectedPage.id
                                    ? {
                                        ...p,
                                        sections: p.sections.filter((s) => s.id !== sec.id),
                                      }
                                    : p
                                ),
                              }));
                            }}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED DEEP CONTENT EDITOR FOR THIS SECTION */}
                      {isEditingSec && (
                        <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/70 rounded-xl p-4 space-y-4">
                          {sec.section_type === 'heading_richtext' && (
                            <WordPressRichEditor
                              label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                              value={payload.body_html || ''}
                              onChange={(html) => updateSectionPayload({ body_html: html })}
                              mediaLibrary={cms.media}
                              minHeight="280px"
                              helperText="WordPress-style Visual WYSIWYG, HTML Code, and Split Preview editor for this page section."
                            />
                          )}

                          {sec.section_type === 'text_with_image' && (
                            <div className="space-y-4">
                              <WordPressRichEditor
                                label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                                value={payload.body || ''}
                                onChange={(html) => updateSectionPayload({ body: html })}
                                mediaLibrary={cms.media}
                                minHeight="260px"
                                helperText="Format the main body of this Service / Content block with Headings, Lists, Tables, Links & Images."
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                                    Featured Section Image URL
                                  </label>
                                  <input
                                    type="text"
                                    value={payload.image_url || ''}
                                    onChange={(e) =>
                                      updateSectionPayload({ image_url: e.target.value })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                                    Deliverables / Bullet Points (One per line)
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={
                                      Array.isArray(payload.highlights)
                                        ? payload.highlights.join('\n')
                                        : ''
                                    }
                                    onChange={(e) =>
                                      updateSectionPayload({
                                        highlights: e.target.value
                                          .split('\n')
                                          .map((x) => x.trim())
                                          .filter(Boolean),
                                      })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {(sec.section_type === 'hero_banner' ||
                            sec.section_type === 'cta_banner') && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                                  Primary CTA Button Text
                                </label>
                                <input
                                  type="text"
                                  value={payload.primary_cta_text || 'Request a Quote'}
                                  onChange={(e) =>
                                    updateSectionPayload({ primary_cta_text: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                                  Primary CTA Target URL
                                </label>
                                <input
                                  type="text"
                                  value={payload.primary_cta_url || '/contact-us'}
                                  onChange={(e) =>
                                    updateSectionPayload({ primary_cta_url: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                                  Hero Image URL (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={payload.hero_image || ''}
                                  onChange={(e) =>
                                    updateSectionPayload({ hero_image: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-mono font-bold text-slate-500 mb-1">
                              Advanced Section JSON Payload (Direct Manual Edit)
                            </label>
                            <textarea
                              rows={4}
                              defaultValue={JSON.stringify(payload, null, 2)}
                              onBlur={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  updateSectionPayload(parsed);
                                } catch {
                                  // Ignore invalid JSON until fixed
                                }
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SEO & DYNAMIC SCHEMA MANAGER */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl w-fit">
                {[
                  { id: 'page_meta', label: `Page SEO & Schema (/${selectedPage.slug})` },
                  { id: 'all_pages_seo', label: `All Pages SEO Matrix (${cms.pages.length})` },
                  { id: 'redirects', label: `301 & 302 Redirects (${cms.redirects.length})` },
                  { id: 'sitemap_robots', label: 'XML Sitemap & robots.txt' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSeoSubTab(t.id as any)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      seoSubTab === t.id ? 'bg-[#0A2540] text-white shadow-sm' : 'text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0A2540]">Select Page:</span>
                <select
                  value={selectedPage.id}
                  onChange={(e) => setSelectedPageId(Number(e.target.value))}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                >
                  {cms.pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (/{p.slug === 'home' ? '' : p.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {seoSubTab === 'page_meta' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      Dynamic SEO &amp; OpenGraph Controls — {selectedPage.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Live Head Sync Active
                    </span>
                  </div>

                  {/* Google SERP Snippet Live Preview */}
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Google Search Result Live Preview
                    </div>
                    <div className="text-xs text-emerald-700 truncate font-mono">
                      {selectedPage.seo.canonical_url}
                    </div>
                    <div className="text-base font-bold text-[#1a0dab] hover:underline truncate">
                      {selectedPage.seo.seo_title || selectedPage.title}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {selectedPage.seo.meta_description}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">SEO Title</label>
                      <input
                        type="text"
                        value={selectedPage.seo.seo_title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, seo_title: val } }
                                : p
                            ),
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Canonical URL</label>
                      <input
                        type="url"
                        value={selectedPage.seo.canonical_url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, canonical_url: val } }
                                : p
                            ),
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Meta Description</label>
                    <textarea
                      rows={3}
                      value={selectedPage.seo.meta_description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCms((prev) => ({
                          ...prev,
                          pages: prev.pages.map((p) =>
                            p.id === selectedPage.id
                              ? { ...p, seo: { ...p.seo, meta_description: val } }
                              : p
                          ),
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Focus Keywords (Comma Separated)
                      </label>
                      <input
                        type="text"
                        placeholder="website design ghaziabad, seo services delhi ncr"
                        value={selectedPage.seo.focus_keywords || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, focus_keywords: val } }
                                : p
                            ),
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        OpenGraph Title (Social Share)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.seo.og_title || selectedPage.seo.seo_title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, og_title: val } }
                                : p
                            ),
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPage.seo.robots_index}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, robots_index: checked } }
                                : p
                            ),
                          }));
                        }}
                      />
                      <span>Allow Search Indexing</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPage.seo.robots_follow}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, robots_follow: checked } }
                                : p
                            ),
                          }));
                        }}
                      />
                      <span>Follow Links</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPage.seo.include_in_sitemap}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCms((prev) => ({
                            ...prev,
                            pages: prev.pages.map((p) =>
                              p.id === selectedPage.id
                                ? { ...p, seo: { ...p.seo, include_in_sitemap: checked } }
                                : p
                            ),
                          }));
                        }}
                      />
                      <span>Include in XML Sitemap</span>
                    </label>
                  </div>
                </div>

                {/* DYNAMIC SCHEMA.ORG JSON-LD GENERATOR & CUSTOM EDITOR */}
                <div className="lg:col-span-5 bg-[#0A2540] text-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6A00] font-bold">
                        Schema.org Structured Data (JSON-LD)
                      </span>
                      <h4 className="font-display text-base font-bold text-white mt-0.5">
                        Dynamic Schema Graph Builder
                      </h4>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Primary Page Schema Type
                    </label>
                    <select
                      value={selectedPage.seo.schema_type || 'WebPage'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCms((prev) => ({
                          ...prev,
                          pages: prev.pages.map((p) =>
                            p.id === selectedPage.id
                              ? { ...p, seo: { ...p.seo, schema_type: val } }
                              : p
                          ),
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono"
                    >
                      <option value="ProfessionalService" className="text-black">
                        ProfessionalService (Agency + LocalBusiness)
                      </option>
                      <option value="LocalBusiness" className="text-black">
                        LocalBusiness (Geo + AggregateRating 4.9★)
                      </option>
                      <option value="Service" className="text-black">
                        Service (Service Offerings &amp; AreaServed)
                      </option>
                      <option value="FAQPage" className="text-black">
                        FAQPage (Dynamic Q&amp;A Rich Results)
                      </option>
                      <option value="WebPage" className="text-black">
                        WebPage + BreadcrumbList
                      </option>
                      <option value="AboutPage" className="text-black">
                        AboutPage
                      </option>
                      <option value="ContactPage" className="text-black">
                        ContactPage
                      </option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Custom JSON-LD Schema Override (Optional)
                      </label>
                      {selectedPage.seo.custom_schema_json && (
                        <button
                          type="button"
                          onClick={() => {
                            setCms((prev) => ({
                              ...prev,
                              pages: prev.pages.map((p) =>
                                p.id === selectedPage.id
                                  ? { ...p, seo: { ...p.seo, custom_schema_json: '' } }
                                  : p
                              ),
                            }));
                          }}
                          className="text-[11px] text-[#FF6A00] underline cursor-pointer"
                        >
                          Reset to Auto-Generated Graph
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={11}
                      value={
                        selectedPage.seo.custom_schema_json ||
                        JSON.stringify(
                          {
                            '@context': 'https://schema.org',
                            '@graph': [
                              {
                                '@type': ['ProfessionalService', 'LocalBusiness'],
                                '@id': 'https://www.shivwebsindia.com/#organization',
                                name: cms.settings.brand_name,
                                telephone: cms.settings.contact_phone,
                                email: cms.settings.contact_email,
                                address: {
                                  '@type': 'PostalAddress',
                                  streetAddress: cms.settings.office_address,
                                  addressLocality: 'Ghaziabad',
                                  addressRegion: 'UP',
                                  postalCode: '201010',
                                  addressCountry: 'IN',
                                },
                              },
                              {
                                '@type': selectedPage.seo.schema_type || 'WebPage',
                                name: selectedPage.seo.seo_title,
                                description: selectedPage.seo.meta_description,
                                url: selectedPage.seo.canonical_url,
                              },
                            ],
                          },
                          null,
                          2
                        )
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setCms((prev) => ({
                          ...prev,
                          pages: prev.pages.map((p) =>
                            p.id === selectedPage.id
                              ? { ...p, seo: { ...p.seo, custom_schema_json: val } }
                              : p
                          ),
                        }));
                      }}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-emerald-300 font-mono text-[11px] leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-300 mt-1.5">
                      Automatically injected into <code className="text-[#FF6A00]">&lt;script type=&quot;application/ld+json&quot;&gt;</code> when visitors open this page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {seoSubTab === 'all_pages_seo' && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      All Pages SEO &amp; Schema Quick Matrix ({cms.pages.length} Pages)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Edit SEO Title, Meta Description, and Schema Type across all pages in one place.
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-slate-200">
                  {cms.pages.map((p) => (
                    <div key={p.id} className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      <div className="lg:col-span-3">
                        <div className="font-bold text-sm text-[#0A2540]">{p.title}</div>
                        <div className="font-mono text-xs text-[#8B1E1E]">
                          /{p.slug === 'home' ? '' : p.slug}
                        </div>
                        <select
                          value={p.seo.schema_type || 'WebPage'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCms((prev) => ({
                              ...prev,
                              pages: prev.pages.map((item) =>
                                item.id === p.id
                                  ? { ...item, seo: { ...item.seo, schema_type: val } }
                                  : item
                              ),
                            }));
                          }}
                          className="mt-2 w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono bg-slate-50"
                        >
                          <option value="ProfessionalService">ProfessionalService</option>
                          <option value="LocalBusiness">LocalBusiness</option>
                          <option value="Service">Service</option>
                          <option value="FAQPage">FAQPage</option>
                          <option value="WebPage">WebPage</option>
                          <option value="AboutPage">AboutPage</option>
                          <option value="ContactPage">ContactPage</option>
                        </select>
                      </div>
                      <div className="lg:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          SEO Title
                        </label>
                        <input
                          type="text"
                          value={p.seo.seo_title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCms((prev) => ({
                              ...prev,
                              pages: prev.pages.map((item) =>
                                item.id === p.id
                                  ? { ...item, seo: { ...item.seo, seo_title: val } }
                                  : item
                              ),
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="lg:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={p.seo.meta_description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCms((prev) => ({
                              ...prev,
                              pages: prev.pages.map((item) =>
                                item.id === p.id
                                  ? { ...item, seo: { ...item.seo, meta_description: val } }
                                  : item
                              ),
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {seoSubTab === 'redirects' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newRedirectSource.trim() || !newRedirectTarget.trim()) return;
                    const src = newRedirectSource.startsWith('/')
                      ? newRedirectSource.trim()
                      : `/${newRedirectSource.trim()}`;
                    const rule: RedirectRule = {
                      id: Date.now(),
                      source_path: src,
                      target_url: newRedirectTarget.trim(),
                      status_code: newRedirectCode,
                      hits_count: 0,
                      is_active: true,
                      created_at: new Date().toISOString(),
                    };
                    setCms((prev) => ({ ...prev, redirects: [rule, ...prev.redirects] }));
                    setNewRedirectSource('');
                    setNewRedirectTarget('');
                  }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                >
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold mb-1.5">Old URL Path</label>
                    <input
                      type="text"
                      required
                      placeholder="/old-page.php"
                      value={newRedirectSource}
                      onChange={(e) => setNewRedirectSource(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold mb-1.5">New Destination</label>
                    <input
                      type="text"
                      required
                      placeholder="/website-design-and-development"
                      value={newRedirectTarget}
                      onChange={(e) => setNewRedirectTarget(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Type</label>
                    <select
                      value={newRedirectCode}
                      onChange={(e) => setNewRedirectCode(Number(e.target.value) as 301 | 302)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                    >
                      <option value={301}>301 Permanent</option>
                      <option value={302}>302 Temporary</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 bg-[#FF6A00] text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      + Add Redirect
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2.5">Source URL</th>
                        <th className="py-2.5">Destination</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Hits</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {cms.redirects.map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 text-[#8B1E1E]">{r.source_path}</td>
                          <td className="py-3 text-emerald-700">{r.target_url}</td>
                          <td className="py-3">{r.status_code}</td>
                          <td className="py-3 tabular-nums">{r.hits_count}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  redirects: prev.redirects.filter((x) => x.id !== r.id),
                                }))
                              }
                              className="text-red-600 hover:underline font-sans cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {seoSubTab === 'sitemap_robots' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0A2540] text-slate-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto">
                  <div className="text-[#FF6A00] font-bold mb-2">Live /sitemap.xml</div>
                  <pre className="leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cms.pages
  .filter((p) => p.status === 'published' && p.seo.robots_index && p.seo.include_in_sitemap)
  .map(
    (p) =>
      `  <url>\n    <loc>https://www.shivwebsindia.com/${
        p.slug === 'home' ? '' : p.slug
      }</loc>\n  </url>`
  )
  .join('\n')}
</urlset>`}
                  </pre>
                </div>

                <div className="bg-[#0A2540] text-slate-200 rounded-2xl p-6 font-mono text-xs">
                  <div className="text-[#FF6A00] font-bold mb-2">Live /robots.txt</div>
                  <pre className="leading-relaxed">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /preview/
Sitemap: https://www.shivwebsindia.com/sitemap.xml`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-display text-base font-bold text-[#0A2540]">
                Upload New Image Asset
              </h3>

              {uploadFeedback.type !== 'idle' && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs font-medium ${
                    uploadFeedback.type === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {uploadFeedback.msg}
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold mb-1.5">Image File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. client-banner.webp"
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold mb-1.5">Alt Text (SEO) *</label>
                  <input
                    type="text"
                    placeholder="Describe the image..."
                    value={uploadAltText}
                    onChange={(e) => setUploadAltText(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSimulateMediaUpload(
                        uploadFilename || 'agency-showcase.webp',
                        uploadAltText
                      )
                    }
                    className="w-full py-2.5 px-3 bg-[#FF6A00] text-white text-xs font-semibold rounded-xl btn-hover-lift cursor-pointer"
                  >
                    Upload Image
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cms.media.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between agency-card-hover"
                >
                  <div>
                    <div className="aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-200">
                      <img
                        src={m.file_path}
                        alt={m.alt_text}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-xs space-y-1.5">
                      <div className="font-bold text-[#0A2540] truncate">{m.original_name}</div>
                      <div className="text-slate-500">
                        {m.mime_type} · {m.width}×{m.height}px
                      </div>
                      <input
                        type="text"
                        value={m.alt_text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCms((prev) => ({
                            ...prev,
                            media: prev.media.map((item) =>
                              item.id === m.id ? { ...item, alt_text: val } : item
                            ),
                          }));
                        }}
                        className="w-full mt-2 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate max-w-[140px]">
                      {m.used_in_pages.length > 0
                        ? `Used on ${m.used_in_pages.length} pages`
                        : 'Unused'}
                    </span>
                    <button
                      onClick={() => {
                        if (m.used_in_pages.length > 0) {
                          setUploadFeedback({
                            type: 'err',
                            msg: `Cannot delete "${m.original_name}" because it is active on published pages (${m.used_in_pages.join(', ')}).`,
                          });
                          return;
                        }
                        setCms((prev) => ({
                          ...prev,
                          media: prev.media.filter((x) => x.id !== m.id),
                        }));
                      }}
                      className="text-red-600 font-semibold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLETE BLOG MANAGEMENT SYSTEM (Posts, Rich Editor, FAQs, Categories & Tags, Individual SEO) */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Sub-navigation between Blog Posts & Categories/Tags */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBlogSubTab('posts')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    blogSubTab === 'posts'
                      ? 'bg-[#0A2540] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0A2540]'
                  }`}
                >
                  Blog Articles ({cms.blog_posts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBlogSubTab('categories_tags')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    blogSubTab === 'categories_tags'
                      ? 'bg-[#0A2540] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0A2540]'
                  }`}
                >
                  Categories ({(cms.blog_categories || []).length}) &amp; Tags (
                  {(cms.blog_tags || []).length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => onPreviewPage('blog')}
                className="px-4 py-2 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold cursor-pointer"
              >
                Preview Public Blog Page (/blog) ↗
              </button>
            </div>

            {blogSubTab === 'posts' && (
              <div className="space-y-6">
                {/* Create / Publish / Save Draft Blog Post Form with Rich Content Toolbar, FAQs & SEO */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBlogTitle.trim()) return;
                    const slug = (newBlogSlug || newBlogTitle)
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/^-|-$/g, '');

                    const parsedTags = newBlogTagsInput
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean);

                    const post: BlogPost = {
                      id: Date.now(),
                      title: newBlogTitle.trim(),
                      slug,
                      excerpt:
                        newBlogExcerpt.trim() ||
                        'Practical engineering and digital marketing insights from ShivWebsIndia.',
                      content:
                        newBlogContent.trim() ||
                        `<p>${
                          newBlogExcerpt.trim() ||
                          'Article published via the ShivWebsIndia Blog Management CMS.'
                        }</p>`,
                      category: newBlogCategory.trim() || 'Website Design',
                      tags: parsedTags.length > 0 ? parsedTags : ['Website Design', 'Ghaziabad'],
                      featured_image_url:
                        newBlogFeaturedImage.trim() ||
                        cms.media[0]?.file_path ||
                        'https://www.shivwebsindia.com/wp-content/uploads/2026/07/Professional-Website-in-Ghaziabad-270x188.webp',
                      featured_image_alt: newBlogTitle.trim(),
                      author_name: 'ShivWebsIndia Editorial Team',
                      status: newBlogStatus,
                      seo_title:
                        newBlogSeoTitle.trim() || `${newBlogTitle.trim()} | ShivWebsIndia Blog`,
                      meta_description:
                        newBlogMetaDesc.trim() ||
                        newBlogExcerpt.trim() ||
                        `Read ${newBlogTitle.trim()} on the ShivWebsIndia blog.`,
                      focus_keywords:
                        newBlogKeywords.trim() || parsedTags.join(', ').toLowerCase(),
                      canonical_url: `https://www.shivwebsindia.com/blog/${slug}`,
                      robots_index: true,
                      reading_time_minutes: Math.max(
                        3,
                        Math.ceil((newBlogContent.length || 600) / 500)
                      ),
                      published_at: new Date().toISOString(),
                      faqs: newBlogFaqs,
                    };
                    setCms((prev) => ({ ...prev, blog_posts: [post, ...prev.blog_posts] }));
                    logAudit(
                      `Created blog post "${post.title}" (${post.status})`,
                      'blog',
                      String(post.id)
                    );
                    setNewBlogTitle('');
                    setNewBlogSlug('');
                    setNewBlogExcerpt('');
                    setNewBlogSeoTitle('');
                    setNewBlogMetaDesc('');
                    setNewBlogKeywords('');
                    setNewBlogFaqs([]);
                  }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#0A2540]">
                        Create New Blog Post (Rich Formatting, Tables, FAQs &amp; Individual SEO)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Each post automatically gets its own dedicated URL at{' '}
                        <code className="font-mono text-[#8B1E1E]">/blog/your-post-slug</code>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold mb-1.5">Article Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Top Local SEO Strategies for Businesses in Ghaziabad"
                        value={newBlogTitle}
                        onChange={(e) => {
                          setNewBlogTitle(e.target.value);
                          setNewBlogSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, '-')
                              .replace(/^-|-$/g, '')
                          );
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold mb-1.5">
                        SEO-Friendly URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="top-local-seo-strategies-ghaziabad"
                        value={newBlogSlug}
                        onChange={(e) =>
                          setNewBlogSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, '-')
                              .replace(/^-|-$/g, '')
                          )
                        }
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold mb-1.5">Category</label>
                      <select
                        value={newBlogCategory}
                        onChange={(e) => setNewBlogCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                      >
                        {(cms.blog_categories || []).map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                        <option value="Website Design">Website Design</option>
                        <option value="SEO & Search">SEO &amp; Search</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold mb-1.5">
                        Featured Image URL
                      </label>
                      <input
                        type="text"
                        value={newBlogFeaturedImage}
                        onChange={(e) => setNewBlogFeaturedImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold mb-1.5">
                        Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={newBlogTagsInput}
                        onChange={(e) => setNewBlogTagsInput(e.target.value)}
                        placeholder="Website Design, Local SEO, Ghaziabad"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold mb-1.5">
                        Initial Status
                      </label>
                      <select
                        value={newBlogStatus}
                        onChange={(e) =>
                          setNewBlogStatus(e.target.value as 'published' | 'draft')
                        }
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                      >
                        <option value="published">Publish Immediately</option>
                        <option value="draft">Save as Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Short Excerpt / Summary (Displayed on Blog Listing Cards) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Write a compelling 1-2 sentence summary..."
                      value={newBlogExcerpt}
                      onChange={(e) => setNewBlogExcerpt(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  {/* WordPress-Style Rich HTML Content Editor with Visual / HTML / Split Modes */}
                  <WordPressRichEditor
                    label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                    value={newBlogContent}
                    onChange={setNewBlogContent}
                    mediaLibrary={cms.media}
                    minHeight="320px"
                    helperText="Full WordPress-style Visual & HTML Editor: format headings (H1-H4), paragraphs, bold/italic, lists, tables, links, and media library images."
                  />

                  {/* Article-Specific FAQs Builder */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A2540]">
                        Article FAQs ({newBlogFaqs.length} added — displayed at bottom of article)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="FAQ Question..."
                          value={draftBlogFaqQ}
                          onChange={(e) => setDraftBlogFaqQ(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="FAQ Answer..."
                          value={draftBlogFaqA}
                          onChange={(e) => setDraftBlogFaqA(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!draftBlogFaqQ.trim() || !draftBlogFaqA.trim()) return;
                            setNewBlogFaqs((prev) => [
                              ...prev,
                              { question: draftBlogFaqQ.trim(), answer: draftBlogFaqA.trim() },
                            ]);
                            setDraftBlogFaqQ('');
                            setDraftBlogFaqA('');
                          }}
                          className="w-full py-2 px-3 bg-[#0A2540] text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          + Add FAQ
                        </button>
                      </div>
                    </div>
                    {newBlogFaqs.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {newBlogFaqs.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs"
                          >
                            <div>
                              <strong className="text-[#0A2540]">Q: {f.question}</strong> —{' '}
                              <span className="text-slate-600">{f.answer}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setNewBlogFaqs((prev) => prev.filter((_, idx) => idx !== i))
                              }
                              className="text-red-600 font-bold ml-3 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Individual Blog SEO Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        placeholder="Custom SEO title..."
                        value={newBlogSeoTitle}
                        onChange={(e) => setNewBlogSeoTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        placeholder="Custom meta description..."
                        value={newBlogMetaDesc}
                        onChange={(e) => setNewBlogMetaDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Focus Keywords
                      </label>
                      <input
                        type="text"
                        placeholder="keyword 1, keyword 2..."
                        value={newBlogKeywords}
                        onChange={(e) => setNewBlogKeywords(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      onClick={() => setNewBlogStatus('published')}
                      className="px-6 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl btn-hover-lift cursor-pointer"
                    >
                      🚀 Publish Blog Post
                    </button>
                    <button
                      type="submit"
                      onClick={() => setNewBlogStatus('draft')}
                      className="px-5 py-2.5 bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      💾 Save as Draft
                    </button>
                  </div>
                </form>

                {/* Existing Blog Posts List with Status Filter, Inline Editor, Preview, Publish/Draft/Unpublish & Delete */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      All Blog Posts ({cms.blog_posts.length})
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
                      {['all', 'published', 'draft', 'unpublished'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setBlogStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer ${
                            blogStatusFilter === st
                              ? 'bg-[#0A2540] text-white'
                              : 'text-slate-600 hover:text-[#0A2540]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {cms.blog_posts
                      .filter(
                        (p) => blogStatusFilter === 'all' || p.status === blogStatusFilter
                      )
                      .map((post) => {
                        const isEditing = editingBlogId === post.id;
                        return (
                          <div key={post.id} className="p-5 space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <img
                                  src={post.featured_image_url}
                                  alt={post.title}
                                  className="w-20 h-14 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                                />
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="font-bold text-[#8B1E1E]">
                                      {post.category}
                                    </span>
                                    <span>·</span>
                                    <span className="font-mono text-slate-500">
                                      /blog/{post.slug}
                                    </span>
                                    <span>·</span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                                        post.status === 'published'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : post.status === 'draft'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-slate-200 text-slate-700'
                                      }`}
                                    >
                                      {post.status}
                                    </span>
                                  </div>
                                  <h4 className="font-display text-base font-bold text-[#0A2540] mt-1">
                                    {post.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                    {post.excerpt}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingBlogId(isEditing ? null : post.id)
                                  }
                                  className="px-3 py-1.5 bg-[#0096e8] hover:bg-[#0284c7] text-white text-xs font-bold rounded-lg cursor-pointer"
                                >
                                  {isEditing ? 'Close Editor' : '✏️ Edit Post & SEO'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onPreviewPage(`blog/${post.slug}`)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A2540] text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                  Preview
                                </button>
                                {post.status !== 'published' ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCms((prev) => ({
                                        ...prev,
                                        blog_posts: prev.blog_posts.map((b) =>
                                          b.id === post.id
                                            ? { ...b, status: 'published' }
                                            : b
                                        ),
                                      }))
                                    }
                                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                                  >
                                    Publish
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCms((prev) => ({
                                        ...prev,
                                        blog_posts: prev.blog_posts.map((b) =>
                                          b.id === post.id
                                            ? { ...b, status: 'unpublished' }
                                            : b
                                        ),
                                      }))
                                    }
                                    className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                                  >
                                    Unpublish
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCms((prev) => ({
                                      ...prev,
                                      blog_posts: prev.blog_posts.map((b) =>
                                        b.id === post.id ? { ...b, status: 'draft' } : b
                                      ),
                                    }))
                                  }
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                  Save Draft
                                </button>
                                {confirmDeleteBlogId === post.id ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCms((prev) => ({
                                        ...prev,
                                        blog_posts: prev.blog_posts.filter(
                                          (b) => b.id !== post.id
                                        ),
                                      }));
                                      setConfirmDeleteBlogId(null);
                                    }}
                                    className="px-3 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                  >
                                    Confirm Delete
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteBlogId(post.id)}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-semibold rounded-lg cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Expanded Full Blog Post Editor */}
                            {isEditing && (
                              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Article Title
                                    </label>
                                    <input
                                      type="text"
                                      value={post.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id ? { ...b, title: val } : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      URL Slug (/blog/...)
                                    </label>
                                    <input
                                      type="text"
                                      value={post.slug}
                                      onChange={(e) => {
                                        const val = e.target.value
                                          .toLowerCase()
                                          .replace(/[^a-z0-9-]+/g, '-');
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id
                                              ? {
                                                  ...b,
                                                  slug: val,
                                                  canonical_url: `https://www.shivwebsindia.com/blog/${val}`,
                                                }
                                              : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Category
                                    </label>
                                    <input
                                      type="text"
                                      value={post.category}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id ? { ...b, category: val } : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Featured Image URL
                                    </label>
                                    <input
                                      type="text"
                                      value={post.featured_image_url}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id
                                              ? { ...b, featured_image_url: val }
                                              : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Tags (Comma Separated)
                                    </label>
                                    <input
                                      type="text"
                                      value={(post.tags || []).join(', ')}
                                      onChange={(e) => {
                                        const tags = e.target.value
                                          .split(',')
                                          .map((t) => t.trim())
                                          .filter(Boolean);
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id ? { ...b, tags } : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold mb-1">
                                    Excerpt / Card Summary
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={post.excerpt}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCms((prev) => ({
                                        ...prev,
                                        blog_posts: prev.blog_posts.map((b) =>
                                          b.id === post.id ? { ...b, excerpt: val } : b
                                        ),
                                      }));
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                  />
                                </div>

                                {/* WordPress-Style Rich HTML Editor for Existing Blog Post */}
                                <WordPressRichEditor
                                  label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                                  value={post.content}
                                  onChange={(html) => {
                                    setCms((prev) => ({
                                      ...prev,
                                      blog_posts: prev.blog_posts.map((b) =>
                                        b.id === post.id ? { ...b, content: html } : b
                                      ),
                                    }));
                                  }}
                                  mediaLibrary={cms.media}
                                  minHeight="300px"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      SEO Meta Title
                                    </label>
                                    <input
                                      type="text"
                                      value={post.seo_title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id ? { ...b, seo_title: val } : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      SEO Meta Description
                                    </label>
                                    <input
                                      type="text"
                                      value={post.meta_description}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCms((prev) => ({
                                          ...prev,
                                          blog_posts: prev.blog_posts.map((b) =>
                                            b.id === post.id
                                              ? { ...b, meta_description: val }
                                              : b
                                          ),
                                        }));
                                      }}
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* BLOG CATEGORIES & TAGS CRUD MANAGER */}
            {blogSubTab === 'categories_tags' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categories CRUD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      Blog Categories ({(cms.blog_categories || []).length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create, edit, or delete blog categories used for filtering articles.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCatName.trim()) return;
                      const slug = newCatName
                        .toLowerCase()
                        .replace(/[^a-z0-9-]+/g, '-')
                        .replace(/^-|-$/g, '');
                      const nextCat: BlogCategory = {
                        id: Date.now(),
                        name: newCatName.trim(),
                        slug,
                        description: newCatDesc.trim(),
                      };
                      setCms((prev) => ({
                        ...prev,
                        blog_categories: [...(prev.blog_categories || []), nextCat],
                      }));
                      setNewCatName('');
                      setNewCatDesc('');
                    }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. E-Commerce Growth"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Short topic description..."
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 px-3 bg-[#FF6A00] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </form>

                  <div className="divide-y divide-slate-200 text-xs">
                    {(cms.blog_categories || []).map((cat) => (
                      <div
                        key={cat.id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        {editingCatId === cat.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCms((prev) => ({
                                  ...prev,
                                  blog_categories: (prev.blog_categories || []).map((c) =>
                                    c.id === cat.id ? { ...c, name: val } : c
                                  ),
                                }));
                              }}
                              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={cat.description || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCms((prev) => ({
                                  ...prev,
                                  blog_categories: (prev.blog_categories || []).map((c) =>
                                    c.id === cat.id ? { ...c, description: val } : c
                                  ),
                                }));
                              }}
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-[#0A2540]">{cat.name}</div>
                            {cat.description && (
                              <div className="text-slate-500">{cat.description}</div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCatId(editingCatId === cat.id ? null : cat.id)
                            }
                            className="px-2.5 py-1 rounded bg-slate-100 font-semibold cursor-pointer"
                          >
                            {editingCatId === cat.id ? 'Done' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCms((prev) => ({
                                ...prev,
                                blog_categories: (prev.blog_categories || []).filter(
                                  (c) => c.id !== cat.id
                                ),
                              }))
                            }
                            className="text-red-600 font-semibold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags CRUD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      Blog Tags ({(cms.blog_tags || []).length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create, edit, or delete topic tags displayed on blog posts.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTagName.trim()) return;
                      const slug = newTagName
                        .toLowerCase()
                        .replace(/[^a-z0-9-]+/g, '-')
                        .replace(/^-|-$/g, '');
                      const nextTag: BlogTag = {
                        id: Date.now(),
                        name: newTagName.trim(),
                        slug,
                      };
                      setCms((prev) => ({
                        ...prev,
                        blog_tags: [...(prev.blog_tags || []), nextTag],
                      }));
                      setNewTagName('');
                    }}
                    className="flex items-end gap-3"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1">
                        New Tag Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Core Web Vitals"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-[#FF6A00] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      + Add Tag
                    </button>
                  </form>

                  <div className="divide-y divide-slate-200 text-xs">
                    {(cms.blog_tags || []).map((tag) => (
                      <div
                        key={tag.id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        {editingTagId === tag.id ? (
                          <input
                            type="text"
                            value={tag.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCms((prev) => ({
                                ...prev,
                                blog_tags: (prev.blog_tags || []).map((t) =>
                                  t.id === tag.id ? { ...t, name: val } : t
                                ),
                              }));
                            }}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        ) : (
                          <span className="font-bold text-[#0A2540]">#{tag.name}</span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTagId(editingTagId === tag.id ? null : tag.id)
                            }
                            className="px-2.5 py-1 rounded bg-slate-100 font-semibold cursor-pointer"
                          >
                            {editingTagId === tag.id ? 'Done' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCms((prev) => ({
                                ...prev,
                                blog_tags: (prev.blog_tags || []).filter(
                                  (t) => t.id !== tag.id
                                ),
                              }))
                            }
                            className="text-red-600 font-semibold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPLETE SERVICE & PORTFOLIO MANAGEMENT SYSTEM (Create Multiple Service Pages per Category, Edit, Publish/Unpublish, Delete, SEO) */}
        {activeTab === 'services_portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setServiceSubTab('services')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    serviceSubTab === 'services'
                      ? 'bg-[#0A2540] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0A2540]'
                  }`}
                >
                  Service Pages Manager ({cms.services.length})
                </button>
                <button
                  type="button"
                  onClick={() => setServiceSubTab('portfolio')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    serviceSubTab === 'portfolio'
                      ? 'bg-[#0A2540] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#0A2540]'
                  }`}
                >
                  Portfolio Projects ({cms.portfolio.length})
                </button>
              </div>
            </div>

            {serviceSubTab === 'services' && (
              <div className="space-y-6">
                {/* Create New Service Page Form (Supports Multiple Service Pages in the Same Category) */}
                <form
                  onSubmit={handleCreateServiceWithPage}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#0A2540]">
                        Create New Service Page (Supports Multiple Service Pages per Category)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Automatically creates a dedicated public Service Page, adds it to the Header &ldquo;Our Services&rdquo; dropdown &amp; Homepage grid, and configures Service Schema.org SEO.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold mb-1.5">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Custom Laravel Web Development"
                        value={newServiceTitle}
                        onChange={(e) => {
                          setNewServiceTitle(e.target.value);
                          setNewServiceSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, '-')
                              .replace(/^-|-$/g, '')
                          );
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold mb-1.5">
                        SEO-Friendly URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="custom-laravel-web-development"
                        value={newServiceSlug}
                        onChange={(e) =>
                          setNewServiceSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, '-')
                              .replace(/^-|-$/g, '')
                          )
                        }
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-semibold mb-1.5">
                        Service Category (Multiple Pages Allowed) *
                      </label>
                      <input
                        type="text"
                        required
                        list="service-categories-list"
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value)}
                        placeholder="Website Design & Development"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                      <datalist id="service-categories-list">
                        <option value="Website Design & Development" />
                        <option value="Digital Marketing & SEO" />
                        <option value="E-Commerce & Custom Portals" />
                        <option value="Branding & Graphic Design" />
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Short Summary (For Service Cards &amp; Meta Fallback) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Concise 1-2 sentence service summary..."
                        value={newServiceShortDesc}
                        onChange={(e) => setNewServiceShortDesc(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <WordPressRichEditor
                      label="Complete Article Body / Service Page Content (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                      value={newServiceFullDesc}
                      onChange={setNewServiceFullDesc}
                      mediaLibrary={cms.media}
                      minHeight="250px"
                      helperText="Write the complete rich HTML service page content using Visual WYSIWYG mode, HTML Text mode, or Split Preview."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Key Deliverables / Bullet Points (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={newServiceDeliverables}
                        onChange={(e) => setNewServiceDeliverables(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Service Featured Image URL
                        </label>
                        <input
                          type="text"
                          value={newServiceImage}
                          onChange={(e) => setNewServiceImage(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            SEO Meta Title
                          </label>
                          <input
                            type="text"
                            placeholder="Auto-generated if blank"
                            value={newServiceSeoTitle}
                            onChange={(e) => setNewServiceSeoTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            Focus Keywords
                          </label>
                          <input
                            type="text"
                            placeholder="keyword 1, keyword 2"
                            value={newServiceKeywords}
                            onChange={(e) => setNewServiceKeywords(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl btn-hover-lift cursor-pointer inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Service &amp; Publish Dedicated Service Page</span>
                  </button>
                </form>

                {/* Existing Services List with Category Filter, Full Inline Edit, Section Builder Link, Publish/Unpublish & Delete */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-display text-base font-bold text-[#0A2540]">
                      All Service Pages ({cms.services.length})
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                      {[
                        'all',
                        ...Array.from(new Set(cms.services.map((s) => s.category))),
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setServiceCategoryFilter(cat)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                            serviceCategoryFilter === cat
                              ? 'bg-[#0A2540] text-white'
                              : 'text-slate-600 hover:text-[#0A2540]'
                          }`}
                        >
                          {cat === 'all' ? 'All Categories' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {cms.services
                      .filter(
                        (s) =>
                          serviceCategoryFilter === 'all' ||
                          s.category === serviceCategoryFilter
                      )
                      .map((svc) => {
                        const isEditing = editingServiceId === svc.id;
                        const linkedPage = cms.pages.find(
                          (p) => p.slug === svc.slug || p.slug === svc.page_slug
                        );
                        return (
                          <div key={svc.id} className="p-5 space-y-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E] font-bold">
                                    {svc.category}
                                  </span>
                                  <span className="font-mono text-slate-500">
                                    /{svc.slug}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                                      svc.status === 'published'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {svc.status}
                                  </span>
                                </div>
                                <h4 className="font-display text-base font-bold text-[#0A2540] mt-1">
                                  {svc.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {svc.short_description}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingServiceId(isEditing ? null : svc.id)
                                  }
                                  className="px-3 py-1.5 bg-[#0096e8] hover:bg-[#0284c7] text-white text-xs font-bold rounded-lg cursor-pointer"
                                >
                                  {isEditing ? 'Close Editor' : '✏️ Edit Service & SEO'}
                                </button>
                                {linkedPage && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPageId(linkedPage.id);
                                      setActiveTab('builder');
                                    }}
                                    className="px-3 py-1.5 bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-semibold rounded-lg cursor-pointer"
                                  >
                                    Page Sections ({linkedPage.sections.length})
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => onPreviewPage(svc.slug)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A2540] text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                  Preview Page
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateServiceAndPage(svc.id, {
                                      status:
                                        svc.status === 'published' ? 'unpublished' : 'published',
                                    })
                                  }
                                  className={`px-3 py-1.5 text-white text-xs font-semibold rounded-lg cursor-pointer ${
                                    svc.status === 'published'
                                      ? 'bg-amber-600'
                                      : 'bg-emerald-600'
                                  }`}
                                >
                                  {svc.status === 'published' ? 'Unpublish' : 'Publish'}
                                </button>
                                {confirmDeleteServiceId === svc.id ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteServiceAndPage(svc.id)}
                                    className="px-3 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                                  >
                                    Confirm Delete
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteServiceId(svc.id)}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-semibold rounded-lg cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Inline Service & SEO Editor */}
                            {isEditing && (
                              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Service Title
                                    </label>
                                    <input
                                      type="text"
                                      value={svc.title}
                                      onChange={(e) =>
                                        updateServiceAndPage(svc.id, { title: e.target.value })
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      URL Slug
                                    </label>
                                    <input
                                      type="text"
                                      value={svc.slug}
                                      onChange={(e) =>
                                        updateServiceAndPage(svc.id, {
                                          slug: e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]+/g, '-'),
                                        })
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Service Category
                                    </label>
                                    <input
                                      type="text"
                                      value={svc.category}
                                      onChange={(e) =>
                                        updateServiceAndPage(svc.id, {
                                          category: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Short Description (Card Summary)
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={svc.short_description}
                                      onChange={(e) =>
                                        updateServiceAndPage(svc.id, {
                                          short_description: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span className="text-xs font-extrabold text-[#0A2540]">
                                        Service Page Rich Text Block &amp; Complete Article Body
                                      </span>
                                      {linkedPage && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const maxOrder = Math.max(
                                              0,
                                              ...linkedPage.sections.map((s) => s.sort_order)
                                            );
                                            const newSec: PageSection = {
                                              id: Date.now(),
                                              page_id: linkedPage.id,
                                              section_type: 'heading_richtext',
                                              title: `${svc.title} — Detailed Guide & Specifications`,
                                              subtitle: `${svc.category} · ShivWebsIndia`,
                                              sort_order: maxOrder + 1,
                                              is_enabled: true,
                                              content_json: {
                                                body_html:
                                                  '<h2>Detailed Service Specifications</h2>\n<p>Add extra rich text blocks, comparison tables, FAQs, and process details to this service page...</p>',
                                              },
                                            };
                                            setCms((prev) => ({
                                              ...prev,
                                              pages: prev.pages.map((p) =>
                                                p.id === linkedPage.id
                                                  ? { ...p, sections: [...p.sections, newSec] }
                                                  : p
                                              ),
                                            }));
                                            setSelectedPageId(linkedPage.id);
                                            setEditingSectionId(newSec.id);
                                            setActiveTab('builder');
                                          }}
                                          className="px-3 py-1 rounded-lg bg-[#0A2540] hover:bg-[#FF6A00] text-white text-[11px] font-bold cursor-pointer transition-colors"
                                        >
                                          + Add Extra Rich Text Block to Service Page
                                        </button>
                                      )}
                                    </div>
                                    <WordPressRichEditor
                                      label="Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)"
                                      value={svc.full_description}
                                      onChange={(html) =>
                                        updateServiceAndPage(svc.id, {
                                          full_description: html,
                                        })
                                      }
                                      mediaLibrary={cms.media}
                                      minHeight="280px"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold mb-1">
                                      Deliverables / Bullet Points (One per line)
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={(svc.deliverables || []).join('\n')}
                                      onChange={(e) =>
                                        updateServiceAndPage(svc.id, {
                                          deliverables: e.target.value
                                            .split('\n')
                                            .map((x) => x.trim())
                                            .filter(Boolean),
                                        })
                                      }
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-bold mb-1">
                                        SEO Meta Title
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          svc.seo_title ||
                                          linkedPage?.seo.seo_title ||
                                          `${svc.title} | ShivWebsIndia`
                                        }
                                        onChange={(e) =>
                                          updateServiceAndPage(svc.id, {
                                            seo_title: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold mb-1">
                                        SEO Meta Description
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          svc.meta_description ||
                                          linkedPage?.seo.meta_description ||
                                          svc.short_description
                                        }
                                        onChange={(e) =>
                                          updateServiceAndPage(svc.id, {
                                            meta_description: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {serviceSubTab === 'portfolio' && (
              <div className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPortfolioTitle.trim()) return;
                    const slug = newPortfolioTitle
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/^-|-$/g, '');
                    const item: PortfolioItem = {
                      id: Date.now(),
                      title: newPortfolioTitle.trim(),
                      slug,
                      client_industry: newPortfolioIndustry.trim() || 'Corporate & Business',
                      service_category: newPortfolioCategory,
                      summary:
                        newPortfolioSummary.trim() ||
                        'Custom responsive website and SEO implementation by ShivWebsIndia.',
                      challenge_solved: 'Mobile responsiveness and local lead generation.',
                      solution_delivered: 'Custom UI/UX, PHP/WordPress CMS, and technical SEO.',
                      tech_stack: ['PHP 8.x', 'WordPress', 'MySQL', 'SEO'],
                      image_url:
                        newPortfolioImage.trim() ||
                        'https://www.shivwebsindia.com/wp-content/uploads/2026/06/sperowz.png',
                      image_alt: newPortfolioTitle.trim(),
                      external_project_url: 'https://www.shivwebsindia.com/',
                      is_verified_authorization: true,
                      sort_order: cms.portfolio.length + 1,
                      status: 'published',
                    };
                    setCms((prev) => ({
                      ...prev,
                      portfolio: [item, ...prev.portfolio],
                    }));
                    setNewPortfolioTitle('');
                    setNewPortfolioIndustry('');
                    setNewPortfolioSummary('');
                  }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
                >
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    Add New Portfolio Project
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Healthcare Portal (Metro Clinic)"
                        value={newPortfolioTitle}
                        onChange={(e) => setNewPortfolioTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Client Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Healthcare & Clinics"
                        value={newPortfolioIndustry}
                        onChange={(e) => setNewPortfolioIndustry(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Service Category
                      </label>
                      <input
                        type="text"
                        value={newPortfolioCategory}
                        onChange={(e) => setNewPortfolioCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Screenshot URL
                      </label>
                      <input
                        type="text"
                        value={newPortfolioImage}
                        onChange={(e) => setNewPortfolioImage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1">
                        Project Summary
                      </label>
                      <input
                        type="text"
                        placeholder="Brief project description..."
                        value={newPortfolioSummary}
                        onChange={(e) => setNewPortfolioSummary(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-[#FF6A00] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      + Add Project
                    </button>
                  </div>
                </form>

                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200 text-xs">
                  {cms.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#0A2540] text-sm">{item.title}</div>
                          <div className="text-[#8B1E1E] font-medium">
                            {item.client_industry} · {item.service_category}
                          </div>
                          <div className="text-slate-500 mt-0.5">{item.summary}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setCms((prev) => ({
                              ...prev,
                              portfolio: prev.portfolio.filter((p) => p.id !== item.id),
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DYNAMIC FAQS MANAGER */}
        {activeTab === 'faqs_manager' && (
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
                const maxOrder = Math.max(0, ...cms.faqs.map((f) => f.sort_order));
                const nextFaq: FAQItem = {
                  id: Date.now(),
                  category: newFaqCategory.trim() || 'General',
                  question: newFaqQuestion.trim(),
                  answer: newFaqAnswer.trim(),
                  page_slug: 'home',
                  sort_order: maxOrder + 1,
                  is_published: true,
                };
                setCms((prev) => ({
                  ...prev,
                  faqs: [...prev.faqs, nextFaq],
                }));
                logAudit(`Added FAQ: ${newFaqQuestion.trim()}`, 'faq', String(nextFaq.id));
                setNewFaqQuestion('');
                setNewFaqAnswer('');
              }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    Add New Dynamic FAQ (Updates Live on Homepage, /faqs &amp; AI Chatbot)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Supports both English and Hindi questions &amp; answers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onPreviewPage('faqs')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                >
                  Preview Live FAQs Page ↗
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">FAQ Category</label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Website Design & Pricing">Website Design &amp; Pricing</option>
                    <option value="SEO & Digital Marketing">SEO &amp; Digital Marketing</option>
                    <option value="WordPress & E-Commerce">WordPress &amp; E-Commerce</option>
                    <option value="Hosting & Maintenance">Hosting &amp; Maintenance</option>
                    <option value="Hindi FAQs (हिंदी सवाल)">Hindi FAQs (हिंदी सवाल)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">
                    Question (English or Hindi) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q11. दिल्ली एनसीआर में वेबसाइट बनवाने का कितना खर्च आता है?"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">Detailed Answer *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write a clear, helpful answer for visitors..."
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-xl btn-hover-lift cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ to Website</span>
              </button>
            </form>

            {/* Existing Dynamic FAQs List with Edit, Reorder, Publish Toggle & Delete */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#0A2540]">
                  All Dynamic FAQs ({cms.faqs.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Use arrows to reorder or click Edit to modify text live
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {[...cms.faqs]
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((faq, idx, arr) => {
                    const isEditing = editingFaqId === faq.id;
                    return (
                      <div key={faq.id} className="p-5 space-y-3 hover:bg-slate-50/60">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs mb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#8B1E1E] font-bold">
                                #{idx + 1} · {faq.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  faq.is_published
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {faq.is_published ? 'Published' : 'Hidden'}
                              </span>
                            </div>

                            {isEditing ? (
                              <div className="space-y-2.5 mt-2">
                                <input
                                  type="text"
                                  value={faq.question}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCms((prev) => ({
                                      ...prev,
                                      faqs: prev.faqs.map((item) =>
                                        item.id === faq.id ? { ...item, question: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-[#0A2540]"
                                />
                                <textarea
                                  rows={3}
                                  value={faq.answer}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCms((prev) => ({
                                      ...prev,
                                      faqs: prev.faqs.map((item) =>
                                        item.id === faq.id ? { ...item, answer: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-700"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-display text-sm sm:text-base font-bold text-[#0A2540]">
                                  {faq.question}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const ordered = [...arr];
                                const prevItem = ordered[idx - 1];
                                const curOrder = faq.sort_order;
                                setCms((prev) => ({
                                  ...prev,
                                  faqs: prev.faqs.map((f) =>
                                    f.id === faq.id
                                      ? { ...f, sort_order: prevItem.sort_order }
                                      : f.id === prevItem.id
                                      ? { ...f, sort_order: curOrder }
                                      : f
                                  ),
                                }));
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === arr.length - 1}
                              onClick={() => {
                                const ordered = [...arr];
                                const nextItem = ordered[idx + 1];
                                const curOrder = faq.sort_order;
                                setCms((prev) => ({
                                  ...prev,
                                  faqs: prev.faqs.map((f) =>
                                    f.id === faq.id
                                      ? { ...f, sort_order: nextItem.sort_order }
                                      : f.id === nextItem.id
                                      ? { ...f, sort_order: curOrder }
                                      : f
                                  ),
                                }));
                              }}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFaqId(isEditing ? null : faq.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-semibold cursor-pointer"
                            >
                              {isEditing ? 'Done' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  faqs: prev.faqs.map((f) =>
                                    f.id === faq.id
                                      ? { ...f, is_published: !f.is_published }
                                      : f
                                  ),
                                }))
                              }
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                            >
                              {faq.is_published ? 'Hide' : 'Publish'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  faqs: prev.faqs.filter((f) => f.id !== faq.id),
                                }))
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC NAVIGATION MENU & BRAND SETTINGS */}
        {activeTab === 'menus_settings' && (
          <div className="space-y-8">
            {/* Dynamic Navigation Menu Builder */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    Dynamic Website Navigation Menu Manager (Header &amp; Footer)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, reorder, enable/disable, or edit links in the Header Primary Menu, Footer
                    Services, and Footer Quick Links.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMenuLabel.trim() || !newMenuUrl.trim()) return;
                  const locItems = cms.menu_items.filter(
                    (m) => m.menu_location === newMenuLocation
                  );
                  const maxOrder = Math.max(0, ...locItems.map((m) => m.sort_order));
                  const created: MenuItem = {
                    id: Date.now(),
                    menu_location: newMenuLocation,
                    parent_id: null,
                    label: newMenuLabel.trim(),
                    url: newMenuUrl.trim().startsWith('/')
                      ? newMenuUrl.trim()
                      : `/${newMenuUrl.trim()}`,
                    sort_order: maxOrder + 1,
                    is_enabled: true,
                  };
                  setCms((prev) => ({
                    ...prev,
                    menu_items: [...prev.menu_items, created],
                  }));
                  setNewMenuLabel('');
                  setNewMenuUrl('/');
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#F5F7FA] p-4 rounded-xl border border-slate-200"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1">Menu Location</label>
                  <select
                    value={newMenuLocation}
                    onChange={(e) =>
                      setNewMenuLocation(e.target.value as MenuItem['menu_location'])
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="header_primary">Header Primary Navbar</option>
                    <option value="footer_services">Footer — Our Services</option>
                    <option value="footer_company">Footer — Quick Links</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Menu Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAQs or CEO Card"
                    value={newMenuLabel}
                    onChange={(e) => setNewMenuLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Target URL / Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /faqs or /shivkumar"
                    value={newMenuUrl}
                    onChange={(e) => setNewMenuUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    + Add Menu Link
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(
                  [
                    { key: 'header_primary', title: 'Header Primary Menu' },
                    { key: 'footer_services', title: 'Footer: Our Services' },
                    { key: 'footer_company', title: 'Footer: Quick Links' },
                  ] as const
                ).map((group) => {
                  const items = cms.menu_items
                    .filter((m) => m.menu_location === group.key)
                    .sort((a, b) => a.sort_order - b.sort_order);

                  return (
                    <div
                      key={group.key}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2.5"
                    >
                      <h4 className="font-display text-sm font-bold text-[#0A2540] pb-2 border-b border-slate-200">
                        {group.title} ({items.length})
                      </h4>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="truncate">
                            <div className="font-bold text-[#0A2540] truncate">{item.label}</div>
                            <div className="font-mono text-[10px] text-slate-500 truncate">
                              {item.url}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  menu_items: prev.menu_items.map((m) =>
                                    m.id === item.id ? { ...m, is_enabled: !m.is_enabled } : m
                                  ),
                                }))
                              }
                              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                item.is_enabled
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {item.is_enabled ? 'Active' : 'Hidden'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  menu_items: prev.menu_items.filter((m) => m.id !== item.id),
                                }))
                              }
                              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Remove Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Brand & Lead Email Settings */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#0A2540]">
                Global Brand &amp; Lead Email Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={cms.settings.brand_name}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, brand_name: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Primary Phone</label>
                  <input
                    type="text"
                    value={cms.settings.contact_phone}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, contact_phone: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Public Contact Email</label>
                  <input
                    type="email"
                    value={cms.settings.contact_email}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, contact_email: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Location Focus</label>
                  <input
                    type="text"
                    value={cms.settings.location_focus}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, location_focus: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#8B1E1E]">
                    Lead Notification Email (Where All Leads Are Sent)
                  </label>
                  <input
                    type="email"
                    value={cms.settings.notification_recipient_email}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          notification_recipient_email: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-[#FF6A00] bg-orange-50/30 rounded-xl text-sm font-semibold text-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-emerald-700">
                    Lead WhatsApp Number (With Country Code, e.g. 918667666429)
                  </label>
                  <input
                    type="text"
                    value={cms.settings.whatsapp_number}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          whatsapp_number: e.target.value.replace(/[^0-9]/g, ''),
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-emerald-500 bg-emerald-50/30 rounded-xl text-sm font-semibold text-[#0A2540] font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Footer Credit Line</label>
                  <input
                    type="text"
                    value={cms.settings.footer_credit}
                    onChange={(e) =>
                      setCms((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, footer_credit: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEAD MANAGEMENT (EMAIL + WHATSAPP ROUTING) */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-[#0A2540] text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-[#FF6A00] font-semibold">
                  Dual-Channel Lead Routing Active (Email + WhatsApp)
                </div>
                <h3 className="font-display text-lg font-bold mt-1">
                  All Enquiries Routed to{' '}
                  <span className="text-[#FF6A00] underline">
                    {cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com'}
                  </span>{' '}
                  &amp; WhatsApp{' '}
                  <span className="text-emerald-400 underline">
                    +{cms.settings.whatsapp_number || '918667666429'}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Every Contact Form and AI Chatbot enquiry is stored below and can be dispatched or
                  followed up via Email &amp; WhatsApp in one click.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('menus_settings')}
                className="px-4 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer whitespace-nowrap"
              >
                Change Email / WhatsApp Number
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-base font-bold text-[#0A2540]">
                  All Customer Leads ({cms.enquiries.length})
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="closed_won">Closed Won</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {cms.enquiries
                  .filter((enq) => leadStatusFilter === 'all' || enq.status === leadStatusFilter)
                  .filter(
                    (enq) =>
                      !leadSearch ||
                      enq.full_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                      enq.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
                      enq.phone.includes(leadSearch)
                  )
                  .map((enq) => {
                    const targetMail =
                      cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com';
                    const adminWaNumber = (cms.settings.whatsapp_number || '918667666429').replace(
                      /[^0-9]/g,
                      ''
                    );
                    const clientWaDigits = enq.phone.replace(/[^0-9]/g, '');
                    const clientWaNumber =
                      clientWaDigits.length === 10 ? `91${clientWaDigits}` : clientWaDigits;

                    const mailSubject = encodeURIComponent(
                      `[ShivWebsIndia Lead #${enq.id}] ${enq.service_interested} - ${enq.full_name}`
                    );
                    const mailBody = encodeURIComponent(
                      `Lead Details:\n\nName: ${enq.full_name}\nPhone: ${enq.phone}\nEmail: ${enq.email}\nCompany: ${enq.company_name}\nService: ${enq.service_interested}\nBudget: ${enq.budget_range}\n\nMessage:\n${enq.message}`
                    );
                    const waLeadSummary = encodeURIComponent(
                      `*Lead Enquiry #${enq.id} – ShivWebsIndia*\n` +
                        `*Name:* ${enq.full_name}\n` +
                        `*Phone:* ${enq.phone}\n` +
                        `*Email:* ${enq.email}\n` +
                        `*Service:* ${enq.service_interested}\n` +
                        `*Budget:* ${enq.budget_range}\n` +
                        `*Requirement:* ${enq.message}`
                    );
                    const waClientReply = encodeURIComponent(
                      `Namaste ${enq.full_name}, thank you for contacting *ShivWebsIndia* regarding *${enq.service_interested}*. How can we assist you today?`
                    );

                    return (
                      <div
                        key={enq.id}
                        className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="font-display text-base font-bold text-[#0A2540]">
                              {enq.full_name}
                            </span>{' '}
                            <span className="text-xs text-slate-500">
                              ({enq.company_name || 'Direct Lead'})
                            </span>
                            <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                              {enq.email} · {enq.phone} ·{' '}
                              <strong className="text-[#8B1E1E]">{enq.service_interested}</strong> ·{' '}
                              {enq.budget_range}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`https://wa.me/${adminWaNumber}?text=${waLeadSummary}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              <span>💬 Forward to Admin WhatsApp</span>
                            </a>
                            <a
                              href={`https://wa.me/${clientWaNumber}?text=${waClientReply}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              <span>📲 Reply Client on WhatsApp</span>
                            </a>
                            <a
                              href={`mailto:${targetMail}?subject=${mailSubject}&body=${mailBody}`}
                              className="px-3 py-1.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Send to Mail ({targetMail})</span>
                            </a>
                            <select
                              value={enq.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as ContactEnquiry['status'];
                                setCms((prev) => ({
                                  ...prev,
                                  enquiries: prev.enquiries.map((item) =>
                                    item.id === enq.id ? { ...item, status: nextStatus } : item
                                  ),
                                }));
                              }}
                              className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold capitalize"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="proposal_sent">Proposal Sent</option>
                              <option value="closed_won">Closed Won</option>
                              <option value="spam">Spam</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                setCms((prev) => ({
                                  ...prev,
                                  enquiries: prev.enquiries.filter((item) => item.id !== enq.id),
                                }))
                              }
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          {enq.message}
                        </p>

                        <input
                          type="text"
                          placeholder="Add internal follow-up notes..."
                          value={enq.admin_notes}
                          onChange={(e) => {
                            const notes = e.target.value;
                            setCms((prev) => ({
                              ...prev,
                              enquiries: prev.enquiries.map((item) =>
                                item.id === enq.id ? { ...item, admin_notes: notes } : item
                              ),
                            }));
                          }}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-600"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN-ONLY BROCHURE, QUOTATION & PROPOSAL SUITE */}
        {activeTab === 'brochure_quote_proposal' && (
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <BrochureQuotationProposalSuite
              cms={cms}
              setCms={setCms}
              initialTab="quotation"
              csrfToken={csrfToken}
              onSubmitEnquiry={(enq) => {
                const newLead: ContactEnquiry = {
                  id: Math.max(0, ...cms.enquiries.map((e) => e.id)) + 1,
                  full_name: enq.full_name,
                  email: enq.email,
                  phone: enq.phone,
                  company_name: enq.company_name,
                  service_interested: enq.service_interested,
                  budget_range: enq.budget_range,
                  message: enq.message,
                  source_page: enq.source_page,
                  ip_address: '127.0.0.1 (Admin Desk)',
                  status: 'proposal_sent',
                  admin_notes: 'Generated directly from Admin Quotation & Proposal Desk',
                  created_at: new Date().toISOString(),
                };
                setCms((prev) => ({
                  ...prev,
                  enquiries: [newLead, ...prev.enquiries],
                }));
                logAudit(
                  `Generated quotation/proposal for ${enq.full_name}`,
                  'enquiry',
                  String(newLead.id)
                );
                return { success: true };
              }}
            />
          </div>
        )}

        {/* TEAM MANAGEMENT SYSTEM */}
        {activeTab === 'team_management' && (
          <TeamManagementPortal
            cms={cms}
            setCms={setCms}
            isAuthenticated={true}
            authenticatedMember={cms.team_members?.[0] || null}
            onLogin={() => ({ success: true })}
            onLogout={onLogout}
            isEmbeddedInAdmin={true}
          />
        )}

        {/* PHP & MYSQL EXPORT */}
        {activeTab === 'source_export' && <PhpArchitectureView cms={cms} />}
      </div>
    </div>
  );
};
