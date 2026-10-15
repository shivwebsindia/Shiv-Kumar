import React, { useState } from 'react';
import {
  Download,
  FileCode2,
  Database,
  ShieldCheck,
  CheckCircle2,
  Server,
  Copy,
  Check,
  FolderGit2,
} from 'lucide-react';
import {
  PHP_PROJECT_FILES,
  downloadCompletePhpBundleZip,
  downloadStandaloneSqlDatabase,
  generateLiveSeedSqlFromState,
} from '../data/phpProjectSource';
import { CMSDatabaseState } from '../data/initialCmsData';

interface PhpArchitectureViewProps {
  cms: CMSDatabaseState;
}

export const PhpArchitectureView: React.FC<PhpArchitectureViewProps> = ({ cms }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const activeFile = PHP_PROJECT_FILES[selectedFileIndex] || PHP_PROJECT_FILES[0];

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadCompletePhpBundleZip(generateLiveSeedSqlFromState(cms));
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSqlOnly = () => {
    downloadStandaloneSqlDatabase(cms);
  };

  const displayedContent = activeFile.path.endsWith('.sql')
    ? activeFile.content + '\n\n' + generateLiveSeedSqlFromState(cms)
    : activeFile.content;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F5F7FA] text-[#0A2540] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Zero-Confusion Header with Separate SQL & Complete PHP ZIP Downloads */}
        <div className="bg-[#0A2540] text-white rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-lg">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#FF6A00] font-bold">
              100% Pure PHP 8.x + Separate MySQL Database (.sql) · Zero Confusion Setup
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
              Complete PHP Website Files & Standalone MySQL Database
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Yahan se aap <strong>Alag se MySQL Database (<code>.sql</code>)</strong> phpMyAdmin me import karne ke liye download kar sakte hain, aur <strong>Pure PHP Website Files (<code>.zip</code>)</strong> seedha apne <code>public_html</code> folder me upload karne ke liye download kar sakte hain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={handleDownloadSqlOnly}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>1. Download MySQL Database (.sql)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-5 py-3.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>
                {downloading
                  ? 'Packaging PHP Files...'
                  : '2. Download All PHP Files + SQL (.zip)'}
              </span>
            </button>
          </div>
        </div>

        {/* 3-Step Visual Live Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-emerald-500/30 rounded-xl p-5">
            <div className="text-xs font-bold uppercase text-emerald-700">Step 1: Database (phpMyAdmin)</div>
            <h3 className="font-display font-bold text-base mt-1">Import .SQL File in phpMyAdmin</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Hostinger / cPanel me naya MySQL Database banayein, phpMyAdmin kholein aur <code>shivwebsindia_complete_database.sql</code> file Import kar dein.
            </p>
          </div>
          <div className="bg-white border-2 border-orange-500/30 rounded-xl p-5">
            <div className="text-xs font-bold uppercase text-[#FF6A00]">Step 2: Upload PHP Files</div>
            <h3 className="font-display font-bold text-base mt-1">Extract in public_html/</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              <code>index.php</code>, <code>admin.php</code>, <code>team.php</code>, <code>.htaccess</code>, <code>config/</code> aur <code>includes/</code> ko seedha <code>public_html</code> me dalein.
            </p>
          </div>
          <div className="bg-white border-2 border-sky-500/30 rounded-xl p-5">
            <div className="text-xs font-bold uppercase text-sky-700">Step 3: Connect 1 Config File</div>
            <h3 className="font-display font-bold text-base mt-1">Edit config/database.php</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Sirf <code>config/database.php</code> khol kar usme apna <code>DB_NAME</code>, <code>DB_USER</code> aur <code>DB_PASS</code> likh kar save karein. Website turant live ho jayegi!
            </p>
          </div>
        </div>

        {/* Source Code Browser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <h2 className="font-display text-sm font-bold text-[#0A2540] flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-[#FF6A00]" />
                <span>Pure PHP + SQL File Tree</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">{PHP_PROJECT_FILES.length} Files</span>
            </div>
            {PHP_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-2 ${
                  selectedFileIndex === idx
                    ? 'bg-[#0A2540] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileCode2 className="w-4 h-4 shrink-0 text-[#FF6A00]" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-[#0A2540] text-slate-100 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900/70 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="font-mono text-xs font-bold text-[#FF6A00]">{activeFile.path}</div>
                <div className="text-xs text-slate-300 mt-0.5">{activeFile.description}</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(displayedContent);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied File' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-5 font-mono text-xs leading-relaxed overflow-x-auto max-h-[560px]">
              {displayedContent}
            </pre>
          </div>
        </div>

        {/* Hostinger / cPanel Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#8B1E1E] font-semibold text-xs uppercase">
              <Server className="w-4 h-4" />
              <span>Flat public_html Folder Structure (No Confusion)</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#0A2540]">
              Konsi File Kahan Jayegi?
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li>
                <strong>1. <code>database/shivwebsindia_complete_database.sql</code>:</strong> Ye aapki standalone MySQL database file hai. Isko Hostinger / cPanel ke <strong>phpMyAdmin → Import</strong> me upload karein.
              </li>
              <li>
                <strong>2. <code>config/database.php</code>:</strong> Sirf is 1 file me apna MySQL Database Name, Username aur Password likhein.
              </li>
              <li>
                <strong>3. <code>index.php</code>, <code>.htaccess</code>, <code>includes/</code>:</strong> Ye aapki main public website, dynamic pages, services, aur blog chalaati hain.
              </li>
              <li>
                <strong>4. <code>admin.php</code>:</strong> Ye aapka complete Admin CMS Panel hai (<code>/admin.php</code>) jisme WordPress-style Rich HTML Editor, Page/Service/Blog CRUD, SEO settings, aur Team Attendance/Leaves hain.
              </li>
              <li>
                <strong>5. <code>team.php</code>:</strong> Ye aapka strict per-employee Team Portal hai (<code>/team.php</code>) jahan har member sirf apna dashboard dekh aur edit kar sakta hai.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Included in Both PHP & SQL Files</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#0A2540]">
              100% Features Synchronized
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {[
                'Standalone MySQL .sql database with all Pages, Services, Blogs, Categories, Tags, Team & Leads.',
                'Admin CMS (admin.php) with WordPress-style Rich HTML Editor for Pages, Services & Blogs.',
                'Multiple Service Pages under the same Category with individual SEO meta titles & descriptions.',
                'Blog Listing (/blog) & Single Blog Post Page (/blog/slug) with FAQs & Related Articles.',
                'Strict Per-Member Team Portal (team.php) for Personal Attendance, Leaves, Tasks & PIN.',
                'Clean SEO URLs via .htaccess and automatic XML Sitemap (/sitemap.xml).',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
