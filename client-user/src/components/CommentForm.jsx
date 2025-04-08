import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/CommentForm.css";

function CommentForm({ postId, onCommentAdded }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState(
    currentUser ? currentUser.name || currentUser.email : ""
  );
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!content.trim()) {
      setError("Comment content is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          content,
          postId: parseInt(postId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();

      // Call the callback to update parent component
      if (onCommentAdded && data.comment) {
        onCommentAdded(data.comment);
      }

      // Clear the form
      setContent("");
      setError("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form-container">
      <h3>Add a Comment</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={currentUser} // Disable if user is logged in
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Comment</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Submitting..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;
