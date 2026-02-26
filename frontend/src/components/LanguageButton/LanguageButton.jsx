import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageButton.css';

/**
 * Floating language switcher component.
 * Renders two buttons (English/Svenska) fixed to the top‑right corner of the viewport.
 * Changes the application language and persists the choice in localStorage.
 *
 * @component
 * @returns {JSX.Element} The rendered language buttons container
 */
const LanguageButton = () => {
  const { i18n } = useTranslation();

  /**
   * Changes the current language and stores the selection.
   * @param {string} lng - Language code ('en' or 'sv')
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Store the chosen language in localStorage using the same format as before
    localStorage.setItem('language', lng === 'en' ? 'en-US' : 'sv-SE');
  };

  return (
    <div className="language-button-container">
      <button className="lang-btn" onClick={() => changeLanguage('en')}>
        English
      </button>
      <button className="lang-btn" onClick={() => changeLanguage('sv')}>
        Svenska
      </button>
    </div>
  );
};

export default LanguageButton;