import '../cssFiles/languageButton.css';

/**
 * View component for the language switcher buttons.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onChangeLanguage - Callback to change language
 * @returns {JSX.Element} Rendered language buttons container
 */
const LanguageButtonView = ({ onChangeLanguage, t }) => {
  return (
    <div>
      <button className="lang-btn" onClick={() => onChangeLanguage(localStorage.language)}>
        {t('languageButton.language')}
      </button>
    </div>
  );
};

export default LanguageButtonView;