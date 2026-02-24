import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Register.css";

/**
 * Registration form component allowing new users to create an account.
 * Handles input validation, password strength indication, and auto‑login upon success.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.setCurrentUser - Callback to set the authenticated user after registration/login
 * @param {Function} props.switchToLogin - Callback to switch the view to the login form
 * @returns {JSX.Element} The rendered registration form
 */
function Register({ setCurrentUser, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [pnr, setPersonNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // new state for success
  const [passwordStrength, setPasswordStrength] = useState(0);
  const {t, i18n} = useTranslation();

  /**
   * Updates the password state and recalculates its strength.
   * Strength is based on length, uppercase, digit, and special character presence.
   *
   * @param {Object} e - Input change event
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Simple password strength check
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  /**
   * Handles form submission: sends registration data to the server.
   * On success, automatically logs the user in and updates the application state.
   *
   * @param {Object} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;

    if (!form.checkValidity()) {
      form.reportValidity(); // Shows your custom messages
      setLoading(false);
      return;
    }

    try {
      // Step 1: Register the user
      const res = await fetch("/account/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          name,
          surname,
          email,
          pnr
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const err = new Error(`sign_up.errors.${data.error}` || 'register.errors.invalid_account_creation');
        err.custom = true;
        throw err;
      }

      //show success and switch to login
      setSuccess(true);

      // Optional: Wait 2 seconds before redirecting to login
      setTimeout(() => {
        switchToLogin();
      }, 2000);
      
      /*// Step 2: Auto-login after successful registration
      const loginRes = await fetch("/account/sign_in", {
        method: "POST",
        credentials: 'include', // Important for cookie-based sessions
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        const err = new Error(loginData.error || "Login failed after registration");
        err.custom = true;
        throw err;
      }

      localStorage.setItem("currentUser", JSON.stringify(loginData));
      setCurrentUser(loginData);*/
    } catch (err) {
      setError(err.custom ? err.message : 'register.errors.offline_login');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Returns a color code based on password strength.
   *
   * @param {number} strength - Strength value from 0 to 4
   * @returns {string} Hex color code
   */
  const getStrengthColor = (strength) => {
    if (strength === 0) return "#e2e8f0";
    if (strength <= 2) return "#ef4444";
    if (strength === 3) return "#f59e0b";
    return "#10b981";
  };

  /**
   * Returns a descriptive text label for the current password strength.
   *
   * @param {number} strength - Strength value from 0 to 4
   * @returns {string} Text label (empty, "Weak", "Good", or "Strong")
   */
  const getStrengthText = (strength) => {
    if (strength === 0) return "";
    if (strength <= 2) return t('register.password_strength.weak');
    if (strength === 3) return t('register.password_strength.good');
    return t('register.password_strength.strong');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon-container">
            <span className="register-icon">📝</span>
          </div>
          <h2 className="register-title">{t('register.title')}</h2>
          <p className="register-subtitle">{t('register.subtitle')}</p>
        </div>
        
        {error && (
          <div className="register-error-alert">
            <span className="register-error-icon">⚠️</span>
            {t(error)}
          </div>
        )}
        
        <form noValidate onSubmit={handleSubmit} className="register-form">
          <div className="register-form-row">
            <div className="register-input-group">
              <label className="register-label">
                {t('register.labels.first_name')} <span className="register-required">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {setName(e.target.value.replace(/[^A-Za-z ]/g, "")); e.target.setCustomValidity(t(''));}}
                required
                onInvalid={(e) => {
                  const value = e.target.value;
                  if (value.length === 0){
                    e.target.setCustomValidity(t('register.errors.missing_field'));
                  }
                  else {
                    e.target.setCustomValidity("");
                  }
                }}
                className="register-input"
                placeholder={t('register.placeholders.first_name')}
              />
            </div>
            
            <div className="register-input-group">
              <label className="register-label">
                {t('register.labels.last_name')} <span className="register-required">*</span>
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => {setSurname(e.target.value.replace(/[^A-Za-z ]/g, "")); e.target.setCustomValidity(t(''));}}
                required
                onInvalid={(e) => {
                  const value = e.target.value;
                  if (value.length === 0){
                    e.target.setCustomValidity(t('register.errors.missing_field'));
                  }
                  else {
                    e.target.setCustomValidity("");
                  }
                }}
                className="register-input"
                placeholder={t('register.placeholders.last_name')}
              />
            </div>
          </div>
          
          <div className="register-input-group">
            <label className="register-label">
              {t('register.labels.email')} <span className="register-required">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value); e.target.setCustomValidity(t(''));}}
              required
              onInvalid={(e) => {
                const value = e.target.value;
                if (value.length === 0){
                  e.target.setCustomValidity(t('register.errors.missing_field'));
                }
                else {
                  e.target.setCustomValidity(t('register.errors.invalid_email'));
                }
              }}
              className="register-input"
              placeholder={t('register.placeholders.email')}
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">
             {t('register.labels.pnr')} <span className="register-required">*</span>
         </label>
          <input
            type="text"
            value={pnr}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPersonNumber(value);
            }}
            pattern="\d{12}"
            required
            onInvalid={(e) => {
              const value = e.target.value;
              if (value.length === 0){
                e.target.setCustomValidity(t('register.errors.missing_field'));
              } else if (value.length !== 12) {
                e.target.setCustomValidity(
                  t("register.errors.pnr_length")
                );
              } else {
                e.target.setCustomValidity("");
              }
            }}
            className="register-input"
            placeholder={t('register.placeholders.pnr')}
          />
          </div>
          <div className="register-input-group">
            <label className="register-label">
              {t('register.labels.username')} <span className="register-required">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                setUsername(value);
              }}
              required
              maxLength={30}
              minLength={3}
              onInvalid={(e) => {
                const value = e.target.value;
                if (value.length === 0){
                  e.target.setCustomValidity(t('register.errors.missing_field'));
                } else if(value.length < 3 || value.length > 30){
                  e.target.setCustomValidity(t('register.errors.username_length'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="register-input"
              placeholder={t('register.placeholders.username')}
            />
          </div>
          
          <div className="register-input-group">
            <div className="register-label-container">
              <label className="register-label">
                {t('register.labels.password')} <span className="register-required">*</span>
              </label>
              <div className="register-strength-indicator">
                <span className="register-strength-text">
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            </div>
            <input type="text" name="fake-username" autoComplete="username" style={{ display: "none" }}/> {/*decoy field to prevent firefox detecting login*/}
            <input
              type="password"
              value={password}
              onChange={(e) => {
                handlePasswordChange(e);
              }}
              minLength={8}
              required
              onInvalid={(e) => {
                const value = e.target.value;
                if (value.length === 0){
                  e.target.setCustomValidity(t('register.errors.missing_field'));
                } else if (value.length < 8) {
                  e.target.setCustomValidity(t('register.errors.password_length'));
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="register-input"
              placeholder={t('register.placeholders.password')}
            />
            <div className="register-password-strength">
              <div className="register-strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="register-strength-bar"
                    style={{
                      backgroundColor: i <= passwordStrength ? getStrengthColor(passwordStrength) : "#e2e8f0",
                    }}
                  />
                ))}
              </div>
              <div className="register-password-tips">
                <p className="register-tip">• {t('register.password_strength.tips.0')}</p>
                <p className="register-tip">• {t('register.password_strength.tips.1')}</p>
                <p className="register-tip">• {t('register.password_strength.tips.2')}</p>
                <p className="register-tip">• {t('register.password_strength.tips.3')}</p>
              </div>
            </div>
          </div>
          
          {success && (
            <div className="register-success-alert">
              <span className="register-error-icon"></span>
              {t('register.alerts.success')}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`register-button ${loading ? 'register-button-loading' : ''}`}
          >
            {loading ? (
              <span className="register-button-content">
                <span className="register-spinner"></span>
                {t('register.buttons.creating_account')}
              </span>
            ) : (
              <p>{t('register.buttons.create_account')}</p>
            )}
          </button>
          
          <div className="register-divider">
            <span className="register-divider-text">{t('register.divider')}</span>
          </div>
          
          <button 
            type="button"
            onClick={switchToLogin}
            className="register-switch-button"
          >
            {t('register.buttons.account_already')} <span className="register-switch-highlight">{t('register.buttons.sign_in')}</span>
          </button>
        </form>
      </div>
      <div>
      <button onClick={() => {i18n.changeLanguage('en'); localStorage.setItem('language','en')}}>English</button>
      <button onClick={() => {i18n.changeLanguage('sv'); localStorage.setItem('language','sv')}}>Svenska</button>
        </div>
    </div>
  );
}

export default Register;