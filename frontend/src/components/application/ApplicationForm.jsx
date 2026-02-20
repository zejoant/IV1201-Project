import React, { useState, useEffect } from 'react';
import './ApplicationForm.css';

/**
 * A form component that allows a logged‑in user to submit a job application.
 * The user can add multiple competences (with years of experience) and multiple
 * availability periods. The form fetches the list of available competences from
 * the backend and sends the final application to the server.
 *
 * @component
 * @param {Object} props - Component props
 * @param {any} props.currentUser - The currently logged‑in user object (not directly used in the form)
 * @param {Function} props.onApplicationComplete - Callback invoked after a successful submission
 * @param {Function} props.onBackToProfile - Callback to return to the profile view
 * @returns {JSX.Element} The rendered application form
 */
function ApplicationForm({ currentUser, onApplicationComplete, onBackToProfile }) {
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

  // Fetch available competences on component mount
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        setLoadingCompetences(true);
        const res = await fetch('/application/list_competences', {
          credentials: 'include',
        });
        const data = await res.json();
        
        if (!res.ok) {
          const err = new Error(data.error || 'Failed to load competences');
          err.custom = true;
          throw err;
        }
        
        // The backend returns data wrapped in 'success' or directly as array
        setCompetenceOptions(data.success || data);
      } catch (err) {
        setFetchError(err.custom ? err.message : 'An error occurred while loading competences');
      } finally {
        setLoadingCompetences(false);
      }
    };
    fetchCompetences();
  }, []);
  
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
    if (!competenceId || !yearsOfExperience) {
      setError('Please select a competence and enter years of experience');
      return;
    }
    
    const years = parseFloat(yearsOfExperience);
    if (isNaN(years) || years <= 0) {
      setError('Years of experience must be a positive number');
      return;
    }
    
    if (years > 50) {
      setError('Years of experience cannot exceed 50');
      return;
    }
    
    // Check if this competence is already in the list
    const isAlreadyAdded = experienceList.some(
      item => item.competence_id.toString() === competenceId
    );
    
    if (isAlreadyAdded) {
      setError('This competence has already been added to your profile');
      return;
    }
    
    // Find selected competence
    const selectedCompetence = competenceOptions.find(
      comp => comp.competence_id.toString() === competenceId
    );
    
    if (!selectedCompetence) {
      setError('Please select a valid competence');
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
      setError('Please select both start and end dates');
      return;
    }
    
    // Compare using UTC dates
    const fromUTC = toUTCDate(fromDate);
    const toUTC = toUTCDate(toDate);
    const todayUTC = toUTCDate(getTodayUTCString());
    
    if (fromUTC < todayUTC) {
      setError('Start date cannot be in the past');
      return;
    }
    
    if (fromUTC > toUTC) {
      setError('Start date cannot be after end date');
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
      setError('This availability period overlaps with an existing period');
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
      setError('Please add at least one competence');
      return;
    }
    
    if (availabilityList.length === 0) {
      setError('Please add at least one availability period');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Format data for API according to backend requirements
      const expertise = experienceList.map(item => ({
        competence_id: item.competence_id,
        yoe: item.yoe,
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
      
      const data = await res.json();
      
      if (!res.ok) {
        const err = new Error(data.error || 'Failed to submit application');
        err.custom = true;
        throw err;
      }
      
      // Show success message
      setSuccess('Application submitted successfully!');
      
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
      console.error('Application submission error:', err);
      setError(err.custom ? err.message : 'An error occurred while submitting your application');
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
    const userLanguage = navigator.language || 'en-US';
    return date.toLocaleDateString(userLanguage, {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            ← Back 
          </button>
          <div className="application-header-content">
            <h2 className="application-title">Apply for a Position</h2>
            <p className="application-subtitle">
              Complete your application by adding your expertise and availability
            </p>
          </div>
        </div>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="application-error-alert">
            <span className="application-error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="application-success-alert">
            <span className="application-success-icon">✅</span>
            {success}
          </div>
        )}
        
        {fetchError && (
          <div className="application-error-alert">
            <span className="application-error-icon">⚠️</span>
            {fetchError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="application-form">
          {/* Expertise Section */}
          <div className="application-section">
            <h3 className="application-section-title">
              <span className="application-section-icon">🎯</span>
              Competence Areas
            </h3>
            <p className="application-section-description">
              Select your competence areas and years of experience in each area
            </p>
            
            <div className="application-input-group-row">
              <div className="application-input-group">
                <label className="application-label">Competence Area</label>
                <select
                  value={competenceId}
                  onChange={(e) => setCompetenceId(e.target.value)}
                  className="application-input"
                  disabled={loadingCompetences}
                >
                  <option value="">
                    {loadingCompetences ? 'Loading competences...' : 'Select a competence area'}
                  </option>
                  {competenceOptions.map((comp) => (
                    <option key={comp.competence_id} value={comp.competence_id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="application-input-group">
                <label className="application-label">Years of Experience</label>
                <input
                  type="number"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  min="0"
                  max="50"
                  step="0.5"
                  className="application-input"
                  placeholder="e.g., 3.5"
                />
                <small className="application-input-hint">Can include one decimal</small>
              </div>
              
              <button
                type="button"
                onClick={handleAddExperience}
                className="application-add-button"
                disabled={loadingCompetences}
              >
                Add Competence
              </button>
            </div>
            
            {/* Experience List */}
            {experienceList.length > 0 && (
              <div className="application-list-container">
                <h4 className="application-list-title">Added Competence Areas</h4>
                <div className="application-list">
                  {experienceList.map((item, index) => (
                    <div key={index} className="application-list-item">
                      <div className="application-list-item-content">
                        <span className="application-list-item-name">{item.competence_name}</span>
                        <span className="application-list-item-details">
                          {item.yoe} {item.yoe === 1 ? 'year' : 'years'} of experience
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="application-remove-button"
                      >
                        Remove
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
              Availability Periods
            </h3>
            <p className="application-section-description">
              Add periods when you are available to work
            </p>
            
            <div className="application-input-group-row">
              <div className="application-input-group">
                <label className="application-label">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="application-input"
                  min={getTodayDate()}
                />
              </div>
              
              <div className="application-input-group">
                <label className="application-label">To Date</label>
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
                Add Period
              </button>
            </div>
            
            {/* Availability List */}
            {availabilityList.length > 0 && (
              <div className="application-list-container">
                <h4 className="application-list-title">Added Availability Periods</h4>
                <div className="application-list">
                  {availabilityList.map((item, index) => (
                    <div key={index} className="application-list-item">
                      <div className="application-list-item-content">
                        <span className="application-list-item-name">
                          {formatDateForDisplay(item.from_date)} to {formatDateForDisplay(item.to_date)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailability(index)}
                        className="application-remove-button"
                      >
                        Remove
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
              <h3 className="application-summary-title">Application Summary</h3>
              
              {experienceList.length > 0 && (
                <div className="application-summary-section">
                  <h4 className="application-summary-subtitle">Competence Areas:</h4>
                  <ul className="application-summary-list">
                    {experienceList.map((item, index) => (
                      <li key={index} className="application-summary-item">
                        {item.competence_name} ({item.yoe} {item.yoe === 1 ? 'year' : 'years'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {availabilityList.length > 0 && (
                <div className="application-summary-section">
                  <h4 className="application-summary-subtitle">Availability Periods:</h4>
                  <ul className="application-summary-list">
                    {availabilityList.map((item, index) => (
                      <li key={index} className="application-summary-item">
                        {formatDateForDisplay(item.from_date)} to {formatDateForDisplay(item.to_date)}
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
                  Submitting Application...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
          
          <p className="application-note">
            Note: You can submit multiple applications. Each new application will replace your previous one.
          </p>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;