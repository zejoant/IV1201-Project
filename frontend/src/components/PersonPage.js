import React from 'react';
import './PersonPage.css';

function PersonPage({ currentUser, handleLogout, onApplyNow }) {
  // For applicant users, we'll show two main functions
  
  return (
    <div className="personpage-container">
      {/* Top Navigation Bar */}
      <nav className="personpage-navbar">
        <div className="personpage-nav-content">
          <div className="personpage-brand">
            <h1 className="personpage-logo">Recruitment Platform</h1>
          </div>
          <div className="personpage-nav-actions">
            <div className="personpage-user-badge">
              <div className="personpage-avatar">
                {currentUser.username?.charAt(0) || 'U'}
              </div>
              <span className="personpage-username">{currentUser.username}</span>
              <span className="personpage-user-role">Applicant</span>
            </div>
            <button onClick={handleLogout} className="personpage-logout-button">
              <span>Logout</span>
              <span className="personpage-logout-icon">→</span>
            </button>
          </div>
        </div>
      </nav>

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
              <button className="personpage-action-button">View All</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PersonPage;