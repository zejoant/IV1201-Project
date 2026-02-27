import '../cssFiles/personPage.css';

/**
 * PersonPageView Component
 *
 * Displays the authenticated user's personal dashboard page.
 * The view presents user information, a welcome section, and
 * quick action cards allowing the user to perform actions such
 * as submitting applications or viewing existing ones.
 *
 * This is a presentational component that receives all data and
 * event handlers via props and does not manage its own state.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.currentUser - The currently authenticated user.
 * @param {string} props.currentUser.username - User's username.
 * @param {string} [props.currentUser.name] - User's first name.
 * @param {string} [props.currentUser.surname] - User's surname.
 * @param {string} [props.currentUser.email] - User's email address.
 * @param {string} [props.currentUser.person_number] - User's personal identification number.
 *
 * @param {Function} props.t - Translation function used for internationalized text.
 *
 * @param {Function} props.onApplyNow - Callback triggered when the user chooses to submit a new application.
 * @param {Function} props.onViewMyApplications - Callback triggered when the user wants to view their applications.
 *
 * @returns {JSX.Element} Rendered personal dashboard page.
 */
function PersonPageView({
  currentUser,
  t,
  onApplyNow,
  onViewMyApplications
}) {

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
          {/*<div className="personpage-action-card">
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
            </div>*/}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonPageView;