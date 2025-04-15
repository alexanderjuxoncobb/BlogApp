// client-admin/src/pages/UsersPage.jsx

import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import UsersList from "../components/Users/UsersList";
import { getUsers, changeUserRole, deleteUser } from "../utils/api";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsers();
      const usersWithPostCount = response.users.map((user) => ({
        ...user,
        postCount: user._count.posts,
      }));

      setUsers(usersWithPostCount);
      setFilteredUsers(usersWithPostCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);

      // Update the user in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error changing user role:", error);
      alert(`Failed to update user role: ${error.message}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      // Show loading state or disable UI if needed

      // Call the deleteUser API function
      await deleteUser(userId);

      // If successful, update the state to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      // Also update filtered users
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((user) => user.id !== userId)
      );

      // Show success message if needed
      console.log(`User ${userId} deleted successfully`);
    } catch (error) {
      // Show error message
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.message}`);
    }
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
              className="rounded-md border-gray-300 shadow-sm focus:border-admin-600 focus:ring focus:ring-admin-500 focus:ring-opacity-50 pl-2"
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
