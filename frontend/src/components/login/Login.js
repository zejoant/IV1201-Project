import React, { useState } from 'react';
import './Login.css';
import Footer from "../Footer";

function Login({ setCurrentUser, switchToRegister }) {
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
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const err = new Error(data.error || 'Login failed');
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
        const err = new Error(profileData.error || 'Failed to fetch user profile');
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
      setError(err.custom ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">  
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your recruitment account</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="login-error-alert">
              <span className="login-error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                  setUsername(value);

                  if (!/^[A-Za-z0-9]+$/.test(value)) {
                    e.target.setCustomValidity("Username can only contain letters and numbers");
                  } else if(value.length < 3 || value.length > 30){
                    e.target.setCustomValidity("Username must be between 3 and 30 characters");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                required
                className="login-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="login-input-group">
              <div className="login-label-container">
                <label className="login-label">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);

                  if (value.length < 8) {
                    e.target.setCustomValidity("Password must be at least 8 characters long");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                required
                className="login-input"
                placeholder="Enter your password"
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
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <button
                onClick={switchToRegister}
                className="login-link-button"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />  
    </div>
  );
}

export default Login;