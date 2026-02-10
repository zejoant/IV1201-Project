import React, { useState } from 'react';
import './ApplicationForm.css';

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
  
  // competence options 
  const competenceOptions = [
    { competence_id: 1, name: 'Ticket Sales' },
    { competence_id: 2, name: 'Lotteries'},
    { competence_id: 3, name: 'Roller Coaster Operation' },
  ];
  
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
    
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (from < today) {
      setError('Start date cannot be in the past');
      return;
    }
    
    if (from > to) {
      setError('Start date cannot be after end date');
      return;
    }
    
    // Check if this period overlaps with existing periods
    const newFrom = from.getTime();
    const newTo = to.getTime();
    
    const hasOverlap = availabilityList.some(period => {
      const existingFrom = new Date(period.from_date).getTime();
      const existingTo = new Date(period.to_date).getTime();
      return (newFrom <= existingTo && newTo >= existingFrom);
    });
    
    if (hasOverlap) {
      setError('This availability period overlaps with an existing period');
      return;
    }
    
    // Add to availability list - format dates as YYYY-MM-DD
    const newAvailability = {
      from_date: formatDateForBackend(fromDate),
      to_date: formatDateForBackend(toDate),
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
        throw new Error(data.message || data.errors?.[0]?.msg || 'Failed to submit application');
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
      setError(err.message || 'An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date for display using browser's system language
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    // Use browser's default language or fallback to 'en-US'
    const userLanguage = navigator.language || 'en-US';
    return date.toLocaleDateString(userLanguage, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format date for backend (YYYY-MM-DD)
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get today's date in YYYY-MM-DD format for date input
  const getTodayDate = () => {
    const today = new Date();
    return formatDateForBackend(today);
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
                >
                  <option value="">Select a competence area</option>
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
              disabled={isSubmitting || experienceList.length === 0 || availabilityList.length === 0}
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