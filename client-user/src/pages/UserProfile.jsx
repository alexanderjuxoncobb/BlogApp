import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
// Removed: import "../styles/UserProfile.css";

function UserProfile() {
  const { currentUser, refreshUser } = useAuth(); // Assuming refreshUser exists in context to update UI after change

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Function to clear success message after a delay
  const clearSuccess = () => {
    setTimeout(() => setSuccess(""), 5000); // Clear after 5 seconds
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Reset messages
    setProfileError("");
    setSuccess("");

    if (!name.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }

    setProfileLoading(true);
    try {
      const userData = { name };

      const response = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      clearSuccess();
      // Optionally refresh user data in context if name change affects navbar etc.
      if (refreshUser) refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Reset messages
    setPasswordError("");
    setSuccess("");

    // Frontend validation
    if (!currentPassword || !password || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    if (password.length < 6) {
      // Example: Enforce minimum length
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(
        `/users/change-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // Clear password fields on success
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      setSuccess("Password updated successfully");
      clearSuccess();
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Show loading state if user data isn't available yet
  if (!currentUser) {
    return (
      <div className="text-center text-gray-600 py-20">Loading profile...</div>
    );
  }

  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 my-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Global Success Message */}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {/* Profile Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Account Information
        </h2>

        {profileError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{profileError}</span>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <small className="text-xs text-gray-500 mt-1 block">
              Email cannot be changed
            </small>
          </div>

          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
              disabled={profileLoading}
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={profileLoading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-sky-400"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Change Password
        </h2>

        {passwordError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
              disabled={passwordLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
              disabled={passwordLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
              disabled={passwordLoading}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              disabled={passwordLoading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-sky-400"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* User Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Account Statistics
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Member since:</strong> {formatDate(currentUser.createdAt)}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{currentUser.role || "User"}</span>
          </p>
          {/* Assuming postCount is available on currentUser */}
          {
            <p>
              <strong>Total Posts:</strong>{" "}
              {currentUser.postCount !== undefined
                ? currentUser.postCount
                : "N/A"}
            </p>
          }
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
