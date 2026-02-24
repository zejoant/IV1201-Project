import React from 'react';
import './Footer.css';
import {useTranslation} from 'react-i18next';

/**
 * Application footer displayed on all pages.
 * Shows copyright and basic links.
 *
 * @component
 * @returns {JSX.Element} The footer component
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  const {t, i18n} = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} {t('footer.copyright')}
        </div>
        <div>
      <button onClick={() => {i18n.changeLanguage('en'); localStorage.setItem('language','en')}}>English</button>
      <button onClick={() => {i18n.changeLanguage('sv'); localStorage.setItem('language','sv')}}>Svenska</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;