import React from 'react';
import './Footer.css';

/**
 * Application footer displayed on all pages.
 * Shows copyright and basic links.
 *
 * @component
 * @returns {JSX.Element} The footer component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} Recruitment Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;