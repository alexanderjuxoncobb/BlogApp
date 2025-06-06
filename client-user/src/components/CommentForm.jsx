// Fixed CommentForm.jsx - WITH DEBUG LOGS
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function CommentForm({ postId, onCommentAdded }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track submission

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name ?? currentUser.email ?? "");
    } else {
      setName("");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[DEBUG] handleSubmit triggered. Current state:", {
      loading,
      submitted,
    }); // Log entry

    // Prevent multiple submissions
    if (loading || submitted) {
      console.log("[DEBUG] Submission blocked by guard clause."); // Log if blocked
      return;
    }

    const currentName = currentUser
      ? (currentUser.name ?? currentUser.email ?? "")
      : name;

    if (!currentName.trim()) {
      setError("Name could not be determined.");
      return;
    }

    if (!content.trim()) {
      setError("Comment content is required");
      return;
    }

    console.log("[DEBUG] Setting loading = true"); // Log before setting state
    setLoading(true);
    setError("");
    // No need to explicitly set submitted = false here unless resetting from a failed state
    // setSubmitted(false);

    try {
      console.log("[DEBUG] Sending fetch request..."); // Log before fetch
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: currentName,
          content,
          postId: parseInt(postId),
        }),
      });
      console.log("[DEBUG] Fetch response received:", response.status); // Log after fetch

      if (!response.ok) {
        let errorMsg = "Failed to add comment";
        try {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
        } catch (_) {}
        // Log before throwing
        console.error(
          "[DEBUG] Fetch response not OK:",
          response.status,
          errorMsg
        );
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("[DEBUG] Fetch response parsed:", data);

      // Set submitted flag to prevent multiple submissions
      console.log("[DEBUG] Setting submitted = true");
      setSubmitted(true);

      // Clear the content field on successful submission
      setContent("");

      // Reset submission state after a delay
      setTimeout(() => {
        console.log("[DEBUG] Resetting submitted = false after timeout");
        setSubmitted(false);
      }, 2000); // 2 seconds

      if (onCommentAdded && data.comment) {
        console.log("[DEBUG] Calling onCommentAdded callback.");
        onCommentAdded(data.comment);
      } else {
        console.log(
          "[DEBUG] onCommentAdded callback not provided or no comment data."
        );
      }
    } catch (error) {
      console.error("[DEBUG] Error caught in handleSubmit:", error); // Log error
      setError(error.message || "Failed to add comment. Please try again.");
      // NOTE: setLoading(false) will happen in finally. If you need to reset
      // submitted state on error, do it here or ensure finally handles it.
      // setSubmitted(false); // Optionally reset submitted on error
    } finally {
      console.log("[DEBUG] Setting loading = false in finally block"); // Log in finally
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white border border-gray-200 p-6 rounded-lg shadow">
      {/* Error Display */}
      {error && (
        <div className="mb-4 flex items-center text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-md">
          <svg
            className="h-5 w-5 text-red-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="mb-4 flex items-center text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">
          <svg
            className="h-5 w-5 text-green-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Comment posted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => !currentUser && setName(e.target.value)}
            disabled={!!currentUser || loading || submitted} // Disable based on auth, loading, or submitted state
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm ${
              currentUser || loading || submitted
                ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            }`}
          />
          {currentUser && (
            <p className="mt-1 text-xs text-gray-500">
              You are commenting as {currentUser.name || currentUser.email}
            </p>
          )}
        </div>

        {/* Comment Content Field */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            placeholder="Write your comment..."
            disabled={loading || submitted} // Disable during loading or after submission (until reset)
            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm ${
              loading || submitted
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            }`}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            // Button is disabled if loading, or already submitted (briefly), or content is empty
            disabled={loading || submitted || !content.trim()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : submitted ? ( // Show "Comment Posted" briefly after success
              "Comment Posted"
            ) : (
              "Add Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
