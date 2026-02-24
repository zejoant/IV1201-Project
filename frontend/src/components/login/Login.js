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
        const err = new Error(`errors.${data.error}` || 'errors.invalid_credentials');
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
        const err = new Error(`errors.${profileData.error}` || 'errors.invalid_fetch');
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
      setError(err.custom ? err.message : 'errors.offline_login');
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
            {t(`login.${error}`)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">{t('login.username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                setUsername(value);

                if (!/^[A-Za-z0-9]+$/.test(value)) {
                  e.target.setCustomValidity(t('login.usernameValidation'));
                } else if(value.length < 3 || value.length > 30){
                  e.target.setCustomValidity(t('login.usernameLength'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              required
              className="login-input"
              placeholder={t('login.usernamePlaceholder')}
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

                if (value.length < 8) {
                  e.target.setCustomValidity(t('login.passwordLength'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              required
              className="login-input"
              placeholder={t('login.passwordPlaceholder')}
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
                {t('login.loggingIn')}
              </span>
            ) : (
              <p>{t('login.signIn')}</p>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            {t('login.noAccount')}{' '}
            <button
              onClick={switchToRegister}
              className="login-link-button"
            >
              {t('login.signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;