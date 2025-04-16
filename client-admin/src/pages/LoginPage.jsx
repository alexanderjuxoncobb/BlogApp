import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLogin from "../components/Login/AdminLogin";
import { useAdminAuth } from "../contexts/AdminAuthContext";

function LoginPage() {
  const { currentAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page they were trying to access
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // If already logged in and admin, redirect to where they were trying to go
    if (currentAdmin && !loading) {
      navigate(from, { replace: true });
    }
  }, [currentAdmin, loading, navigate, from]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  // If not logged in, show login form
  if (!currentAdmin && !loading) {
    // Pass the "from" location to AdminLogin so it can redirect after successful login
    return <AdminLogin redirectPath={from} />;
  }

  // This should not be visible due to the redirect
  return null;
}

export default LoginPage;
