// client-admin/src/pages/PostsPage.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import PostsList from "../components/Posts/PostsList";
import PostFilters from "../components/Posts/PostFilters";
import { getPosts, deletePost, togglePostPublish } from "../utils/api";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "all", searchTerm: "" });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPosts();
        setPosts(response.posts || []);
        applyFilters(response.posts || [], filters);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters(posts, filters);
  }, [filters, posts]);

  const applyFilters = (postsToFilter, currentFilters) => {
    let result = [...postsToFilter];

    // Apply status filter
    if (currentFilters.status !== "all") {
      const isPublished = currentFilters.status === "published";
      result = result.filter((post) => post.published === isPublished);
    }

    // Apply search filter
    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term) ||
          (post.author?.name && post.author.name.toLowerCase().includes(term))
      );
    }

    setFilteredPosts(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handlePublishToggle = async (postId, newPublishedStatus) => {
    try {
      await togglePostPublish(postId, newPublishedStatus);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, published: newPublishedStatus } : post
        )
      );
    } catch (error) {
      console.error("Error toggling post published status:", error);
      alert("Failed to update post status. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        </div>

        <PostFilters onFilterChange={handleFilterChange} />

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
            <PostsList
              posts={filteredPosts}
              onDelete={handleDelete}
              onPublishToggle={handlePublishToggle}
            />

            <div className="mt-6 text-center text-gray-500 text-sm">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default PostsPage;
