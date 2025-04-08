import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchPosts = async (refresh = false) => {
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
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      // Sort posts by newest first (assuming posts have createdAt field)
      const sortedPosts = [...(data.posts || [])].sort((a, b) => {
        // If createdAt is available, use it for sorting
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Fallback to sorting by ID if createdAt is not available
        return b.id - a.id;
      });

      setPosts(sortedPosts);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Format the post content to show only a preview (first 150 characters)
  const formatPostPreview = (content) => {
    if (!content) return "";
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <div className="home-container">
      <h1>Recent Posts</h1>

      <div className="controls">
        <button
          onClick={() => fetchPosts(true)}
          disabled={loading}
          className="refresh-button"
        >
          {loading ? "Loading..." : "Refresh Posts"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading posts...</div>}

      <div className="posts-container">
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="post-preview">
                  {formatPostPreview(post.content)}
                </p>
                <div className="post-footer">
                  <Link to={`/posts/${post.id}`} className="read-more">
                    Read More
                  </Link>
                </div>
              </div>
            ))
          : !loading && <p className="no-posts">No posts available.</p>}
      </div>
    </div>
  );
}

export default Home;
