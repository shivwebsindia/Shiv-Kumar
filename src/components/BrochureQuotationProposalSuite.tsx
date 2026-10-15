import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calculator,
  FileCheck2,
  Download,
  Printer,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Building2,
  User,
  Layers,
  Clock,
  IndianRupee,
  Plus,
  Trash2,
  Edit3,
  Settings,
  FolderArchive,
  Check,
  Eye,
} from 'lucide-react';
import {
  CMSDatabaseState,
  QuoteCatalogItem,
  BrochureConfig,
  SavedProposalQuote,
  INITIAL_CMS_STATE,
} from '../data/initialCmsData';

interface BrochureQuotationProposalSuiteProps {
  cms: CMSDatabaseState;
  setCms?: React.Dispatch<React.SetStateAction<CMSDatabaseState>>;
  initialTab?: 'brochure' | 'quotation' | 'proposal' | 'cms_manager' | 'saved_records';
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
}

export const BrochureQuotationProposalSuite: React.FC<BrochureQuotationProposalSuiteProps> = ({
  cms,
  setCms,
  initialTab = 'brochure',
  onSubmitEnquiry,
  csrfToken,
}) => {
  const [activeTab, setActiveTab] = useState<
    'brochure' | 'quotation' | 'proposal' | 'cms_manager' | 'saved_records'
  >(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Dynamic Catalog, Brochure Config, and Saved Quotes from CMS State
  const catalogList: QuoteCatalogItem[] =
    cms.quote_catalog && cms.quote_catalog.length > 0
      ? cms.quote_catalog
      : INITIAL_CMS_STATE.quote_catalog || [];

  const brochureCfg: BrochureConfig =
    cms.brochure_config || INITIAL_CMS_STATE.brochure_config!;

  const savedQuotesList: SavedProposalQuote[] =
    cms.saved_quotes && cms.saved_quotes.length > 0
      ? cms.saved_quotes
      : INITIAL_CMS_STATE.saved_quotes || [];

  const activeCatalogItems = catalogList.filter((item) => item.is_active);

  // Client Details for Quotation & Proposal
  const [clientName, setClientName] = useState('Rahul Verma');
  const [companyName, setCompanyName] = useState('Apex Enterprises Pvt. Ltd.');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('Ghaziabad / Delhi NCR');
  const [projectGoal, setProjectGoal] = useState(
    'Design a modern, mobile-responsive corporate website and generate qualified leads via Local SEO & Google Search.'
  );
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Selected services in Quotation Builder
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'biz-web',
    'local-seo',
    'domain-host',
  ]);
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  const [quoteReference, setQuoteReference] = useState<string>(
    () => `SWI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    msg: string;
  }>({ type: 'idle', msg: '' });

  // Custom One-Off Line Item in Quotation Builder
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemDeliverable, setCustomItemDeliverable] = useState('');

  // CMS Manager State for Editing/Adding Catalog Items
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catCategory, setCatCategory] = useState<QuoteCatalogItem['category']>('Web Development');
  const [catPrice, setCatPrice] = useState<number>(15000);
  const [catWeeks, setCatWeeks] = useState<number>(2);
  const [catDeliverablesText, setCatDeliverablesText] = useState('');
  const [cmsFeedback, setCmsFeedback] = useState('');

  const updateCmsCatalog = (nextCatalog: QuoteCatalogItem[]) => {
    if (!setCms) return;
    setCms((prev) => ({
      ...prev,
      quote_catalog: nextCatalog,
    }));
  };

  const updateCmsBrochure = (nextBrochure: BrochureConfig) => {
    if (!setCms) return;
    setCms((prev) => ({
      ...prev,
      brochure_config: nextBrochure,
    }));
  };

  const updateCmsSavedQuotes = (nextSaved: SavedProposalQuote[]) => {
    if (!setCms) return;
    setCms((prev) => ({
      ...prev,
      saved_quotes: nextSaved,
    }));
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = catalogList.filter((item) => selectedServiceIds.includes(item.id));

  const rawSubtotal = selectedItems.reduce((acc, item) => acc + item.basePrice, 0);
  const subtotal = Math.max(0, rawSubtotal - Math.max(0, discountAmount));
  const gstAmount = includeGst ? Math.round(subtotal * 0.18) : 0;
  const grandTotal = subtotal + gstAmount;
  const estimatedWeeks = Math.max(
    2,
    ...(selectedItems.length > 0 ? selectedItems.map((i) => i.timelineWeeks) : [2]),
    selectedItems.length > 2 ? 4 : 2
  );

  // Add a quick custom item directly from Quotation tab and select it
  const handleAddQuickCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim() || !customItemPrice) return;
    const newId = 'custom-' + Date.now();
    const newItem: QuoteCatalogItem = {
      id: newId,
      name: customItemName.trim(),
      category: 'Add-Ons',
      basePrice: Number(customItemPrice) || 5000,
      timelineWeeks: 1,
      deliverables: [
        customItemDeliverable.trim() || 'Custom requirement configured as per client scope',
      ],
      is_active: true,
    };
    updateCmsCatalog([...catalogList, newItem]);
    setSelectedServiceIds((prev) => [...prev, newId]);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemDeliverable('');
  };

  // Save or Update Catalog Item in CMS Manager Tab
  const handleSaveCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const deliverablesArr = catDeliverablesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (editingCatalogId) {
      const updated = catalogList.map((item) =>
        item.id === editingCatalogId
          ? {
              ...item,
              name: catName.trim(),
              category: catCategory,
              basePrice: Number(catPrice) || 0,
              timelineWeeks: Number(catWeeks) || 1,
              deliverables:
                deliverablesArr.length > 0
                  ? deliverablesArr
                  : ['Standard ShivWebsIndia deliverable package'],
            }
          : item
      );
      updateCmsCatalog(updated);
      setEditingCatalogId(null);
      setCmsFeedback('Service package updated in Quotation & Proposal Catalog!');
    } else {
      const newId = 'svc-' + Date.now();
      const newItem: QuoteCatalogItem = {
        id: newId,
        name: catName.trim(),
        category: catCategory,
        basePrice: Number(catPrice) || 10000,
        timelineWeeks: Number(catWeeks) || 2,
        deliverables:
          deliverablesArr.length > 0
            ? deliverablesArr
            : ['Complete design, development, and testing deliverable'],
        is_active: true,
      };
      updateCmsCatalog([...catalogList, newItem]);
      setSelectedServiceIds((prev) => [...prev, newId]);
      setCmsFeedback('New service package added to Quotation & Proposal Catalog!');
    }

    setCatName('');
    setCatPrice(15000);
    setCatWeeks(2);
    setCatDeliverablesText('');
    setTimeout(() => setCmsFeedback(''), 3500);
  };

  // Save current Quotation/Proposal into Saved Records Archive
  const handleSaveQuoteToArchive = (docType: 'Quotation' | 'Proposal') => {
    const newRecord: SavedProposalQuote = {
      id: Date.now(),
      reference_no: quoteReference,
      doc_type: docType,
      client_name: clientName.trim() || 'Valued Client',
      company_name: companyName.trim() || 'Client Organization',
      client_email: clientEmail.trim() || 'client@company.com',
      client_phone: clientPhone.trim() || '+91 9800000000',
      client_city: clientCity.trim() || 'Delhi NCR',
      project_goal: projectGoal.trim(),
      selected_service_ids: selectedServiceIds,
      discount_amount: discountAmount,
      include_gst: includeGst,
      subtotal,
      gst_amount: gstAmount,
      grand_total: grandTotal,
      status: 'sent',
      created_at: new Date().toISOString(),
    };
    updateCmsSavedQuotes([newRecord, ...savedQuotesList]);
    setSubmissionStatus({
      type: 'success',
      msg: `${docType} (${quoteReference}) saved to Admin Saved Records Archive!`,
    });
  };

  // Load a saved quote back into the live editor
  const handleLoadSavedQuote = (record: SavedProposalQuote) => {
    setClientName(record.client_name);
    setCompanyName(record.company_name);
    setClientEmail(record.client_email);
    setClientPhone(record.client_phone);
    setClientCity(record.client_city);
    setProjectGoal(record.project_goal);
    setSelectedServiceIds(record.selected_service_ids);
    setDiscountAmount(record.discount_amount || 0);
    setIncludeGst(record.include_gst);
    setQuoteReference(record.reference_no);
    setActiveTab(record.doc_type === 'Proposal' ? 'proposal' : 'quotation');
  };

  // Open a clean printable window for Brochure / Quotation / Proposal
  const handlePrintOrDownloadDocument = (docType: 'Brochure' | 'Quotation' | 'Proposal') => {
    const printWindow = window.open('', '_blank', 'width=960,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const itemsRowsHtml = selectedItems
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;font-weight:700;">0${idx + 1}</td>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;">
            <div style="font-weight:700;color:#0A2540;font-size:14px;">${item.name}</div>
            <div style="font-size:12px;color:#475569;margin-top:4px;">${item.deliverables.join(' • ')}</div>
          </td>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.timelineWeeks} Weeks</td>
          <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;color:#0A2540;">₹${item.basePrice.toLocaleString('en-IN')}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>ShivWebsIndia_${docType}_${quoteReference}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0A2540; margin: 0; padding: 32px; background: #fff; }
          .tricolor { height: 6px; background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%); margin-bottom: 20px; border: 1px solid #e2e8f0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0A2540; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 28px; font-weight: 800; color: #0A2540; }
          .brand span { color: #DD0B0B; }
          .badge { display: inline-block; background: #FF6A00; color: #fff; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          .meta-box { background: #F5F7FA; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #0A2540; color: #fff; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
          .totals { width: 320px; margin-left: auto; margin-top: 20px; background: #F5F7FA; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .totals-row.grand { border-top: 2px solid #0A2540; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 800; color: #DD0B0B; }
          .section-box { margin-top: 24px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 12px; }
          .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #475569; display: flex; justify-content: space-between; }
          @media print { .no-print { display: none; } body { padding: 12px; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom:16px;text-align:right;">
          <button onclick="window.print()" style="background:#FF6A00;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:700;cursor:pointer;">🖨️ Print / Save as PDF</button>
        </div>
        <div class="tricolor"></div>
        <div class="header">
          <div>
            <div class="brand">ShivWebs<span>India</span></div>
            <div style="font-size:13px;color:#475569;margin-top:4px;">${brochureCfg.subheadline}</div>
            <div style="font-size:12px;color:#0A2540;margin-top:6px;">
              <strong>Address:</strong> ${cms.settings.office_address || 'Vaishali, 3F, Sector 3, Ghaziabad (201010)'}<br/>
              <strong>Phone:</strong> ${cms.settings.contact_phone} | ${cms.settings.secondary_phone} · <strong>Email:</strong> ${cms.settings.contact_email}
            </div>
          </div>
          <div style="text-align:right;">
            <span class="badge">Official ${docType}</span>
            <div style="font-size:13px;font-weight:700;margin-top:8px;">Ref: ${quoteReference}</div>
            <div style="font-size:12px;color:#64748b;">Date: ${dateStr}</div>
          </div>
        </div>

        <div class="meta-box">
          <div>
            <div style="font-size:11px;text-transform:uppercase;color:#8B1E1E;font-weight:700;">Prepared For</div>
            <div style="font-size:16px;font-weight:800;margin-top:2px;">${companyName || 'Valued Client'}</div>
            <div style="font-size:13px;color:#334155;">Attn: ${clientName || 'Management'} (${clientCity})</div>
            ${clientPhone ? `<div style="font-size:12px;color:#475569;">Phone: ${clientPhone} | Email: ${clientEmail}</div>` : ''}
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;text-transform:uppercase;color:#8B1E1E;font-weight:700;">Estimated Delivery</div>
            <div style="font-size:16px;font-weight:800;margin-top:2px;">${estimatedWeeks} Weeks</div>
            <div style="font-size:12px;color:#334155;">Valid for 15 Days</div>
          </div>
        </div>

        ${
          docType === 'Brochure'
            ? `
          <div class="section-box">
            <h3 style="margin:0 0 8px 0;color:#0A2540;">${brochureCfg.headline}</h3>
            <p style="font-size:13px;line-height:1.6;margin:0;color:#334155;">
              ${brochureCfg.subheadline} — <strong>${brochureCfg.experience_years} Experience</strong>, <strong>${brochureCfg.projects_delivered} Projects</strong>, <strong>${brochureCfg.industries_served} Industries</strong>, and <strong>${brochureCfg.client_retention} Client Retention</strong>.
            </p>
          </div>`
            : `
          <div class="section-box">
            <h3 style="margin:0 0 6px 0;color:#0A2540;">Project Objective & Scope Summary</h3>
            <p style="font-size:13px;line-height:1.6;margin:0;color:#334155;">${projectGoal}</p>
          </div>`
        }

        <table>
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th>Service & Key Deliverables</th>
              <th style="width:110px;text-align:center;">Timeline</th>
              <th style="width:130px;text-align:right;">Investment (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRowsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Base Subtotal:</span>
            <strong>₹${rawSubtotal.toLocaleString('en-IN')}</strong>
          </div>
          ${
            discountAmount > 0
              ? `<div class="totals-row" style="color:#128807;">
                  <span>Special Discount:</span>
                  <strong>- ₹${discountAmount.toLocaleString('en-IN')}</strong>
                </div>`
              : ''
          }
          ${
            includeGst
              ? `<div class="totals-row">
                  <span>GST (18%):</span>
                  <strong>₹${gstAmount.toLocaleString('en-IN')}</strong>
                </div>`
              : ''
          }
          <div class="totals-row grand">
            <span>Total Estimate:</span>
            <span>₹${grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="section-box">
          <h4 style="margin:0 0 8px 0;color:#0A2540;">Execution Roadmap & Commercial Terms</h4>
          <p style="font-size:12px;line-height:1.6;color:#334155;margin:0;">
            <strong>Workflow:</strong> ${brochureCfg.roadmap_summary}<br/>
            <strong>Payment Terms:</strong> ${brochureCfg.payment_terms}
          </p>
        </div>

        <div class="footer">
          <div>Authorized Signatory — <strong>${brochureCfg.authorized_signatory}</strong></div>
          <div>Support: ${cms.settings.contact_phone} | ${cms.settings.notification_recipient_email}</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Lock & Send Quotation/Proposal to shivwebsindia@gmail.com + Admin Lead DB + Saved Quotes Archive
  const handleSendOfficialProposalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus({ type: 'idle', msg: '' });

    const servicesSummary = selectedItems.map((s) => s.name).join(', ');
    const fullProposalMessage = `[${activeTab.toUpperCase()} REF: ${quoteReference}] Selected Services: ${servicesSummary} | Total Estimate: ₹${grandTotal.toLocaleString(
      'en-IN'
    )} (${includeGst ? 'Incl. GST' : 'Excl. GST'}, Discount: ₹${discountAmount}) | Goal: ${projectGoal}`;

    const res = onSubmitEnquiry({
      full_name: clientName,
      email: clientEmail,
      phone: clientPhone,
      company_name: companyName,
      service_interested: servicesSummary || 'Website & SEO Proposal',
      budget_range: `₹${grandTotal.toLocaleString('en-IN')} (${quoteReference})`,
      message: fullProposalMessage,
      source_page: `/brochure-quotation-proposal (${activeTab})`,
      csrf_token: csrfToken,
      honeypot: '',
    });

    if (res.success) {
      handleSaveQuoteToArchive(activeTab === 'proposal' ? 'Proposal' : 'Quotation');
      setSubmissionStatus({
        type: 'success',
        msg: `Official ${activeTab} (${quoteReference}) for ₹${grandTotal.toLocaleString(
          'en-IN'
        )} has been saved to Saved Records and routed to ${
          cms.settings.notification_recipient_email || 'shivwebsindia@gmail.com'
        }!`,
      });
    } else {
      setSubmissionStatus({
        type: 'error',
        msg: res.error || 'Please enter client name, valid email, and 10-digit mobile number.',
      });
    }
  };

  return (
    <section
      id="swi-business-desk"
      className="py-10 sm:py-14 px-4 sm:px-6 bg-gradient-to-b from-[#0A2540] via-[#0f172a] to-[#0A2540] text-white border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6A00]/20 border border-[#FF6A00]/40 text-[#FF9933] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Dynamic Admin Desk · Edit, Add &amp; Delete Any Package or Content</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dynamic <span className="text-[#FF6A00]">Brochure</span>,{' '}
              <span className="text-[#00d4ff]">Quotation</span> &amp;{' '}
              <span className="text-emerald-400">Proposal</span> CMS
            </h2>
            <p className="text-slate-300 mt-1.5 max-w-2xl text-xs sm:text-sm">
              Manage service packages, edit brochure PDF/stats, build custom client quotations with discounts, and track all saved proposals in one place.
            </p>
          </div>

          {/* 5-Tab Switcher: Brochure | Quotation | Proposal | Edit Catalog & CMS | Saved Records */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl self-start xl:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('brochure')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'brochure'
                  ? 'bg-[#FF6A00] text-white shadow-lg'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. e-Brochure</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quotation')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quotation'
                  ? 'bg-[#FF6A00] text-white shadow-lg'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>2. Quotation Builder</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proposal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'proposal'
                  ? 'bg-[#FF6A00] text-white shadow-lg'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>3. Proposal Generator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cms_manager')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cms_manager'
                  ? 'bg-[#0096e8] text-white shadow-lg'
                  : 'text-amber-300 hover:bg-white/10'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>4. Edit Catalog &amp; Brochure CMS ({catalogList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved_records')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'saved_records'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-emerald-300 hover:bg-white/10'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>5. Saved Quotes ({savedQuotesList.length})</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            TAB 1: OFFICIAL DIGITAL COMPANY BROCHURE (DYNAMIC FROM brochureCfg)
           ==================================================================== */}
        {activeTab === 'brochure' && (
          <div className="bg-white text-[#0A2540] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Top Tricolor Ribbon */}
            <div
              className="h-2 w-full"
              style={{
                background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)',
              }}
            />

            {/* Brochure Hero Header */}
            <div className="bg-gradient-to-r from-[#522c2a] via-[#2b1817] to-[#0A2540] text-white p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF6A00] text-white text-[11px] font-extrabold uppercase tracking-widest">
                    Official Corporate Profile &amp; Service Brochure
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Brochure Content
                  </button>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-3 leading-tight">
                  {brochureCfg.headline}
                </h3>
                <p className="text-slate-200 text-sm mt-1.5">{brochureCfg.subheadline}</p>
                <p className="text-slate-300 text-xs mt-2">
                  Official PDF URL:{' '}
                  <code className="text-amber-300 font-mono text-xs break-all">
                    {brochureCfg.pdf_url}
                  </code>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={brochureCfg.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg btn-hover-lift"
                >
                  <FileText className="w-4 h-4" />
                  <span>👁 View Official PDF</span>
                </a>
                <a
                  href={brochureCfg.pdf_url}
                  download="Company-Brochure-ShivWebsIndia.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg btn-hover-lift"
                >
                  <Download className="w-4 h-4" />
                  <span>⬇ Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => handlePrintOrDownloadDocument('Brochure')}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#00d4ff]" />
                  <span>Print Summary Sheet</span>
                </button>
              </div>
            </div>

            {/* Embedded Official PDF Viewer */}
            <div className="p-6 sm:p-8 bg-slate-100 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="font-display text-base sm:text-lg font-extrabold text-[#0A2540]">
                    📄 Live Official PDF Brochure Viewer
                  </h4>
                  <p className="text-xs text-slate-600 break-all">Source: {brochureCfg.pdf_url}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    Change PDF URL in CMS →
                  </button>
                  <a
                    href={brochureCfg.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#0d6efd] hover:underline"
                  >
                    Open Fullscreen PDF ↗
                  </a>
                </div>
              </div>
              <div className="w-full h-[500px] rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-inner">
                <iframe
                  src={brochureCfg.pdf_url}
                  title="Official Company Brochure ShivWebsIndia PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Brochure Inside Spread (3 Columns) */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Panel 1: Credentials & Why Us */}
              <div className="lg:col-span-4 bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E1E]">
                    01 · Agency Credentials
                  </span>
                  <h4 className="font-display text-xl font-extrabold text-[#0A2540] mt-1">
                    Proven Track Record in Delhi NCR
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {brochureCfg.subheadline}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                      <div className="font-display text-2xl font-extrabold text-[#DD0B0B]">
                        {brochureCfg.experience_years}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        Industry Experience
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                      <div className="font-display text-2xl font-extrabold text-[#0A2540]">
                        {brochureCfg.projects_delivered}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        Projects Delivered
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                      <div className="font-display text-2xl font-extrabold text-[#0d6efd]">
                        {brochureCfg.industries_served}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        Industries Served
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                      <div className="font-display text-2xl font-extrabold text-[#128807]">
                        {brochureCfg.client_retention}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        Client Retention
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <MapPin className="w-4 h-4 text-[#DD0B0B] shrink-0" />
                    <span>Vaishali, 3F, Sector 3, Ghaziabad (201010)</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold tabular-nums">
                    <Phone className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>
                      {cms.settings.contact_phone} | {cms.settings.secondary_phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Mail className="w-4 h-4 text-[#0d6efd] shrink-0" />
                    <span>{cms.settings.contact_email}</span>
                  </div>
                </div>
              </div>

              {/* Panel 2: Dynamic Service Matrix */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0d6efd]">
                    02 · Dynamic Service Portfolio ({activeCatalogItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                  >
                    + Add / Edit Services
                  </button>
                </div>
                <h4 className="font-display text-xl font-extrabold text-[#0A2540] mt-1">
                  Web Engineering &amp; Digital Growth
                </h4>

                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                  {activeCatalogItems.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-3 rounded-xl bg-[#F5F7FA] border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-display text-xs sm:text-sm font-bold text-[#0A2540]">
                          {svc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {svc.deliverables[0]}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#0A2540] text-white font-mono text-xs font-bold shrink-0 tabular-nums">
                        ₹{svc.basePrice.toLocaleString('en-IN')}+
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 3: Tech Stack & Next Step CTA */}
              <div className="lg:col-span-3 bg-gradient-to-b from-[#0A2540] to-[#13385e] text-white rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#00d4ff]">
                    03 · Technology Stack
                  </span>
                  <h4 className="font-display text-xl font-extrabold text-white mt-1">
                    Modern, Secure &amp; Scalable
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {[
                      'HTML5 / CSS3',
                      'PHP 8.x MVC',
                      'MySQL InnoDB',
                      'WordPress CMS',
                      'WooCommerce',
                      'ReactJS / Node',
                      'Laravel',
                      'Razorpay / UPI',
                      'Schema.org SEO',
                      'Google Ads',
                    ].map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-semibold text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quotation')}
                    className="w-full py-3 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Calculate Instant Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Brochure &amp; Prices</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: INTERACTIVE INSTANT QUOTATION BUILDER (DYNAMIC CATALOG + CUSTOM ITEM)
           ==================================================================== */}
        {activeTab === 'quotation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Select Services, Add Custom Line Item & Manage Catalog */}
            <div className="lg:col-span-7 bg-white text-[#0A2540] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#DD0B0B]">
                    Step 1 · Select or Customize Services
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0A2540] mt-0.5">
                    Dynamic Quotation Package Selector
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="px-3 py-1.5 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit / Delete Packages</span>
                  </button>
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 text-[#0A2540] font-mono text-xs font-bold">
                    {selectedItems.length} Selected
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {activeCatalogItems.map((item) => {
                  const isSelected = selectedServiceIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleService(item.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#F5F7FA] border-[#FF6A00] shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 accent-[#FF6A00] cursor-pointer"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-sm font-bold text-[#0A2540]">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[10px] font-bold text-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                            {item.deliverables.map((d, i) => (
                              <li key={i}>• {d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-base font-extrabold text-[#0A2540] tabular-nums">
                          ₹{item.basePrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.timelineWeeks} Weeks</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Add Custom Line Item Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-display text-xs font-extrabold uppercase tracking-wider text-[#0A2540] mb-2.5">
                  + Add Custom Line Item / Requirement to This Quote
                </h4>
                <form
                  onSubmit={handleAddQuickCustomService}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2.5"
                >
                  <input
                    type="text"
                    required
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Service Name (e.g. Custom CRM Module)"
                    className="sm:col-span-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    required
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    placeholder="Price (INR) e.g. 8000"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#0A2540] hover:bg-[#FF6A00] text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Quote
                  </button>
                  <input
                    type="text"
                    value={customItemDeliverable}
                    onChange={(e) => setCustomItemDeliverable(e.target.value)}
                    placeholder="Deliverable details (optional)..."
                    className="sm:col-span-4 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </form>
              </div>

              {/* Discount & GST Controls */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#0A2540] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGst}
                      onChange={(e) => setIncludeGst(e.target.checked)}
                      className="w-4 h-4 accent-[#0A2540]"
                    />
                    <span>Include 18% GST</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Special Discount (₹):</span>
                    <input
                      type="number"
                      min={0}
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      className="w-28 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('proposal')}
                  className="text-xs font-bold text-[#FF6A00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Convert to Full Project Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Itemized Quotation Preview & PDF Export */}
            <div className="lg:col-span-5 bg-white text-[#0A2540] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-gradient-to-r from-[#522c2a] to-[#0A2540] text-white p-6">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#FF6A00] text-white font-mono text-[11px] font-bold">
                    ESTIMATE #{quoteReference}
                  </span>
                  <span className="text-xs text-slate-300">
                    {new Date().toLocaleDateString('en-IN')}
                  </span>
                </div>
                <h4 className="font-display text-xl font-extrabold text-white mt-2">
                  Official Cost Quotation
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  ShivWebsIndia · Vaishali, Sector 3, Ghaziabad
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Selected Line Items */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      Select at least one service on the left to generate your live quotation.
                    </p>
                  ) : (
                    selectedItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100"
                      >
                        <div>
                          <span className="font-mono font-bold text-[#8B1E1E] mr-1.5">
                            0{idx + 1}.
                          </span>
                          <span className="font-semibold text-[#0A2540]">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-[#0A2540] tabular-nums shrink-0 ml-2">
                          ₹{item.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals Summary Box */}
                <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-slate-200/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimated Delivery Timeline:</span>
                    <strong className="text-[#0A2540]">{estimatedWeeks} Weeks</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Subtotal:</span>
                    <strong className="font-mono text-[#0A2540] tabular-nums">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Special Discount:</span>
                      <strong className="font-mono tabular-nums">
                        - ₹{discountAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}
                  {includeGst && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>GST (18%):</span>
                      <strong className="font-mono text-[#0A2540] tabular-nums">
                        ₹{gstAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}
                  <div className="pt-2.5 border-t border-slate-300 flex items-center justify-between text-base font-extrabold text-[#DD0B0B]">
                    <span>Total Estimate:</span>
                    <span className="font-mono tabular-nums flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quick Client Lock & Email Form */}
                <form onSubmit={handleSendOfficialProposalRequest} className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-[#0A2540]">
                    Save to Records &amp; Email Official Quotation:
                  </p>

                  {submissionStatus.type !== 'idle' && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        submissionStatus.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          : 'bg-red-50 border border-red-200 text-red-900'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{submissionStatus.msg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Client Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="tel"
                      required
                      placeholder="10-Digit Mobile *"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Client Email *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePrintOrDownloadDocument('Quotation')}
                      className="py-3 px-4 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#00d4ff]" />
                      <span>Print / Save PDF</span>
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Save &amp; Email Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: CUSTOMIZED PROJECT PROPOSAL GENERATOR
           ==================================================================== */}
        {activeTab === 'proposal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Proposal Customizer Inputs */}
            <div className="lg:col-span-4 bg-white text-[#0A2540] rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E1E]">
                  Customize Proposal
                </span>
                <h3 className="font-display text-xl font-extrabold text-[#0A2540] mt-0.5">
                  Client &amp; Project Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Personalize the executive proposal document in real time and save it to records.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                  Client / Decision Maker Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                  Location / Target Market
                </label>
                <input
                  type="text"
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1">
                  Project Objective &amp; Business Goals
                </label>
                <textarea
                  rows={3}
                  value={projectGoal}
                  onChange={(e) => setProjectGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F7FA] border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePrintOrDownloadDocument('Proposal')}
                  className="w-full py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Full Proposal (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuoteToArchive('Proposal')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A2540] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4 text-[#00d4ff]" />
                  <span>Save Proposal to Admin Records</span>
                </button>
                <a
                  href={`https://wa.me/${cms.settings.whatsapp_number}?text=${encodeURIComponent(
                    `Namaste ${clientName}, here is your official ShivWebsIndia Proposal ${quoteReference} for ${companyName} (Estimate: ₹${grandTotal.toLocaleString(
                      'en-IN'
                    )}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share Proposal on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Live Executive Project Proposal Document */}
            <div className="lg:col-span-8 bg-white text-[#0A2540] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Document Header */}
              <div className="bg-gradient-to-r from-[#0A2540] via-[#163a5f] to-[#522c2a] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-[#00d4ff] font-mono text-xs font-bold">
                    TECHNICAL &amp; COMMERCIAL PROPOSAL · {quoteReference}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Website &amp; Digital Growth Proposal
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">
                    Prepared exclusively for <strong>{companyName}</strong> ({clientName} ·{' '}
                    {clientCity})
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 bg-white/10 p-4 rounded-2xl border border-white/15">
                  <div className="text-[11px] uppercase tracking-wider text-slate-300">
                    Total Investment
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-[#FF9933] tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Timeline: {estimatedWeeks} Weeks
                  </div>
                </div>
              </div>

              {/* Proposal Body Sections */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Executive Summary */}
                <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-slate-200/90">
                  <h4 className="font-display text-base font-extrabold text-[#0A2540] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF6A00]" />
                    <span>1. Executive Summary &amp; Project Objective</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                    {projectGoal}
                  </p>
                </div>

                {/* 2. Scope of Work & Deliverables */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display text-base font-extrabold text-[#0A2540] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#128887]" />
                      <span>2. Scope of Work &amp; Technical Deliverables</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('quotation')}
                      className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                    >
                      Modify Selected Services →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {selectedItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display text-xs sm:text-sm font-bold text-[#0A2540]">
                            0{idx + 1}. {item.name}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#DD0B0B] tabular-nums">
                            ₹{item.basePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {item.deliverables.map((d, i) => (
                            <li key={i}>✔ {d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Milestone Schedule & Terms (Driven by brochureCfg) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-slate-200">
                    <h4 className="font-display text-sm font-extrabold text-[#0A2540] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0d6efd]" />
                      <span>3. Delivery Roadmap ({estimatedWeeks} Weeks)</span>
                    </h4>
                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">
                      {brochureCfg.roadmap_summary}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-slate-200">
                    <h4 className="font-display text-sm font-extrabold text-[#0A2540] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#128807]" />
                      <span>4. Payment Terms &amp; Ownership</span>
                    </h4>
                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">
                      {brochureCfg.payment_terms}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Authorized Signatory: <strong className="text-[#0A2540]">{brochureCfg.authorized_signatory}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms_manager')}
                    className="text-[#FF6A00] font-bold hover:underline cursor-pointer"
                  >
                    Edit Terms &amp; Signatory in CMS →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: DYNAMIC CMS MANAGER (ADD / EDIT / DELETE CATALOG & BROCHURE)
           ==================================================================== */}
        {activeTab === 'cms_manager' && (
          <div className="space-y-8">
            {cmsFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
                <Check className="w-4 h-4" />
                <span>{cmsFeedback}</span>
              </div>
            )}

            {/* Part A: Add / Edit Quotation & Proposal Service Packages */}
            <div className="bg-white text-[#0A2540] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6A00]">
                    Dynamic Service Package CMS
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0A2540] mt-0.5">
                    {editingCatalogId
                      ? `Editing Package: ${catName}`
                      : '+ Add New Service Package to Quotation & Proposal Catalog'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Any service added, edited, or deleted here updates the Brochure, Quotation Builder, and Proposal Generator immediately.
                  </p>
                </div>
                {editingCatalogId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatalogId(null);
                      setCatName('');
                      setCatPrice(15000);
                      setCatWeeks(2);
                      setCatDeliverablesText('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCatalogItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Service Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Custom Laravel ERP / Portal Development"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">Category</label>
                  <select
                    value={catCategory}
                    onChange={(e) =>
                      setCatCategory(e.target.value as QuoteCatalogItem['category'])
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Add-Ons">Add-Ons</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={catPrice}
                      onChange={(e) => setCatPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Weeks *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={catWeeks}
                      onChange={(e) => setCatWeeks(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Deliverables Bullet Points (One deliverable per line) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={catDeliverablesText}
                    onChange={(e) => setCatDeliverablesText(e.target.value)}
                    placeholder={
                      'Up to 15 Dynamic Pages with Admin Dashboard\nMobile Responsive UI & Technical SEO\n1 Year Free Technical Support'
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingCatalogId ? 'Update Service Package' : 'Add Service Package to Catalog'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Existing Catalog Items List with Edit, Toggle, Delete */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h4 className="font-display text-sm font-extrabold text-[#0A2540]">
                  All Catalog Service Packages ({catalogList.length})
                </h4>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  {catalogList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-bold text-[#0A2540]">
                            {item.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                            {item.category}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#DD0B0B]">
                            ₹{item.basePrice.toLocaleString('en-IN')} ({item.timelineWeeks} Wks)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.deliverables.join(' • ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            updateCmsCatalog(
                              catalogList.map((c) =>
                                c.id === item.id ? { ...c, is_active: !c.is_active } : c
                              )
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            item.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Hidden'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatalogId(item.id);
                            setCatName(item.name);
                            setCatCategory(item.category);
                            setCatPrice(item.basePrice);
                            setCatWeeks(item.timelineWeeks);
                            setCatDeliverablesText(item.deliverables.join('\n'));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0A2540] hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateCmsCatalog(catalogList.filter((c) => c.id !== item.id));
                            setSelectedServiceIds((prev) => prev.filter((id) => id !== item.id));
                          }}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Service Package"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Part B: Dynamic Brochure & Proposal Terms CMS Editor */}
            <div className="bg-white text-[#0A2540] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0096e8]">
                  Brochure &amp; Proposal Template Settings
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0A2540] mt-0.5">
                  Edit Official Brochure PDF Link, Agency Stats &amp; Proposal Terms
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Brochure Headline
                  </label>
                  <input
                    type="text"
                    value={brochureCfg.headline}
                    onChange={(e) =>
                      updateCmsBrochure({ ...brochureCfg, headline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Official Brochure PDF URL
                  </label>
                  <input
                    type="text"
                    value={brochureCfg.pdf_url}
                    onChange={(e) =>
                      updateCmsBrochure({ ...brochureCfg, pdf_url: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Agency Subheadline / Tagline
                  </label>
                  <input
                    type="text"
                    value={brochureCfg.subheadline}
                    onChange={(e) =>
                      updateCmsBrochure({ ...brochureCfg, subheadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:col-span-2">
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Experience Stat
                    </label>
                    <input
                      type="text"
                      value={brochureCfg.experience_years}
                      onChange={(e) =>
                        updateCmsBrochure({ ...brochureCfg, experience_years: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Projects Stat
                    </label>
                    <input
                      type="text"
                      value={brochureCfg.projects_delivered}
                      onChange={(e) =>
                        updateCmsBrochure({ ...brochureCfg, projects_delivered: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Industries Stat
                    </label>
                    <input
                      type="text"
                      value={brochureCfg.industries_served}
                      onChange={(e) =>
                        updateCmsBrochure({ ...brochureCfg, industries_served: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Retention Stat
                    </label>
                    <input
                      type="text"
                      value={brochureCfg.client_retention}
                      onChange={(e) =>
                        updateCmsBrochure({ ...brochureCfg, client_retention: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Execution Roadmap Text (Printed on Quotes &amp; Proposals)
                  </label>
                  <textarea
                    rows={3}
                    value={brochureCfg.roadmap_summary}
                    onChange={(e) =>
                      updateCmsBrochure({ ...brochureCfg, roadmap_summary: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Payment Milestones &amp; Terms Text
                  </label>
                  <textarea
                    rows={3}
                    value={brochureCfg.payment_terms}
                    onChange={(e) =>
                      updateCmsBrochure({ ...brochureCfg, payment_terms: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    Authorized Signatory Line
                  </label>
                  <input
                    type="text"
                    value={brochureCfg.authorized_signatory}
                    onChange={(e) =>
                      updateCmsBrochure({
                        ...brochureCfg,
                        authorized_signatory: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 5: SAVED QUOTATIONS & PROPOSALS ARCHIVE (LOAD, UPDATE STATUS, DELETE)
           ==================================================================== */}
        {activeTab === 'saved_records' && (
          <div className="bg-white text-[#0A2540] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Saved Quotations &amp; Proposals CRM
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0A2540] mt-0.5">
                  Generated Client Quotations &amp; Proposals ({savedQuotesList.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Load any saved quotation or proposal back into the editor, change approval status, or delete old records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('quotation')}
                className="px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#e55f00] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create New Quotation
              </button>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
              {savedQuotesList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No saved quotations or proposals yet. Use the Quotation or Proposal tab to save one.
                </div>
              ) : (
                savedQuotesList.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#0A2540] text-white font-mono text-[11px] font-bold">
                          {rec.reference_no}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-orange-100 text-[#8B1E1E] text-[10px] font-bold uppercase">
                          {rec.doc_type}
                        </span>
                        <span className="font-display text-base font-bold text-[#0A2540]">
                          {rec.company_name} ({rec.client_name})
                        </span>
                        <span className="font-mono text-sm font-extrabold text-[#DD0B0B]">
                          ₹{rec.grand_total.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{rec.project_goal}</p>
                      <div className="text-[11px] text-slate-400">
                        {rec.client_phone} · {rec.client_email} · {rec.client_city}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        value={rec.status}
                        onChange={(e) => {
                          const nextSt = e.target.value as SavedProposalQuote['status'];
                          updateCmsSavedQuotes(
                            savedQuotesList.map((q) =>
                              q.id === rec.id ? { ...q, status: nextSt } : q
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold capitalize bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent to Client</option>
                        <option value="approved">Approved / Won</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleLoadSavedQuote(rec)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Load &amp; Edit / Print</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateCmsSavedQuotes(savedQuotesList.filter((q) => q.id !== rec.id))
                        }
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
