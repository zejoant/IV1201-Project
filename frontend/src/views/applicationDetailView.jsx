import React from 'react';
import '../cssFiles/applicationDetail.css';

/**
 * ApplicationDetailView Component
 *
 * Displays detailed information for a selected job application within
 * the recruiter interface. The view presents applicant personal data,
 * competencies with years of experience, availability periods, and
 * allows recruiters to update the application's status.
 *
 * This is a presentational component that relies on parent components
 * for data fetching, navigation, formatting, and status update logic.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 *
 * @param {Function} props.t - Translation function used for internationalized text.
 *
 * @param {boolean} props.loading - Indicates whether application details are being loaded.
 * @param {Object|null} props.application - Application data object.
 * @param {string} props.application.name - Applicant's first name.
 * @param {string} props.application.surname - Applicant's surname.
 * @param {string} props.application.status - Current application status.
 * @param {Array<Object>} [props.application.competences] - Applicant competences.
 * @param {string} props.application.competences[].name - Competence name key.
 * @param {number|string} props.application.competences[].yoe - Years of experience.
 * @param {Array<Object>} [props.application.availabilities] - Availability periods.
 * @param {string} props.application.availabilities[].from_date - Availability start date.
 * @param {string} props.application.availabilities[].to_date - Availability end date.
 *
 * @param {string|null} props.detailError - Error message related to loading or updating details.
 * @param {boolean} props.updating - Indicates whether application status is being updated.
 *
 * @param {Function} props.navigate - Navigation function used to change routes.
 * @param {Function} props.handleStatusChange - Updates application status
 *        (e.g., "accepted", "rejected", or "unhandled").
 *
 * @param {Function} props.formatDate - Formats date values for display.
 * @param {Function} props.getStatusClass - Returns CSS class name based on status.
 *
 * @returns {JSX.Element} Rendered application detail view.
 */
function ApplicationDetailView({
    t,
    loading,
    application,
    detailError,
    updating,
    navigate,
    handleStatusChange,
    formatDate,
    getStatusClass
}) {
    if (loading) return <div className="recruiter-detail-loading">{t('applicationDetail.loading')}</div>;
    if (!application) return <div className="recruiter-detail-error">{t('applicationDetail.application_not_found')}</div>;

    return (
        <div className="recruiter-detail-container">

            <main className="recruiter-detail-main">
                <div className="recruiter-detail-content">
                    <button className="recruiter-detail-back-button" onClick={() => navigate('/recruiter')}>
                        {t('applicationDetail.back_to_applications')}
                    </button>

                    <div className="recruiter-detail-card">
                        <div className="recruiter-detail-header">
                            <h2>{t('applicationDetail.title')}</h2>
                            <div className={`recruiter-detail-status-badge ${getStatusClass(application.status)}`}>
                                {t(`applicationDetail.status.${application.status}`)}
                            </div>
                        </div>

                        <section className="recruiter-detail-section">
                            <h3>{t('applicationDetail.personal_info')}</h3>
                            <div className="recruiter-detail-info-grid">
                                <div className="recruiter-detail-info-item">
                                    <span className="recruiter-detail-info-label">{t('applicationDetail.name')}</span>
                                    <span className="recruiter-detail-info-value">
                                        {application.name}
                                    </span>
                                </div>
                                <div className="recruiter-detail-info-item">
                                    <span className="recruiter-detail-info-label">{t('applicationDetail.surname')}</span>
                                    <span className="recruiter-detail-info-value">
                                        {application.surname}
                                    </span>
                                </div>
                                {/*<div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">{t('applicationDetail.email')}</span>
                  <span className="recruiter-detail-info-value">{application.email || t('applicationDetail.not_available')}</span>
                </div>
                <div className="recruiter-detail-info-item">
                  <span className="recruiter-detail-info-label">{t('applicationDetail.pnr')}</span>
                  <span className="recruiter-detail-info-value">
                    {application.pnr || application.person_number || application.ssn || t('applicationDetail.not_available')}
                  </span>
                </div>*/}
                            </div>
                        </section>

                        <section className="recruiter-detail-section">
                            <h3>{t('applicationDetail.aoe')}</h3>
                            {application.competences && Array.isArray(application.competences) && application.competences.length > 0 ? (
                                <ul className="recruiter-detail-list">
                                    {application.competences.map((exp, index) => {
                                        if (!exp) return null;
                                        const name = exp.name || t('applicationDetail.unknown');
                                        const yoe = exp.yoe ? parseFloat(exp.yoe) : 0;
                                        return (
                                            <li key={index} className="recruiter-detail-list-item">
                                                {t(`applicationDetail.competences.${name}`)} - {yoe} {yoe === 1 ? t('applicationDetail.year') : t('applicationDetail.years')}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>{detailError ? t('applicationDetail.fullDetailsUnavailable') : t('applicationDetail.no_expertise')}</p>
                            )}
                        </section>

                        <section className="recruiter-detail-section">
                            <h3>{t('applicationDetail.availability_periods')}</h3>
                            {application.availabilities && Array.isArray(application.availabilities) && application.availabilities.length > 0 ? (
                                <ul className="recruiter-detail-list">
                                    {application.availabilities.map((period, index) => {
                                        if (!period) return null;
                                        const from = period.from_date ? formatDate(period.from_date) : t('applicationDetail.not_available');
                                        const to = period.to_date ? formatDate(period.to_date) : t('applicationDetail.not_available');
                                        return (
                                            <li key={index} className="recruiter-detail-list-item">
                                                {from} {t('applicationDetail.to')} {to}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>{detailError ? t('applicationDetail.full_details_unavailable') : t('applicationDetail.noAvailability')}</p>
                            )}
                        </section>

                        <section className="recruiter-detail-actions">
                            <h3>{t('applicationDetail.change_status')}</h3>
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
                                    {t('applicationDetail.mark_unhandled')}
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

export default ApplicationDetailView;