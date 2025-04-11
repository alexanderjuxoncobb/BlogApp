import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PostEditor from "../components/Posts/PostEditor";

function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      // If this is a "create new post" page (no id), skip fetching
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data to demonstrate the UI

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock post data - in a real app, you'd fetch based on the id
        const mockPost = {
          id: parseInt(id),
          title: "Sample Post Title",
          content:
            "This is a sample post content that would be fetched from the API in a real application. The editor will allow you to modify this content and update it.",
          published: true,
          authorId: 1,
          author: { name: "John Doe", email: "john@example.com" },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        };

        setPost(mockPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSave = async (postData) => {
    try {
      // In a real implementation, you would call your API here
      console.log("Saving post:", postData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to posts list after successful save
      navigate("/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      throw new Error("Failed to save post. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/posts");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Edit Post" : "Create New Post"}
          </h1>
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
          <PostEditor post={post} onSave={handleSave} onCancel={handleCancel} />
        )}
      </div>
    </AdminLayout>
  );
}

export default PostEditPage;
