import { useEffect } from 'react';
import { trackEvent } from './analytics';

const THRESHOLDS = [50, 90];

const useScrollDepth = (slug) => {
  useEffect(() => {
    const fired = new Set();

    const onScroll = () => {
      const { scrollHeight } = document.documentElement;
      if (!scrollHeight) return;
      const percent = ((window.scrollY + window.innerHeight) / scrollHeight) * 100;
      THRESHOLDS.forEach((t) => {
        if (percent >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent('scroll_depth', { percent: t, project_slug: slug });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);
};

export default useScrollDepth;
