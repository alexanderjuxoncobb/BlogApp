import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Blog Admin</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={isActive("/")}>
            <Link to="/">Dashboard</Link>
          </li>
          <li
            className={
              isActive("/posts") || location.pathname.includes("/posts/")
            }
          >
            <Link to="/posts">Posts</Link>
          </li>
          <li className={isActive("/comments")}>
            <Link to="/comments">Comments</Link>
          </li>
          <li className={isActive("/users")}>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
