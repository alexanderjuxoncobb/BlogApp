import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import UsersList from "../components/Users/UsersList";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a production environment, this would be an API call
        // For now, we'll simulate with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock users data
        const mockUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "ADMIN",
            postCount: 10,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "USER",
            postCount: 5,
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          },
          {
            id: 3,
            name: "Alice Johnson",
            email: "alice@example.com",
            role: "USER",
            postCount: 3,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          },
          {
            id: 4,
            name: "Bob Wilson",
            email: "bob@example.com",
            role: "USER",
            postCount: 0,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          },
          {
            id: 5,
            name: "Carol Martinez",
            email: "carol@example.com",
            role: "USER",
            postCount: 2,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          },
        ];

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users when search term changes
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(term)) ||
          user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleRoleChange = (userId, newRole) => {
    // In a real application, this would call an API to update the user role
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleDelete = (userId) => {
    // In a real application, this would call an API to delete the user
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-md border-gray-300 shadow-sm focus:border-admin-600 focus:ring focus:ring-admin-500 focus:ring-opacity-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <UsersList
              users={filteredUsers}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />

            <div className="mt-6 text-center text-gray-500 text-sm">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default UsersPage;
