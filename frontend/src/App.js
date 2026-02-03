import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser(data);
      setError("");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  }

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.name} {user.surname}</h1>
      </div>
    );
  }

  return (
    <form onSubmit={login}>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
      <button>Login</button>
    </form>
  );
}

export default App;
