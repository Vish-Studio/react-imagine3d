import React from "react";
import StyledTopBar from "./style";
import Logo from '../logo/logo';
import img from '../../assets/logo/white.png';
import config from '../../config.json'
import { trackEvent } from '../../utils/analytics';


const TopBar = ({ isOpened, onOpenMenu }) => {
    return(
        <StyledTopBar className="top-bar">
            <div className="top-bar__logo">
                <Logo img={img} link="/"/>
            </div>

            <div className="top-bar__menu-btn" onClick={() => {
                trackEvent('menu_toggle', { state: isOpened ? 'close' : 'open' });
                onOpenMenu();
            }}>
                <div className={`menu-txt ${isOpened ? 'opened' : ''}`}>
                    <span className="txt-menu">Menu</span>
                    <span className="txt-toggle">
                        {isOpened ? 'Close' : 'Open'}
                    </span>
                </div>
                <span className={config.icons}>
                    {isOpened ? 'close' : 'menu'}
                </span>
            </div>
        </StyledTopBar>
    )
}

export default TopBar;