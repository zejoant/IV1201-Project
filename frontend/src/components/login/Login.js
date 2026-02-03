import { useState } from "react";
import "./Login.css";

function Login({ setCurrentUser, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("currentUser", JSON.stringify(data));
      setCurrentUser(data);
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your recruitment account</p>
        </div>
        
        {error && (
          <div className="login-error-alert">
            <span className="login-error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
              placeholder="Enter your username or email"
            />
          </div>
          
          <div className="login-input-group">
            <div className="login-label-container">
              <label className="login-label">Password</label>
              <a href="/forgot-password" className="login-forgot-link">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-footer-text">
            Don't have an account?{" "}
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
  );
}

export default Login;