import '../cssFiles/applicationForm.css';

/**
 * ApplicationFormView Component
 *
 * Renders the job application form where users can add competencies,
 * specify years of experience, define availability periods, and submit
 * an application. This component is purely presentational and relies on
 * parent components for state management, validation, and business logic.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 *
 * @param {Function} props.t - Translation function used for internationalized text.
 *
 * @param {string} props.competenceId - Selected competence identifier.
 * @param {Function} props.setCompetenceId - Updates the selected competence.
 *
 * @param {string|number} props.yearsOfExperience - Years of experience for the selected competence.
 * @param {Function} props.setYearsOfExperience - Updates years of experience value.
 *
 * @param {Array<Object>} props.experienceList - List of added competences.
 * @param {string} props.experienceList[].competence_name - Name of the competence.
 * @param {number} props.experienceList[].yoe - Years of experience.
 *
 * @param {string} props.fromDate - Availability start date (ISO format).
 * @param {Function} props.setFromDate - Updates start date.
 *
 * @param {string} props.toDate - Availability end date (ISO format).
 * @param {Function} props.setToDate - Updates end date.
 *
 * @param {Array<Object>} props.availabilityList - List of availability periods.
 * @param {string} props.availabilityList[].from_date - Availability start date.
 * @param {string} props.availabilityList[].to_date - Availability end date.
 *
 * @param {string|null} props.error - Translation key for form error message.
 * @param {string|null} props.success - Success message key suffix.
 * @param {boolean} props.isSubmitting - Indicates whether the form submission is in progress.
 *
 * @param {Array<Object>} props.competenceOptions - Available competence options fetched from backend.
 * @param {number|string} props.competenceOptions[].competence_id - Competence identifier.
 * @param {string} props.competenceOptions[].name - Competence name key.
 *
 * @param {boolean} props.loadingCompetences - Indicates whether competences are loading.
 * @param {string|null} props.fetchError - Translation key for competence loading errors.
 *
 * @param {Function} props.handleAddExperience - Adds a competence entry to the list.
 * @param {Function} props.handleRemoveExperience - Removes a competence entry by index.
 *
 * @param {Function} props.handleAddAvailability - Adds an availability period.
 * @param {Function} props.handleRemoveAvailability - Removes an availability period by index.
 *
 * @param {Function} props.handleSubmit - Handles form submission.
 *
 * @param {Function} props.formatDateForDisplay - Formats ISO dates for UI display.
 * @param {Function} props.getTodayDate - Returns today's date formatted for input[type="date"] minimum value.
 *
 * @param {Function} props.onBackToProfile - Navigates back to the user profile page.
 *
 * @returns {JSX.Element} Rendered application form interface.
 */
