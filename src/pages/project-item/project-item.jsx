import React, { useEffect, useState, useRef } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../utils/animations';
import Loader from '../../components/loader/loader';
import { usePageLoading } from '../../context/LoadingContext';
import { StyledProjectAbout, StyledProjectHero, StyledProjectItem } from './style';

import { useQuery } from '@apollo/client';
import PROJECT_ITEM_BY_SLUG_QUERY from '../../gql-query/ProjectItemBySlugQuery';
import { getRelativePath } from '../../utils/get-relative-path';
import { trackEvent } from '../../utils/analytics';
import useScrollDepth from '../../utils/use-scroll-depth';

const sliderSettings = {
  arrows: false,
  centerMode: true,
  className: 'center',
  infinite: true,
  slidesToShow: 3,
  swipeToSlide: true,
  speed: 600,
  autoplay: true,
  dots: true,
  responsive: [
    {
      breakpoint: 992,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1, centerMode: false }
    }
  ]
};

const CommonSlider = ({ images, slug, section }) => {
  const lastInteraction = useRef(0);
  const markInteraction = () => { lastInteraction.current = Date.now(); };

  // autoplay also changes slides, so only report changes shortly after a user gesture
  const onBeforeChange = (oldIndex, newIndex) => {
    if (Date.now() - lastInteraction.current < 1500) {
      trackEvent('gallery_interaction', {
        project_slug: slug,
        section,
        slide_index: newIndex,
      });
    }
  };

  return (
    <div onPointerDown={markInteraction} onPointerUp={markInteraction}>
      <Slider {...sliderSettings} beforeChange={onBeforeChange}>
        {images &&
          images.map((image, index) => (
            <div
              key={index}
              className="slick-image-wrapper"
            >
              <img
                src={image.url}
                alt="Slider"
                loading="lazy"
              />
            </div>
          ))}
      </Slider>
    </div>
  );
};

const HeroSection = ({ heroImage, title, category, projectType }) => {
  const heroRef = useRef(null);

  useGSAP(() => {
    const el = heroRef.current;
    if (!el) return;
    const topBar = el.querySelector('.hero-top-bar');
    const h1 = el.querySelector('h1');
    const img = el.querySelector('.hero-image');
    const meta = el.querySelectorAll('.meta-item');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(topBar, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
      .fromTo(h1, { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 0.12)
      .fromTo(img, { scale: 0.97, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3 }, 0.3)
      .fromTo(meta, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.75);
  }, { scope: heroRef });

  return (
    <StyledProjectHero ref={heroRef}>
      <div className="hero-inner">
        <div className="hero-top-bar">
          <NavLink to="/projects">Works</NavLink>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{title}</span>
        </div>

        <div className="hero-title">
          <h1>{title}</h1>
        </div>

        <div className="hero-image">
          <img src={heroImage} alt={title} />
        </div>

        <div className="hero-meta">
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{category || 'Architecture'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Type</span>
            <span className="meta-value">{projectType || 'Visualization'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Studio</span>
            <span className="meta-value">Imagine 3D</span>
          </div>
        </div>
      </div>
    </StyledProjectHero>
  );
};

const AboutSection = ({ description }) => {
  return (
    <StyledProjectAbout className="block-text-about">
      <div className="about-label">
        <span className="label-tag">About the Project</span>
        <div className="label-line" />
      </div>
      <p>{description}</p>
    </StyledProjectAbout>
  );
};

const GallerySection = ({ tag, title, description, images, slug }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const el = sectionRef.current;
    if (!el) return;
    const header = el.querySelector('.section-header');
    const h2 = el.querySelector('h2');
    const p = el.querySelector('p');
    const slides = el.querySelector('.slides');
    const trig = { start: 'top 80%' };

    gsap.fromTo(header, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: header, ...trig } });
    gsap.fromTo(h2, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: h2, ...trig } });
    if (p) gsap.fromTo(p, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: p, ...trig } });
    if (slides) gsap.fromTo(slides, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: slides, start: 'top 88%' } });
  }, { scope: sectionRef });

  if (!images || images.length === 0) return null;
  return (
    <div className="container" ref={sectionRef}>
      <div className="section-header">
        <span className="section-tag">{tag}</span>
        <div className="section-line" />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="slides">
        <CommonSlider images={images} slug={slug} section={title.toLowerCase()} />
      </div>
    </div>
  );
};

const ScrollDepthTracker = ({ slug }) => {
  useScrollDepth(slug);
  return null;
};

const ProjectItem = () => {
  const location = useLocation();
  const { setPageReady } = usePageLoading();
  const [project, setProject] = useState(null);
  const [loader, setLoader] = useState(true);

  const handleLoaderDone = (val) => {
    setLoader(val);
    if (!val) setPageReady(true);
  };

  const currentProjectSlug = getRelativePath(location.pathname, '/projects/');
  const { data } = useQuery(PROJECT_ITEM_BY_SLUG_QUERY, {
    variables: { slug: currentProjectSlug },
    skip: !!location.state && !!location.state.project
  });

  useEffect(() => {
    if (!location.state || !location.state.project) {
      data && setProject(data.projectItemCollection.items[0]);
    } else {
      setProject(location.state.project);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, data]);

  if (loader || !project) return <Loader setLoader={handleLoaderDone} />;

  return (
    <StyledProjectItem>
      <ScrollDepthTracker slug={project.slug || currentProjectSlug} />
      <HeroSection
        heroImage={project.heroImage.url}
        title={project.title}
        category={project.category}
        projectType={project.projectType}
      />

      <div className="section-divider" />

      <AboutSection description={project.projectDescription} />

      <GallerySection
        tag="01"
        title="Interior"
        description={project.interiorViewsDescription}
        images={project.interiorViewsCollection.items}
        slug={project.slug || currentProjectSlug}
      />

      <GallerySection
        tag="02"
        title="Exterior"
        description={project.exteriorViewsDescription}
        images={project.exteriorViewsCollection.items}
        slug={project.slug || currentProjectSlug}
      />
    </StyledProjectItem>
  );
};

export default ProjectItem;
