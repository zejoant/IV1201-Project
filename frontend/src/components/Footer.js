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
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;