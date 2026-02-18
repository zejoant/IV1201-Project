import React, { useState, useEffect } from 'react';
import './MyApplications.css';

function MyApplications({ currentUser, onBackToProfile }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc' for date (ID as proxy)
  const [deleteConfirm, setDeleteConfirm] = useState(null); // stores application id to delete

  // Fetch all applications and filter by current user
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch('/application/list_applications', {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await res.json();
        // data.success is expected to be an array of applications
        const allApps = data.success || [];
        // Filter applications belonging to current user
        const myApps = allApps.filter(app => app.person_id === currentUser.person_id);
        setApplications(myApps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [currentUser.person_id]);

  // Handle delete (cancel) confirmation
  const confirmDelete = (app) => {
    setDeleteConfirm(app);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Perform delete (update status to 'cancelled')
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch('/application/update_application', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_application_id: deleteConfirm.job_application_id,
          status: 'cancelled', // assuming backend accepts 'cancelled'
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to cancel application');
      }

      // Remove from local state
      setApplications(prev => prev.filter(app => app.job_application_id !== deleteConfirm.job_application_id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Sort applications by ID (as proxy for date)
  const sortedApplications = React.useMemo(() => {
    return [...applications].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.job_application_id - b.job_application_id;
      } else {
        return b.job_application_id - a.job_application_id;
      }
    });
  }, [applications, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unhandled';
    }
  };

  return (
    <div className="myapps-container">
      <div className="myapps-card">
        <div className="myapps-header">
          <button className="myapps-back-button" onClick={onBackToProfile}>
            ← Back
          </button>
          <h2 className="myapps-title">My Applications</h2>
        </div>

        {loading && <div className="myapps-loading">Loading your applications...</div>}
        {error && <div className="myapps-error">Error: {error}</div>}

        {!loading && !error && (
          <>
            <div className="myapps-toolbar">
              <button className="myapps-sort-button" onClick={toggleSortOrder}>
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {sortedApplications.length === 0 ? (
              <div className="myapps-empty">You haven't submitted any applications yet.</div>
            ) : (
              <div className="myapps-list">
                {sortedApplications.map((app) => (
                  <div key={app.job_application_id} className="myapps-item">
                    <div className="myapps-item-info">
                      <div className="myapps-item-header">
                        <span className="myapps-item-name">{app.name} {app.surname}</span>
                        <span className={`myapps-status-badge ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="myapps-item-details">
                        <span>Application ID: {app.job_application_id}</span>
                        {/* If backend provided created_at, show date here */}
                      </div>
                    </div>
                    {app.status !== 'cancelled' && (
                      <button
                        className="myapps-delete-button"
                        onClick={() => confirmDelete(app)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div className="myapps-modal-overlay">
            <div className="myapps-modal">
              <h3>Cancel Application</h3>
              <p>
                Are you sure you want to cancel this application for{' '}
                <strong>{deleteConfirm.name} {deleteConfirm.surname}</strong>?
              </p>
              <p className="myapps-modal-warning">This action cannot be undone.</p>
              <div className="myapps-modal-actions">
                <button className="myapps-modal-cancel" onClick={cancelDelete}>
                  No, Keep It
                </button>
                <button className="myapps-modal-confirm" onClick={handleDelete}>
                  Yes, Cancel Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;