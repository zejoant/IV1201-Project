import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';
import HeaderView from '../views/headerView';
import LanguageButton from '../presenters/languageButtonPresenter';

/**
 * Application header displayed on all authenticated pages.
 * Shows brand, user info and logout button.
 * 
 * @component
 * @returns {JSX.Element|null} The header component or null if not logged in
 */
function Header() {
  const { currentUser, logout } = useContext(UserContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    const response = await logout()
    if(response){
      setError(response)
    }
    else{
      navigate('/login');
    }
  };

  if (!currentUser) return null;

  return (
    <HeaderView
      currentUser={currentUser}
      t={t}
      onLogout={handleLogout}
      navigate={navigate}
      LanguageButton={LanguageButton}
      error={error}
    />
  );
}

export default Header;