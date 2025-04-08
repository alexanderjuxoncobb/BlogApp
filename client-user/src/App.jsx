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
import { useAuth } from "./contexts/AuthContext";

// NavBar component with conditional rendering based on auth state
function NavBar() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const activeClass = "text-primary-700 font-semibold";
  const inactiveClass = "text-gray-600 hover:text-primary-600";

  return (
    <header className="bg-white shadow-sm">
      <div className="container-wrapper">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-heading font-bold text-primary-700"
          >
            BlogApp
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? activeClass : inactiveClass
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? activeClass : inactiveClass
              }
            >
              About
            </NavLink>

            {currentUser ? (
              <>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Users
                </NavLink>
                <button onClick={logout} className="btn-secondary text-sm">
                  Logout
                </button>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                    {currentUser.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : currentUser.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {currentUser.name || currentUser.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Log in
                </NavLink>
                <NavLink to="/register" className="btn-primary">
                  Sign up
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 focus:outline-none"
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
          <nav className="md:hidden py-3 pb-4 space-y-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 px-3 rounded-md ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-gray-600"
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
                `block py-2 px-3 rounded-md ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-gray-600"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>

            {currentUser ? (
              <>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-md ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Users
                </NavLink>
                <div className="border-t border-gray-200 my-3 pt-3 px-3">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm mr-2">
                      {currentUser.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : currentUser.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">
                      {currentUser.name || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 my-3 pt-3 px-3 space-y-2">
                <NavLink
                  to="/login"
                  className="block w-full py-2 text-center bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className="block w-full py-2 text-center bg-primary-600 rounded-md text-white font-medium hover:bg-primary-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
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
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow py-8">
        <div className="container-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container-wrapper">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} BlogApp. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
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
