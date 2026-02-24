import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './PersonPage.css';
import { useTranslation } from 'react-i18next';

/**
 * PersonPage component – the main dashboard for applicant users.
 * Displays personal information and provides quick actions to apply
 * for a position or view existing applications.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onApplyNow - Callback to navigate to the application form
 * @param {Function} props.onViewMyApplications - Callback to navigate to the user's applications list
 * @returns {JSX.Element} The rendered applicant dashboard
 */
function PersonPage({ onApplyNow, onViewMyApplications }) {
  const { currentUser } = useContext(UserContext);
  const {t} = useTranslation();
  
  return (
    <div className="personpage-container">
      
      {/* Main Content Area */}
      <main className="personpage-main">
        <div className="personpage-content">
          {/* Welcome Banner */}
          <div className="personpage-welcome-section">
            <div className="personpage-welcome-content">
              <h2 className="personpage-welcome-title">
                {t('personPage.welcome_title')} <span className="personpage-highlight">{currentUser.username}</span>!
              </h2>
              <p className="personpage-welcome-subtitle">
                {t('personPage.welcome_subtitle')}
              </p>
            </div>
            <div className="personpage-welcome-decoration">
              <div className="personpage-decoration-circle"></div>
            </div>
          </div>

          {/* User Information Card */}
          <div className="personpage-card">
            <div className="personpage-card-header">
              <h3 className="personpage-card-title">
                <span className="personpage-card-icon">👤</span>
                {t('personPage.personal_info')}
              </h3>
              <div className="personpage-card-badge">{t('personPage.active')}</div>
            </div>
            
            <div className="personpage-info-grid">
              <div className="personpage-info-item">
                <span className="personpage-info-label">{t('personPage.labels.name')}</span>
                <span className="personpage-info-value">{currentUser.name || t('personPage.not_provided')}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">{t('personPage.labels.surname')}</span>
                <span className="personpage-info-value">{currentUser.surname || t('personPage.not_provided')}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">{t('personPage.labels.username')}</span>
                <span className="personpage-info-value">{currentUser.username}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">{t('personPage.labels.email')}</span>
                <span className="personpage-info-value">{currentUser.email || t('personPage.notProvided')}</span>
              </div>
              {/* Person number can be shown if available */}
              {currentUser.person_number && (
                <div className="personpage-info-item">
                  <span className="personpage-info-label">{t('personPage.labels.pnr')}</span>
                  <span className="personpage-info-value">{currentUser.person_number}</span>
                </div>
              )}
            </div>

            <div className="personpage-card-footer">
              <span className="personpage-footer-note">
                {t('personPage.last_updated')} {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="personpage-actions-grid">
            {/* Submit Application Card */}
            <div className="personpage-action-card">
              <div className="personpage-action-icon personpage-action-icon-1">
                📝
              </div>
              <h4 className="personpage-action-title">{t('personPage.actions.submit_application')}</h4>
              <p className="personpage-action-description">
                {t('personPage.actions.submit_description')}
              </p>
              <button 
                className="personpage-action-button"
                onClick={onApplyNow}
              >
                {t('personPage.actions.apply_now')}
              </button>
            </div>
            
            {/* My Applications Card */}
          <div className="personpage-action-card">
           <div className="personpage-action-icon personpage-action-icon-2">
              📋
           </div>
              <h4 className="personpage-action-title">{t('personPage.actions.my_applications')}</h4>
               <p className="personpage-action-description">
            {t('personPage.actions.manage_description')}
           </p>
        <button
            className="personpage-action-button"
             onClick={onViewMyApplications}
            >
            {t('personPage.actions.view_all')}
          </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonPage;