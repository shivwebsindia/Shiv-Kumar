import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Eye,
  Columns,
  Minus,
  CheckSquare,
  Sparkles,
  RotateCcw,
  Type,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { MediaAsset } from '../data/initialCmsData';

export interface WordPressRichEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  mediaLibrary?: MediaAsset[];
  minHeight?: string;
  helperText?: string;
}

export const WordPressRichEditor: React.FC<WordPressRichEditorProps> = ({
  label = 'Complete Article Body (Rich HTML Editor — Headings, Paragraphs, Images, Links, Lists & Tables)',
  value,
  onChange,
  placeholder = 'Start writing or type / to choose a block — supports Headings (H1-H4), Paragraphs, Images, Hyperlinks, Lists & Tables...',
  mediaLibrary = [],
  minHeight = '280px',
  helperText,
}) => {
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | 'split'>('visual');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const visualRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value changes into the contentEditable div when not actively typing inside it
  useEffect(() => {
    if (visualRef.current && !isInternalChange.current) {
      if (visualRef.current.innerHTML !== (value || '')) {
        visualRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value, editorMode]);

  const emitVisualChange = () => {
    if (!visualRef.current) return;
    isInternalChange.current = true;
    onChange(visualRef.current.innerHTML);
  };

  // Insert HTML snippet either at cursor in Visual mode or at cursor in HTML textarea mode
  const insertHtmlSnippet = (snippet: string) => {
    if (editorMode === 'visual' && visualRef.current) {
      visualRef.current.focus();
      const selection = window.getSelection();
      if (
        selection &&
        selection.rangeCount > 0 &&
        visualRef.current.contains(selection.anchorNode)
      ) {
        document.execCommand('insertHTML', false, snippet);
      } else {
        visualRef.current.innerHTML += snippet;
      }
      emitVisualChange();
    } else if (textareaRef.current) {
      const el = textareaRef.current;
      const start = el.selectionStart ?? (value || '').length;
      const end = el.selectionEnd ?? (value || '').length;
      const current = value || '';
      const updated = current.slice(0, start) + snippet + current.slice(end);
      onChange(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 10);
    } else {
      onChange((value || '') + snippet);
    }
  };

  // Execute rich formatting command
  const execFormat = (command: string, arg?: string) => {
    if (editorMode === 'visual' && visualRef.current) {
      visualRef.current.focus();
      document.execCommand(command, false, arg);
      emitVisualChange();
      return;
    }

    // Fallback tag wrapping when in HTML / Split code mode
    const el = textareaRef.current;
    const current = value || '';
    const start = el ? el.selectionStart : current.length;
    const end = el ? el.selectionEnd : current.length;
    const selected = current.slice(start, end) || 'Text here';

    let replacement = selected;
    if (command === 'bold') replacement = `<strong>${selected}</strong>`;
    else if (command === 'italic') replacement = `<em>${selected}</em>`;
    else if (command === 'underline') replacement = `<u>${selected}</u>`;
    else if (command === 'strikeThrough') replacement = `<del>${selected}</del>`;
    else if (command === 'insertUnorderedList')
      replacement = `\n<ul>\n  <li>${selected}</li>\n  <li>Second item</li>\n</ul>`;
    else if (command === 'insertOrderedList')
      replacement = `\n<ol>\n  <li>${selected}</li>\n  <li>Second step</li>\n</ol>`;
    else if (command === 'justifyLeft')
      replacement = `<div style="text-align:left">${selected}</div>`;
    else if (command === 'justifyCenter')
      replacement = `<div style="text-align:center">${selected}</div>`;
    else if (command === 'justifyRight')
      replacement = `<div style="text-align:right">${selected}</div>`;
    else if (command === 'formatBlock' && arg) {
      const tag = arg.replace(/[<>]/g, '').toLowerCase();
      replacement = `\n<${tag}>${selected}</${tag}>`;
    } else if (command === 'insertHorizontalRule') {
      replacement = `\n<hr />\n`;
    }

    const updated = current.slice(0, start) + replacement + current.slice(end);
    onChange(updated);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || linkUrl.trim();
    const targetAttr = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    insertHtmlSnippet(`<a href="${linkUrl.trim()}"${targetAttr}>${text}</a> `);
    setShowLinkModal(false);
    setLinkUrl('https://');
    setLinkText('');
    setLinkNewTab(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const alt = imageAlt.trim() || 'ShivWebsIndia Article Image';
    const html = imageCaption.trim()
      ? `\n<figure class="my-6">\n  <img src="${imageUrl.trim()}" alt="${alt}" />\n  <figcaption class="text-xs text-slate-500 mt-2 text-center italic">${imageCaption.trim()}</figcaption>\n</figure>\n`
      : `\n<img src="${imageUrl.trim()}" alt="${alt}" />\n`;
    insertHtmlSnippet(html);
    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
  };

  const handleInsertTable = (e: React.FormEvent) => {
    e.preventDefault();
    const r = Math.max(1, Math.min(12, Number(tableRows) || 3));
    const c = Math.max(1, Math.min(8, Number(tableCols) || 3));

    let thead = '  <thead>\n    <tr>\n';
    for (let j = 1; j <= c; j++) {
      thead += `      <th>Column Heading ${j}</th>\n`;
    }
    thead += '    </tr>\n  </thead>\n';

    let tbody = '  <tbody>\n';
    for (let i = 1; i <= r; i++) {
      tbody += '    <tr>\n';
      for (let j = 1; j <= c; j++) {
        tbody += `      <td>Row ${i} Data ${j}</td>\n`;
      }
      tbody += '    </tr>\n';
    }
    tbody += '  </tbody>';

    const tableHtml = `\n<table>\n${thead}${tbody}\n</table>\n<p></p>`;
    insertHtmlSnippet(tableHtml);
    setShowTableModal(false);
  };

  // Calculate live word count & reading time
  const plainText = (value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  const charCount = plainText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const richTypographyClasses =
    'space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base focus:outline-none [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#0A2540] [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A2540] [&_h2]:mt-6 [&_h2]:mb-2.5 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0A2540] [&_h3]:mt-5 [&_h3]:mb-2 [&_h4]:font-display [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A2540] [&_h4]:mt-4 [&_p]:my-2.5 [&_a]:text-[#FF6A00] [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF6A00] [&_blockquote]:pl-4 [&_blockquote]:py-2.5 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:bg-slate-50 [&_blockquote]:rounded-r-xl [&_table]:w-full [&_table]:border-collapse [&_table]:my-5 [&_th]:bg-[#0A2540] [&_th]:text-white [&_th]:p-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_td]:text-xs sm:[&_td]:text-sm [&_tr:nth-child(even)]:bg-slate-50 [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-h-96 [&_img]:object-cover [&_img]:border [&_img]:border-slate-200 [&_hr]:my-6 [&_hr]:border-slate-200';

  return (
    <div className="border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-sm">
      {/* 1. WordPress Top Header Bar (Label + Add Media + Mode Tabs) */}
      <div className="bg-slate-100 border-b border-slate-300 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>{label}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setShowImageModal(!showImageModal);
              setShowLinkModal(false);
              setShowTableModal(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#0A2540] hover:text-white text-[#0A2540] border border-slate-300 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#0096e8]" />
            <span>Add Media / Image</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTableModal(!showTableModal);
              setShowImageModal(false);
              setShowLinkModal(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#0A2540] hover:text-white text-[#0A2540] border border-slate-300 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <TableIcon className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Insert Table</span>
          </button>
        </div>

        {/* WordPress Visual / Text (HTML) / Split Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/90 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              editorMode === 'visual'
                ? 'bg-white text-[#0A2540] shadow-xs'
                : 'text-slate-600 hover:text-[#0A2540]'
            }`}
          >
            <Eye className="w-3 h-3 text-[#0096e8]" />
            <span>Visual (WordPress Editor)</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('html')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              editorMode === 'html'
                ? 'bg-white text-[#0A2540] shadow-xs'
                : 'text-slate-600 hover:text-[#0A2540]'
            }`}
          >
            <Code className="w-3 h-3 text-[#FF6A00]" />
            <span>Text / HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('split')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              editorMode === 'split'
                ? 'bg-white text-[#0A2540] shadow-xs'
                : 'text-slate-600 hover:text-[#0A2540]'
            }`}
          >
            <Columns className="w-3 h-3 text-emerald-600" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* 2. WordPress Classic / Gutenberg Formatting Toolbar */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5">
        {/* Format Dropdown (Paragraph / Headings H1-H4 / Blockquote) */}
        <select
          onChange={(e) => {
            if (!e.target.value) return;
            execFormat('formatBlock', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#0A2540] cursor-pointer"
          title="Format Block (Paragraph or Heading)"
        >
          <option value="" disabled>
            Format: Paragraph / Heading
          </option>
          <option value="P">Paragraph (&lt;p&gt;)</option>
          <option value="H1">Heading 1 (&lt;h1&gt;)</option>
          <option value="H2">Heading 2 (&lt;h2&gt; — Main Section)</option>
          <option value="H3">Heading 3 (&lt;h3&gt; — Sub-Section)</option>
          <option value="H4">Heading 4 (&lt;h4&gt;)</option>
          <option value="BLOCKQUOTE">Blockquote (&lt;blockquote&gt;)</option>
        </select>

        {/* Quick H2 / H3 / P buttons */}
        <button
          type="button"
          onClick={() => insertHtmlSnippet('\n<h2>Section Heading (H2)</h2>\n<p>Write your paragraph content here...</p>')}
          className="px-2 py-1 rounded bg-white hover:bg-[#0A2540] hover:text-white border border-slate-300 text-[11px] font-extrabold text-[#0A2540] cursor-pointer"
          title="Insert H2 Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertHtmlSnippet('\n<h3>Sub-Section Heading (H3)</h3>\n<p>Write supporting details here...</p>')}
          className="px-2 py-1 rounded bg-white hover:bg-[#0A2540] hover:text-white border border-slate-300 text-[11px] font-extrabold text-[#0A2540] cursor-pointer"
          title="Insert H3 Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => insertHtmlSnippet('\n<p>New paragraph text...</p>')}
          className="px-2 py-1 rounded bg-white hover:bg-[#0A2540] hover:text-white border border-slate-300 text-[11px] font-bold text-slate-700 cursor-pointer"
          title="Insert Paragraph"
        >
          ¶ Para
        </button>

        <span className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Bold, Italic, Underline, Strikethrough */}
        <button
          type="button"
          onClick={() => execFormat('bold')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execFormat('italic')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execFormat('underline')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execFormat('strikeThrough')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execFormat('justifyLeft')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execFormat('justifyCenter')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execFormat('justifyRight')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Bullet List, Numbered List, Blockquote */}
        <button
          type="button"
          onClick={() =>
            insertHtmlSnippet(
              '\n<ul>\n  <li>Key deliverable or feature point one</li>\n  <li>Key deliverable or feature point two</li>\n  <li>Key deliverable or feature point three</li>\n</ul>\n'
            )
          }
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Insert Bulleted List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            insertHtmlSnippet(
              '\n<ol>\n  <li>First step in the process</li>\n  <li>Second step in the process</li>\n  <li>Third step in the process</li>\n</ol>\n'
            )
          }
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Insert Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            insertHtmlSnippet(
              '\n<blockquote><strong>Expert Insight:</strong> Add an important highlight, client testimonial, or key takeaway box here.</blockquote>\n'
            )
          }
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Insert Blockquote / Callout"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <span className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Link, Image, Table, Divider */}
        <button
          type="button"
          onClick={() => {
            setShowLinkModal(!showLinkModal);
            setShowImageModal(false);
            setShowTableModal(false);
          }}
          className={`px-2 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
            showLinkModal
              ? 'bg-[#0A2540] text-white border-[#0A2540]'
              : 'bg-white hover:bg-slate-200 text-[#0A2540] border-slate-300'
          }`}
          title="Insert or Edit Hyperlink"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowImageModal(!showImageModal);
            setShowLinkModal(false);
            setShowTableModal(false);
          }}
          className={`px-2 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
            showImageModal
              ? 'bg-[#0A2540] text-white border-[#0A2540]'
              : 'bg-white hover:bg-slate-200 text-[#0A2540] border-slate-300'
          }`}
          title="Insert Image"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowTableModal(!showTableModal);
            setShowImageModal(false);
            setShowLinkModal(false);
          }}
          className={`px-2 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
            showTableModal
              ? 'bg-[#0A2540] text-white border-[#0A2540]'
              : 'bg-white hover:bg-slate-200 text-[#0A2540] border-slate-300'
          }`}
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Table</span>
        </button>

        <button
          type="button"
          onClick={() => execFormat('insertHorizontalRule')}
          className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-[#0A2540] cursor-pointer"
          title="Insert Horizontal Divider Line"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* WordPress Pre-Styled Content Blocks (Checklist, Key Takeaways, CTA Box) */}
        <button
          type="button"
          onClick={() =>
            insertHtmlSnippet(
              '\n<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #0096e8;border-radius:12px;padding:16px;margin:16px 0;">\n  <h3>Key Takeaways &amp; Deliverables</h3>\n  <ul>\n    <li><strong>100% Mobile Responsive:</strong> Optimized for Android, iOS, and desktop viewports.</li>\n    <li><strong>Technical SEO Schema:</strong> Built-in JSON-LD structured data and fast Core Web Vitals.</li>\n    <li><strong>Dedicated Support:</strong> Direct WhatsApp, phone, and remote assistance from Vaishali, Ghaziabad.</li>\n  </ul>\n</div>\n'
            )
          }
          className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0A2540] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          title="Insert Key Takeaways Box"
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#0096e8]" />
          <span>+ Key Box</span>
        </button>

        <button
          type="button"
          onClick={() =>
            insertHtmlSnippet(
              '\n<div style="background:#0A2540;color:#ffffff;border-radius:16px;padding:20px;margin:20px 0;">\n  <h3 style="color:#ffffff;margin-top:0;">Need Expert Help With Your Project?</h3>\n  <p style="color:#cbd5e1;margin-bottom:12px;">Speak directly with our web development and SEO specialists in Vaishali, Ghaziabad for a free project roadmap and quotation.</p>\n  <p><a href="/contact-us" style="display:inline-block;background:#FF6A00;color:#ffffff;padding:8px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Request a Free Consultation →</a></p>\n</div>\n'
            )
          }
          className="px-2 py-1 rounded bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF6A00] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          title="Insert Call-To-Action Box"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ CTA Block</span>
        </button>

        {/* Text Color Quick Swatches */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-300" title="Apply Brand Text Color">
          <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
          {[
            { color: '#0A2540', name: 'Navy' },
            { color: '#FF6A00', name: 'Orange' },
            { color: '#8B1E1E', name: 'Crimson' },
            { color: '#0096e8', name: 'Sky Blue' },
            { color: '#059669', name: 'Emerald' },
          ].map((sw) => (
            <button
              key={sw.color}
              type="button"
              onClick={() => execFormat('foreColor', sw.color)}
              style={{ backgroundColor: sw.color }}
              className="w-4 h-4 rounded-full border border-white shadow-2xs cursor-pointer hover:scale-110 transition-transform"
              title={`Text Color: ${sw.name}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => execFormat('removeFormat')}
          className="ml-auto p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-600 cursor-pointer text-[11px] flex items-center gap-1"
          title="Clear Text Formatting"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* 3. Interactive Popover: Insert Link */}
      {showLinkModal && (
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Insert Hyperlink into Content</span>
            </span>
            <button
              type="button"
              onClick={() => setShowLinkModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold mb-1">Anchor Text</label>
              <input
                type="text"
                placeholder="e.g. Explore Our SEO Packages"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold mb-1">Destination URL</label>
              <input
                type="text"
                placeholder="https://... or /contact-us"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-3 flex items-center gap-2">
              <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                />
                <span>New Tab</span>
              </label>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-3 py-1.5 bg-[#FF6A00] text-white text-xs font-bold rounded-lg cursor-pointer ml-auto"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Interactive Popover: Insert Image / Media Library */}
      {showImageModal && (
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#0096e8]" />
              <span>Insert Image (Paste URL or Pick from Media Library)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold mb-1">Image URL *</label>
              <input
                type="text"
                placeholder="https://www.shivwebsindia.com/wp-content/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold mb-1">SEO Alt Text</label>
              <input
                type="text"
                placeholder="Describe image for SEO..."
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold mb-1">Caption (Optional)</label>
              <input
                type="text"
                placeholder="Caption..."
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleInsertImage}
                className="w-full py-1.5 px-3 bg-[#0096e8] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>

          {mediaLibrary.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1.5">
                Or Click Any Media Library Image to Select:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {mediaLibrary.slice(0, 8).map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setImageUrl(asset.file_path);
                      setImageAlt(asset.alt_text || asset.original_name);
                    }}
                    className="group relative w-16 h-12 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-[#FF6A00] shrink-0 cursor-pointer"
                    title={asset.alt_text || asset.original_name}
                  >
                    <img
                      src={asset.file_path}
                      alt={asset.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Interactive Popover: Insert Table */}
      {showTableModal && (
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>Insert Responsive Data / Comparison Table</span>
            </span>
            <button
              type="button"
              onClick={() => setShowTableModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1">Rows</label>
              <input
                type="number"
                min={1}
                max={12}
                value={tableRows}
                onChange={(e) => setTableRows(Number(e.target.value))}
                className="w-20 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1">Columns</label>
              <input
                type="number"
                min={1}
                max={8}
                value={tableCols}
                onChange={(e) => setTableCols(Number(e.target.value))}
                className="w-20 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleInsertTable}
              className="px-4 py-1.5 bg-[#0A2540] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              + Insert {tableRows}×{tableCols} Table
            </button>
            <button
              type="button"
              onClick={() => {
                insertHtmlSnippet(
                  '\n<table>\n  <thead>\n    <tr><th>Package / Deliverable</th><th>Specification</th><th>Estimated Timeline</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Business Website Design</td><td>Custom UI/UX + Mobile Responsive + On-Page SEO</td><td>7–10 Working Days</td></tr>\n    <tr><td>E-Commerce / Dynamic Portal</td><td>Payment Gateway + Admin CMS + Speed Optimization</td><td>14–21 Working Days</td></tr>\n    <tr><td>Monthly SEO &amp; Growth</td><td>Technical Audit + Local GBP + High-DA Backlinks</td><td>Ongoing Monthly</td></tr>\n  </tbody>\n</table>\n<p></p>'
                );
                setShowTableModal(false);
              }}
              className="px-3.5 py-1.5 bg-[#FF6A00] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              + Insert Pre-Built Service Comparison Table
            </button>
          </div>
        </div>
      )}

      {/* 6. Main Editor Canvas (Visual WYSIWYG / HTML Code / Split View) */}
      {editorMode === 'visual' && (
        <div className="relative bg-white">
          {!plainText && (
            <div className="pointer-events-none absolute top-4 left-4 right-4 text-xs text-slate-400 select-none">
              {placeholder}
            </div>
          )}
          <div
            ref={visualRef}
            contentEditable
            suppressContentEditableWarning
            onInput={emitVisualChange}
            onBlur={emitVisualChange}
            style={{ minHeight }}
            className={`p-4 sm:p-5 w-full ${richTypographyClasses}`}
          />
        </div>
      )}

      {editorMode === 'html' && (
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-4 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none"
        />
      )}

      {editorMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          <div className="flex flex-col">
            <div className="px-3 py-1.5 bg-slate-900 text-slate-300 text-[10px] font-mono uppercase font-bold">
              HTML Source Code Editor
            </div>
            <textarea
              ref={textareaRef}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{ minHeight }}
              className="w-full flex-1 p-4 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none"
            />
          </div>
          <div className="flex flex-col bg-white">
            <div className="px-3 py-1.5 bg-slate-100 text-[#0A2540] text-[10px] font-mono uppercase font-bold border-b border-slate-200">
              Live Formatted Visual Preview
            </div>
            <div
              style={{ minHeight }}
              className={`p-4 sm:p-5 ${richTypographyClasses}`}
              dangerouslySetInnerHTML={{
                __html:
                  value ||
                  '<p class="text-slate-400 italic">Live preview will appear here as you type...</p>',
              }}
            />
          </div>
        </div>
      )}

      {/* 7. WordPress Bottom Status Bar (Word Count, Reading Time, Helper Info) */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex flex-wrap items-center gap-3 font-medium">
          <span>
            Words: <strong className="text-[#0A2540] tabular-nums">{wordCount}</strong>
          </span>
          <span>·</span>
          <span>
            Characters: <strong className="text-[#0A2540] tabular-nums">{charCount}</strong>
          </span>
          <span>·</span>
          <span>
            Reading Time: <strong className="text-[#0A2540] tabular-nums">~{readingTimeMin} min</strong>
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          {helperText ||
            'WordPress-Style Visual & HTML Editor — Supports H1-H4, Lists, Tables, Images & Links'}
        </div>
      </div>
    </div>
  );
};
