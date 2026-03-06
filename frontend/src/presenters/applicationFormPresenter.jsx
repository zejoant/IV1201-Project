import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';
import ApplicationFormView from '../views/applicationFormView';

/**
 * Presenter component for the job application form.
 *
 * Handles form state, validation, API communication, and business logic.
 * Delegates rendering to ApplicationFormView.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onApplicationComplete - Called after successful submission
 * @param {Function} props.onBackToProfile - Navigates back to profile view
 * @returns {JSX.Element} Application form presenter component
 */
function ApplicationFormPresenter({ onApplicationComplete, onBackToProfile }) {
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

    const [competenceOptions, setCompetenceOptions] = useState([]);
    const [loadingCompetences, setLoadingCompetences] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const { t } = useTranslation();

    /**
     * Fetches available competences from the backend when the component mounts.
     *
     * - Sends authenticated request
     * - Handles authorization errors
     * - Stores received competences in state
     * - Handles offline and server errors
     */
    useEffect(() => {
        const fetchCompetences = async () => {
            try {
                setLoadingCompetences(true);

                const res = await fetch('/application/list_competences', {
                    credentials: 'include',
                });

                if (res.status === 403) {
                    logout();
                }

                const data = await res.json();

                if (!res.ok) {
                    const err = new Error(
                        `list_competences.errors.${data.error}` ||
                        'applicationForm.errors.invalid_application'
                    );
                    err.custom = true;
                    throw err;
                }

                setCompetenceOptions(data.success || data);

            } catch (err) {
                setFetchError(
                    err.custom
                        ? err.message
                        : 'applicationForm.errors.offline_application'
                );
            } finally {
                setLoadingCompetences(false);
            }
        };

        fetchCompetences();
    }, [logout]);

    /**
     * Converts a YYYY-MM-DD string into a UTC Date object.
     *
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {Date} Date object set to UTC midnight
     */
    const toUTCDate = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };

    /**
     * Returns today's date as a UTC-based YYYY-MM-DD string.
     *
     * @returns {string} Current date in YYYY-MM-DD format
     */
    const getTodayUTCString = () => {
        return new Date().toISOString().split('T')[0];
    };

    /**
     * Adds a competence experience entry to the list.
     *
     * Performs validation:
     * - Competence selected
     * - Experience entered
     * - Value is positive and <= 50
     * - No duplicate competences
     *
     * Updates experienceList state if valid.
     */
    const handleAddExperience = () => {
        if (!competenceId) {
            setError('applicationForm.errors.select_competence');
            return;
        }

        if (!yearsOfExperience) {
            setError('applicationForm.errors.write_experience');
            return;
        }

        const years = Number(parseFloat(yearsOfExperience).toFixed(1));

        if (years === 0) {
            setError('applicationForm.errors.not_enough_experience');
            return;
        }

        if (isNaN(years) || years < 0) {
            setError('applicationForm.errors.experience_positive');
            return;
        }

        if (years > 50) {
            setError('applicationForm.errors.experience_max');
            return;
        }

        const isAlreadyAdded = experienceList.some(
            item => item.competence_id.toString() === competenceId
        );

        if (isAlreadyAdded) {
            setError('applicationForm.errors.competence_exists');
            return;
        }

        const selectedCompetence = competenceOptions.find(
            comp => comp.competence_id.toString() === competenceId
        );

        if (!selectedCompetence) {
            setError('applicationForm.errors.invalid_competence');
            return;
        }

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

    /**
     * Removes an experience entry by index.
     *
     * @param {number} index - Index of the experience to remove
     */
    const handleRemoveExperience = (index) => {
        setExperienceList(experienceList.filter((_, i) => i !== index));
    };

    /**
     * Adds a new availability period.
     *
     * Validates:
     * - Both dates selected
     * - Start date is not in the past
     * - Start date <= end date
     * - No overlapping periods
     */
    const handleAddAvailability = () => {
        if (!fromDate || !toDate) {
            setError('applicationForm.errors.select_dates');
            return;
        }

        const fromUTC = toUTCDate(fromDate);
        const toUTC = toUTCDate(toDate);
        const todayUTC = toUTCDate(getTodayUTCString());

        if (fromUTC < todayUTC) {
            setError('applicationForm.errors.start_past');
            return;
        }

        if (fromUTC > toUTC) {
            setError('applicationForm.errors.start_after_end');
            return;
        }

        const newFromTime = fromUTC.getTime();
        const newToTime = toUTC.getTime();

        const hasOverlap = availabilityList.some(period => {
            const existingFrom = toUTCDate(period.from_date).getTime();
            const existingTo = toUTCDate(period.to_date).getTime();

            return newFromTime <= existingTo && newToTime >= existingFrom;
        });

        if (hasOverlap) {
            setError('applicationForm.errors.overlapping_period');
            return;
        }

        const newAvailability = {
            from_date: fromDate,
            to_date: toDate,
        };

        setAvailabilityList([...availabilityList, newAvailability]);
        setFromDate('');
        setToDate('');
        setError('');
    };

    /**
     * Removes an availability period by index.
     *
     * @param {number} index - Index of the availability period
     */
    const handleRemoveAvailability = (index) => {
        setAvailabilityList(availabilityList.filter((_, i) => i !== index));
    };

    /**
     * Submits the application form to the backend.
     *
     * - Validates that competences and availability exist
     * - Sends POST request
     * - Handles authentication
     * - Displays success or error feedback
     * - Resets form after successful submission
     *
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (experienceList.length === 0) {
            setError('applicationForm.errors.add_competence_required');
            return;
        }

        if (availabilityList.length === 0) {
            setError('applicationForm.errors.add_availability_required');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const expertise = experienceList.map(item => ({
                competence_id: item.competence_id,
                yoe: item.yoe,
            }));

            const availability = availabilityList.map(item => ({
                from_date: item.from_date,
                to_date: item.to_date,
            }));

            const res = await fetch('/application/apply', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expertise, availability }),
            });

            if (res.status === 403) {
                logout();
            }

            const data = await res.json();

            if (!res.ok) {
                const err = new Error(
                    `apply.errors.${data.error}` ||
                    'applicationForm.errors.invalid_application'
                );
                err.custom = true;
                throw err;
            }

            setSuccess('submitted');

            setTimeout(() => {
                setExperienceList([]);
                setAvailabilityList([]);
                setCompetenceId('');
                setYearsOfExperience('');
                setFromDate('');
                setToDate('');

                if (onApplicationComplete) {
                    onApplicationComplete();
                }
            }, 2000);

        } catch (err) {
            setError(
                err.custom
                    ? err.message
                    : 'applicationForm.errors.invalid_application'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Formats a YYYY-MM-DD date string for localized display.
     *
     * Uses user's language preferences and UTC timezone.
     *
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {string} Localized formatted date
     */
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';

        const [year, month, day] = dateString.split('-');
        const date = new Date(Date.UTC(year, month - 1, day));

        const userLanguage =
            localStorage.language || navigator.language;

        return date.toLocaleDateString(userLanguage, {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    /**
     * Returns today's local date in YYYY-MM-DD format.
     *
     * Used for setting min values in date inputs.
     *
     * @returns {string} Today's date string
     */
    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    return (
        <ApplicationFormView
            t={t}
            competenceId={competenceId}
            setCompetenceId={setCompetenceId}
            yearsOfExperience={yearsOfExperience}
            setYearsOfExperience={setYearsOfExperience}
            experienceList={experienceList}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            availabilityList={availabilityList}
            error={error}
            success={success}
            isSubmitting={isSubmitting}
            competenceOptions={competenceOptions}
            loadingCompetences={loadingCompetences}
            fetchError={fetchError}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
            handleAddAvailability={handleAddAvailability}
            handleRemoveAvailability={handleRemoveAvailability}
            handleSubmit={handleSubmit}
            formatDateForDisplay={formatDateForDisplay}
            getTodayDate={getTodayDate}
            onBackToProfile={onBackToProfile}
        />
    );
}

export default ApplicationFormPresenter;