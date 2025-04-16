import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";

function AdminPrivateRoute({ children }) {
  const { currentAdmin, loading } = useAdminAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated as admin
  if (!currentAdmin || currentAdmin.role !== "ADMIN") {
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated as admin
  return children;
}

export default AdminPrivateRoute;
