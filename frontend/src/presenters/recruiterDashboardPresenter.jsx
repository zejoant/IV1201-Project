import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';
import RecruiterDashboardView from '../views/recruiterDashboardView';

/**
 * Recruiter dashboard displaying a sortable table of all job applications.
 * Allows recruiters to view applications and navigate to details.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard
 */
function RecruiterDashboard() {
  const { logout } = useContext(UserContext);
  // State: applications list, loading, error, sort settings
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'job_application_id', direction: 'asc' });
  const navigate = useNavigate();
  const {t} = useTranslation();

  // Fetch all applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch('/application/list_applications', {
          credentials: 'include',
        });

        if (res.status === 403) {
          logout()
        } 

        const data = await res.json();

        if (!res.ok) {
          const err = new Error(`list_applications.errors.${data.error}` || 'recruiterDashboard.errors.invalid_fetch');
          err.custom = true;
          throw err;
        }

        setApplications(data.success || []);
      } catch (err) {
        setError(err.type? err.message : 'recruiterDashboard.errors.offline');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [logout]);

  // Sort applications based on selected column
  const sortedApplications = React.useMemo(() => {
    if (!applications.length) return [];
    const sorted = [...applications];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [applications, sortConfig]);

  /**
   * Updates the sort configuration when a column header is clicked.
   * Toggles between ascending and descending order for the same key,
   * or sets a new key with ascending order.
   *
   * @param {string} key - The column key to sort by
   */
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  /**
   * Returns a CSS class name based on the application status.
   *
   * @param {string} status - Application status ('accepted', 'rejected', or other)
   * @returns {string} CSS class for styling the status badge
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-unhandled';
    }
  };

  /**
   * Navigates to the detailed view of the selected application.
   * Passes the application data via router state.
   *
   * @param {Object} app - The application object
   */
  const handleRowClick = (app) => {
    navigate(`/recruiter/application/${app.job_application_id}`, { state: { application: app } });
  };

  return (
    <RecruiterDashboardView
      t={t}
      loading={loading}
      error={error}
      sortConfig={sortConfig}
      sortedApplications={sortedApplications}
      requestSort={requestSort}
      getStatusClass={getStatusClass}
      handleRowClick={handleRowClick}
    />
  );
}

export default RecruiterDashboard;