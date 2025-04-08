import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    login,
    currentUser,
    loading: authLoading,
    isAdmin,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  // If already authenticated as admin, redirect to dashboard
  if (currentUser && isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but not an admin, show error and provide logout option
  if (currentUser && !isAdmin) {
    return (
      <div className="login-container">
        <h2>Access Denied</h2>
        <p>You do not have admin privileges.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // Show loading state if authentication is still checking
  if (authLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const result = await login(email, password);

      if (result.success) {
        if (result.isAdmin) {
          navigate("/");
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } else {
        setError(result.message || "Failed to log in");
      }
    } catch (err) {
      setError("Failed to log in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
