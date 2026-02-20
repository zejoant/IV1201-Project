import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ApplicationDetail.css';

/**
 * Displays detailed information about a single job application.
 * Recruiters can view personal details, competences, availability,
 * and update the application status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - The currently logged‑in user (recruiter)
 * @param {Function} props.handleLogout - Callback to log the user out
 * @returns {JSX.Element} The rendered application detail view
 */
function ApplicationDetail({ currentUser, handleLogout }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState(''); 
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setDetailError('');
        let appBasic = location.state?.application;

        // If no state, fetch from list to get basic info
        if (!appBasic) {
          const listRes = await fetch('/application/list_applications', {
            credentials: 'include',
          });

          const listData = await listRes.json();

          if (!listRes.ok) {
            const err = new Error(listData.error || 'Failed to fetch applications list');
            err.custom = true;
            throw err;
          }
          const found = listData.success?.find(
            (app) => app.job_application_id === parseInt(id)
          );
          if (!found) {
            const err = new Error(`Application with ID ${id} not found`);
            err.custom = true;
            throw err;
          }
          appBasic = found;
        }

        // Set basic info immediately so user sees something
        setApplication(appBasic);

        // Now fetch full details
        const requestBody = {
          job_application_id: parseInt(id),
          person_id: appBasic.person_id,
          status: appBasic.status,
          name: appBasic.name,
          surname: appBasic.surname,
        };

        const res = await fetch('/application/get_application', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (!res.ok) {
          const err = new Error(data.error || 'Failed to load full application details');
          err.custom = true;
          throw err;
        }

        setApplication(data.success || data);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setDetailError(err.custom ? err.message : 'An error occurred while fetching application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id, location.state]);

  /**
   * Updates the status of the current application.
   * Sends a PATCH request to the server and updates local state on success.
   *
   * @param {string} newStatus - New status value ('accepted', 'rejected', or 'unhandled')
   * @returns {Promise<void>}
   */
  const handleStatusChange = async (newStatus) => {
    if (!application) return;
    
    // Store previous status for potential rollback
    const previousStatus = application.status;
    

    setApplication(prev => ({ ...prev, status: newStatus }));
    setUpdating(true);
    setDetailError('');
    try {
      // Replace with actual endpoint when available
      const res = await fetch('/application/update_application', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          job_application_id: application.job_application_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If request fails, rollback to previous status
        setApplication(prev => ({ ...prev, status: previousStatus }));
        const err = new Error(data.error || 'Update failed');
        err.custom = true;
        throw err;
      }

      const updatedApp = data.success || data;
      if (updatedApp && typeof updatedApp === 'object') {
        setApplication(prev => ({ ...prev, ...updatedApp }));
      }


    } catch (err) {
      // Set a user-friendly error message
      let errorMessage = err.custom ? err.message : 'An error occurred while updating status';
      if (err.message.includes('conflict') || err.message.includes('modified')) {
        errorMessage = 'This application has been modified by another user. Please refresh.';
      }
      setDetailError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Formats a date string into a human‑readable long date.
   *
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "January 1, 2025") or "N/A" if invalid
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  /**
   * Returns a CSS class name based on the application status.
   *
   * @param {string} status - Application status
   * @returns {string} CSS class for styling the status badge
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'detail-status-accepted';
      case 'rejected': return 'detail-status-rejected';
      default: return 'detail-status-unhandled';
    }
  };

  if (loading) return <div className="recruiter-detail-loading">Loading application details...</div>;
  if (!application) return <div className="recruiter-detail-error">Application not found</div>;

  return (
    <div className="recruiter-detail-container">
      <nav className="recruiter-detail-navbar">
        <div className="recruiter-detail-nav-content">
          <div className="recruiter-detail-brand">
            <h1 className="recruiter-detail-logo">Recruitment Platform</h1>
          </div>
          <div className="recruiter-detail-nav-actions">
            <div className="recruiter-detail-user-badge">
              <div className="recruiter-detail-avatar">
                {currentUser.username?.charAt(0) || 'U'}
              </div>
              <span className="recruiter-detail-username">{currentUser.username}</span>
              <span className="recruiter-detail-user-role">Recruiter</span>
            </div>
            <button onClick={handleLogout} className="recruiter-detail-logout-button">
              <span>Logout</span>
              <span className="recruiter-detail-logout-icon">→</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="recruiter-detail-main">
        <div className="recruiter-detail-content">
          <button className="recruiter-detail-back-button" onClick={() => navigate('/recruiter')}>
            ← Back to Applications
          </button>

          <div className="recruiter-detail-card">
            <div className="recruiter-detail-header">
              <h2>Application Details</h2>
              <div className={`recruiter-detail-status-badge ${getStatusClass(application.status)}`}>
                {application.status}
              </div>
            </div>

            <section className="recruiter-detail-section">
              <h3>Personal Information</h3>
              <div className="recruiter-detail-info-grid">
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">Name</span>
                  <span className="recruiter-detail-info-value">
                    {application.name} {application.surname}
                  </span>
                </div>
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">Email</span>
                  <span className="recruiter-detail-info-value">{application.email || 'N/A'}</span>
                </div>
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">Person Number</span>
                  <span className="recruiter-detail-info-value">
                    {application.pnr || application.person_number || application.ssn || 'N/A'}
                  </span>
                </div>
              </div>
            </section>

            <section className="recruiter-detail-section">
              <h3>Areas of Expertise</h3>
              {application.competences && Array.isArray(application.competences) && application.competences.length > 0 ? (
                <ul className="recruiter-detail-list">
                  {application.competences.map((exp, index) => {
                    if (!exp) return null;
                    const name = exp.name || 'Unknown';
                    const yoe = exp.yoe ? parseFloat(exp.yoe) : 0;
                    return (
                      <li key={index} className="recruiter-detail-list-item">
                        {name} – {yoe} {yoe === 1 ? 'year' : 'years'}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>{detailError ? 'Full details unavailable' : 'No expertise provided.'}</p>
              )}
            </section>

            <section className="recruiter-detail-section">
              <h3>Availability Periods</h3>
              {application.availabilities && Array.isArray(application.availabilities) && application.availabilities.length > 0 ? (
                <ul className="recruiter-detail-list">
                  {application.availabilities.map((period, index) => {
                    if (!period) return null;
                    const from = period.from_date ? formatDate(period.from_date) : 'N/A';
                    const to = period.to_date ? formatDate(period.to_date) : 'N/A';
                    return (
                      <li key={index} className="recruiter-detail-list-item">
                        {from} to {to}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>{detailError ? 'Full details unavailable' : 'No availability periods provided.'}</p>
              )}
            </section>

            <section className="recruiter-detail-actions">
              <h3>Change Status</h3>
              <div className="recruiter-detail-buttons">
                <button
                  className="recruiter-detail-button accept"
                  onClick={() => handleStatusChange('accepted')}
                  disabled={updating || application.status === 'accepted'}
                >
                  Accept
                </button>
                <button
                  className="recruiter-detail-button reject"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={updating || application.status === 'rejected'}
                >
                  Reject
                </button>
                <button
                  className="recruiter-detail-button unhandled"
                  onClick={() => handleStatusChange('unhandled')}
                  disabled={updating || application.status === 'unhandled'}
                >
                  Mark as Unhandled
                </button>
              </div>
              {detailError && <div className="recruiter-detail-error-message">{detailError}</div>}
              {updating && <p className="recruiter-detail-updating">Updating...</p>}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetail;