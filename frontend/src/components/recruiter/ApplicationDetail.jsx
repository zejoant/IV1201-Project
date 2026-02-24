import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './ApplicationDetail.css';
import { useTranslation } from 'react-i18next';

/**
 * Displays detailed information about a single job application.
 * Recruiters can view personal details, competences, availability,
 * and update the application status.
 *
 * @component
 * @returns {JSX.Element} The rendered application detail view
 */
function ApplicationDetail() {
  const { logout } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState(''); 
  const [updating, setUpdating] = useState(false);

  const {t} = useTranslation();

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

          if (listRes.status === 403) {
            logout()
          } 

          const listData = await listRes.json();

          if (!listRes.ok) {
            const err = new Error(`errors.${listData.error}` || 'validation.application_fetch_fail');
            err.custom = true;
            throw err;
          }
          const found = listData.success?.find(
            (app) => app.job_application_id === parseInt(id)
          );
          if (!found) {
            const err = new Error(`validation.application_not_found`);
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

        if (res.status === 403) {
          logout()
        } 

        const data = await res.json();

        if (!res.ok) {
          const err = new Error(`errors.${data.error}` || 'validation.load_full_application');
          err.custom = true;
          throw err;
        }

        setApplication(data.success || data);
      } catch (err) {
        //console.error('Error fetching application details:', err);
        setDetailError(err.custom ? err.message : 'validation.application_fetch_error');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id, location.state, logout]);

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

      if (res.status === 403) {
        logout()
      } 

      const data = await res.json();

      if (!res.ok) {
        // If request fails, rollback to previous status
        setApplication(prev => ({ ...prev, status: previousStatus }));
        const err = new Error(`errors.${data.error}` || 'validation.application_update_failed');
        err.custom = true;
        throw err;
      }

      const updatedApp = data.success || data;
      if (updatedApp && typeof updatedApp === 'object') {
        setApplication(prev => ({ ...prev, ...updatedApp }));
      }


    } catch (err) {
      // Set a user-friendly error message
      let errorMessage = err.custom ? err.message : 'validation.update_status_error';
      //if (err.message.includes('conflict') || err.message.includes('modified')) {
      //  errorMessage = 'This application has been modified by another user. Please refresh.';
      //}
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

  if (loading) return <div className="recruiter-detail-loading">{t('applicationDetail.loading')}</div>;
  if (!application) return <div className="recruiter-detail-error">{t('applicationDetail.applicationNotFound')}</div>;

  return (
    <div className="recruiter-detail-container">

      <main className="recruiter-detail-main">
        <div className="recruiter-detail-content">
          <button className="recruiter-detail-back-button" onClick={() => navigate('/recruiter')}>
            {t('applicationDetail.backToApplications')}
          </button>

          <div className="recruiter-detail-card">
            <div className="recruiter-detail-header">
              <h2>{t('applicationDetail.title')}</h2>
              <div className={`recruiter-detail-status-badge ${getStatusClass(application.status)}`}>
                {t(`applicationDetail.status.${application.status}`)}
              </div>
            </div>

            <section className="recruiter-detail-section">
              <h3>{t('applicationDetail.personalInformation')}</h3>
              <div className="recruiter-detail-info-grid">
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">{t('applicationDetail.name')}</span>
                  <span className="recruiter-detail-info-value">
                    {application.name} {application.surname}
                  </span>
                </div>
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">{t('applicationDetail.email')}</span>
                  <span className="recruiter-detail-info-value">{application.email || t('applicationDetail.notAvailable')}</span>
                </div>
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">{t('applicationDetail.pnr')}</span>
                  <span className="recruiter-detail-info-value">
                    {application.pnr || application.person_number || application.ssn || t('applicationDetail.notAvailable')}
                  </span>
                </div>
              </div>
            </section>

            <section className="recruiter-detail-section">
              <h3>{t('applicationDetail.areasOfExpertise')}</h3>
              {application.competences && Array.isArray(application.competences) && application.competences.length > 0 ? (
                <ul className="recruiter-detail-list">
                  {application.competences.map((exp, index) => {
                    if (!exp) return null;
                    const name = exp.name || t('applicationDetail.unknown');
                    const yoe = exp.yoe ? parseFloat(exp.yoe) : 0;
                    return (
                      <li key={index} className="recruiter-detail-list-item">
                        {t(`applicationDetail.competences.${name}`)} – {yoe} {yoe === 1 ? t('applicationDetail.year') : t('applicationDetail.years')}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>{detailError ? t('applicationDetail.fullDetailsUnavailable') : t('applicationDetail.noExpertise')}</p>
              )}
            </section>

            <section className="recruiter-detail-section">
              <h3>{t('applicationDetail.availabilityPeriods')}</h3>
              {application.availabilities && Array.isArray(application.availabilities) && application.availabilities.length > 0 ? (
                <ul className="recruiter-detail-list">
                  {application.availabilities.map((period, index) => {
                    if (!period) return null;
                    const from = period.from_date ? formatDate(period.from_date) : t('applicationDetail.notAvailable');
                    const to = period.to_date ? formatDate(period.to_date) : t('applicationDetail.notAvailable');
                    return (
                      <li key={index} className="recruiter-detail-list-item">
                        {from} {t('applicationDetail.to')} {to}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>{detailError ? t('applicationDetail.fullDetailsUnavailable') : t('applicationDetail.noAvailability')}</p>
              )}
            </section>

            <section className="recruiter-detail-actions">
              <h3>{t('applicationDetail.changeStatus')}</h3>
              <div className="recruiter-detail-buttons">
                <button
                  className="recruiter-detail-button accept"
                  onClick={() => handleStatusChange('accepted')}
                  disabled={updating || application.status === 'accepted'}
                >
                  {t('applicationDetail.accept')}
                </button>
                <button
                  className="recruiter-detail-button reject"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={updating || application.status === 'rejected'}
                >
                  {t('applicationDetail.reject')}
                </button>
                <button
                  className="recruiter-detail-button unhandled"
                  onClick={() => handleStatusChange('unhandled')}
                  disabled={updating || application.status === 'unhandled'}
                >
                  {t('applicationDetail.markUnhandled')}
                </button>
              </div>
              {detailError && <div className="recruiter-detail-error-message">{detailError}</div>}
              {updating && <p className="recruiter-detail-updating">{t('applicationDetail.updating')}</p>}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetail;