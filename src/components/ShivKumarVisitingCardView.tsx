import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Download,
  Share2,
  Eye,
  FileText,
  CreditCard,
  Star,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  QrCode,
  Building2,
} from 'lucide-react';
import { CMSDatabaseState } from '../data/initialCmsData';

interface ShivKumarVisitingCardProps {
  cms: CMSDatabaseState;
  onNavigate?: (path: string) => void;
}

export const OFFICIAL_BROCHURE_PDF_URL =
  'https://www.shivwebsindia.com/wp-content/uploads/2025/05/Company-Brochure-ShivWebsIndia.pdf';

export const ShivKumarVisitingCardView: React.FC<ShivKumarVisitingCardProps> = ({
  cms,
  onNavigate,
}) => {
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState<boolean>(false);

  const handleDownloadVCard = () => {
    const vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Kumar;Shiv;;;',
      'FN:Shiv Kumar (CEO - ShivWebsIndia)',
      'ORG:ShivWebsIndia',
      'TITLE:Chief Executive Officer',
      'TEL;TYPE=CELL,VOICE:+918667666429',
      'TEL;TYPE=WORK,VOICE:+919266220144',
      'EMAIL;TYPE=PREF,INTERNET:shiv@shivwebsindia.com',
      'EMAIL;TYPE=WORK,INTERNET:info@shivwebsindia.com',
      'URL:https://www.shivwebsindia.com/',
      'ADR;TYPE=WORK:;;Plot no.313, 3F, Vaishali sector 3;Ghaziabad;UP;201010;INDIA',
      'END:VCARD',
    ].join('\n');

    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Shiv_Kumar_ShivWebsIndia.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const socialConnectItems = [
    {
      label: 'Call Us (+91-8667666429)',
      href: 'tel:+918667666429',
      icon: 'https://img.icons8.com/ios-filled/50/ffffff/phone.png',
    },
    {
      label: 'Talk To Us on WhatsApp',
      href: 'https://wa.me/+918667666429',
      icon: 'https://img.icons8.com/ios-filled/50/25D366/whatsapp.png',
    },
    {
      label: 'Follow Us on Instagram',
      href: 'https://www.instagram.com/shivwebsindia',
      icon: 'https://img.icons8.com/ios-filled/50/E1306C/instagram.png',
    },
    {
      label: 'Find Us on X / Twitter',
      href: 'https://twitter.com/shivwebsindia',
      icon: 'https://img.icons8.com/ios-filled/50/1DA1F2/twitter.png',
    },
    {
      label: 'Connect Us on LinkedIn',
      href: 'https://www.linkedin.com/company/shivwebsindia/',
      icon: 'https://img.icons8.com/ios-filled/50/0A66C2/linkedin.png',
    },
    {
      label: 'Discover Us on Pinterest',
      href: 'https://in.pinterest.com/shivwebsindia/',
      icon: 'https://img.icons8.com/ios-filled/50/E60023/pinterest.png',
    },
    {
      label: 'Subscribe Us on YouTube',
      href: 'https://www.youtube.com/channel/shivwebsindia',
      icon: 'https://img.icons8.com/ios-filled/50/FF0000/youtube.png',
    },
    {
      label: 'Write Us (shiv@shivwebsindia.com)',
      href: 'mailto:shiv@shivwebsindia.com',
      icon: 'https://img.icons8.com/ios-filled/50/ffffff/email.png',
    },
    {
      label: 'Reach Us on Google Maps',
      href: 'https://maps.app.goo.gl/ZMK5zZx4mNcE3kP17',
      icon: 'https://img.icons8.com/ios-filled/50/ffffff/marker.png',
    },
    {
      label: 'Visit Us (shivwebsindia.com)',
      href: 'https://www.shivwebsindia.com/',
      icon: 'https://img.icons8.com/ios-filled/50/ffffff/domain.png',
    },
  ];

  return (
    <section
      className="py-12 sm:py-16 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #0f4c81 100%)',
        color: '#e6eef8',
      }}
    >
      {/* Top breadcrumb bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-3">
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
          <span>Official Digital Visiting Card · https://www.shivwebsindia.com/shivkumar/</span>
        </div>
      </div>

      {/* Main Digital Visiting Card Container (.vcard) */}
      <div
        className="w-full max-w-4xl rounded-[22px] overflow-hidden shadow-[0_12px_40px_rgba(2,6,23,0.7)] border border-white/15 backdrop-blur-xl flex flex-col md:flex-row"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* LEFT ASIDE: Profile Panel (.profile-panel) */}
        <aside className="w-full md:w-[300px] shrink-0 p-6 sm:p-8 flex flex-col items-center bg-white/[0.04] border-b md:border-b-0 md:border-r border-white/10">
          {/* Logo Box */}
          <div className="mb-5 bg-white/95 px-4 py-2.5 rounded-xl shadow-md">
            <img
              src="https://www.shivwebsindia.com/wp-content/uploads/2023/01/cropped-shivwebsindia-logo500-%C3%97-200-px-1.png"
              alt="ShivWebsIndia Logo"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://www.shivwebsindia.com/wp-content/uploads/2026/08/logo2026.png';
              }}
              className="max-w-[160px] h-auto block object-contain"
            />
          </div>

          {/* CEO Portrait */}
          <div className="relative group mb-4">
            <img
              src="https://www.shivwebsindia.com/wp-content/uploads/2025/09/shiv-kumar.jpeg"
              alt="Shiv Kumar - Chief Executive Officer"
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-[0_8px_24px_rgba(2,6,23,0.7)] border-2 border-cyan-400/50 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-[10px] font-extrabold uppercase tracking-wider text-white shadow">
              Founder &amp; CEO
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mt-2">
            Shiv <strong className="font-extrabold text-cyan-300">Kumar</strong>
          </h1>
          <p className="text-xs sm:text-sm text-[#b7c6d9] text-center mt-1 font-medium">
            Chief Executive Officer · ShivWebsIndia
          </p>

          {/* Share This Card */}
          <div className="w-full mt-6 pt-5 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-center text-cyan-300 mb-3">
              Share This Card
            </h3>
            <div className="flex items-center justify-center gap-2.5">
              <a
                href="https://api.whatsapp.com/send?text=Check%20out%20this%20Visiting%20Card:%20https://www.shivwebsindia.com/shivkumar/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-violet-600 hover:to-cyan-500 flex items-center justify-center transition-all hover:-translate-y-0.5"
                title="Share on WhatsApp"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/25D366/whatsapp.png"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://www.shivwebsindia.com/shivkumar/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-violet-600 hover:to-cyan-500 flex items-center justify-center transition-all hover:-translate-y-0.5"
                title="Share on Facebook"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/1877F2/facebook.png"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=https://www.shivwebsindia.com/shivkumar/&text=Check%20out%20this%20Visiting%20Card!"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-violet-600 hover:to-cyan-500 flex items-center justify-center transition-all hover:-translate-y-0.5"
                title="Share on Twitter"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/1DA1F2/twitter.png"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://www.shivwebsindia.com/shivkumar/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-violet-600 hover:to-cyan-500 flex items-center justify-center transition-all hover:-translate-y-0.5"
                title="Share on LinkedIn"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/0A66C2/linkedin.png"
                  alt="LinkedIn"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="mailto:?subject=Shiv%20Kumar%20-%20ShivWebsIndia%20Visiting%20Card&body=Visit%20here:%20https://www.shivwebsindia.com/shivkumar/"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-violet-600 hover:to-cyan-500 flex items-center justify-center transition-all hover:-translate-y-0.5"
                title="Share via Email"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/email.png"
                  alt="Email"
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>

          {/* Action Buttons: Save Contact List (.vcf) & Share on WhatsApp */}
          <div className="w-full mt-5 space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>📥 Save Contact List (.vcf)</span>
            </button>
            <a
              href="https://api.whatsapp.com/send?text=Check%20out%20this%20Visiting%20Card:%20https://www.shivwebsindia.com/shivkumar/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>📲 Share on WhatsApp</span>
            </a>
          </div>

          {/* Direct Brochure Quick Box in Sidebar */}
          <div className="w-full mt-6 p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-center">
            <img
              src="https://img.icons8.com/ios-filled/50/ffffff/pdf.png"
              alt="PDF Brochure"
              className="w-9 h-9 mx-auto mb-2"
            />
            <h4 className="text-sm font-bold text-white">Official Company Brochure</h4>
            <p className="text-[11px] text-[#b7c6d9] mt-0.5">Company-Brochure-ShivWebsIndia.pdf</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <a
                href={OFFICIAL_BROCHURE_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-[#ff6b35] hover:bg-[#e85a25] text-white text-xs font-bold transition-colors"
              >
                👁 View
              </a>
              <a
                href={OFFICIAL_BROCHURE_PDF_URL}
                download="Company-Brochure-ShivWebsIndia.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-bold transition-colors"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN: Info Panel (.info-panel) */}
        <div className="flex-1 p-6 sm:p-8 space-y-7">
          {/* 1. Connect With Us */}
          <div>
            <h3 className="text-lg font-bold text-white border-b border-white/15 pb-2 mb-3">
              Connect With Us
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {socialConnectItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-gradient-to-r hover:from-violet-600 hover:to-cyan-500 border border-white/10 text-xs sm:text-sm text-[#e6eef8] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 2. About Us */}
          <div>
            <h3 className="text-lg font-bold text-white border-b border-white/15 pb-2 mb-2.5">
              About Us
            </h3>
            <p className="text-xs sm:text-sm text-[#b7c6d9] leading-relaxed">
              ShivWebsIndia is a leading digital solutions provider specializing in web design,
              e-commerce, SEO, and digital marketing. With a focus on creativity and performance,
              we help businesses establish a strong online presence.
            </p>
          </div>

          {/* 3. Our Services & Our Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-white border-b border-white/15 pb-2 mb-3">
                Our Services
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  'Website Design',
                  'E-Commerce Solutions',
                  'Digital Marketing',
                  'SEO Services',
                ].map((srv) => (
                  <div
                    key={srv}
                    className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-center text-xs font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    {srv}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white border-b border-white/15 pb-2 mb-3">
                Our Products
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  'Business Websites',
                  'Portfolio Sites',
                  'Landing Pages',
                  'Custom Web Apps',
                ].map((prd) => (
                  <div
                    key={prd}
                    className="p-3 rounded-xl bg-white/[0.06] border border-white/10 text-center text-xs font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    {prd}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Documents Section — Official Brochure PDF */}
          <div>
            <h3 className="text-lg font-bold text-white border-b border-white/15 pb-2 mb-3">
              Documents (Official Company Brochure)
            </h3>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/pdf.png"
                  alt="PDF"
                  className="w-10 h-10 shrink-0"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Company-Brochure-ShivWebsIndia.pdf
                  </h4>
                  <p className="text-xs text-[#b7c6d9]">
                    Official ShivWebsIndia Corporate Profile, Services &amp; Packages PDF
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                  className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer"
                >
                  {showEmbeddedPdf ? 'Hide Preview' : '📄 Inline Preview'}
                </button>
                <a
                  href={OFFICIAL_BROCHURE_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e85a25] text-white text-xs font-bold"
                >
                  👁 View PDF
                </a>
                <a
                  href={OFFICIAL_BROCHURE_PDF_URL}
                  download="Company-Brochure-ShivWebsIndia.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-bold"
                >
                  ⬇ Download
                </a>
              </div>
            </div>

            {showEmbeddedPdf && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-white/20 bg-slate-900 h-[480px]">
                <iframe
                  src={OFFICIAL_BROCHURE_PDF_URL}
                  title="Company Brochure ShivWebsIndia PDF"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>

          {/* 5. Payment Details Section (Bank + UPI QR from /shivkumar/) */}
          <div>
            <h3 className="text-lg font-bold text-white border-b border-white/15 pb-2 mb-3">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm space-y-1.5">
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-xs mb-2">
                  Official Bank Account
                </div>
                <p>
                  <strong className="text-white">Bank Name:</strong> Indian Overseas Bank
                </p>
                <p>
                  <strong className="text-white">A/C Name:</strong> ShivWebsIndia
                </p>
                <p className="font-mono">
                  <strong className="text-white font-sans">A/C NO.:</strong> 211302000004360
                </p>
                <p className="font-mono">
                  <strong className="text-white font-sans">IFSC Code:</strong> IOBA0002113
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-4">
                <div className="text-xs sm:text-sm">
                  <div className="text-cyan-300 font-bold uppercase tracking-wider text-xs mb-1">
                    UPI Payment
                  </div>
                  <p className="font-mono font-bold text-white">shivwebsindia@upi</p>
                  <p className="text-[11px] text-[#b7c6d9] mt-1">
                    Scan QR with any UPI App (GPay, PhonePe, Paytm)
                  </p>
                </div>
                <img
                  src="https://www.shivwebsindia.com/wp-content/uploads/2025/09/SHIVWEBSINDIA.jpg"
                  alt="ShivWebsIndia UPI QR"
                  className="w-24 h-24 rounded-xl object-contain bg-white p-1 shrink-0 shadow-md"
                />
              </div>
            </div>
          </div>

          {/* 6. Reviews & Registered Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 space-y-2 text-xs">
              <div className="text-cyan-300 font-bold uppercase tracking-wider mb-1">
                Client Reviews
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                ⭐⭐⭐⭐⭐ &ldquo;Amazing service and great designs!&rdquo;
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                ⭐⭐⭐⭐⭐ &ldquo;Professional team, highly recommended.&rdquo;
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                ⭐⭐⭐⭐⭐ &ldquo;Best experience for website development.&rdquo;
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col justify-between text-xs sm:text-sm">
              <div>
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-xs mb-2">
                  Registered Office Address
                </div>
                <p className="text-white font-semibold leading-relaxed">
                  Plot no.313, 3F, Vaishali sector 3, Ghaziabad, 201010, INDIA
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#b7c6d9]">
                <span>{cms.settings.contact_phone}</span>
                <span>info@shivwebsindia.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
