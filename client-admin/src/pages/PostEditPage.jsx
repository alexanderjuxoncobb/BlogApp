// client-admin/src/pages/PostEditPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PostEditor from "../components/Posts/PostEditor";
import { getPostById, createPost, updatePost } from "../utils/api";

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
        const response = await getPostById(id);
        setPost(response.post);
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
      if (id) {
        // Update existing post
        await updatePost(id, postData);
      } else {
        // Create new post
        await createPost(postData);
      }

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
