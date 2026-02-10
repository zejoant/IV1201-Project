import { useState, useEffect } from "react";
import Login from "./components/login/Login";
import Register from "./components/register/Register"; 
import PersonPage from "./components/PersonPage";
import ApplicationForm from "./components/application/ApplicationForm";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showApplication, setShowApplication] = useState(false);

  // Check if user is already logged in on app load
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
    setShowApplication(false); // Reset to person page on logout
  };

  // Handle application submission completion
  const handleApplicationComplete = () => {
    setShowApplication(false); // Return to person page after application
  };

  // If no user is logged in, show login/register
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

  // If user is logged in and wants to see application form
  if (showApplication) {
    return (
      <ApplicationForm 
        currentUser={currentUser} 
        onApplicationComplete={handleApplicationComplete}
        onBackToProfile={() => setShowApplication(false)}
      />
    );
  }

  // If user is logged in and wants to see person page
  return (
    <PersonPage 
      currentUser={currentUser} 
      handleLogout={handleLogout}
      onApplyNow={() => setShowApplication(true)}
    />
  );
}

export default App;