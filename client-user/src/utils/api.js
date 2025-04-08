// src/utils/api.js
const API_URL = "http://localhost:5000";

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

// Post-related API functions
export const getPosts = async (refresh = false) => {
  const url = refresh ? "/posts?refresh=true" : "/posts";
  const response = await apiRequest(url);

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

export const getUserPosts = async (userId) => {
  const response = await apiRequest(`/posts/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }

  return response.json();
};

export const createPost = async (postData) => {
  const response = await apiRequest("/posts", {
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
    method: "PATCH",
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

  return response.status === 204 ? null : response.json();
};

// Comment-related API functions
export const getComments = async (postId, refresh = false) => {
  const url = refresh
    ? `/comments/${postId}?refresh=true`
    : `/comments/${postId}`;
  const response = await apiRequest(url);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
};

export const createComment = async (commentData) => {
  const response = await apiRequest("/comments", {
    method: "POST",
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
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

  return response.status === 204 ? null : response.json();
};

// User-related API functions
export const updateUserProfile = async (userId, userData) => {
  const response = await apiRequest(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export default {
  getPosts,
  getPostById,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  deleteComment,
  updateUserProfile,
};
