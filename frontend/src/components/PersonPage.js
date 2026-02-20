import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './PersonPage.css';

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
  
  return (
    <div className="personpage-container">
      
      {/* Main Content Area */}
      <main className="personpage-main">
        <div className="personpage-content">
          {/* Welcome Banner */}
          <div className="personpage-welcome-section">
            <div className="personpage-welcome-content">
              <h2 className="personpage-welcome-title">
                Welcome back, <span className="personpage-highlight">{currentUser.username}</span>!
              </h2>
              <p className="personpage-welcome-subtitle">
                Manage your job applications and profile
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
                Personal Information
              </h3>
              <div className="personpage-card-badge">Active</div>
            </div>
            
            <div className="personpage-info-grid">
              <div className="personpage-info-item">
                <span className="personpage-info-label">Name</span>
                <span className="personpage-info-value">{currentUser.name || 'Not provided'}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">Surname</span>
                <span className="personpage-info-value">{currentUser.surname || 'Not provided'}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">Username</span>
                <span className="personpage-info-value">{currentUser.username}</span>
              </div>
              <div className="personpage-info-item">
                <span className="personpage-info-label">Email</span>
                <span className="personpage-info-value">{currentUser.email || 'Not provided'}</span>
              </div>
              {/* Person number can be shown if available */}
              {currentUser.person_number && (
                <div className="personpage-info-item">
                  <span className="personpage-info-label">Person Number</span>
                  <span className="personpage-info-value">{currentUser.person_number}</span>
                </div>
              )}
            </div>

            <div className="personpage-card-footer">
              <span className="personpage-footer-note">
                Last updated: {new Date().toLocaleDateString()}
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
              <h4 className="personpage-action-title">Submit Application</h4>
              <p className="personpage-action-description">
                Apply for a position at the amusement park
              </p>
              <button 
                className="personpage-action-button"
                onClick={onApplyNow}
              >
                Apply Now
              </button>
            </div>
            
            {/* My Applications Card */}
          <div className="personpage-action-card">
           <div className="personpage-action-icon personpage-action-icon-2">
              📋
           </div>
              <h4 className="personpage-action-title">My Applications</h4>
               <p className="personpage-action-description">
            View and manage your submitted applications
           </p>
        <button
            className="personpage-action-button"
             onClick={onViewMyApplications}
            >
            View All
          </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonPage;