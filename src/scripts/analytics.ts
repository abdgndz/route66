// Google Analytics 4, loaded only after the visitor accepts on the cookie banner.
// The choice is remembered on this device; "Cookie settings" in the footer reopens it.

const GA_ID = 'G-1KLBW6DXVR';
const KEY = 'r66-consent';
type Choice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const banner = document.getElementById('cookie-banner');

const readChoice = (): Choice | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

const saveChoice = (choice: Choice) => {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // Private mode: the banner simply asks again next visit.
  }
};

let loaded = false;
const loadAnalytics = () => {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

// Count WhatsApp and phone taps as leads.
document.addEventListener('click', (event) => {
  if (!loaded) return;
  const link = (event.target as Element | null)?.closest('a[href]');
  const href = link?.getAttribute('href') ?? '';
  if (href.startsWith('https://wa.me/')) window.gtag('event', 'generate_lead', { method: 'whatsapp' });
  else if (href.startsWith('tel:')) window.gtag('event', 'generate_lead', { method: 'phone' });
});

const choice = readChoice();
if (choice === 'granted') loadAnalytics();
else if (choice === null && banner) banner.hidden = false;

banner?.addEventListener('click', (event) => {
  const value = (event.target as Element | null)?.closest('[data-consent]')?.getAttribute('data-consent');
  if (value !== 'granted' && value !== 'denied') return;
  saveChoice(value);
  banner.hidden = true;
  if (value === 'granted') loadAnalytics();
  // Withdrawing consent: stop Analytics on the next page load.
  else if (loaded) location.reload();
});

document.addEventListener('click', (event) => {
  if ((event.target as Element | null)?.closest('[data-cookie-settings]') && banner) {
    event.preventDefault();
    banner.hidden = false;
  }
});

export {};
