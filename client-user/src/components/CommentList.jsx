// CommentList.jsx - Redesigned Comment List Component
import { useAuth } from "../contexts/AuthContext";

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
    return null; // The parent component handles empty state
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {comment.name}
              </h4>
              {comment.createdAt && (
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              )}
            </div>
          </div>

          <div className="text-gray-700 text-sm">
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </div>

          {/* Show delete button for admin users or authenticated users who own the comment */}
          {currentUser &&
            (currentUser.role === "ADMIN" ||
              (comment.userId && comment.userId === currentUser.id)) && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                title="Delete comment"
              >
                <svg
                  className="h-4 w-4"
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
              </button>
            )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
