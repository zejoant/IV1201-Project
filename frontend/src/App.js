import { useState, useEffect } from "react";
import Login from "./components/login/Login";
import Register from "./components/register/Register"; 
import PersonPage from "./components/PersonPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

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
  };

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

  return <PersonPage currentUser={currentUser} handleLogout={handleLogout} />;
}

export default App;