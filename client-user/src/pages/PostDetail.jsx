// PostDetail.jsx - Updated with PublishToggle component
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import PublishToggle from "../components/PublishToggle";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  // Fetch post details
  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        }
        throw new Error("Failed to fetch post details");
      }

      const data = await response.json();
      setPost(data.post);

      // Fetch author details if available
      if (data.post && data.post.authorId) {
        try {
          const authorResponse = await fetch(
            `/api/users/${data.post.authorId}`,
            {
              credentials: "include",
            }
          );
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            setAuthor(authorData.user);
          }
        } catch (err) {
          console.error("Error fetching author:", err);
          // Don't set error here, just continue with the post display
        }
      }

      // Check if the current user is the author of this post
      if (currentUser && data.post && data.post.authorId === currentUser.id) {
        setIsAuthor(true);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError(error.message || "Failed to load post details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // We'll handle this silently and just show an empty comments list
    }
  };

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [id]);

  // Check author status when currentUser changes
  useEffect(() => {
    if (currentUser && post) {
      setIsAuthor(post.authorId === currentUser.id);
    } else {
      setIsAuthor(false);
    }
  }, [currentUser, post]);

  // Handle toggling publish status
  const handlePublishToggle = (postId, newStatus) => {
    setPost((prev) => ({ ...prev, published: newStatus }));
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle adding a new comment
  const handleAddComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `/api/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Remove the comment from the state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  // Handle deleting the post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Redirect to home page after successful deletion
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <svg
            className="animate-spin h-10 w-10 text-sky-600"
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link
              to="/"
              className="text-sky-600 hover:text-sky-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-900 font-medium">Post</span>
            </li>
          </ol>
        </nav>

        <article className="max-w-4xl mx-auto">
          {/* Post header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-medium mr-3">
                  {author
                    ? author.name?.charAt(0).toUpperCase()
                    : post.authorId.toString().charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    {author ? author.name : `Author #${post.authorId}`}
                  </span>
                  {post.createdAt && (
                    <div className="text-sm">{formatDate(post.createdAt)}</div>
                  )}
                </div>
              </div>

              {/* Add PublishToggle for author */}
              {isAuthor && (
                <div className="ml-4">
                  <PublishToggle
                    postId={post.id}
                    initialStatus={post.published}
                    onToggleSuccess={handlePublishToggle}
                  />
                </div>
              )}
            </div>

            {/* Actions for post owner */}
            {isAuthor && (
              <div className="flex flex-wrap space-x-3 mb-6">
                <button
                  onClick={() => navigate(`/edit-post/${id}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <svg
                    className="h-4 w-4 mr-2"
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
                  Edit Post
                </button>

                <button
                  onClick={handleDeletePost}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4 mr-2"
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
                  Delete Post
                </button>
              </div>
            )}
          </header>

          {/* Post content */}
          <div className="prose prose-lg max-w-none mb-12 text-gray-800">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Comments section */}
          <section className="border-t border-gray-200 pt-10 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

            {/* Comment form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add a Comment
              </h3>
              <CommentForm postId={id} onCommentAdded={handleAddComment} />
            </div>

            {/* Comments list */}
            <div className="space-y-8">
              {comments.length > 0 ? (
                <CommentList
                  comments={comments}
                  onDeleteComment={handleDeleteComment}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

export default PostDetail;
