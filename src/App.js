import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gsap } from './utils/animations';
import { LoadingContext } from './context/LoadingContext';

import NavBar from './components/nav-bar/nav-bar';
import TopBar from './components/top-bar/top-bar';
import CookieConsent from './components/cookie-consent/cookie-consent';
import usePageTracking from './utils/use-page-tracking';
import useLinkTracking from './utils/use-link-tracking';

import SOCIALS_QUERY from './gql-query/SocialsQuery';
import FOOTER_QUERY from './gql-query/FooterQuery';

import './styles/global.css';
import './styles/test.css';

import HomePage from './pages/homepage/homepage';
import ProjectItem from './pages/project-item/project-item';
import Projects from './pages/projects/projects';
import AboutUs from './pages/about-us/about-us';
import Footer from './components/footer/footer';

// TODO: to add a loader screen so that when all data is received, we display the required
// page. Loader screen should contain client logo. A global state/context can be used for this.

function ConditionalFooter({ socials, footerTitle }) {
  const location = useLocation();
  const { pageReady } = React.useContext(LoadingContext);
  if (location.pathname === '/') return null;
  if (!pageReady) return null;
  return (
    <Footer
      socials={socials}
      titleJson={footerTitle}
    />
  );
}

function PageTransition({ children }) {
  const location = useLocation();
  const wrapperRef = useRef(null);
  const { setPageReady } = React.useContext(LoadingContext);

  useEffect(() => {
    setPageReady(false);
    const tween = gsap.fromTo(
      wrapperRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'all', overwrite: true }
    );
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return <div ref={wrapperRef}>{children}</div>;
}

function PageTracker() {
  usePageTracking();
  useLinkTracking();
  return null;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnClick = () => setMenuOpen(!menuOpen);

  const [pageReady, setPageReady] = useState(false);
  const loadingContextValue = useMemo(() => ({ pageReady, setPageReady }), [pageReady]);

  const { data: socialsData } = useQuery(SOCIALS_QUERY);
  const socials = socialsData?.socialsCollection?.items?.[0]?.linksCollection?.items || [];

  const { data: footerData } = useQuery(FOOTER_QUERY);
  const footerTitle = footerData?.footerCollection?.items?.[0]?.title?.json || null;

  return (
    <LoadingContext.Provider value={loadingContextValue}>
      <div className="App">
        <TopBar
          isOpened={menuOpen}
          onOpenMenu={menuBtnClick}
        />
        <Router>
          <PageTracker />
          <NavBar
            isOpened={menuOpen}
            onOpenMenu={menuBtnClick}
            socials={socials}
          />
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage socials={socials} />
                </PageTransition>
              }
            />
            <Route
              path="/projects"
              element={
                <PageTransition>
                  <Projects />
                </PageTransition>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <PageTransition>
                  <ProjectItem />
                </PageTransition>
              }
            />
            <Route
              path="/about-us"
              element={
                <PageTransition>
                  <AboutUs />
                </PageTransition>
              }
            />
          </Routes>
          <ConditionalFooter
            socials={socials}
            footerTitle={footerTitle}
          />
          <CookieConsent />
        </Router>
      </div>
    </LoadingContext.Provider>
  );
}

export default App;
