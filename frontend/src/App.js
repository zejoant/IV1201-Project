import { useEffect, useState } from "react";

function App() {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/persons/1"); //relative path, works for prod with azure and for localhost dev with proxy
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setPerson(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  if (!person) {
    console.log(`this is user: ${person}`);
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>User Info</h1>
      <p>ID: {person.person_id}</p>
      <p>Name: {person.name}</p>
    </div>
  );
}

export default App;
