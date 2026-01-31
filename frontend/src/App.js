import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users/1");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Info</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}

export default App;
