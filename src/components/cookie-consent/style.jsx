import styled from 'styled-components';

const StyledCookieConsent = styled.div`
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: rgba(11, 11, 11, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  color: #fff;

  @media (min-width: 992px) {
    left: auto;
    right: 2rem;
    bottom: 2rem;
    max-width: 440px;
  }

  .cookie-consent__label {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .cookie-consent__text {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.6;
    color: #aaa;
  }

  .cookie-consent__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .cookie-consent__btn {
    flex: 1;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 0.85rem 1.5rem;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: #fd5a1e;
      border-color: #fd5a1e;
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid #fd5a1e;
      outline-offset: 2px;
    }

    &--accept {
      background: #fd5a1e;
      border-color: #fd5a1e;

      &:hover {
        background: transparent;
        color: #fd5a1e;
      }
    }
  }
`;

export default StyledCookieConsent;
