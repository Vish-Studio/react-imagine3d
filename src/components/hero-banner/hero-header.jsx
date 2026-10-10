import React, { useRef, useState } from "react";
import StyledHeroHeader from "./style";
import BottomBar from "./bottom-bar/bottom-bar";
import { trackEvent } from "../../utils/analytics";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const FullWidthSlide = ({ link, title, category, img, imgAlt, onClick }) => {
  return (
    <section className="slide-content">
      <a href={link} onClick={onClick}>
        <div className="text">
          <div className="category">
            {category}
          </div>
          <div className="title">
            <p>
              {title}
            </p>
          </div>
        </div>
      </a>

      <div className="image">
        <picture>
          <img src={img} alt={imgAlt} />
        </picture>
      </div>
    </section>
  )
}


const HeroHeader = ({
  featuredItems,
  socials = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const sliderRef = useRef(null);

  const sliderNext = () => {
    trackEvent('home_carousel_navigate', { direction: 'next', slide_index: currentSlide });
    if (sliderRef.current) sliderRef.current.slickNext();
  };
  const sliderPrev = () => {
    trackEvent('home_carousel_navigate', { direction: 'prev', slide_index: currentSlide });
    if (sliderRef.current) sliderRef.current.slickPrev();
  };
  const slideChanged = (oldIndex, newIndex) => setCurrentSlide(newIndex + 1);


  var settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 4000,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    pauseOnFocus: false,
    fade: true,
    beforeChange: slideChanged
  };


  return (
    <StyledHeroHeader className="hero-header">
      <Slider
        {...settings}
        ref={sliderRef}
      >
        {
          featuredItems.map((item, key) => (
            <FullWidthSlide
              key={key}
              link={`projects/${item?.slug}`}
              title={item?.title}
              category={item?.heroImageType ? 'Exterior' : 'Interior'}
              img={item?.heroImage?.url}
              imgAlt={item?.heroImage?.title}
              onClick={() => trackEvent('project_click', {
                project_slug: item?.slug,
                project_type: item?.projectType,
                source: 'home_carousel',
                position: key + 1,
              })}
            />
          ))
        }
      </Slider>

      <BottomBar
        emailTxt="Get in touch"
        emailAddress="imagine3dvisual@gmail.com"
        emailIcon="mail"
        socialsTxt="Follow"
        socialsIcon="share"
        socials={socials}
        btnPrev={sliderPrev}
        btnNext={sliderNext}
        currentSlide={`0${currentSlide}`}
        totalSlides={`0${featuredItems.length}`}
      />
    </StyledHeroHeader>
  );
}


export default HeroHeader;