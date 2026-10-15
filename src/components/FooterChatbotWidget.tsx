import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  MessageCircle,
  Sparkles,
  User,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { CMSDatabaseState } from '../data/initialCmsData';

interface FooterChatbotWidgetProps {
  cms: CMSDatabaseState;
  currentPath: string;
  onNavigate: (path: string) => void;
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

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionUrl?: string;
  actionLabel?: string;
  showLeadForm?: boolean;
  showServiceCards?: boolean;
  timestamp: string;
}

const QUICK_TOPICS = [
  {
    icon: '💻',
    label: 'Website Design Cost',
    query: 'Website banwane ka kharcha aur time kitna lagta hai?',
  },
  {
    icon: '📍',
    label: 'Local SEO & Maps',
    query: 'Mere business ke liye Local SEO aur Google Map ranking kaise hogi?',
  },
  {
    icon: '🛒',
    label: 'E-Commerce Store',
    query: 'Mujhe Razorpay UPI ke sath E-commerce website banwani hai',
  },
  {
    icon: '🚀',
    label: 'Google Ads / Leads',
    query: 'Google Ads PPC se leads kaise aayengi?',
  },
  {
    icon: '📞',
    label: 'Request Callback',
    query: 'Mujhe callback chahiye, apna quote bhejein',
  },
];

const MINI_SERVICE_SHOWCASE = [
  {
    title: 'Business Website',
    tag: 'Responsive + SEO Ready',
    slug: '/website-design-and-development',
    accent: 'from-[#0d6efd] to-[#00d4ff]',
  },
  {
    title: 'E-Commerce Store',
    tag: 'UPI / Razorpay + Cart',
    slug: '/ecommerce-website-development',
    accent: 'from-[#FF6A00] to-[#ff9933]',
  },
  {
    title: 'SEO & Local Maps',
    tag: 'Rank #1 in Delhi NCR',
    slug: '/search-engine-optimization-seo',
    accent: 'from-[#128807] to-[#25D366]',
  },
];

