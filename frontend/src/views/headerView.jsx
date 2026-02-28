import '../cssFiles/header.css';

function HeaderView({ currentUser, t, onLogout, navigate, LanguageButton}) {
  return (
    <nav className="header-navbar">
      <div className="header-nav-content">
        <div className="header-brand" onClick={() => navigate('/')}>
          <h1 className="header-logo">{t('header.brand')}</h1>
        </div>
        <div className="header-nav-actions">
          <div className="header-user-badge">
            <div className="header-avatar">
              {currentUser.username?.charAt(0) || 'U'}
            </div>
            <span className="header-username">{currentUser.username}</span>
            <span className="header-user-role">
              {currentUser.role_id === 1 ? t('header.recruiter') : t('header.applicant')}
            </span>
          </div>
          {<LanguageButton/>}
          <button onClick={onLogout} className="header-logout-button">
            <span>{t('header.logout')}</span>
            <span className="header-logout-icon">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HeaderView;