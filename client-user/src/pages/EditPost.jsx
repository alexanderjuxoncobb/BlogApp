import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/CreatePost.css"; // Reuse styles from CreatePost

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setInitialLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post details");
        }

        const data = await response.json();

        // If current user is not the author, redirect
        if (currentUser && data.post && data.post.authorId !== currentUser.id) {
          navigate(`/posts/${id}`);
          return;
        }

        setTitle(data.post.title || "");
        setContent(data.post.content || "");
        setError("");
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. " + error.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser, navigate]);

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
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // Redirect to the post view
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Loading post...</div>;
  }

  return (
    <div className="create-post-container">
      <h1>Edit Post</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
