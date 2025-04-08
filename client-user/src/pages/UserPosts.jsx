import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/UserPosts.css";

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/posts/user/${currentUser.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch your posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError("Failed to load your posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentUser]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Update the posts list
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return <div className="loading">Loading your posts...</div>;
  }

  return (
    <div className="user-posts-container">
      <h1>My Posts</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        <button
          onClick={() => navigate("/create-post")}
          className="create-post-button"
        >
          Create New Post
        </button>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-info">
                <h2>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="post-status">
                  Status: {post.published ? "Published" : "Draft"}
                </p>
              </div>

              <div className="post-actions">
                <button
                  onClick={() => navigate(`/edit-post/${post.id}`)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>You haven't created any posts yet.</p>
            <button
              onClick={() => navigate("/create-post")}
              className="start-posting-button"
            >
              Start Posting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPosts;
