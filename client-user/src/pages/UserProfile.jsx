import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/UserProfile.css";

function UserProfile() {
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const userData = {
        name,
      };

      const response = await fetch(`http://localhost:5000/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Minimal frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Rely on backend error messages
        throw new Error(data.message || "Failed to change password");
      }

      // Clear password fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      setSuccess("Password updated successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile-container">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleProfileUpdate} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="disabled-input"
          />
          <small>Email cannot be changed</small>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="update-button">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="password-form">
        <div className="password-section">
          <h3 className="white-bg-text">Change Password</h3>

          <div className="form-group">
            <label htmlFor="currentPassword" className="white-bg-text">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="white-bg-text">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="white-bg-text">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="update-button">
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>

      <div className="user-stats">
        <h3>Account Statistics</h3>
        <p>
          Member since: {new Date(currentUser.createdAt).toLocaleDateString()}
        </p>
        <p>Role: {currentUser.role || "User"}</p>
        <p>Total Posts: {currentUser.postCount || 0}</p>
      </div>
    </div>
  );
}

export default UserProfile;
