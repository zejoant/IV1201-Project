import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, UserContext } from "./UserContext";
import './cssFiles/app.css';
import Login from "./presenters/loginPresenter";
import Register from "./presenters/registerPresenter"; 
import PersonPage from "./presenters/personPagePresenter";
import ApplicationForm from "./presenters/applicationFormPresenter";
import RecruiterDashboard from "./presenters/recruiterDashboardPresenter";
import ApplicationDetail from "./presenters/applicationDetailPresenter";
import Footer from "./presenters/footerPresenter";
import Header from "./presenters/headerPresenter";

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
  const {currentUser, login} = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(false);
  // For applicant area: track which sub‑view to display
  const [applicantView, setApplicantView] = useState('profile'); // 'profile', 'apply', 

  // If not logged in, show login/register
  if (!currentUser) {
    if (showRegister) {
      return (
        <div>
          <Register 
            setCurrentUser={login} 
            switchToLogin={() => setShowRegister(false)} 
          />
          <Footer></Footer>
        </div>
      );
    }
    return (
      <div>
        <Login
          setCurrentUser={login}
          switchToRegister={() => setShowRegister(true)}
        />
        <Footer></Footer>
      </div>
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
            //<Layout>
            //  <RecruiterDashboard />
            //</Layout>
            <div className="layout">
              <Header />
              <main className="layout-main">{<RecruiterDashboard />}</main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/recruiter/application/:id"
          element={
            //<Layout>
            //  <ApplicationDetail />
            //</Layout>
            <div className="layout">
              <Header />
                <main className="layout-main">{<ApplicationDetail />}</main>
              <Footer />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/recruiter" replace />} />
      </Routes>
    );
  } else {
    // Applicant area: switch between views inside Layout
    return (
      /*<Layout>
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
      </Layout>*/
      <div className="layout">
        <Header />
        <main className="layout-main">
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
        </main>
        <Footer />
      </div>
    );
  }
}

export { AppContent };
export default App;