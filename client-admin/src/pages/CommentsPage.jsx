import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import CommentsManager from "../components/Comments/CommentsManager";

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
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data to demonstrate the UI

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock comments data
        const mockComments = [
          {
            id: 1,
            content:
              "This is a really helpful article. Thanks for sharing your knowledge!",
            postId: 1,
            postTitle: "Getting Started with React",
            name: "User123",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          {
            id: 2,
            content:
              "I've been struggling with this concept for a while. Your explanation made it much clearer.",
            postId: 1,
            postTitle: "Getting Started with React",
            name: "TechEnthusiast",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          },
          {
            id: 3,
            content:
              "Do you have any recommendations for more advanced reading on this topic?",
            postId: 2,
            postTitle: "JavaScript Tips and Tricks",
            name: "LearningDev",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
          {
            id: 4,
            content:
              "I noticed a small error in the code example. In the second function, shouldn't the loop start at 0 instead of 1?",
            postId: 2,
            postTitle: "JavaScript Tips and Tricks",
            name: "CodeReviewer",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            id: 5,
            content:
              "Great post! I'm looking forward to more content like this.",
            postId: 4,
            postTitle: "Building REST APIs with Node.js",
            name: "BackendDev",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
        ];

        setComments(mockComments);
        setFilteredComments(mockComments);
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

  const handleDelete = (commentId) => {
    // In a real application, this would call an API to delete the comment
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const handleApprove = (commentId) => {
    // In a real application, this would call an API to approve the comment
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
