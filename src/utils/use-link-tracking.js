import { useEffect } from 'react';
import { trackEvent } from './analytics';

const SOCIAL_SELECTOR = '.socials-block, .socials__icons, .footer-connect';
const NAV_SELECTOR = '.nav-bar .menu, .footer-nav';

const getLocation = (el) => {
  if (el.closest('.nav-bar')) return 'nav';
  if (el.closest('.bottom-bar')) return 'hero';
  if (el.closest('footer')) return el.classList.contains('cta-btn') ? 'footer_cta' : 'footer';
  return 'other';
};

const getNetwork = (url) => url.hostname.replace(/^www\./, '').split('.')[0];

const handleClick = (e) => {
  const anchor = e.target.closest && e.target.closest('a[href]');
  if (!anchor) return;

  const rawHref = anchor.getAttribute('href');
  const location = getLocation(anchor);

  if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    trackEvent('contact_click', {
      method: rawHref.startsWith('mailto:') ? 'email' : 'phone',
      location,
    });
    return;
  }

  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }
  if (!/^https?:$/.test(url.protocol)) return;

  const isExternal = url.origin !== window.location.origin;

  if (anchor.closest(SOCIAL_SELECTOR)) {
    trackEvent('social_click', { network: getNetwork(url), location });
  } else if (!isExternal && anchor.closest(NAV_SELECTOR)) {
    trackEvent('nav_click', { destination: url.pathname, location });
  } else if (isExternal) {
    trackEvent('outbound_click', { url: url.href });
  }
};

const useLinkTracking = () => {
  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);
};

export default useLinkTracking;
