import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <span className="text-9xl font-bold text-gray-200">404</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or doesn't exist.
      </p>

      <Link to="/" className="btn-primary inline-flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
