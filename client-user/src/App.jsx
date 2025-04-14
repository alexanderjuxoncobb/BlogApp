// App.jsx - Main component
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import UserPosts from "./pages/UserPosts";
import UserProfile from "./pages/UserProfile"; // Import UserProfile
import EditPost from "./pages/EditPost"; // Import EditPost
import { useAuth } from "./contexts/AuthContext";

// NavBar component with conditional rendering based on auth state
function NavBar() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-sky-400">
            BlogApp
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-sky-400 font-medium"
                  : "text-gray-300 hover:text-white transition-colors"
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-sky-400 font-medium"
                  : "text-gray-300 hover:text-white transition-colors"
              }
            >
              About
            </NavLink>

            {currentUser && (
              <NavLink
                to="/my-posts"
                className={({ isActive }) =>
                  isActive
                    ? "text-sky-400 font-medium"
                    : "text-gray-300 hover:text-white transition-colors"
                }
              >
                My Posts
              </NavLink>
            )}

            {currentUser ? (
              <>
                <NavLink
                  to="/create-post"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Write Post
                </NavLink>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-300 hover:text-white pb-2 pt-2">
                    <div className="h-8 w-8 rounded-full bg-sky-700 flex items-center justify-center text-white font-medium">
                      {currentUser.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : currentUser.email.charAt(0).toUpperCase()}
                    </div>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile" // Link already exists
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-3 pb-4 border-t border-gray-700 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-3 rounded ${
                  isActive ? "bg-gray-800 text-sky-400" : "text-gray-300"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block py-2 px-3 rounded ${
                  isActive ? "bg-gray-800 text-sky-400" : "text-gray-300"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>

            {currentUser && (
              <NavLink
                to="/my-posts"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${
                    isActive ? "bg-gray-800 text-sky-400" : "text-gray-300"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Posts
              </NavLink>
            )}

            {currentUser ? (
              <>
                <NavLink
                  to="/create-post"
                  className="block py-2 px-3 rounded bg-sky-600 text-white font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write Post
                </NavLink>
                <NavLink
                  to="/profile" // Link already exists
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded ${
                      isActive ? "bg-gray-800 text-sky-400" : "text-gray-300"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 rounded text-gray-300 hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="block py-2 px-3 rounded text-gray-300 hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block py-2 px-3 rounded bg-sky-600 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

// Main App component
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />{" "}
          {/* Keep public or adjust as needed */}
          {/* Private Routes */}
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <PrivateRoute>
                <UserPosts />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile" // Add Profile Route
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-post/:id" // Add Edit Post Route
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/users" // Assuming this should be private
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold text-sky-400 mb-4">BlogApp</h2>
              <p className="text-gray-400 mb-4">
                A modern platform for sharing ideas, knowledge, and stories with
                a global audience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-400">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-white"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-400">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} BlogApp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// App with auth provider
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
