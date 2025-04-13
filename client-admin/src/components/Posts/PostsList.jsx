import { useState } from "react";
import { Link } from "react-router-dom";

function PostsList({ posts, onDelete, onPublishToggle }) {
  const [selectedPosts, setSelectedPosts] = useState([]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(posts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPosts.length} posts?`
      )
    ) {
      selectedPosts.forEach((postId) => onDelete(postId));
      setSelectedPosts([]);
    }
  };

  const handleBulkPublish = (publish) => {
    selectedPosts.forEach((postId) => onPublishToggle(postId, publish));
    setSelectedPosts([]);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="p-4 bg-sky-50 border-b border-sky-100">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">
              {selectedPosts.length} posts selected
            </span>
            <button
              onClick={() => handleBulkPublish(true)}
              className="py-1.5 px-3 text-xs font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 transition-colors"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkPublish(false)}
              className="py-1.5 px-3 text-xs font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Unpublish
            </button>
            <button
              onClick={handleBulkDelete}
              className="py-1.5 px-3 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedPosts.length === posts.length && posts.length > 0
                }
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => handleSelectPost(post.id)}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-sky-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {truncateContent(post.content)}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {post.author?.name || "Unknown"}
                </div>
                <div className="text-xs text-gray-500">
                  {post.author?.email || ""}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.published
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    title="View"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="text-sky-600 hover:text-sky-900 transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => onPublishToggle(post.id, !post.published)}
                    className={
                      post.published
                        ? "text-green-600 hover:text-green-900 transition-colors"
                        : "text-gray-500 hover:text-gray-700 transition-colors"
                    }
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this post?"
                        )
                      ) {
                        onDelete(post.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No posts found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new post.
          </p>
          <div className="mt-6">
            <Link
              to="/posts/create"
              className="btn-primary py-2 px-4 inline-flex items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsList;
