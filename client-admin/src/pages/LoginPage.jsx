import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/Login/AdminLogin";
import { useAdminAuth } from "../contexts/AdminAuthContext";

function LoginPage() {
  const { currentAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in and admin, redirect to dashboard
    if (currentAdmin && !loading) {
      navigate("/");
    }
  }, [currentAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  // If not logged in, show login form
  if (!currentAdmin && !loading) {
    return <AdminLogin />;
  }

  // This should not be visible due to the redirect
  return null;
}

export default LoginPage;
