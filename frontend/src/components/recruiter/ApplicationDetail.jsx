import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ApplicationDetail.css';

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
          if (!listRes.ok) throw new Error('Failed to fetch applications list');
          const listData = await listRes.json();
          const found = listData.success?.find(
            (app) => app.job_application_id === parseInt(id)
          );
          if (!found) throw new Error(`Application with ID ${id} not found`);
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
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load full application details');
        }
        
        const data = await res.json();
        setApplication(data.success || data);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setDetailError(err.message);
        // application already has basic info from appBasic, so no need to set again
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id, location.state]);

  const handleStatusChange = async (newStatus) => {
    if (!application) return;
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
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Update failed');
      }
      const updated = await res.json();
      setApplication(updated);
      alert('Status updated successfully');
    } catch (err) {
      if (err.message.includes('conflict') || err.message.includes('modified')) {
        alert('This application has been modified by another user. Please refresh.');
      } else {
        setDetailError(err.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
              {updating && <p className="recruiter-detail-updating">Updating...</p>}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetail;