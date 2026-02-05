import { useState } from "react";
import "./Register.css";

function Register({ setCurrentUser, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [pnr, setPersonNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        throw new Error(data.message || "Registration failed");
      }
      
      // Auto-login after successful registration
      const loginRes = await fetch("/account/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.message || "Login failed after registration");
      }

      localStorage.setItem("currentUser", JSON.stringify(loginData));
      setCurrentUser(loginData);
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "#e2e8f0";
    if (strength <= 2) return "#ef4444";
    if (strength === 3) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon-container">
            <span className="register-icon">📝</span>
          </div>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join our recruitment platform today</p>
        </div>
        
        {error && (
          <div className="register-error-alert">
            <span className="register-error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-row">
            <div className="register-input-group">
              <label className="register-label">
                First Name <span className="register-required">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="register-input"
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="register-input-group">
              <label className="register-label">
                Last Name <span className="register-required">*</span>
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="register-input"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="register-input-group">
            <label className="register-label">
              Email Address <span className="register-required">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
              placeholder="Enter your email address"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">
             Person Number <span className="register-required">*</span>
         </label>
          <input
            type="text"
            value={pnr}
            onChange={(e) => setPersonNumber(e.target.value)}
            required
            className="register-input"
            placeholder="Enter your person number"
          />
          </div>
          <div className="register-input-group">
            <label className="register-label">
              Username <span className="register-required">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="register-input"
              placeholder="Choose a username"
            />
          </div>
          
          <div className="register-input-group">
            <div className="register-label-container">
              <label className="register-label">
                Password <span className="register-required">*</span>
              </label>
              <div className="register-strength-indicator">
                <span className="register-strength-text">
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            </div>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="register-input"
              placeholder="Create a strong password"
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
                <p className="register-tip">• At least 8 characters</p>
                <p className="register-tip">• Include uppercase letters</p>
                <p className="register-tip">• Include numbers</p>
                <p className="register-tip">• Include special characters</p>
              </div>
            </div>
          </div>
          
          
          <button 
            type="submit" 
            disabled={loading}
            className={`register-button ${loading ? 'register-button-loading' : ''}`}
          >
            {loading ? (
              <span className="register-button-content">
                <span className="register-spinner"></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
          
          <div className="register-divider">
            <span className="register-divider-text">OR</span>
          </div>
          
          <button 
            type="button"
            onClick={switchToLogin}
            className="register-switch-button"
          >
            Already have an account? <span className="register-switch-highlight">Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;