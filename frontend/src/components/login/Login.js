import React, { useState } from 'react';
import './Login.css';
import { useTranslation } from 'react-i18next';


function Login({ setCurrentUser, switchToRegister }) {
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">{t("login.title")}</h2>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="login-error-alert">
            <span className="login-error-icon">⚠️</span>
            {t(error)}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                setUsername(value);
              }}
              required
              minLength={3}
              maxLength={30}
              onInvalid={(e) => {
                const value = e.target.value;
                if (value.length === 0) {
                  e.target.setCustomValidity(t('login.errors.missing_field'));
                } else if(value.length < 3 || value.length > 30){
                  e.target.setCustomValidity(t('login.errors.invalid_username_length'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="login-input"
              placeholder={t('login.username_placeholder')}
            />
          </div>

          <div className="login-input-group">
            <div className="login-label-container">
              <label className="login-label">{t('login.password')}</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
              }}
              minLength={8}
              required
              onInvalid={(e) => {
                const value = e.target.value;
                if (value.length === 0){
                  e.target.setCustomValidity(t('login.errors.missing_field'));
                } else if (value.length < 8) {
                  e.target.setCustomValidity(t('login.errors.password_length'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="login-input"
              placeholder={t('login.password_placeholder')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'login-button-loading' : ''}`}
          >
            {loading ? (
              <span className="login-button-content">
                <span className="login-spinner"></span>
                {t('login.logging_in')}
              </span>
            ) : (
              <p>{t('login.sign_in')}</p>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            {t('login.no_account')}{' '}
            <button
              onClick={switchToRegister}
              className="login-link-button"
            >
              {t('login.sign_up')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;