function ApplicationFormView({
    t,
    competenceId,
    setCompetenceId,
    yearsOfExperience,
    setYearsOfExperience,
    experienceList,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    availabilityList,
    error,
    success,
    isSubmitting,
    competenceOptions,
    loadingCompetences,
    fetchError,
    handleAddExperience,
    handleRemoveExperience,
    handleAddAvailability,
    handleRemoveAvailability,
    handleSubmit,
    formatDateForDisplay,
    getTodayDate,
    onBackToProfile
}) {
    return (
        <div className="application-container">
            <div className="application-card">
                {/* Application Header with Back Button */}
                <div className="application-header-with-back">
                    <button
                        onClick={onBackToProfile}
                        className="application-back-button"
                    >
                        ← {t('applicationForm.back')}
                    </button>
                    <div className="application-header-content">
                        <h2 className="application-title">{t('applicationForm.title')}</h2>
                        <p className="application-subtitle">
                            {t('applicationForm.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="application-error-alert">
                        <span className="application-error-icon">⚠️</span>
                        {t(error)}
                    </div>
                )}

                {success && (
                    <div className="application-success-alert">
                        <span className="application-success-icon">✅</span>
                        {t(`applicationForm.success.${success}`)}
                    </div>
                )}

                {fetchError && (
                    <div className="application-error-alert">
                        <span className="application-error-icon">⚠️</span>
                        {t(fetchError)}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="application-form">
                    {/* Expertise Section */}
                    <div className="application-section">
                        <h3 className="application-section-title">
                            <span className="application-section-icon">🎯</span>
                            {t('applicationForm.sections.competence_title')}
                        </h3>
                        <p className="application-section-description">
                            {t('applicationForm.sections.competence_description')}
                        </p>

                        <div className="application-input-group-row">
                            <div className="application-input-group">
                                <label className="application-label">{t('applicationForm.labels.competence_area')}</label>
                                <select
                                    value={competenceId}
                                    onChange={(e) => setCompetenceId(e.target.value)}
                                    className="application-input"
                                    disabled={loadingCompetences}
                                >
                                    <option value="">
                                        {loadingCompetences ? t('applicationForm.placeholders.loading_competences') : t('applicationForm.placeholders.select_competence')}
                                    </option>
                                    {competenceOptions.map((comp) => (
                                        <option key={comp.competence_id} value={comp.competence_id}>
                                            {t(`applicationForm.competences.${comp.name}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="application-input-group">
                                <label className="application-label">{t('applicationForm.labels.years_experience')}</label>
                                <input
                                    type="number"
                                    value={yearsOfExperience}
                                    onChange={(e) => setYearsOfExperience(e.target.value)}
                                    min="0"
                                    max="50"
                                    step="0.5"
                                    className="application-input"
                                    placeholder={t('applicationForm.placeholders.experience_example')}
                                />
                                <small className="application-input-hint">{t('applicationForm.experience.decimal_hint')}</small>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddExperience}
                                className="application-add-button"
                                disabled={loadingCompetences}
                            >
                                {t('applicationForm.buttons.add_competence')}
                            </button>
                        </div>

                        {/* Experience List */}
                        {experienceList.length > 0 && (
                            <div className="application-list-container">
                                <h4 className="application-list-title">{t('applicationForm.lists.added_competences')}</h4>
                                <div className="application-list">
                                    {experienceList.map((item, index) => (
                                        <div key={index} className="application-list-item">
                                            <div className="application-list-item-content">
                                                <span className="application-list-item-name">{t(`applicationForm.competences.${item.competence_name}`)}</span>
                                                <span className="application-list-item-details">
                                                    {item.yoe} {item.yoe === 1.0 ? t('applicationForm.experience.year') : t('applicationForm.experience.years')} {t('applicationForm.experience.of_experience')}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExperience(index)}
                                                className="application-remove-button"
                                            >
                                                {t('applicationForm.buttons.remove')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Availability Section */}
                    <div className="application-section">
                        <h3 className="application-section-title">
                            <span className="application-section-icon">📅</span>
                            {t('applicationForm.lists.availability_periods')}
                        </h3>
                        <p className="application-section-description">
                            {t('applicationForm.sections.availability_description')}
                        </p>

                        <div className="application-input-group-row">
                            <div className="application-input-group">
                                <label className="application-label">{t('applicationForm.labels.from_date')}</label>
                                {/* TODO: TYPE:DATE IS SYSTEM DEPENDANT AND WILL OVERWRITE PLACEHOLDER,
                IF TRANSLATION IS WANTED HAVE TO CHANGE TO ANOTHER TYPE OR SOMETHING IDK */}
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="application-input"
                                    min={getTodayDate()}
                                />
                            </div>

                            <div className="application-input-group">
                                <label className="application-label">{t('applicationForm.labels.to_date')}</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="application-input"
                                    min={fromDate || getTodayDate()}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddAvailability}
                                className="application-add-button"
                            >
                                {t('applicationForm.buttons.add_period')}
                            </button>
                        </div>

                        {/* Availability List */}
                        {availabilityList.length > 0 && (
                            <div className="application-list-container">
                                <h4 className="application-list-title">{t('applicationForm.lists.added_availability')}</h4>
                                <div className="application-list">
                                    {availabilityList.map((item, index) => (
                                        <div key={index} className="application-list-item">
                                            <div className="application-list-item-content">
                                                <span className="application-list-item-name">
                                                    {formatDateForDisplay(item.from_date)} {t('applicationForm.to')} {formatDateForDisplay(item.to_date)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAvailability(index)}
                                                className="application-remove-button"
                                            >
                                                {t('applicationForm.buttons.remove')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    {(experienceList.length > 0 || availabilityList.length > 0) && (
                        <div className="application-summary">
                            <h3 className="application-summary-title">{t('applicationForm.sections.summary_title')}</h3>

                            {experienceList.length > 0 && (
                                <div className="application-summary-section">
                                    <h4 className="application-summary-subtitle">{t('applicationForm.sections.competence_title')}:</h4>
                                    <ul className="application-summary-list">
                                        {experienceList.map((item, index) => (
                                            <li key={index} className="application-summary-item">
                                                {t(`applicationForm.competences.${item.competence_name}`)} ({item.yoe} {item.yoe === 1.0 ? t('applicationForm.experience.year') : t('applicationForm.experience.years')})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {availabilityList.length > 0 && (
                                <div className="application-summary-section">
                                    <h4 className="application-summary-subtitle">{t('applicationForm.sections.availability_title')}:</h4>
                                    <ul className="application-summary-list">
                                        {availabilityList.map((item, index) => (
                                            <li key={index} className="application-summary-item">
                                                {formatDateForDisplay(item.from_date)} {t('applicationForm.to')} {formatDateForDisplay(item.to_date)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="application-action-buttons">
                        <button
                            type="submit"
                            disabled={isSubmitting || experienceList.length === 0 || availabilityList.length === 0 || loadingCompetences}
                            className={`application-submit-button ${isSubmitting ? 'application-submit-button-loading' : ''}`}
                        >
                            {isSubmitting ? (
                                <span className="application-button-content">
                                    <span className="application-spinner"></span>
                                    {t('applicationForm.buttons.submitting')}
                                </span>
                            ) : (
                                <p>{t('applicationForm.buttons.submit')}</p>
                            )}
                        </button>
                    </div>

                    <p className="application-note">
                        {t('applicationForm.note')}
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ApplicationFormView;