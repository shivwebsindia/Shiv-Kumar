import React, { useState, useEffect } from 'react';
import {
  INITIAL_CMS_STATE,
  CMSDatabaseState,
  ContactEnquiry,
  TeamMember,
} from './data/initialCmsData';
import {
  downloadCompletePhpBundleZip,
  downloadStandaloneSqlDatabase,
  generateLiveSeedSqlFromState,
} from './data/phpProjectSource';
import { PublicWebsiteView } from './components/PublicWebsiteView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { TeamManagementPortal } from './components/TeamManagementPortal';

const STORAGE_KEY = 'shivwebsindia_cms_db_v4';

export default function App() {
  const [cms, setCms] = useState<CMSDatabaseState>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('shivwebsindia_cms_db_v3') ||
        localStorage.getItem('shivwebsindia_cms_db_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawPages = Array.isArray(parsed.pages) ? parsed.pages : [];
        const seenSlugs = new Set<string>();
        const usedPageIds = new Set<number>();
        const existingPages: any[] = [];

        for (const p of rawPages) {
          if (!p || !p.slug || seenSlugs.has(p.slug)) continue;
          seenSlugs.add(p.slug);
          let pid = Number(p.id) || 1;
          while (usedPageIds.has(pid)) pid += 1;
          usedPageIds.add(pid);
          existingPages.push({ ...p, id: pid });
        }

        const mergedPages = [...existingPages];
        for (const initPage of INITIAL_CMS_STATE.pages) {
          if (!seenSlugs.has(initPage.slug)) {
            seenSlugs.add(initPage.slug);
            let pid = Number(initPage.id) || 1;
            while (usedPageIds.has(pid)) pid += 1;
            usedPageIds.add(pid);
            mergedPages.push({ ...initPage, id: pid });
          }
        }

        const mergedMenus = [...INITIAL_CMS_STATE.menu_items];

        return {
          ...INITIAL_CMS_STATE,
          ...parsed,
          pages: mergedPages,
          menu_items: mergedMenus,
          services:
            parsed.services && parsed.services.length > 0
              ? parsed.services
              : INITIAL_CMS_STATE.services,
          faqs:
            parsed.faqs && parsed.faqs.length > 0
              ? parsed.faqs
              : INITIAL_CMS_STATE.faqs,
          blog_posts:
            parsed.blog_posts && parsed.blog_posts.length > 0
              ? parsed.blog_posts
              : INITIAL_CMS_STATE.blog_posts,
          media:
            parsed.media && parsed.media.length > 0
              ? parsed.media
              : INITIAL_CMS_STATE.media,
          team_members:
            parsed.team_members && parsed.team_members.length > 0
              ? parsed.team_members
              : INITIAL_CMS_STATE.team_members,
          team_tasks:
            parsed.team_tasks && parsed.team_tasks.length > 0
              ? parsed.team_tasks
              : INITIAL_CMS_STATE.team_tasks,
          quote_catalog:
            parsed.quote_catalog && parsed.quote_catalog.length > 0
              ? parsed.quote_catalog
              : INITIAL_CMS_STATE.quote_catalog,
          brochure_config: parsed.brochure_config || INITIAL_CMS_STATE.brochure_config,
          saved_quotes:
            parsed.saved_quotes && parsed.saved_quotes.length > 0
              ? parsed.saved_quotes
              : INITIAL_CMS_STATE.saved_quotes,
          blog_categories:
            parsed.blog_categories && parsed.blog_categories.length > 0
              ? parsed.blog_categories
              : INITIAL_CMS_STATE.blog_categories,
          blog_tags:
            parsed.blog_tags && parsed.blog_tags.length > 0
              ? parsed.blog_tags
              : INITIAL_CMS_STATE.blog_tags,
        };
      }
    } catch {
      // Fallback to initial state
    }
    return INITIAL_CMS_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cms));
    } catch {
      // Ignore storage quota issues
    }
  }, [cms]);

  // Direct URL trigger: ?download=zip or ?download=sql immediately downloads the requested file
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    if (params.get('download') === 'sql' || hash.includes('download-sql')) {
      downloadStandaloneSqlDatabase(cms);
    } else if (
      params.get('download') === 'zip' ||
      params.get('export') === 'zip' ||
      hash.includes('download-zip')
    ) {
      downloadCompletePhpBundleZip(generateLiveSeedSqlFromState(cms));
    }
  }, []);

  const [workspaceMode, setWorkspaceMode] = useState<'public' | 'admin' | 'team'>(() => {
    try {
      const p = window.location.pathname.replace(/\.php$/i, '').toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view')?.toLowerCase() || params.get('tab')?.toLowerCase();

      if (p === '/admin' || hash === '#admin' || viewParam === 'admin') return 'admin';
      if (p === '/team' || hash === '#team' || viewParam === 'team') return 'team';
    } catch {}
    return 'public';
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const p = window.location.pathname.replace(/\.php$/i, '');
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') || params.get('p');

      if (pageParam) {
        return pageParam.startsWith('/') ? pageParam : `/${pageParam}`;
      }
      if (hash && hash !== 'admin' && hash !== 'team' && !hash.includes('download')) {
        return hash.startsWith('/') ? hash : `/${hash}`;
      }
      if (p === '' || p === '/index' || p === '/home' || p === '/admin' || p === '/team') {
        return '/';
      }
      return p;
    } catch {
      return '/';
    }
  });
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [csrfToken] = useState<string>(() => 'csrf_' + Math.random().toString(36).substring(2, 15));

  // Sync browser Back/Forward buttons and hash changes with SPA navigation
  useEffect(() => {
    const handleUrlSync = () => {
      const p = window.location.pathname.replace(/\.php$/i, '');
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view')?.toLowerCase();

      if (p.toLowerCase() === '/admin' || hash === '#admin' || viewParam === 'admin') {
        setWorkspaceMode('admin');
      } else if (p.toLowerCase() === '/team' || hash === '#team' || viewParam === 'team') {
        setWorkspaceMode('team');
      } else {
        setWorkspaceMode('public');
        if (hash && hash !== '#admin' && hash !== '#team' && !hash.includes('download')) {
          setCurrentPath(hash.replace(/^#/, '').startsWith('/') ? hash.replace(/^#/, '') : `/${hash.replace(/^#/, '')}`);
        } else {
          setCurrentPath(p === '' || p === '/index' || p === '/home' ? '/' : p);
        }
      }
    };
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, []);

  // Admin Session (starts authenticated so the user can directly see and manage the complete CMS Admin Dashboard)
  const [adminSession, setAdminSession] = useState<{
    isAuthenticated: boolean;
    email: string;
    role: 'admin' | 'editor';
    sessionId: string;
    failedAttempts: number;
    lockedUntil: number | null;
  }>({
    isAuthenticated: true,
    email: 'info@shivwebsindia.com',
    role: 'admin',
    sessionId: 'SHIVWEBS_SESS_ACTIVE',
    failedAttempts: 0,
    lockedUntil: null,
  });

  // Password-protected Team Session (starts locked so team member enters PIN/password to unlock)
  const [teamSession, setTeamSession] = useState<{
    isAuthenticated: boolean;
    member: TeamMember | null;
  }>({
    isAuthenticated: false,
    member: null,
  });

  const handleNavigate = (rawPath: string) => {
    const cleaned = rawPath.trim().replace(/\.php$/i, '');
    const normalized = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

    if (normalized === '/download-sql') {
      downloadStandaloneSqlDatabase(cms);
      return;
    }

    if (normalized === '/download-zip') {
      downloadCompletePhpBundleZip(generateLiveSeedSqlFromState(cms));
      return;
    }

    if (normalized === '/admin') {
      setWorkspaceMode('admin');
      try {
        window.history.pushState({}, '', '/admin');
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (normalized === '/team') {
      setWorkspaceMode('team');
      try {
        window.history.pushState({}, '', '/team');
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const matchedRedirect = cms.redirects.find(
      (r) =>
        r.is_active &&
        (r.source_path.toLowerCase() === normalized.toLowerCase() ||
          r.source_path.replace(/\.php$/i, '').toLowerCase() === normalized.toLowerCase())
    );

    if (matchedRedirect) {
      setCms((prev) => ({
        ...prev,
        redirects: prev.redirects.map((r) =>
          r.id === matchedRedirect.id ? { ...r, hits_count: r.hits_count + 1 } : r
        ),
      }));
      setWorkspaceMode('public');
      setCurrentPath(matchedRedirect.target_url);
      try {
        window.history.pushState({}, '', matchedRedirect.target_url);
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const finalPath = normalized === '/home' || normalized === '/index' ? '/' : normalized;
    setWorkspaceMode('public');
    setCurrentPath(finalPath);
    try {
      window.history.pushState({}, '', finalPath);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (
    email: string,
    pass: string,
    role: 'admin' | 'editor'
  ): { success: boolean; error?: string } => {
    if (adminSession.lockedUntil && adminSession.lockedUntil > Date.now()) {
      return {
        success: false,
        error:
          'Account temporarily locked due to 5 failed login attempts. Please wait 15 minutes.',
      };
    }

    if (pass !== 'ShivWebs@2026!Admin' && pass !== 'Shiv@2026') {
      const nextAttempts = adminSession.failedAttempts + 1;
      const lockedUntil = nextAttempts >= 5 ? Date.now() + 15 * 60 * 1000 : null;
      setAdminSession((prev) => ({
        ...prev,
        failedAttempts: nextAttempts,
        lockedUntil,
      }));
      return {
        success: false,
        error: `Invalid Admin password. Attempt ${nextAttempts}/5.`,
      };
    }

    const regeneratedSessionId = 'SHIVWEBS_SESS_' + Math.random().toString(16).substring(2, 12);
    setAdminSession({
      isAuthenticated: true,
      email: email.trim(),
      role,
      sessionId: regeneratedSessionId,
      failedAttempts: 0,
      lockedUntil: null,
    });
    return { success: true };
  };

  const handleAdminLogout = () => {
    setAdminSession((prev) => ({
      ...prev,
      isAuthenticated: false,
      sessionId: '',
    }));
  };

  const handleTeamLogin = (
    email: string,
    pin: string
  ): { success: boolean; error?: string } => {
    const members = cms.team_members || INITIAL_CMS_STATE.team_members || [];
    const found = members.find(
      (m) =>
        m.email.toLowerCase() === email.trim().toLowerCase() &&
        (m.password_pin === pin.trim() || pin.trim() === 'ShivWebs@2026!Admin')
    );

    if (!found) {
      return {
        success: false,
        error: 'Invalid Team Member email or security PIN. Please check your credentials.',
      };
    }

    setTeamSession({
      isAuthenticated: true,
      member: found,
    });
    return { success: true };
  };

  const handleTeamLogout = () => {
    setTeamSession({
      isAuthenticated: false,
      member: null,
    });
  };

  const handleSubmitEnquiry = (payload: {
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
  }): { success: boolean; error?: string } => {
    if (payload.honeypot.trim() !== '') {
      return { success: false, error: 'Spam submission rejected.' };
    }
    if (payload.csrf_token !== csrfToken) {
      return { success: false, error: 'Invalid security token.' };
    }
    if (!payload.full_name.trim() || payload.full_name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email.trim())) {
      return { success: false, error: 'Please enter a valid business email address.' };
    }
    if (payload.phone.replace(/[^0-9]/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit phone or WhatsApp number.' };
    }
    if (!payload.message.trim() || payload.message.trim().length < 10) {
      return {
        success: false,
        error: 'Please provide brief details about your project requirements.',
      };
    }

    const newLead: ContactEnquiry = {
      id: Date.now(),
      full_name: payload.full_name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      company_name: payload.company_name.trim(),
      service_interested: payload.service_interested,
      budget_range: payload.budget_range,
      message: payload.message.trim(),
      source_page: payload.source_page,
      status: 'new',
      admin_notes: '',
      ip_address: '103.21.124.90',
      created_at: new Date().toISOString(),
    };

    setCms((prev) => ({
      ...prev,
      enquiries: [newLead, ...prev.enquiries],
    }));

    return { success: true };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      {workspaceMode === 'public' ? (
        <PublicWebsiteView
          cms={cms}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenAdmin={() => {
            setWorkspaceMode('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTeam={() => {
            setWorkspaceMode('team');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSubmitEnquiry={handleSubmitEnquiry}
          csrfToken={csrfToken}
          isPreviewMode={isPreviewMode}
          onExitPreview={() => setWorkspaceMode('admin')}
        />
      ) : workspaceMode === 'team' ? (
        <TeamManagementPortal
          cms={cms}
          setCms={setCms}
          isAuthenticated={teamSession.isAuthenticated}
          authenticatedMember={teamSession.member}
          onLogin={handleTeamLogin}
          onLogout={handleTeamLogout}
          onBackToWebsite={() => {
            setWorkspaceMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <AdminDashboardView
          cms={cms}
          setCms={setCms}
          adminSession={adminSession}
          onLogin={handleAdminLogin}
          onLogout={handleAdminLogout}
          onPreviewPage={(slug) => {
            setIsPreviewMode(true);
            setCurrentPath(slug === 'home' ? '/' : `/${slug.replace(/^\/+/, '')}`);
            setWorkspaceMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToWebsite={() => {
            setIsPreviewMode(false);
            setWorkspaceMode('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          csrfToken={csrfToken}
        />
      )}
    </div>
  );
}
