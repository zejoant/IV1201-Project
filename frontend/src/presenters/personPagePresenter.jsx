import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useTranslation } from 'react-i18next';
import PersonPageView from '../views/personPageView';

/**
 * PersonPage component – the main dashboard for applicant users.
 * Displays personal information and provides quick actions to apply
 * for a position or view existing applications.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onApplyNow - Callback to navigate to the application form
 * @param {Function} props.onViewMyApplications - Callback to navigate to the user's applications list
 * @returns {JSX.Element} The rendered applicant dashboard
 */
function PersonPagePresenter({ onApplyNow, onViewMyApplications }) {
  const { currentUser } = useContext(UserContext);
  const {t} = useTranslation();
  
  return (
    <PersonPageView
      currentUser={currentUser}
      t={t}
      onApplyNow={onApplyNow}
      onViewMyApplications={onViewMyApplications}
    />
  );
}

export default PersonPagePresenter;