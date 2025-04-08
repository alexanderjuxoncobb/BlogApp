import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
