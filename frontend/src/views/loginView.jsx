import '../cssFiles/login.css';
import LanguageButton from '../presenters/languageButtonPresenter';
/**
 * LoginView Component
 *
 * Presents the user login interface including username and password inputs,
 * validation handling, error display, and authentication submission.
 * This is a presentational (view) component that receives all state and
 * behavior through props from a parent container.
 *
 * @component
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.t - Translation function used for internationalized text.
 *
 * @param {string} props.username - Current username input value.
 * @param {Function} props.setUsername - Updates the username state.
 *
 * @param {string} props.password - Current password input value.
 * @param {Function} props.setPassword - Updates the password state.
 *
 * @param {string|null} props.error - Translation key for an error message to display.
 * @param {boolean} props.loading - Indicates whether a login request is in progress.
 *
 * @param {Function} props.handleSubmit - Form submission handler for login.
 * @param {Function} props.switchToRegister - Switches the view to the registration screen.
 *
 * @returns {JSX.Element} Rendered login form UI.
 *
 */
function LoginView({
    t,
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    switchToRegister,
}) {

    return (
        <>
            <div className="language-button-container">
                <LanguageButton />
            </div>
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
                                    } else if (value.length < 3 || value.length > 30) {
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
                                    if (value.length === 0) {
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
        </>
    );
}

export default LoginView;