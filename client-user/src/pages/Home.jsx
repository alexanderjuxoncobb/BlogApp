import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchData = async (refresh = false) => {
    setLoading(true);
    try {
      // Add the refresh query parameter if refresh is true
      const url = refresh
        ? "http://localhost:5000/posts?refresh=true"
        : "http://localhost:5000/posts";

      const response = await fetch(url, {
        credentials: "include", // Include cookies with request
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setMessage(data.message);
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Hero section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 md:p-12 shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to Our Blog
          </h1>
          <p className="text-primary-50 text-lg mb-6 max-w-2xl">
            Discover interesting articles and stories from our community.
          </p>

          {currentUser ? (
            <div className="welcome-message bg-white/20 backdrop-blur-sm text-white border-white/20">
              <h2 className="text-xl font-semibold">
                Welcome, {currentUser.name || currentUser.email}!
              </h2>
              <p className="mt-1">
                You are logged in and can access all features.
              </p>
            </div>
          ) : (
            <div className="auth-prompt bg-white/20 backdrop-blur-sm text-white border-white/20">
              <p className="mb-4">
                Join our community to create your own posts and engage with
                others.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="btn bg-white text-primary-700 hover:bg-primary-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn bg-primary-700 text-white hover:bg-primary-800"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
        <button
          onClick={() => fetchData(true)}
          disabled={loading}
          className="btn-secondary flex items-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-4 w-4 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Blog posts grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content || "No content available"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  By: Author #{post.authorId}
                </span>
                <Link
                  to={`/posts/${post.id}`}
                  className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No posts available at the moment.
          </p>
          {currentUser && (
            <Link to="/create-post" className="btn-primary inline-flex">
              Create Your First Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
