import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false); // Add published state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For form submission
  const [initialLoading, setInitialLoading] = useState(true); // For fetching initial data
  const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setInitialLoading(true);
      setIsAuthorized(false); // Reset authorization state
      setError("");
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch post details (Status: ${response.status})`
          );
        }

        const data = await response.json();

        if (!data || !data.post) {
          throw new Error("Invalid post data received");
        }

        // Check authorization
        if (currentUser && data.post.authorId === currentUser.id) {
          setIsAuthorized(true);
          setTitle(data.post.title || "");
          setContent(data.post.content || "");
          setPublished(data.post.published || false); // Set published state
        } else {
          setIsAuthorized(false);
          // Still set data to show content if desired, but form won't submit
          setTitle(data.post.title || "");
          setContent(data.post.content || "");
          setPublished(data.post.published || false); // Set published state even if not authorized
          setError("You are not authorized to edit this post.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(`Failed to load post. ${error.message}`);
        // Ensure title/content are empty if fetch fails completely
        setTitle("");
        setContent("");
        setPublished(false);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id && currentUser) {
      fetchPost();
    } else if (!currentUser) {
      setError("You must be logged in to edit posts.");
      setInitialLoading(false);
    } else {
      setError("Invalid post ID.");
      setInitialLoading(false);
    }
  }, [id, currentUser]); // Removed navigate from dependencies as it's stable

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthorized) {
      setError("You are not authorized to perform this action.");
      return;
    }

    // Basic validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          published, // Include published status in update
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update post (Status: ${response.status})`
        );
      }

      navigate(`/posts/${id}`); // Redirect on success
    } catch (error) {
      console.error("Error updating post:", error);
      setError(`Failed to update post. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle published status handler
  const handlePublishedToggle = () => {
    setPublished(!published);
  };

  // Initial Loading State
  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-600">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to={id ? `/posts/${id}` : "/"} // Link back to post if ID exists
            className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors duration-200"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {id ? "Back to Post" : "Back to Home"}
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update the details of your post
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.293a1 1 0 001.414 1.414l4-4a1 1 0 00-1.414-1.414L10 11.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2zM10 6a1 1 0 100-2 1 1 0 000 2z" // Simple Exclamation in Circle
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-8">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
              >
                Post Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 text-lg font-semibold rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Your updated title..."
                required
                disabled={!isAuthorized || loading} // Disable if not authorized or submitting
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
              >
                Post Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="12"
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Update your post content here..."
                required
                disabled={!isAuthorized || loading} // Disable if not authorized or submitting
              ></textarea>
              <p className="mt-2 text-xs text-gray-500">
                Markdown is supported for formatting.
              </p>
            </div>

            {/* Published Toggle */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={handlePublishedToggle}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded transition duration-200 disabled:opacity-50"
                  disabled={!isAuthorized || loading}
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Publish this post
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {published
                  ? "This post will be visible to everyone."
                  : "This post is currently unpublished and only visible to you."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                // Navigate back to the specific post
                onClick={() => navigate(id ? `/posts/${id}` : "/")}
                className="py-2.5 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-200 disabled:opacity-50"
                disabled={loading} // Only disable based on form submission loading
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isAuthorized || loading} // Disable if not authorized OR submitting
                className={`inline-flex justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-200 ${
                  !isAuthorized || loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
