import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSENT_EVENT, initAnalytics, trackEvent, trackPageView } from '../utils/analytics';

const usePageTracking = () => {
  const { pathname, search } = useLocation();
  const path = pathname + search;

  useEffect(() => {
    initAnalytics();
    trackPageView(path);
  }, [path]);

  useEffect(() => {
    const onConsent = (e) => {
      if (e.detail === 'granted' && initAnalytics()) {
        trackPageView(window.location.pathname + window.location.search);
        trackEvent('consent_choice', { choice: 'granted' });
      }
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);
};

export default usePageTracking;
