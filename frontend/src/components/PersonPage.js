import { useState, useEffect } from "react";

function PersonPage({ userId, onLogout }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/persons/${userId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("user not found");
          }
          throw new Error(res.statusText);
        }
        const data = await res.json();
        setPerson(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [userId]);

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>loading...</div>;
  if (error) return <div style={{ padding: "50px", textAlign: "center", color: "red" }}>error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>User info</h1>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          back to login
        </button>
      </div>
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
        <p><strong>ID:</strong> {person.person_id}</p>
        <p><strong>Name:</strong> {person.name}</p>
        <p><strong>Username:</strong> {person.username}</p>
      </div>
    </div>
  );
}

export default PersonPage;