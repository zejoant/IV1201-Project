import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/1"); //relative path, works for prod with azure and for localhost dev with proxy
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user){

    console.log(`this is user: ${user}`);
    return <p>Loading...</p>;

  };

  return (
    <div>
      <h1>User Info</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </div>
  );
}

export default App;
