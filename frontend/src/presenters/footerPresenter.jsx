import { useTranslation } from 'react-i18next';
import FooterView from '../views/footerView';

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

  return <FooterView currentYear={currentYear} t={t} />;
}

export default Footer;