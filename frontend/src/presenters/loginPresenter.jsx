import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoginView from '../views/loginView';

function LoginPresenter({ setCurrentUser, switchToRegister }) {
  const {t} = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission.
   * @param {Event} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;

    if (!form.checkValidity()) {
      form.reportValidity(); // Shows your custom messages
      setLoading(false);
      return;
    }

    try {
      // Step 1: Sign in to get session
      const res = await fetch('/account/sign_in', {
        method: 'POST',
        credentials: 'include', // Important for cookie-based sessions
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password}),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const err = new Error(`sign_in.errors.${data.error}` || 'login.errors.invalid_credentials');
        err.custom = true;
        throw err;
      }


      // Step 2: Fetch the full user profile (including role)
      const profileRes = await fetch('/account/id', {
        method: 'GET',
        credentials: 'include',
      });

      const profileData = await profileRes.json();

      
      if (!profileRes.ok) {
        const err = new Error(`id.errors.${profileData.error}` || 'login.errors.invalid_fetch');
        err.custom = true;
        throw err;
      }

      // Assume profileData.success contains user object with fields:
      // person_id, username, name, surname, email, role, etc.
      const user = profileData.success;

      // Save user to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
    } catch (err) {
      setError(err.custom ? err.message : 'login.errors.offline_login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      t={t}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      handleSubmit={handleSubmit}
      switchToRegister={switchToRegister}
    />
  );
}

export default LoginPresenter;