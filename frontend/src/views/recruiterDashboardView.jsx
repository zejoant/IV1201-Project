import '../cssFiles/recruiterDashboard.css';

/**
 * RecruiterDashboardView Component
 *
 * Displays the recruiter dashboard containing a sortable table of
 * job applications. Recruiters can view applicant information,
 * sort applications by different columns, and select a row to
 * view detailed application data.
 *
 * This component is presentational and receives all data, sorting
 * logic, and event handlers through props.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 *
 * @param {Function} props.t - Translation function used for internationalized text.
 *
 * @param {boolean} props.loading - Indicates whether application data is being loaded.
 * @param {string|null} props.error - Translation key for an error message to display.
 *
 * @param {Object} props.sortConfig - Current sorting configuration.
 * @param {string} props.sortConfig.key - Active column used for sorting.
 * @param {'asc'|'desc'} props.sortConfig.direction - Sorting direction.
 *
 * @param {Array<Object>} props.sortedApplications - List of sorted job applications.
 * @param {number|string} props.sortedApplications[].job_application_id - Unique application identifier.
 * @param {string} props.sortedApplications[].name - Applicant's first name.
 * @param {string} props.sortedApplications[].surname - Applicant's surname.
 * @param {string} props.sortedApplications[].status - Application status key.
 *
 * @param {Function} props.requestSort - Triggered when a column header is clicked to change sorting.
 * @param {Function} props.getStatusClass - Returns CSS class name based on application status.
 * @param {Function} props.handleRowClick - Called when a table row is selected.
 *
 * @returns {JSX.Element} Rendered recruiter dashboard view with sortable applications table.
 */
function RecruiterDashboardView({
    t,
    loading,
    error,
    sortConfig,
    sortedApplications,
    requestSort,
    getStatusClass,
    handleRowClick
}) {
    return (
        <div className="recruiter-container">

            {/* Main content: applications table with sorting */}
            <main className="recruiter-main">
                <div className="recruiter-content">
                    <h2 className="recruiter-page-title">{t('recruiterDashboard.title')}</h2>
                    {loading && <div className="recruiter-loading">{t('recruiterDashboard.loading')}</div>}
                    {error && <div className="recruiter-error">{t(error)}</div>}
                    {!loading && !error && (
                        <div className="recruiter-table-container">
                            <table className="recruiter-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => requestSort('name')}>
                                            {t('recruiterDashboard.columns.name')} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('surname')}>
                                            {t('recruiterDashboard.columns.surname')} {sortConfig.key === 'surname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('job_application_id')}>
                                            {t('recruiterDashboard.columns.application_id')} {sortConfig.key === 'job_application_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('status')}>
                                            {t('recruiterDashboard.columns.status')} {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                                                <td><span className={`recruiter-status-badge ${getStatusClass(app.status)}`}>{t(`recruiterDashboard.status.${app.status}`)}</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="recruiter-no-data">{t('recruiterDashboard.no_data')}</td>
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

export default RecruiterDashboardView;