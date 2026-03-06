import { useTranslation } from 'react-i18next';
import LanguageButtonView from '../views/languageButtonView';
import { useEffect, useState } from 'react';

/**
 * Floating language switcher container component.
 *
 * - Loading the persisted language from localStorage on mount
 * - Synchronizing the selected language with react-i18next
 * - Persisting language changes to localStorage
 * - Passing language state and handlers to the view component
 *
 * @component
 * @returns {JSX.Element} Rendered language switcher UI
 */
const LanguageButton = () => {
    const {i18n, t} = useTranslation();
    const [language, setLanguage] = useState(null)

    /**
     * Initializes language settings on component mount.
     *
     * Reads the saved language preference from localStorage.
     * If none exists, defaults to "en-US".
     *
     * Synchronizes the i18next language instance and
     * updates local React state so the UI re-renders.
     */
    useEffect(() => {
        const storedLanguage = localStorage.getItem("language") || "en-US";
        setLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
    }, [i18n]);

    /**
     * Toggles the application language and persists the selection.
     *
     * Updates:
     * - i18next language instance
     * - localStorage persistence
     * - React component state (triggers re-render)
     *
     * @param {string} lng - Current language code ("en-US" or "sv-SE")
     */
    const changeLanguage = (lng) => {
        const newLang = lng === 'en-US' ? 'sv-SE' : 'en-US';

        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
        setLanguage(newLang);
    };

    return <LanguageButtonView
        onChangeLanguage={changeLanguage}
        t={t}
        language={language}
    />;
};

export default LanguageButton;