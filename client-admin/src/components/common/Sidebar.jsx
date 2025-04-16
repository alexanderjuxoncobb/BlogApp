import { NavLink } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

const clientUrl = __CLIENT_URL__;

function Sidebar() {
  const { currentAdmin } = useAdminAuth();

  return (
    <div className="bg-gray-900 text-white h-full min-h-screen w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-sky-400">BlogApp Admin</h2>
        <div className="mt-2 text-sm text-gray-400">
          {currentAdmin?.name || currentAdmin?.email || "Admin"}
        </div>
      </div>

      <nav className="flex-1 mt-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? "bg-sky-600 text-white" : ""}`
          }
          end
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2"
            />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? "bg-sky-600 text-white" : ""}`
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          Posts
        </NavLink>

        <NavLink
          to="/comments"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? "bg-sky-600 text-white" : ""}`
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          Comments
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? "bg-sky-600 text-white" : ""}`
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Users
        </NavLink>

        <div className="mt-10 px-4 text-xs uppercase text-gray-500 font-semibold">
          Site
        </div>

        <a
          href={clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-nav-item"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Blog Site
        </a>
      </nav>
    </div>
  );
}

export default Sidebar;
