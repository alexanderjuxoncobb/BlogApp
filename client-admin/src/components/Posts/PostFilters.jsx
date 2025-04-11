import { useState } from "react";
import { Link } from "react-router-dom";

function PostFilters({ onFilterChange }) {
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, searchTerm });
  };

  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    onFilterChange({ status, searchTerm: newTerm });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ status, searchTerm });
  };

  const handleClearFilters = () => {
    setStatus("all");
    setSearchTerm("");
    onFilterChange({ status: "all", searchTerm: "" });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Status filter */}
          <div className="flex items-center">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mr-2"
            >
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-admin-600 focus:ring focus:ring-admin-500 focus:ring-opacity-50 text-sm"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search posts..."
                className="rounded-md border-gray-300 shadow-sm focus:border-admin-600 focus:ring focus:ring-admin-500 focus:ring-opacity-50 text-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    onFilterChange({ status, searchTerm: "" });
                  }}
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
            <button type="submit" className="btn-secondary text-sm py-1">
              Search
            </button>
          </form>

          {/* Clear filters */}
          {(status !== "all" || searchTerm) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg
                className="h-4 w-4 mr-1"
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
              Clear filters
            </button>
          )}
        </div>

        {/* Create post button */}
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
  );
}

export default PostFilters;
