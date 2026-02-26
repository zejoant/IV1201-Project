import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import './ApplicationForm.css';

/**
 * A form component that allows a logged‑in user to submit a job application.
 * The user can add multiple competences (with years of experience) and multiple
 * availability periods. The form fetches the list of available competences from
 * the backend and sends the final application to the server.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onApplicationComplete - Callback invoked after a successful submission
 * @param {Function} props.onBackToProfile - Callback to return to the profile view
 * @returns {JSX.Element} The rendered application form
 */
function ApplicationForm({ onApplicationComplete, onBackToProfile }) {
  //const { currentUser } = useContext(UserContext); 
  const { logout } = useContext(UserContext);
  const [competenceId, setCompetenceId] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [experienceList, setExperienceList] = useState([]);
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [availabilityList, setAvailabilityList] = useState([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for competences fetched from backend
  const [competenceOptions, setCompetenceOptions] = useState([]);
  const [loadingCompetences, setLoadingCompetences] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const {t} = useTranslation();

  // Fetch available competences on component mount
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        setLoadingCompetences(true);
        const res = await fetch('/application/list_competences', {
          credentials: 'include',
        });

        if (res.status === 403) {
          logout()
        } 

        const data = await res.json();
        
        if (!res.ok) {
          const err = new Error(`list_competences.errors.${data.error}` || 'applicationForm.errors.invalid_application');
          err.custom = true;
          throw err;
        }
        
        // The backend returns data wrapped in 'success' or directly as array
        setCompetenceOptions(data.success || data);
      } catch (err) {
        setFetchError(err.custom ? err.message  : 'applicationForm.errors.offline_application');
      } finally {
        setLoadingCompetences(false);
      }
    };
    fetchCompetences();
  }, [logout]);
  
  /**
   * Converts a date string in YYYY-MM-DD format to a Date object set to UTC midnight.
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {Date} UTC Date object representing midnight of the given date
   */
  const toUTCDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };
  
  /**
   * Returns today's date as a string in YYYY-MM-DD format, based on UTC.
   * @returns {string} Today's UTC date in YYYY-MM-DD
   */
  const getTodayUTCString = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  // Handle adding an experience to the list
  const handleAddExperience = () => {
    if(!competenceId) {
      setError('applicationForm.error.select_competence');
      return;
    }

    if(!yearsOfExperience) {
      setError('applicationForm.error.write_experience');
      return;
    }
    const years = Number(parseFloat(yearsOfExperience).toFixed(1));
    if(years === 0){
      setError('applicationForm.error.not_enough_experience');
      return;
    }
    if (isNaN(years) || years < 0) {
      setError('applicationForm.error.experience_positive');
      return;
    }
    
    if (years > 50) {
      setError('applicationForm.error.experience_max');
      return;
    }
    
    // Check if this competence is already in the list
    const isAlreadyAdded = experienceList.some(
      item => item.competence_id.toString() === competenceId
    );
    
    if (isAlreadyAdded) {
      setError('applicationForm.error.competence_exists');
      return;
    }
    
    // Find selected competence
    const selectedCompetence = competenceOptions.find(
      comp => comp.competence_id.toString() === competenceId
    );
    
    if (!selectedCompetence) {
      setError('applicationForm.error.invalid_competence');
      return;
    }
    
    // Add to experience list
    const newExperience = {
      competence_id: parseInt(competenceId),
      competence_name: selectedCompetence.name,
      yoe: years,
    };
    
    setExperienceList([...experienceList, newExperience]);
    setCompetenceId('');
    setYearsOfExperience('');
    setError('');
  };
  
  // Handle removing an experience from the list
  const handleRemoveExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };
  
  // Handle adding an availability period
  const handleAddAvailability = () => {
    if (!fromDate || !toDate) {
      setError('applicationForm.error.select_dates');
      return;
    }
    
    // Compare using UTC dates
    const fromUTC = toUTCDate(fromDate);
    const toUTC = toUTCDate(toDate);
    const todayUTC = toUTCDate(getTodayUTCString());
    
    if (fromUTC < todayUTC) {
      setError('applicationForm.error.start_past');
      return;
    }
    
    if (fromUTC > toUTC) {
      setError('applicationForm.error.start_after_end');
      return;
    }
    
    // Check if this period overlaps with existing periods (using UTC timestamps)
    const newFromTime = fromUTC.getTime();
    const newToTime = toUTC.getTime();
    
    const hasOverlap = availabilityList.some(period => {
      const existingFrom = toUTCDate(period.from_date).getTime();
      const existingTo = toUTCDate(period.to_date).getTime();
      return (newFromTime <= existingTo && newToTime >= existingFrom);
    });
    
    if (hasOverlap) {
      setError('applicationForm.error.overlapping_period');
      return;
    }
    
    // Add to availability list - store the raw YYYY-MM-DD strings
    const newAvailability = {
      from_date: fromDate,
      to_date: toDate,
    };
    
    setAvailabilityList([...availabilityList, newAvailability]);
    setFromDate('');
    setToDate('');
    setError('');
  };
  
  // Handle removing an availability period
  const handleRemoveAvailability = (index) => {
    setAvailabilityList(availabilityList.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (experienceList.length === 0) {
      setError('applicationForm.error.add_competence_required');
      return;
    }
    
    if (availabilityList.length === 0) {
      setError('applicationForm.error.add_availability_required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Format data for API according to backend requirements
      const expertise = experienceList.map(item => ({
        competence_id: item.competence_id,
        yoe: item.yoe, //TODO: THIS IS A STRING NOW NOT A FLOAT? ALSO FIX ERROR MESSAGE "COULD NOT ADD EXPERTISE" TO BE PRETTY WITH JSON FILES TRANSLATIONS
      }));
      
      const availability = availabilityList.map(item => ({
        from_date: item.from_date,
        to_date: item.to_date,
      }));
      
      console.log('Submitting application with data:', { expertise, availability });
      console.log('JSON stringified:', JSON.stringify({ expertise, availability }));
      
      // Submit application
      const res = await fetch('/application/apply', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expertise, availability }),
      });

      if (res.status === 403) {
        logout()
      } 
      
      const data = await res.json();
      
      if (!res.ok) {
        const err = new Error(`apply.errors.${data.error}` || 'applicationForm.errors.invalid_application');
        err.custom = true;
        throw err;
      }
      
      // Show success message
      setSuccess('submitted');
      
      // Reset form after successful submission
      setTimeout(() => {
        setExperienceList([]);
        setAvailabilityList([]);
        setCompetenceId('');
        setYearsOfExperience('');
        setFromDate('');
        setToDate('');
        
        // Notify parent component that application is complete
        if (onApplicationComplete) {
          onApplicationComplete();
        }
      }, 2000);
      
    } catch (err) {
      //console.error('Application submission error:', err);
      setError(err.custom ? err.message : 'applicationForm.errors.invalid_application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Formats a date string (YYYY-MM-DD) into a human‑readable long date,
   * using UTC to avoid timezone shifts.
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {string} Formatted date (e.g., "January 1, 2025")
   */
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    // Create date object at UTC midnight
    const date = new Date(Date.UTC(year, month - 1, day));
    // Use browser's default language but force UTC interpretation
    const userLanguage = localStorage.language || navigator.language;
    return date.toLocaleDateString(userLanguage, {timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'});
  };
  
  /**
   * Returns today's date as a string in YYYY-MM-DD format, based on the browser's local time.
   * This is used for the min attribute of date inputs.
   * @returns {string} Today's local date in YYYY-MM-DD
   */
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
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
                  <h4 className="application-summary-subtitle">{t('applicationForm.sections.competenceTitle')}:</h4>
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

export default ApplicationForm;