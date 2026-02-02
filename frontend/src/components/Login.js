import { useState } from "react";

function Login({ setCurrentUser }) {
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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your recruitment account</p>
        </div>
        
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your username or email"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Password</label>
              <a href="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonLoading : styles.button}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <a href="/signup" style={styles.link}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f8ff",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "440px",
    border: "1px solid #e6e9f0"
  },
  header: {
    textAlign: "center",
    marginBottom: "32px"
  },
  title: {
    margin: 0,
    color: "#1a1a1a",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px"
  },
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px"
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e1e5ee",
    fontSize: "15px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#f8f9fa"
  },
  inputFocus: {
    borderColor: "#4a6cf7",
    backgroundColor: "white"
  },
  button: {
    padding: "16px",
    backgroundColor: "#4a6cf7",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px"
  },
  buttonLoading: {
    padding: "16px",
    backgroundColor: "#4a6cf7",
    opacity: 0.8,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "8px"
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  forgotLink: {
    fontSize: "13px",
    color: "#4a6cf7",
    textDecoration: "none",
    fontWeight: "500"
  },
  errorAlert: {
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    color: "#c33",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  errorIcon: {
    fontSize: "16px"
  },
  footer: {
    marginTop: "32px",
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #eee"
  },
  footerText: {
    margin: 0,
    color: "#666",
    fontSize: "14px"
  },
  link: {
    color: "#4a6cf7",
    textDecoration: "none",
    fontWeight: "600"
  }
};


const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #4a6cf7 !important;
    background-color: white !important;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    background-color: #3a5ce5 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(74, 108, 247, 0.3) !important;
  }
  
  a:hover {
    text-decoration: underline !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = cssStyles;
  document.head.appendChild(styleSheet);
}

export default Login;