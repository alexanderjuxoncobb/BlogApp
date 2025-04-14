// PublishToggle.jsx - Component for toggling post publication status
import { useState } from "react";

function PublishToggle({ postId, initialStatus, onToggleSuccess }) {
  const [isPublished, setIsPublished] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false); // Still useful for visual feedback/disabling rapid clicks
  const [error, setError] = useState(null);

  const togglePublishStatus = async () => {
    // 1. Store the original status and determine the target status
    const originalStatus = isPublished;
    const newStatus = !originalStatus;

    // 2. Optimistically update the UI immediately
    setIsPublished(newStatus);
    setError(null); // Clear previous errors optimistically
    setIsLoading(true); // Indicate background activity

    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          published: newStatus, // Send the *new* status to the backend
        }),
      });

      if (!response.ok) {
        // Construct a more informative error message if possible
        let errorMsg = "Failed to update publication status";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          // Ignore if response body isn't valid JSON
        }
        throw new Error(errorMsg);
      }

      // 4. Backend update was successful - call the callback if provided
      if (onToggleSuccess) {
        onToggleSuccess(postId, newStatus);
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      // 5. Backend update failed - Revert UI and show error
      setIsPublished(originalStatus); // Revert the state
      setError(error.message || "Failed to update. Please try again.");

      // Optional: If the parent needs to know about the failure to revert *its* state,
      // you could add an `onToggleFailure` prop and call it here.
      // if (onToggleFailure) {
      //   onToggleFailure(postId, originalStatus);
      // }
    } finally {
      // Always stop the loading indicator
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={togglePublishStatus}
        // Disable *only* while the fetch is actually in progress to prevent rapid clicks
        // but allow clicking again immediately after success/failure.
        disabled={isLoading}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
          isPublished ? "bg-sky-600" : "bg-gray-300"
        } ${isLoading ? "cursor-wait" : ""}`} // Add cursor-wait for loading
        aria-pressed={isPublished}
        aria-label="Toggle publication status"
      >
        <span
          className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
            isPublished ? "translate-x-6" : "translate-x-1"
          } ${isLoading ? "opacity-70" : ""}`} // Keep opacity change for loading feedback
        />
      </button>
      <span className="ml-2 text-xs font-medium text-gray-700">
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
