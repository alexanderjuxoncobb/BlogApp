import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import PostsList from "../components/Posts/PostsList";
import PostFilters from "../components/Posts/PostFilters";

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
        // In a production environment, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock posts data
        const mockPosts = [
          {
            id: 1,
            title: "Getting Started with React",
            content:
              "React is a JavaScript library for building user interfaces. It's maintained by Facebook and a community of individual developers and companies.",
            published: true,
            authorId: 1,
            author: { name: "John Doe", email: "john@example.com" },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          },
          {
            id: 2,
            title: "JavaScript Tips and Tricks",
            content:
              "JavaScript is a versatile language used for web development. Here are some useful tips and tricks to make your code more efficient.",
            published: true,
            authorId: 2,
            author: { name: "Jane Smith", email: "jane@example.com" },
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          {
            id: 3,
            title: "Introduction to CSS Grid",
            content:
              "CSS Grid Layout is a two-dimensional layout system designed for the web. It allows you to lay out content in rows and columns.",
            published: false,
            authorId: 1,
            author: { name: "John Doe", email: "john@example.com" },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          },
          {
            id: 4,
            title: "Building REST APIs with Node.js",
            content:
              "Learn how to build RESTful APIs with Node.js, Express, and MongoDB. This tutorial covers all the basics you need to get started.",
            published: true,
            authorId: 3,
            author: { name: "Alice Johnson", email: "alice@example.com" },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          {
            id: 5,
            title: "TypeScript for React Developers",
            content:
              "TypeScript adds static type definitions to JavaScript, making your code more predictable and easier to debug. Here's how to use it with React.",
            published: false,
            authorId: 2,
            author: { name: "Jane Smith", email: "jane@example.com" },
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
        ];

        setPosts(mockPosts);
        applyFilters(mockPosts, filters);
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

  const handleDelete = (postId) => {
    // In a real application, this would call an API to delete the post
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handlePublishToggle = (postId, newPublishedStatus) => {
    // In a real application, this would call an API to update the post's published status
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, published: newPublishedStatus } : post
      )
    );
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
