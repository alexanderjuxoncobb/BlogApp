// client-admin/src/utils/helpers.js

// Format date to a readable string
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate long text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Get initial from name or email
export const getInitial = (name, email) => {
  if (name && name.length > 0) {
    return name.charAt(0).toUpperCase();
  }
  if (email && email.length > 0) {
    return email.charAt(0).toUpperCase();
  }
  return "?";
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};

export default {
  formatDate,
  formatDateTime,
  truncateText,
  getInitial,
  calculatePercentage,
};
