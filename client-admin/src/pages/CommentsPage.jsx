// client-admin/src/pages/CommentsPage.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import CommentsManager from "../components/Comments/CommentsManager";
import { getAllComments, deleteComment } from "../utils/api";

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        // Since we don't have a direct endpoint for all comments,
        // we're using a hack by passing null as the postId
        const response = await getAllComments();
        const commentsWithPostDetails = response.comments.map((comment) => ({
          ...comment,
          postTitle: comment.post?.title || `Post #${comment.postId}`,
        }));

        setComments(commentsWithPostDetails);
        setFilteredComments(commentsWithPostDetails);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    // Filter comments when search term changes
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = comments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(term) ||
          (comment.name && comment.name.toLowerCase().includes(term)) ||
          (comment.postTitle && comment.postTitle.toLowerCase().includes(term))
      );
      setFilteredComments(filtered);
    } else {
      setFilteredComments(comments);
    }
  }, [searchTerm, comments]);

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleApprove = (commentId) => {
    // This functionality might not be implemented in the backend yet
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, approved: true } : comment
      )
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Comments</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-md border-gray-300 shadow-sm focus:border-admin-600 focus:ring focus:ring-admin-500 focus:ring-opacity-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <CommentsManager
              comments={filteredComments}
              onDelete={handleDelete}
              onApprove={handleApprove}
            />

            <div className="mt-6 text-center text-gray-500 text-sm">
              Showing {filteredComments.length} of {comments.length} comments
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default CommentsPage;
