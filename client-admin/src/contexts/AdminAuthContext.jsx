import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated by trying to fetch admin profile
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      });

      if (response.ok) {
        const data = await response.json();

        // Only set as admin if user has ADMIN role
        if (data.user && data.user.role === "ADMIN") {
          setCurrentAdmin(data.user);
        } else {
          setCurrentAdmin(null);
          console.log("User is not an admin");
        }
      } else {
        // Token might be expired, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setCurrentAdmin(null);
        }
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      setCurrentAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // After refreshing, fetch the user profile again
        await fetchAdminProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user has admin role
        if (data.user && data.user.role === "ADMIN") {
          setCurrentAdmin(data.user);
          return { success: true };
        } else {
          return {
            success: false,
            message: "You don't have admin privileges",
          };
        }
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: "Failed to log in" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setCurrentAdmin(null);
      // Redirect to login page after logout
      window.location.href = "/login";
    }
  };

  const value = {
    currentAdmin,
    loading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
