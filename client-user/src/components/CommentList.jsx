import { useAuth } from "../contexts/AuthContext";
import "../styles/CommentList.css";

function CommentList({ comments, onDeleteComment }) {
  const { currentUser } = useAuth();

  // Format the comment date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{comment.name}</span>
            {comment.createdAt && (
              <span className="comment-date">
                {formatDate(comment.createdAt)}
              </span>
            )}
          </div>

          <div className="comment-content">
            <p>{comment.content}</p>
          </div>

          {/* Show delete button for admin users or authenticated users who own the comment */}
          {currentUser &&
            (currentUser.role === "ADMIN" ||
              (comment.userId && comment.userId === currentUser.id)) && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="delete-comment-button"
              >
                Delete
              </button>
            )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
