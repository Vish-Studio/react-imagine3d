import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../utils/animations';
import { getConsent, setConsent } from '../../utils/consent';
import StyledCookieConsent from './style';

const CookieConsent = () => {
  const [visible, setVisible] = useState(() => getConsent() === null);
  const ref = useRef(null);

  useEffect(() => {
    if (!visible || !ref.current) return;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1 }
    );
    return () => tween.kill();
  }, [visible]);

  const choose = (value) => {
    setConsent(value);
    gsap.to(ref.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setVisible(false)
    });
  };

  if (!visible) return null;

  return (
    <StyledCookieConsent
      ref={ref}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{ opacity: 0 }}
    >
      <div>
        <h4 className="cookie-consent__label">Cookies</h4>
        <p className="cookie-consent__text">
          We use analytics cookies to understand how visitors use this site and to improve it.
          Declining won't affect your experience.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button
          type="button"
          className="cookie-consent__btn"
          onClick={() => choose('denied')}
        >
          Decline
        </button>
        <button
          type="button"
          className="cookie-consent__btn cookie-consent__btn--accept"
          onClick={() => choose('granted')}
        >
          Accept
        </button>
      </div>
    </StyledCookieConsent>
  );
};

export default CookieConsent;
