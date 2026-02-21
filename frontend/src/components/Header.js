import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import './Header.css';

/**
 * Application header displayed on all authenticated pages.
 * Shows brand, user info and logout button.
 * 
 * @component
 * @returns {JSX.Element|null} The header component or null if not logged in
 */
function Header() {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <nav className="header-navbar">
      <div className="header-nav-content">
        <div className="header-brand" onClick={() => navigate('/')}>
          <h1 className="header-logo">Recruitment Platform</h1>
        </div>
        <div className="header-nav-actions">
          <div className="header-user-badge">
            <div className="header-avatar">
              {currentUser.username?.charAt(0) || 'U'}
            </div>
            <span className="header-username">{currentUser.username}</span>
            <span className="header-user-role">
              {currentUser.role_id === 1 ? 'Recruiter' : 'Applicant'}
            </span>
          </div>
          <button onClick={handleLogout} className="header-logout-button">
            <span>Logout</span>
            <span className="header-logout-icon">→</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;