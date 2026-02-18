import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterDashboard.css';

/**
 * Recruiter dashboard displaying a sortable table of all job applications.
 * Allows recruiters to view applications and navigate to details.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - The currently logged‑in recruiter
 * @param {Function} props.handleLogout - Callback to log the user out
 * @returns {JSX.Element} The rendered dashboard
 */
function RecruiterDashboard({ currentUser, handleLogout }) {
  // State: applications list, loading, error, sort settings
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'job_application_id', direction: 'asc' });
  const navigate = useNavigate();

  // Fetch all applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch('/application/list_applications', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          const err = new Error(data.message || data.error?.message || 'Failed to fetch applications');
          err.custom = true;
          throw err;
        }
        setApplications(data.success || []);
      } catch (err) {
        setError(err.custom ? err.message : 'An error occurred while fetching applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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
    <div className="recruiter-container">
      {/* Navigation bar with user info and logout */}
      <nav className="recruiter-navbar">
        <div className="recruiter-nav-content">
          <div className="recruiter-brand">
            <h1 className="recruiter-logo">Recruitment Platform</h1>
          </div>
          <div className="recruiter-nav-actions">
            <div className="recruiter-user-badge">
              <div className="recruiter-avatar">
                {currentUser.username?.charAt(0) || 'U'}
              </div>
              <span className="recruiter-username">{currentUser.username}</span>
              <span className="recruiter-user-role">Recruiter</span>
            </div>
            <button onClick={handleLogout} className="recruiter-logout-button">
              <span>Logout</span>
              <span className="recruiter-logout-icon">→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content: applications table with sorting */}
      <main className="recruiter-main">
        <div className="recruiter-content">
          <h2 className="recruiter-page-title">All Applications</h2>
          {loading && <div className="recruiter-loading">Loading applications...</div>}
          {error && <div className="recruiter-error">Error: {error}</div>}
          {!loading && !error && (
            <div className="recruiter-table-container">
              <table className="recruiter-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('name')}>
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('surname')}>
                      Surname {sortConfig.key === 'surname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('job_application_id')}>
                      Application ID {sortConfig.key === 'job_application_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('status')}>
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApplications.length > 0 ? (
                    sortedApplications.map((app) => (
                      <tr key={app.job_application_id} onClick={() => handleRowClick(app)} className="recruiter-table-row">
                        <td>{app.name}</td>
                        <td>{app.surname}</td>
                        <td>{app.job_application_id}</td>
                        <td><span className={`recruiter-status-badge ${getStatusClass(app.status)}`}>{app.status}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="recruiter-no-data">No applications found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;