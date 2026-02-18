import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register"; 
import PersonPage from "./components/PersonPage";
import ApplicationForm from "./components/application/ApplicationForm";
import MyApplications from "./components/application/MyApplications"; 
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
import ApplicationDetail from "./components/recruiter/ApplicationDetail";

const ROLE_RECRUITER = 1; 

/**
 * Main application component.
 * Handles authentication state and routing based on user role.
 * Renders login/register views for unauthenticated users,
 * recruiter dashboard for recruiters, and applicant dashboard for applicants.
 *
 * @component
 * @returns {JSX.Element} The rendered application root
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [showMyApplications, setShowMyApplications] = useState(false); 

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setShowApplication(false);
    setShowMyApplications(false); 
  };

  // Called after application submission to return to profile page
  const handleApplicationComplete = () => {
    setShowApplication(false);
  };

  // If not logged in, show login/register
  if (!currentUser) {
    if (showRegister) {
      return (
        <Register 
          setCurrentUser={setCurrentUser} 
          switchToLogin={() => setShowRegister(false)} 
        />
      );
    }
    return (
      <Login
        setCurrentUser={setCurrentUser}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Logged in user – determine role and render appropriate interface
  // Use role_id from backend (1 = recruiter, 2 = applicant)
  if (currentUser.role_id === ROLE_RECRUITER) {
    // Recruiter routes
    return (
      <Router>
        <Routes>
          <Route
            path="/recruiter"
            element={
              <RecruiterDashboard
                currentUser={currentUser}
                handleLogout={handleLogout}
              />
            }
          />
          <Route
            path="/recruiter/application/:id"
            element={
              <ApplicationDetail
                currentUser={currentUser}
                handleLogout={handleLogout}
              />
            }
          />
          <Route path="*" element={<Navigate to="/recruiter" replace />} />
        </Routes>
      </Router>
    );
  } else {
    // Applicant interface
    if (showApplication) {
      return (
        <ApplicationForm
          currentUser={currentUser}
          onApplicationComplete={handleApplicationComplete}
          onBackToProfile={() => setShowApplication(false)}
        />
      );
    }
    if (showMyApplications) { 
      return (
        <MyApplications
          currentUser={currentUser}
          onBackToProfile={() => setShowMyApplications(false)}
        />
      );
    }
    return (
      <PersonPage
        currentUser={currentUser}
        handleLogout={handleLogout}
        onApplyNow={() => setShowApplication(true)}
        onViewMyApplications={() => setShowMyApplications(true)} 
      />
    );
  }
}

export default App;