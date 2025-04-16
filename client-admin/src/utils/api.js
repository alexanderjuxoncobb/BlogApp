// client-admin/src/utils/api.js
const getBaseUrl = () => {
  const origin = import.meta.env.VITE_API_URL || window.location.origin;
  return origin.endsWith("/admin") ? origin.slice(0, -6) : origin;
};

const API_URL = getBaseUrl();

// Generic request function with authentication
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Important for sending cookies with requests
  };

  try {
    const response = await fetch(url, config);

    // If response is unauthorized and we have a refresh token
    if (response.status === 401) {
      // Try to refresh the token
      const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // If token refresh was successful, retry the original request
        return fetch(url, config);
      } else {
        // If token refresh failed, throw an error
        throw new Error("Session expired. Please log in again.");
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Dashboard related functions
export const getDashboardStats = async () => {
  const response = await apiRequest("/admin/dashboard/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }

  return response.json();
};

// Post related functions
export const getPosts = async () => {
  const response = await apiRequest("/posts");

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const getPostById = async (id) => {
  const response = await apiRequest(`/posts/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
};

export const createPost = async (postData) => {
  const response = await apiRequest("/posts/create", {
    method: "POST",
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const updatePost = async (id, postData) => {
  const response = await apiRequest(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

export const deletePost = async (id) => {
  const response = await apiRequest(`/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return response.status === 204 ? true : response.json();
};

// client-admin/src/utils/api.js
export const togglePostPublish = async (id, isPublished) => {
  try {
    const response = await apiRequest(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ published: isPublished }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update post status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling post publish status:", error);
    throw error;
  }
};

// User related functions
export const getUsers = async () => {
  const response = await apiRequest("/admin/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const changeUserRole = async (userId, newRole) => {
  let endpoint = "";

  if (newRole === "ADMIN") {
    endpoint = `/admin/users/${userId}/make-admin`;
  } else {
    endpoint = `/admin/users/${userId}/revoke-admin`;
  }

  const response = await apiRequest(endpoint, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || `Failed to change user role to ${newRole}.`
    );
  }

  return response.json();
};

// client-admin/src/utils/api.js

// client-admin/src/utils/api.js - Update this function

export const deleteUser = async (id) => {
  try {
    const response = await apiRequest(`/users/${id}`, {
      method: "DELETE",
      credentials: "include", // Ensure cookies are sent for authentication
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required to delete users");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to delete users");
      } else if (response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error("Failed to delete user");
      }
    }

    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};

// Comment related functions
export const getComments = async (postId) => {
  const endpoint = postId ? `/comments/${postId}` : "/comments";
  const response = await apiRequest(endpoint);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
};

export const getAllComments = async () => {
  // Since there's no direct endpoint for all comments, we'll use a dummy post ID
  // that should return all comments
  const response = await apiRequest(`/comments`);

  if (!response.ok) {
    throw new Error("Failed to fetch all comments");
  }

  return response.json();
};

export const deleteComment = async (id) => {
  const response = await apiRequest(`/comments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  return response.status === 204 ? true : response.json();
};

export default {
  getDashboardStats,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
  getUsers,
  changeUserRole,
  deleteUser,
  getComments,
  getAllComments,
  deleteComment,
};
