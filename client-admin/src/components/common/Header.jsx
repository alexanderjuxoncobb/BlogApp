import { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

function Header() {
  const { currentAdmin, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const pageTitle = () => {
    const path = window.location.pathname;
    if (path === "/") return "Dashboard";
    return (
      path.substring(1).charAt(0).toUpperCase() +
      path.substring(2).split("/")[0]
    );
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle()}</h1>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none group"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white">
            {currentAdmin?.name
              ? currentAdmin.name.charAt(0).toUpperCase()
              : currentAdmin?.email.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline-block font-medium text-gray-700 group-hover:text-gray-900">
            {currentAdmin?.name || currentAdmin?.email}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-transform duration-200 ${
              dropdownOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <div className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700">
              Signed in as <br />
              <span className="font-semibold">{currentAdmin?.email}</span>
            </div>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
