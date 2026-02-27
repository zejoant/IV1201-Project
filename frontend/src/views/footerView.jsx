import React from 'react';
import '../cssFiles/footer.css';

function FooterView({ currentYear, t }) {
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

export default FooterView;