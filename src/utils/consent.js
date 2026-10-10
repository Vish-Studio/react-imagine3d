const STORAGE_KEY = 'cookie-consent';
export const CONSENT_EVENT = 'cookie-consent-change';

export const getConsent = () => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

export const setConsent = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // storage unavailable; the choice only lasts for this page view
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
};
