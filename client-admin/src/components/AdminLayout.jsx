import Sidebar from "./common/Sidebar";
import Header from "./common/Header";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
