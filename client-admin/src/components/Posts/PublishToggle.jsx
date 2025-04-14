// Update the PublishToggle component to ensure the text has a fixed width
// In client-admin/src/components/Posts/PublishToggle.jsx

import { useState } from "react";
import { togglePostPublish } from "../../utils/api";

function PublishToggle({ postId, initialStatus, onToggleSuccess }) {
  const [isPublished, setIsPublished] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    // Store the original status and determine the target status
    const originalStatus = isPublished;
    const newStatus = !originalStatus;

    // Optimistically update the UI immediately
    setIsPublished(newStatus);
    setError(null);
    setIsLoading(true);

    try {
      // Call the API to update the post's published status
      await togglePostPublish(postId, newStatus);

      // If successful, call the parent's callback if provided
      if (onToggleSuccess) {
        onToggleSuccess(postId, newStatus);
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      // Revert the UI state on error
      setIsPublished(originalStatus);
      setError(error.message || "Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
          isPublished ? "bg-sky-600" : "bg-gray-300"
        } ${isLoading ? "cursor-wait" : ""}`}
        aria-pressed={isPublished}
        aria-label="Toggle publication status"
      >
        <span
          className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
            isPublished ? "translate-x-6" : "translate-x-1"
          } ${isLoading ? "opacity-70" : ""}`}
        />
      </button>
      <span className="ml-2 text-xs font-medium text-gray-700 w-16 inline-block">
        {isPublished ? "Published" : "Draft"}
      </span>
      {/* Display error message */}
      {error && (
        <div className="absolute left-0 top-full mt-1 w-max max-w-xs text-xs text-red-600 bg-red-50 border border-red-200 p-1 rounded shadow-md z-10">
          {error}
        </div>
      )}
    </div>
  );
}

export default PublishToggle;
