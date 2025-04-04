/**
 * Utility functions for API requests with authentication
 */

const API_URL = "http://localhost:5000";

// Get the authentication token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper function for making authenticated requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Include cookies for refresh token
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // If response is unauthorized and we have a token, try to refresh
    if (response.status === 401 && token) {
      const refreshSuccess = await refreshToken();

      if (refreshSuccess) {
        // Retry the request with the new token
        const newToken = getToken();
        config.headers["Authorization"] = `Bearer ${newToken}`;
        return fetch(`${API_URL}${endpoint}`, config);
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};

// Common API functions
export const getUserProfile = async () => {
  const response = await apiRequest("/auth/profile");
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
};

export const getUsers = async () => {
  const response = await apiRequest("/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const getPosts = async () => {
  const response = await apiRequest("/posts");
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const createPost = async (postData) => {
  const response = await apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const getComments = async (postId) => {
  const response = await apiRequest(`/comments/${postId}`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

export const createComment = async (commentData) => {
  const response = await apiRequest("/comments", {
    method: "POST",
    body: JSON.stringify(commentData),
  });
  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
};
