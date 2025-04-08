import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Prevent multiple simultaneous authentication checks
  const isAuthenticating = useRef(false);

  const fetchUserProfile = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isAuthenticating.current) {
      console.log("Authentication check already in progress");
      return null;
    }

    isAuthenticating.current = true;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Profile fetch status:", response.status);

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          setCurrentUser(data.user);
          setIsAdmin(data.user.role === "ADMIN");
          return data.user;
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          return null;
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setCurrentUser(null);
      setIsAdmin(false);
      return null;
    } finally {
      isAuthenticating.current = false;
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (isAuthenticating.current) {
      console.log("Token refresh already in progress");
      return false;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/refresh-token", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Token refresh status:", response.status);

      if (response.ok) {
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    // Single authentication check on initial load
    const checkAuth = async () => {
      await fetchUserProfile();
    };

    checkAuth();
  }, [fetchUserProfile]);

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

      console.log("Login status:", response.status);

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          setCurrentUser(data.user);
          setIsAdmin(data.user.role === "ADMIN");
          return {
            success: true,
            isAdmin: data.user.role === "ADMIN",
          };
        } else {
          return {
            success: false,
            message: "Invalid user data",
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
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setCurrentUser(null);
      setIsAdmin(false);
      // Redirect to home page after logout
      console.log("i have seen this (client-admin)");
      window.location.href = "/";
    }
  };

  const value = {
    currentUser,
    loading,
    isAdmin,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
