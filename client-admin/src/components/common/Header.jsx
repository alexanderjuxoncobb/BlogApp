import { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

function Header() {
  const { currentAdmin, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          {window.location.pathname === "/"
            ? "Dashboard"
            : window.location.pathname.substring(1).charAt(0).toUpperCase() +
              window.location.pathname.substring(2).split("/")[0]}
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="h-8 w-8 rounded-full bg-admin-600 flex items-center justify-center text-white">
            {currentAdmin?.name
              ? currentAdmin.name.charAt(0).toUpperCase()
              : currentAdmin?.email.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline-block font-medium text-gray-700">
            {currentAdmin?.name || currentAdmin?.email}
          </span>
          <svg
            className="w-4 h-4 text-gray-500"
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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700">
              Signed in as <br />
              <span className="font-semibold">{currentAdmin?.email}</span>
            </div>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
