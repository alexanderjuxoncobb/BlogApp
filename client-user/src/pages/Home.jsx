// Home.jsx - Updated to only show published posts
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load posts. Please try again.");
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

  // Get only published posts for display on homepage
  // const publishedPosts = posts.filter((post) => post.published);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Share Your Ideas With The World
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of writers and readers passionate about
              technology, design, and creativity.
            </p>

            {currentUser ? (
              <div className="bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Welcome back, {currentUser.name || currentUser.email}!
                </h2>
                <p className="mb-4">
                  Ready to share your thoughts with the community?
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/create-post"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
                  >
                    Create New Post
                  </Link>
                  <Link
                    to="/my-posts"
                    className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    My Posts
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-600">
                <p className="mb-4">
                  Join our community to create your own posts and engage with
                  others.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/login"
                    className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <button
              onClick={() => fetchData(true)}
              disabled={loading}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-sky-600"
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
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
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
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      <Link
                        to={`/posts/${post.id}`}
                        className="hover:text-sky-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <div className="text-gray-700 mb-4 line-clamp-3">
                      {post.content}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.author?.name || "Anonymous"}</span>
                      {post.createdAt && (
                        <span>{formatDate(post.createdAt)}</span>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-sky-600 hover:text-sky-800 font-medium inline-flex items-center"
                      >
                        Read more
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No published posts available yet
              </h3>
              <p className="mt-1 text-gray-500">
                Be the first to create content for our community.
              </p>
              {currentUser ? (
                <div className="mt-6">
                  <Link
                    to="/create-post"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
                  >
                    Sign in to post
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to action section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to start your blogging journey?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our community of writers and share your knowledge, ideas, and
            stories with readers around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/create-post"
              className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Start Writing
            </Link>
            <Link
              to="/about"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
