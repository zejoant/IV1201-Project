import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';
import ApplicationDetailView from '../views/applicationDetailView';

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
            const err = new Error(`list_applications.errors.${listData.error}` || 'applicationDetail.errors.application_fetch_fail');
            err.custom = true;
            throw err;
          }
          const found = listData.success?.find(
            (app) => app.job_application_id === parseInt(id)
          );
          if (!found) {
            const err = new Error(`applicationDetail.errors.application_not_found`);
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
          const err = new Error(`get_application.errors.${data.error}` || 'applicationDetail.errors.load_full_application');
          err.custom = true;
          throw err;
        }

        setApplication(data.success || data);
      } catch (err) {
        //console.error('Error fetching application details:', err);
        setDetailError(err.custom ? err.message : 'applicationDetail.errors.application_fetch_error');
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
        const err = new Error(`update_application.errors.${data.error}` || 'applicationDetail.errors.application_update_failed');
        err.custom = true;
        throw err;
      }

      const updatedApp = data.success || data;
      if (updatedApp && typeof updatedApp === 'object') {
        setApplication(prev => ({ ...prev, ...updatedApp }));
      }


    } catch (err) {
      // Set a user-friendly error message
      let errorMessage = err.custom ? err.message : 'applicationDetail.errors.update_status_error';
      //if (err.message.includes('conflict') || err.message.includes('modified')) {
      //  errorMessage = 'This application has been modified by another user. Please refresh.';
      //}
      setDetailError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Formats a date string into a human-readable long date.
   *
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "January 1, 2025") or "N/A" if invalid
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const userLanguage = localStorage.language || navigator.language; 
    return date.toLocaleDateString(userLanguage, { year: 'numeric', month: 'long', day: 'numeric' });
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

  //if (loading) return <div className="recruiter-detail-loading">{t('applicationDetail.loading')}</div>;
  //if (!application) return <div className="recruiter-detail-error">{t('applicationDetail.application_not_found')}</div>;

  return (
    <ApplicationDetailView
      t={t}
      loading={loading}
      application={application}
      detailError={detailError}
      updating={updating}
      navigate={navigate}
      handleStatusChange={handleStatusChange}
      formatDate={formatDate}
      getStatusClass={getStatusClass}
    />
  );
}

export default ApplicationDetail;