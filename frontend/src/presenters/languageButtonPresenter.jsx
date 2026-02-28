import { useTranslation } from 'react-i18next';
import LanguageButtonView from '../views/languageButtonView';

/**
 * Floating language switcher component.
 * Handles language change logic and persistence.
 *
 * @component
 * @returns {JSX.Element} The rendered language buttons container
 */
const LanguageButton = () => {
    const {i18n, t} = useTranslation();

    /**
     * Changes the current language and stores the selection.
     * @param {string} lng - Language code ('en' or 'sv')
     */
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Store the chosen language in localStorage using the same format as before
        localStorage.setItem('language', lng === 'en-US' ? 'sv-SE' : 'en-US');
    };

    return <LanguageButtonView
        onChangeLanguage={changeLanguage}
        t={t}
        language={localStorage.language}
    />;
};

export default LanguageButton;