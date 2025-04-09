import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function CommentForm({ postId, onCommentAdded }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name ?? currentUser.email ?? "");
    } else {
      setName("");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: currentName,
          content,
          postId: parseInt(postId),
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to add comment";
        try {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (onCommentAdded && data.comment) onCommentAdded(data.comment);

      setContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError(error.message || "Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white border border-gray-200 p-6 rounded-lg shadow">
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={!!currentUser}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm ${
              currentUser
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Submitting...
              </>
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
