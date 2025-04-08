import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;


//TODO: is this even being used anymore? i think i put into App.jsx

