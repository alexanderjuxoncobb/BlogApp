// CommentList.jsx
import { useAuth } from "../contexts/AuthContext";

function CommentList({ comments, onDeleteComment }) {
  const { currentUser } = useAuth();

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
    return null;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        // Prefer the name from the related user object (more current),
        // fall back to the name stored on the comment itself.
        const commenterName =
          comment.user?.name || comment.name || "Unknown User";
        const commenterInitial = commenterName.charAt(0).toUpperCase();

        // Use the reliable userId for the delete check
        const canDelete =
          currentUser &&
          (currentUser.role === "ADMIN" ||
            (comment.userId && comment.userId === currentUser.id));

        return (
          <div
            key={comment.id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative"
          >
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold mr-3">
                {commenterInitial}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {commenterName}
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

            {canDelete && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors duration-150"
                title="Delete comment"
                aria-label="Delete this comment"
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
        );
      })}
    </div>
  );
}

export default CommentList;
