import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Auto AI Chatbot Endpoint (Server-Side Gemini 3.8 Flash with Structured Output)
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { message, history = [], cmsContext = {} } = req.body || {};

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error: 'GEMINI_API_KEY not configured on server; falling back to local smart engine.',
          useFallback: true,
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const brandName = cmsContext.brand_name || 'ShivWebsIndia';
      const phone = cmsContext.contact_phone || '+91-8667666429';
      const email = cmsContext.contact_email || 'info@shivwebsindia.com';
      const leadEmail = cmsContext.notification_recipient_email || 'shivwebsindia@gmail.com';
      const location = cmsContext.location_focus || 'Vaishali, Sector 3, Ghaziabad & Delhi NCR';
      const servicesList = Array.isArray(cmsContext.services)
        ? cmsContext.services.join(', ')
        : 'Website Design & Development, WordPress Development, E-commerce Website Development, Digital Marketing, SEO, Local SEO, Social Media Marketing, Google Ads / PPC';

      const systemInstruction = `You are the official Auto AI Sales & Technical Support Assistant for ${brandName} (https://www.shivwebsindia.com/), a full-service Website Design, Custom PHP 8.x/MySQL & WordPress Development, E-commerce, SEO, Local SEO, and Google Ads agency located in ${location}.

Key Business Facts:
- Phone / WhatsApp: ${phone}
- Official Email: ${email}
- Lead Notification Email: ${leadEmail}
- Core Services: ${servicesList}
- Typical Project Timelines: Standard business websites take 2–4 weeks; custom e-commerce or PHP/MySQL portals take 4–7 weeks.
- Typical Pricing: Local business packages start around ₹15,000–₹30,000 and scale based on custom features.
- Ownership: Clients get 100% ownership of domain, source code, and database on Hostinger/cPanel.
- Language Support: Reply naturally in the same language the user writes in (English, Hindi, or Hinglish). Keep answers concise (2–4 sentences), helpful, and conversion-focused. Never invent fake awards or guarantee #1 Google rankings.`;

      const formattedHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: any) => `${h.sender === 'user' ? 'Visitor' : 'Assistant'}: ${h.text}`)
            .join('\n')
        : '';

      const prompt = formattedHistory
        ? `Conversation History:\n${formattedHistory}\n\nVisitor's Latest Message: ${message}`
        : `Visitor's Message: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: {
                type: Type.STRING,
                description: 'Concise, friendly, helpful response in English, Hindi, or Hinglish matching the user.',
              },
              suggestedRouteUrl: {
                type: Type.STRING,
                description:
                  'Relevant internal page URL such as /website-design-and-development, /wordpress-development, /ecommerce-website-development, /search-engine-optimization-seo, /local-seo, /google-ads-ppc, /portfolio, /faqs, or /contact-us.',
              },
              suggestedRouteLabel: {
                type: Type.STRING,
                description: 'Short button label for the suggested page, e.g., Explore SEO Services or Request a Quote.',
              },
              shouldShowLeadForm: {
                type: Type.BOOLEAN,
                description:
                  'Set to true if the user asks about pricing, quotes, callbacks, hiring, contact details, or starting a project.',
              },
            },
            required: ['replyText', 'suggestedRouteUrl', 'suggestedRouteLabel', 'shouldShowLeadForm'],
          },
        },
      });

      const rawJson = response.text || '{}';
      const parsed = JSON.parse(rawJson);

      res.json({
        replyText:
          parsed.replyText ||
          `Namaste! Contact ${brandName} at ${phone} or request a callback below.`,
        actionUrl: parsed.suggestedRouteUrl || '/contact-us',
        actionLabel: parsed.suggestedRouteLabel || 'Request a Quote',
        showLeadForm: Boolean(parsed.shouldShowLeadForm),
        poweredBy: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('[AI Chat Error]', error?.message || error);
      res.status(500).json({
        error: error?.message || 'AI chat request failed',
        useFallback: true,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShivWebsIndia server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
