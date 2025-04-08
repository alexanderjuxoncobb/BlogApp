import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import PostsPage from "./pages/PostsPage";
import EditPostPage from "./pages/EditPostPage";
import CreatePostPage from "./pages/CreatePostPage";
import UsersPage from "./pages/UsersPage";
import CommentsPage from "./pages/CommentsPage";
import Layout from "./components/Layout";
import "./App.css";

function PrivateRoute({ children }) {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser && currentUser.role === "ADMIN" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts"
        element={
          <PrivateRoute>
            <Layout>
              <PostsPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts/create"
        element={
          <PrivateRoute>
            <Layout>
              <CreatePostPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts/:id/edit"
        element={
          <PrivateRoute>
            <Layout>
              <EditPostPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Layout>
              <UsersPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/comments"
        element={
          <PrivateRoute>
            <Layout>
              <CommentsPage />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
