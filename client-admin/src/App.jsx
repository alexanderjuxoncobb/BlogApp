// client-admin/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

// Pages
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import UsersPage from "./pages/UsersPage";
import CommentsPage from "./pages/CommentsPage";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Public route - Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes - Admin only */}
          <Route
            path="/"
            element={
              <AdminPrivateRoute>
                <DashboardPage />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/posts"
            element={
              <AdminPrivateRoute>
                <PostsPage />
              </AdminPrivateRoute>
            }
          />

          {/* New route for viewing a single post */}
          <Route
            path="/posts/:id"
            element={
              <AdminPrivateRoute>
                <PostDetailPage />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/posts/create"
            element={
              <AdminPrivateRoute>
                <PostEditPage />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/posts/edit/:id"
            element={
              <AdminPrivateRoute>
                <PostEditPage />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <AdminPrivateRoute>
                <UsersPage />
              </AdminPrivateRoute>
            }
          />

          <Route
            path="/comments"
            element={
              <AdminPrivateRoute>
                <CommentsPage />
              </AdminPrivateRoute>
            }
          />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
