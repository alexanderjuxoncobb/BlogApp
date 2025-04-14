// client-admin/src/pages/PostDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getPostById, deletePost, togglePostPublish } from "../utils/api";
import { formatDate } from "../utils/helpers";

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPostById(parseInt(id));
        setPost(response.post);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost(parseInt(id));
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  // client-admin/src/pages/PostsPage.jsx (update just the handlePublishToggle function)

  const handlePublishToggle = async () => {
    try {
      setPublishLoading(true);
      // Toggle to opposite of current published status
      const newStatus = !post.published;

      // Call the API function with the post ID and new status
      await togglePostPublish(parseInt(id), newStatus);

      // Update the post state with the new status
      setPost({ ...post, published: newStatus });
    } catch (error) {
      console.error("Error toggling post published status:", error);
      alert(
        `Failed to ${!post.published ? "publish" : "unpublish"} post: ${error.message}`
      );
    } finally {
      setPublishLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Post not found.</p>
          <Link
            to="/posts"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
          >
            Back to Posts
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <div className="flex space-x-3">
            <Link
              to={`/posts/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={handlePublishToggle}
              disabled={publishLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                publishLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : post.published
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {publishLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5"
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
              ) : post.published ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  Unpublish
                </>
              ) : (
                <>
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
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
                  Publish
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="mr-4">
                <span className="font-medium text-gray-900">Status:</span>{" "}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.published
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </span>
              <span className="mr-4">
                <span className="font-medium text-gray-900">Author:</span>{" "}
                {post.author?.name || "Unknown"}
              </span>
              <span>
                <span className="font-medium text-gray-900">Created:</span>{" "}
                {formatDate(post.createdAt)}
              </span>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>
        </div>

        {post.comments && post.comments.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Comments ({post.comments.length})
              </h2>
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {comment.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default PostDetailPage;
