import { useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterView from "./../views/registerView";

/**
 * Registration form component allowing new users to create an account.
 * Handles input validation, password strength indication, and auto-login upon success.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.setCurrentUser - Callback to set the authenticated user after registration/login
 * @param {Function} props.switchToLogin - Callback to switch the view to the login form
 * @returns {JSX.Element} The rendered registration form
 */
function RegisterPresenter({ setCurrentUser, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [pnr, setPersonNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { t } = useTranslation();

  /**
   * Updates the password state and recalculates its strength.
   * Strength is based on length, uppercase, digit, and special character presence.
   *
   * @param {Object} e - Input change event
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

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
      form.reportValidity();
      setLoading(false);
      return;
    }

    try {
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

      setSuccess(true);

      setTimeout(() => {
        switchToLogin();
      }, 2000);

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
    <RegisterView
      t={t}
      username={username}
      setUsername={setUsername}
      password={password}
      name={name}
      setName={setName}
      surname={surname}
      setSurname={setSurname}
      email={email}
      setEmail={setEmail}
      pnr={pnr}
      setPersonNumber={setPersonNumber}
      error={error}
      loading={loading}
      success={success}
      passwordStrength={passwordStrength}
      handlePasswordChange={handlePasswordChange}
      handleSubmit={handleSubmit}
      getStrengthColor={getStrengthColor}
      getStrengthText={getStrengthText}
      switchToLogin={switchToLogin}
    />
  );
}

export default RegisterPresenter;