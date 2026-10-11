import ReactGA from 'react-ga4';
import { CONSENT_EVENT, getConsent } from './consent';

const MEASUREMENT_ID = process.env.REACT_APP_GA_ID;
let initialized = false;

const canTrack = () => Boolean(MEASUREMENT_ID) && getConsent() === 'granted';

export const initAnalytics = () => {
  if (initialized || !canTrack()) return false;
  ReactGA.initialize(MEASUREMENT_ID, {
    gtagOptions: { send_page_view: false, anonymize_ip: true }
  });
  initialized = true;
  return true;
};

export const trackPageView = (path) => {
  if (!initialized) return;
  ReactGA.send({ hitType: 'pageview', page: path, title: document.title });
};

export const trackEvent = (action, params = {}) => {
  if (!initialized) return;
  ReactGA.event(action, params);
};

export { CONSENT_EVENT };
