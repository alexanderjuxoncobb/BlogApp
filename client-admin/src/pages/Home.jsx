import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchData = async (refresh = false) => {
    setLoading(true);
    try {
      // Add the refresh query parameter if refresh is true
      const url = refresh
        ? "http://localhost:5000/users?refresh=true"
        : "http://localhost:5000/users";

      const response = await fetch(url, {
        credentials: "include", // Include cookies with request
      });
      const data = await response.json();
      setMessage(data.message);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>

      {currentUser ? (
        <div className="welcome-message">
          <h2>Welcome, {currentUser.name || currentUser.email}!</h2>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div className="auth-prompt">
          <p>Please log in or register to access all features.</p>
        </div>
      )}

      <div className="data-section">
        <div className="refresh-controls">
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="refresh-button"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
          {loading && <span className="loading-indicator">Loading...</span>}
        </div>

        <p>API Message: {message}</p>

        {users.length > 0 && (
          <div className="users-list">
            <h3>Users:</h3>
            {users.map((user) => {
              return <p key={user.id}>{user.email}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
