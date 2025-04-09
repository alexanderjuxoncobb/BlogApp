// client-user/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by trying to fetch user profile
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        // Token might be expired, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setCurrentUser(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // After refreshing, fetch the user profile again
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, message: "Failed to register user" };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);

        return { success: true };
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
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setCurrentUser(null);
      // Redirect to home page after logout
      window.location.href = "/";
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