export const FooterChatbotWidget: React.FC<FooterChatbotWidgetProps> = ({
  cms,
  currentPath,
  onNavigate,
  onSubmitEnquiry,
  csrfToken,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showFloatingTeaser, setShowFloatingTeaser] = useState<boolean>(true);
  const [hasAutoGreeted, setHasAutoGreeted] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [inputText, setInputText] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 Namaste! Welcome to ${cms.settings.brand_name}.\n\nWe specialize in:\n✔ Website Design & PHP/WordPress Dev\n✔ SEO & Local Google Map Ranking\n✔ E-Commerce & School Websites\n✔ Google Ads (PPC) Lead Generation\n\nAap Hindi, Hinglish ya English mein kuch bhi pooch sakte hain!`,
      actionUrl: '/contact-us',
      actionLabel: 'Get Free Project Quote',
      showServiceCards: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Mini inline callback form inside chatbot
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadService, setLeadService] = useState('Website Design and Development');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowFloatingTeaser(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Speak bot reply if voice output is enabled
  const speakBotReply = (textToSpeak: string) => {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleanText = textToSpeak.replace(/[✔👋🚀💻📍🛒📞•*]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors on unsupported browsers
    }
  };

  // Web Speech API Voice Recognition ("🎤 Talk" button from shivwebsindia.com)
  const handleVoiceTalkToggle = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handleSendQuery('Mujhe nayi website aur SEO ke liye quote chahiye');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendQuery(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Proactive Auto-AI Contextual Greeting after 9 seconds dwell time
  useEffect(() => {
    if (hasAutoGreeted || isOpen) return;
    const timer = setTimeout(() => {
      setHasAutoGreeted(true);
      const cleanRoute = currentPath.replace(/^\/+/, '');
      let proactiveText = `✨ Kya aap apne business ke liye nayi Website ya SEO plan kar rahe hain? Humari Ghaziabad team se turant free consultation aur quote lein!`;
      if (cleanRoute.includes('seo')) {
        proactiveText = `📈 Dekh raha hoon aap SEO page par hain! Kya main aapki website ke liye Local SEO ya Google Map ranking strategy bataoon?`;
      } else if (cleanRoute.includes('ecommerce')) {
        proactiveText = `🛒 E-Commerce store plan kar rahe hain? Hum Razorpay UPI, GST billing aur Inventory ke sath complete store banate hain. Cost janna chahenge?`;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: 'auto-proactive-' + Date.now(),
          sender: 'bot',
          text: proactiveText,
          actionUrl: '/contact-us',
          actionLabel: 'Request Free Estimate',
          showLeadForm: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setUnreadCount((prev) => prev + 1);
    }, 9500);

    return () => clearTimeout(timer);
  }, [currentPath, hasAutoGreeted, isOpen]);

  // Smart Local Fallback Engine (supports English, Hindi & Hinglish if offline)
  const generateSmartLocalFallback = (
    rawQuery: string
  ): {
    replyText: string;
    actionUrl?: string;
    actionLabel?: string;
    showLeadForm?: boolean;
    showServiceCards?: boolean;
  } => {
    const q = rawQuery.toLowerCase();

    if (
      q.includes('callback') ||
      q.includes('quote') ||
      q.includes('call') ||
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('number') ||
      q.includes('baat') ||
      q.includes('sampark') ||
      q.includes('whatsapp')
    ) {
      return {
        replyText: `📞 Aap humse seedha ${cms.settings.contact_phone} par Call ya WhatsApp kar sakte hain!\n\nYa niche diye gaye form mein apna Naam aur Mobile Number dalein—humari details turant ${cms.settings.notification_recipient_email} par pahunch jayengi aur hum aapko call karenge:`,
        actionUrl: '/contact-us',
        actionLabel: 'Open Contact Page',
        showLeadForm: true,
      };
    }

    if (
      q.includes('price') ||
      q.includes('pricing') ||
      q.includes('cost') ||
      q.includes('kharcha') ||
      q.includes('kitna') ||
      q.includes('rate') ||
      q.includes('budget') ||
      q.includes('package') ||
      q.includes('time')
    ) {
      return {
        replyText: `💰 Website Design & Development Packages:\n• Standard Business Website: 2–3 weeks (starts ₹15,000–₹30,000)\n• Dynamic CMS / E-Commerce Store: 3–6 weeks (custom scope)\n• SEO & Digital Marketing: Monthly growth plans\n\nNiche apna mobile number share karein, hum exact quotation bhej denge!`,
        actionUrl: '/contact-us',
        actionLabel: 'Get Exact Price Quote',
        showLeadForm: true,
      };
    }

    if (
      q.includes('ecommerce') ||
      q.includes('e-commerce') ||
      q.includes('store') ||
      q.includes('shop') ||
      q.includes('upi')
    ) {
      return {
        replyText:
          '🛒 Hum complete D2C aur B2B E-Commerce websites banate hain jisme Razorpay/UPI payment gateway, shopping cart drawer, GST invoicing, aur automated inventory management shamil hai.',
        actionUrl: '/ecommerce-website-development',
        actionLabel: 'Explore E-Commerce Development',
        showLeadForm: true,
      };
    }

    if (
      q.includes('local seo') ||
      q.includes('map') ||
      q.includes('gbp') ||
      q.includes('ghaziabad')
    ) {
      return {
        replyText: `📍 Hum ${cms.settings.location_focus} ke businesses ke liye Google Business Profile (Local Map Pack), local citations, aur location pages optimize karte hain taaki aas-paas ke customers aapko Google par top mein dhoondh sakein.`,
        actionUrl: '/local-seo',
        actionLabel: 'Explore Local SEO',
      };
    }

    if (q.includes('seo') || q.includes('rank') || q.includes('google')) {
      return {
        replyText:
          '📈 Humari Technical aur On-Page SEO service mein complete website audit, keyword mapping, Schema.org JSON-LD markup, XML sitemap aur high-intent content strategy shamil hai.',
        actionUrl: '/search-engine-optimization-seo',
        actionLabel: 'View SEO Services',
      };
    }

    if (q.includes('ads') || q.includes('ppc') || q.includes('lead')) {
      return {
        replyText:
          '🚀 Instant inbound calls aur leads ke liye hum high-intent Google Search Ads aur Remarketing PPC campaigns chalate hain jisme har click aur conversion track hota hai.',
        actionUrl: '/google-ads-ppc',
        actionLabel: 'Explore Google Ads / PPC',
        showLeadForm: true,
      };
    }

    return {
      replyText: `Namaste! ${cms.settings.brand_name} (${cms.settings.location_focus}) Website Design, PHP/WordPress Development, E-commerce, SEO aur Google Ads mein specialize karta hai.\n\nKya main aapke project ke liye ek free callback schedule kar doon?`,
      actionUrl: '/contact-us',
      actionLabel: 'Request a Quote',
      showLeadForm: true,
      showServiceCards: true,
    };
  };

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isTyping) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: nowTime,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          cmsContext: {
            brand_name: cms.settings.brand_name,
            contact_phone: cms.settings.contact_phone,
            contact_email: cms.settings.contact_email,
            notification_recipient_email: cms.settings.notification_recipient_email,
            location_focus: cms.settings.location_focus,
            services: cms.services.map((s) => s.title),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: data.replyText,
          actionUrl: data.actionUrl,
          actionLabel: data.actionLabel,
          showLeadForm: data.showLeadForm,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        speakBotReply(data.replyText);
        return;
      }
    } catch {
      // Fallback to local smart engine if offline
    }

    setTimeout(() => {
      const fallback = generateSmartLocalFallback(trimmed);
      const botMsg: ChatMessage = {
        id: 'b-' + Date.now(),
        sender: 'bot',
        text: fallback.replyText,
        actionUrl: fallback.actionUrl,
        actionLabel: fallback.actionLabel,
        showLeadForm: fallback.showLeadForm,
        showServiceCards: fallback.showServiceCards,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speakBotReply(fallback.replyText);
    }, 420);
  };

  const handleMiniLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    const res = onSubmitEnquiry({
      full_name: leadName,
      email: leadEmail || 'callback@shivwebsindia-chat.local',
      phone: leadPhone,
      company_name: 'Via Auto AI Chatbot',
      service_interested: leadService,
      budget_range: 'Requested via Auto AI Chatbot',
      message: `Instant callback requested via Auto AI Chatbot on page ${currentPath}.`,
      source_page: currentPath || '/',
      csrf_token: csrfToken,
      honeypot: '',
    });

    if (res.success) {
      setLeadSubmitted(true);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
    } else {
      setLeadError(res.error || 'Please enter your name and valid 10-digit mobile number.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ====================================================================
          STYLISH CHAT WINDOW DRAWER
         ==================================================================== */}
      {isOpen && (
        <div className="mb-3.5 w-[350px] sm:w-[410px] bg-white text-[#0A2540] rounded-3xl shadow-[0_25px_70px_-15px_rgba(10,37,64,0.45)] border border-slate-200/90 overflow-hidden flex flex-col max-h-[600px] transition-all duration-300">
          {/* Top Indian Tricolor Accent Bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)',
            }}
          />

          {/* Stylish Premium Header */}
          <div className="bg-gradient-to-r from-[#522c2a] via-[#1e1b2e] to-[#0A2540] text-white px-4 py-3.5 relative overflow-hidden">
            {/* Subtle glowing background orb */}
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#FF6A00]/20 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* Animated Avatar with Live Green Pulse */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#DD0B0B] flex items-center justify-center text-white shadow-lg border border-white/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0A2540]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-extrabold tracking-tight text-white">
                      ShivWebsIndia AI
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#FF6A00] text-white rounded-md">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-[#FF9933]" />
                    <span>Hindi · Hinglish · English | Instant Reply</span>
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const nextState = !voiceOutputEnabled;
                    setVoiceOutputEnabled(nextState);
                    if (!nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  title={voiceOutputEnabled ? 'Mute Voice Replies' : 'Enable Voice Replies'}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    voiceOutputEnabled
                      ? 'bg-[#FF6A00] text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {voiceOutputEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLeadSubmitted(false);
                    setMessages([
                      {
                        id: 'welcome-reset-' + Date.now(),
                        sender: 'bot',
                        text: `👋 Namaste! Welcome to ${cms.settings.brand_name}.\n\nWe provide:\n✔ Website Design\n✔ SEO Services\n✔ Digital Marketing\n✔ School Website\n✔ E-commerce Website\n\nHow can I help you today?`,
                        actionUrl: '/contact-us',
                        actionLabel: 'Request Free Quote',
                        showServiceCards: true,
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                      },
                    ]);
                  }}
                  title="Reset Chat"
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Minimize Chat"
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:bg-[#DD0B0B] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Strip inside Header (Direct Call, WhatsApp, Quote) */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
              <a
                href={`tel:${cms.settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3 text-[#FF9933]" />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/${cms.settings.whatsapp_number}?text=Hi%20ShivWebsIndia%2C%20I%20want%20to%20discuss%20a%20website%20project.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#25D366]/25 hover:bg-[#25D366]/40 border border-[#25D366]/40 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3 h-3 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => handleSendQuery('Mujhe callback chahiye, apna quote bhejein')}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#FF6A00] hover:bg-[#e55f00] text-white font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>Instant Quote</span>
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#F5F7FA] to-white max-h-[340px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Sender Mini Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#0A2540] text-white'
                      : 'bg-gradient-to-br from-[#FF6A00] to-[#DD0B0B] text-white'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col max-w-[82%]">
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0A2540] to-[#163a5f] text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/90 text-[#0A2540] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Interactive Mini Service Cards inside Welcome Message */}
                    {msg.showServiceCards && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Popular Solutions (Click to Explore):
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {MINI_SERVICE_SHOWCASE.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                onNavigate(item.slug);
                                setIsOpen(false);
                              }}
                              className="w-full p-2 rounded-xl bg-slate-50 hover:bg-[#0A2540] text-left group transition-all flex items-center justify-between border border-slate-200/70 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-6 rounded-full bg-gradient-to-b ${item.accent}`}
                                />
                                <div>
                                  <div className="font-display text-xs font-bold text-[#0A2540] group-hover:text-white">
                                    {item.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 group-hover:text-slate-300">
                                    {item.tag}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6A00] group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Link Button */}
                    {msg.actionUrl && msg.actionLabel && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(msg.actionUrl!);
                          setIsOpen(false);
                        }}
                        className="mt-3 w-full py-2 px-3 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>{msg.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Inline Lead Capture Card inside Bot Message */}
                    {msg.showLeadForm && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        {leadSubmitted ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-[11px]">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="block text-emerald-950">
                                  Request Saved! Send Instantly via WhatsApp or Email:
                                </strong>
                                <span>
                                  Routed to{' '}
                                  <span className="font-mono font-bold">
                                    {cms.settings.notification_recipient_email ||
                                      'shivwebsindia@gmail.com'}
                                  </span>{' '}
                                  &amp; WhatsApp ({cms.settings.contact_phone}).
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <a
                                href={`https://wa.me/${(
                                  cms.settings.whatsapp_number || '918667666429'
                                ).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `*New Website Lead – ShivWebsIndia*\nService: ${leadService}\nPage: ${currentPath}`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#25D366] text-white font-bold text-center"
                              >
                                💬 Send on WhatsApp
                              </a>
                              <a
                                href={`mailto:${
                                  cms.settings.notification_recipient_email ||
                                  'shivwebsindia@gmail.com'
                                }?subject=${encodeURIComponent(
                                  `[ShivWebsIndia Lead] ${leadService}`
                                )}`}
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#0A2540] text-white font-bold text-center"
                              >
                                ✉️ Send on Email
                              </a>
                            </div>
                          </div>
                        ) : (
                          <form
                            onSubmit={handleMiniLeadSubmit}
                            className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-[11px] text-[#8B1E1E]">
                                ⚡ Instant Callback Request
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> 10 min reply
                              </span>
                            </div>

                            {leadError && (
                              <p className="text-[11px] text-red-600 font-medium">{leadError}</p>
                            )}

                            <input
                              type="text"
                              required
                              placeholder="Your Full Name *"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#FF6A00]"
                            />
                            <input
                              type="tel"
                              required
                              placeholder="10-Digit Mobile / WhatsApp *"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#FF6A00]"
                            />
                            <input
                              type="email"
                              required
                              placeholder="Your Email ID *"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#FF6A00]"
                            />
                            <select
                              value={leadService}
                              onChange={(e) => setLeadService(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#FF6A00]"
                            >
                              {cms.services.map((s) => (
                                <option key={s.id} value={s.title}>
                                  {s.title}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="w-full py-2 bg-gradient-to-r from-[#FF6A00] to-[#DD0B0B] hover:opacity-95 text-white font-bold rounded-lg text-xs shadow-md cursor-pointer transition-opacity"
                            >
                              Submit &amp; Get Call Back
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] text-slate-400 mt-1 px-1 tabular-nums ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Animated 3-Dot Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#DD0B0B] text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-[#0A2540] animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#128807] animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                  <span className="text-[11px] text-slate-500 ml-1 font-medium">
                    ShivWebsIndia AI is typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Horizontal Quick Topic Chips */}
          <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_TOPICS.map((topic, i) => (
              <button
                key={i}
                type="button"
                disabled={isTyping}
                onClick={() => handleSendQuery(topic.query)}
                className="px-3 py-1.5 bg-white hover:bg-[#0A2540] text-[#0A2540] hover:text-white border border-slate-200/90 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs flex items-center gap-1 disabled:opacity-50"
              >
                <span>{topic.icon}</span>
                <span>{topic.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Input Bar + "🎤 Talk" Voice Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputText);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleVoiceTalkToggle}
              title="Voice Input (Speak in Hindi or English)"
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#0A2540]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#DD0B0B]" />}
              <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Talk'}</span>
            </button>

            <input
              type="text"
              disabled={isTyping}
              placeholder="Ask in Hindi or English..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#F5F7FA] border border-slate-300 rounded-xl text-xs text-[#0A2540] placeholder:text-slate-400 focus:outline-none focus:border-[#FF6A00] focus:bg-white transition-colors"
            />

            <button
              type="submit"
              disabled={isTyping || !inputText.trim()}
              className="p-2.5 bg-gradient-to-r from-[#FF6A00] to-[#DD0B0B] hover:opacity-95 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-md disabled:opacity-40"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ====================================================================
          FLOATING GREETING TEASER BUBBLE + STYLISH LAUNCHER BUTTON
         ==================================================================== */}
      <div className="flex items-center gap-3">
        {!isOpen && showFloatingTeaser && (
          <div className="hidden sm:flex items-center gap-2.5 bg-white text-[#0A2540] px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/90 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-bold text-[#0A2540] hover:text-[#FF6A00] transition-colors text-left cursor-pointer"
            >
              👋 Need a Website or SEO Quote? <span className="text-[#FF6A00] underline">Chat with AI</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFloatingTeaser(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              aria-label="Dismiss teaser"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#522c2a] via-[#8B1E1E] to-[#FF6A00] text-white font-display font-extrabold text-xs sm:text-sm shadow-[0_12px_30px_rgba(255,106,0,0.4)] hover:shadow-[0_16px_36px_rgba(255,106,0,0.6)] hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/25"
        >
          {/* Unread Notification Badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-[#00d4ff] text-[#0A2540] font-mono text-[11px] font-extrabold flex items-center justify-center shadow-md border-2 border-white">
              {unreadCount}
            </span>
          )}

          {isOpen ? (
            <>
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Close Chat</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#522c2a]" />
              </div>
              <span>AI Assistant 💬</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
