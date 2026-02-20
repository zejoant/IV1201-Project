import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, UserContext } from "./contexts/UserContext";
import Layout from "./components/Layout";
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
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

/**
 * Inner component that consumes UserContext and handles the view logic.
 * Separated to allow use of useContext inside the Router context.
 */
function AppContent() {
  const { currentUser, login } = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(false);
  // For applicant area: track which sub‑view to display
  const [applicantView, setApplicantView] = useState('profile'); // 'profile', 'apply', 'myapps'

  // If not logged in, show login/register
  if (!currentUser) {
    if (showRegister) {
      return (
        <Register 
          setCurrentUser={login} 
          switchToLogin={() => setShowRegister(false)} 
        />
      );
    }
    return (
      <Login
        setCurrentUser={login}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Logged in user – determine role and render appropriate interface
  if (currentUser.role_id === ROLE_RECRUITER) {
    // Recruiter routes with Layout
    return (
      <Routes>
        <Route
          path="/recruiter"
          element={
            <Layout>
              <RecruiterDashboard />
            </Layout>
          }
        />
        <Route
          path="/recruiter/application/:id"
          element={
            <Layout>
              <ApplicationDetail />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/recruiter" replace />} />
      </Routes>
    );
  } else {
    // Applicant area: switch between views inside Layout
    return (
      <Layout>
        {applicantView === 'profile' && (
          <PersonPage
            onApplyNow={() => setApplicantView('apply')}
            onViewMyApplications={() => setApplicantView('myapps')}
          />
        )}
        {applicantView === 'apply' && (
          <ApplicationForm
            onApplicationComplete={() => setApplicantView('profile')}
            onBackToProfile={() => setApplicantView('profile')}
          />
        )}
        {applicantView === 'myapps' && (
          <MyApplications
            onBackToProfile={() => setApplicantView('profile')}
          />
        )}
      </Layout>
    );
  }
}

export default App;