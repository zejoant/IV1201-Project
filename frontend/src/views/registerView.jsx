import "./../cssFiles/register.css";
import LanguageButton from '../presenters/languageButtonPresenter';

/**
 * RegisterView Component
 *
 * Displays the user registration interface including form inputs,
 * validation handling, password strength indicator, and submission controls.
 * The component is fully controlled via props and relies on parent state
 * management for form values and actions.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {Function} props.t - Translation function (i18n) used to localize text content.
 *
 * @param {string} props.username - Current username input value.
 * @param {string} props.password - Current password input value.
 * @param {string} props.name - User's first name.
 * @param {string} props.surname - User's last name.
 * @param {string} props.email - User's email address.
 * @param {string} props.pnr - Personal number (12-digit identifier).
 *
 * @param {string|null} props.error - Translation key for an error message to display.
 * @param {boolean} props.loading - Indicates whether the registration request is in progress.
 * @param {boolean} props.success - Indicates whether registration completed successfully.
 *
 * @param {number} props.passwordStrength - Password strength level (1–4).
 *
 * @param {Function} props.setUsername - Updates username state.
 * @param {Function} props.setName - Updates first name state.
 * @param {Function} props.setSurname - Updates surname state.
 * @param {Function} props.setEmail - Updates email state.
 * @param {Function} props.setPersonNumber - Updates personal number state.
 *
 * @param {Function} props.handlePasswordChange - Handles password input changes and strength calculation.
 * @param {Function} props.handleSubmit - Form submission handler.
 *
 * @param {Function} props.getStrengthColor - Returns color corresponding to password strength.
 * @param {Function} props.getStrengthText - Returns localized text describing password strength.
 *
 * @param {Function} props.switchToLogin - Switches view to the login screen.
 *
 * @returns {JSX.Element} Rendered registration form view.
 *
 */

function RegisterView({
    t,
    username,
    password,
    name,
    surname,
    email,
    pnr,
    error,
    loading,
    success,
    passwordStrength,
    setUsername,
    setName,
    setSurname,
    setEmail,
    setPersonNumber,
    handlePasswordChange,
    handleSubmit,
    getStrengthColor,
    getStrengthText,
    switchToLogin,
}) {
    return (
        <>
            <div className="language-button-container">
                <LanguageButton />     
            </div>
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
                                    onChange={(e) => { setName(e.target.value.replace(/[^A-Za-z ]/g, "")); e.target.setCustomValidity(t('')); }}
                                    required
                                    onInvalid={(e) => {
                                        const value = e.target.value;
                                        if (value.length === 0) {
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
                                    onChange={(e) => { setSurname(e.target.value.replace(/[^A-Za-z ]/g, "")); e.target.setCustomValidity(t('')); }}
                                    required
                                    onInvalid={(e) => {
                                        const value = e.target.value;
                                        if (value.length === 0) {
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
                                onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(t('')); }}
                                required
                                onInvalid={(e) => {
                                    const value = e.target.value;
                                    if (value.length === 0) {
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
                                    if (value.length === 0) {
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
                                    if (value.length === 0) {
                                        e.target.setCustomValidity(t('register.errors.missing_field'));
                                    } else if (value.length < 3 || value.length > 30) {
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
                            <input type="text" name="fake-username" autoComplete="username" style={{ display: "none" }} /> {/*decoy field to prevent firefox detecting login*/}
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
                                    if (value.length === 0) {
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
            </div>
        </>
    );
}

export default RegisterView;