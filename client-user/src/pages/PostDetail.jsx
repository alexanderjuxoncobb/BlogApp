import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import "../styles/PostDetail.css";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  // Fetch post details
  const fetchPostDetails = async () => {
    setLoading(true);
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
      setPost(data.post);

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
      const response = await fetch(`http://localhost:5000/comments/${id}`, {
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

  // Handle adding a new comment
  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/comments/${commentId}`,
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
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
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
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1>{post.title}</h1>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {isAuthor && (
        <div className="post-actions">
          <button
            onClick={() => navigate(`/edit-post/${id}`)}
            className="edit-button"
          >
            Edit Post
          </button>
          <button onClick={handleDeletePost} className="delete-button">
            Delete Post
          </button>
        </div>
      )}

      <div className="comments-section">
        <h2>Comments</h2>
        <CommentForm postId={id} onCommentAdded={handleAddComment} />
        <CommentList
          comments={comments}
          currentUser={currentUser}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
}

export default PostDetail;
