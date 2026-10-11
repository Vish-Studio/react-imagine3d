import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../utils/animations';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import StyledFooter from './style';

const richTextOptions = {
  renderMark: {
    [MARKS.ITALIC]: (text) => <span style={{ color: '#fd5a1e', fontStyle: 'normal' }}>{text}</span>
  },
  renderNode: {
    [BLOCKS.HEADING_2]: (_node, children) => <h2>{children}</h2>,
    [BLOCKS.PARAGRAPH]: () => null
  }
};

const fallbackTitle = (
  <h2>
    LET'S BUILD
    <br />
    SOMETHING <span style={{ color: '#fd5a1e' }}>REAL</span>.
  </h2>
);

const Footer = ({ socials = [], titleJson }) => {
  const footerRef = useRef(null);
  const renderedTitle = titleJson
    ? documentToReactComponents(titleJson, richTextOptions)
    : fallbackTitle;

  // Mount animation — footer slides up into view when first rendered
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1,
        onComplete: () => ScrollTrigger.refresh()
      }
    );
  }, []);

  useGSAP(
    () => {
      const el = footerRef.current;
      if (!el) return;
      const brand = el.querySelector('.brand-section');
      const columns = el.querySelectorAll('.links-column');
      const bottom = el.querySelector('.footer-bottom');

      const trigger = { start: 'top 88%' };
      gsap.fromTo(
        brand,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: brand, ...trigger }
        }
      );
      gsap.fromTo(
        columns,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: columns[0], ...trigger }
        }
      );
      gsap.fromTo(
        bottom,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: bottom, start: 'top 98%' }
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <StyledFooter ref={footerRef}>
      {/* Main Footer Layout */}
      <div className="footer-content">
        {/* Large Brand / Call to Action */}
        <div className="brand-section">
          {renderedTitle}
          <a
            href="mailto:imagine3dvisual@gmail.com"
            className="cta-btn"
          >
            Start a Project
          </a>
        </div>

        {/* Quick Links */}
        <div className="links-column footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/projects">Projects</a>
            </li>
            <li>
              <a href="/about-us">Studio</a>
            </li>
            <li>
              <a href="mailto:imagine3dvisual@gmail.com">Contact</a>
            </li>
            <li>
              <a href="tel:+23055018008">+230 5501 8008</a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="links-column footer-connect">
          <h4>Connect</h4>
          <ul>
            {socials.length > 0 ? (
              socials.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target={link.newTab ? '_blank' : '_self'}
                    rel={link.newTab ? 'noreferrer' : undefined}
                  >
                    {link.title}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://behance.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Behance
                  </a>
                </li>
              </>
            )}
            <li style={{ marginTop: '2rem' }}>
              <span style={{ color: '#444', fontFamily: 'Poppins', fontSize: '12px' }}>
                Moka, Mauritius
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright / Legal */}
      <div className="footer-bottom">
        <p>
          © 2023{' '}
          <a
            href="https://www.vish.studio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            VISH Studio
          </a>
          . All rights reserved.
        </p>
        <div className="socials">
          <span
            style={{
              color: '#444',
              fontFamily: 'Poppins',
              fontSize: '12px',
              letterSpacing: '0.5px'
            }}
          >
            Privacy Policy
          </span>
          <span
            style={{
              color: '#444',
              fontFamily: 'Poppins',
              fontSize: '12px',
              letterSpacing: '0.5px'
            }}
          >
            Terms
          </span>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer;
