import React, { useEffect, useRef } from "react";
import StyledLoader from "./style";
import gsap from 'gsap';
import logoImg from '../../assets/logo/white.png';


const Loader = ({ setLoader }) => {
    const container = useRef(null);
    const progressBar = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => setLoader(false)
        });

        tl.fromTo(logoRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        )
            .fromTo(progressBar.current,
                { width: '0%' },
                { width: '100%', duration: 1.8, ease: 'power1.inOut' },
                '-=0.2'
            )
            .to(container.current,
                { opacity: 0, pointerEvents: 'none', visibility: 'hidden', duration: 0.5 }
            );

        return () => tl.kill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StyledLoader ref={container}>
            <div className="loader-logo" ref={logoRef}>
                <img src={logoImg} alt="Logo" />
            </div>
            <div className="loader-progress-track">
                <div className="loader-progress-bar" ref={progressBar} />
            </div>
        </StyledLoader>
    );
};

export default Loader;