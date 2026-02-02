import { useState, useEffect } from "react";
import Login from "./components/Login";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
    return <Login setCurrentUser={setCurrentUser} />;
  }

  return (
    <div>
      <div>
        <h1>Recruitment Platform</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <div>
        <h2>User Information</h2>
        <p>ID: {currentUser.person_id}</p>
        <p>Name: {currentUser.name}</p>
        <p>Username: {currentUser.username}</p>
      </div>
    </div>
  );
}

export default App;