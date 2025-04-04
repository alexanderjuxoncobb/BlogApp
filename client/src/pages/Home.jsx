import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });
        const data = await response.json();
        setMessage(data.message);
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

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
  );
}

export default Home;
