// CreatePost.jsx - Redesigned Create Post Page with published toggle
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false); // Add published state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          published, // Include published status in creation
          authorId: currentUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();

      // Redirect to the new post
      navigate(`/posts/${data.post.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle published status handler
  const handlePublishedToggle = () => {
    setPublished(!published);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
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
            Back to Home
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Create a New Post
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Share your thoughts with the community
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

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
                className="block w-full px-4 py-3 text-lg font-semibold rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                placeholder="Your attention-grabbing title..."
                required
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
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                placeholder="Write your post content here..."
                required
              ></textarea>
              <p className="mt-2 text-xs text-gray-500">
                Pro tip: Use Markdown to format your content with headings,
                lists, and more.
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
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded transition duration-200 accent-sky-600 hover:accent-sky-700"
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
                  ? "This post will be visible to everyone immediately."
                  : "This post will be saved as a draft and only visible to you."}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="py-2.5 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 duration-200"
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
                    Publishing...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-8">
          <h3 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Writing Tips
          </h3>
          <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
            <li className="transition-colors duration-200 hover:text-blue-800">
              Start with a clear, descriptive title that summarizes your post
            </li>
            <li className="transition-colors duration-200 hover:text-blue-800">
              Break content into short paragraphs for better readability
            </li>
            <li className="transition-colors duration-200 hover:text-blue-800">
              Use headings to organize longer posts
            </li>
            <li className="transition-colors duration-200 hover:text-blue-800">
              Include examples or code snippets where relevant
            </li>
            <li className="transition-colors duration-200 hover:text-blue-800">
              Proofread before publishing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
