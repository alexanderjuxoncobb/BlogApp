import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch stats from your API
    const fetchStats = async () => {
      try {
        // Example API call to get dashboard stats
        // const response = await fetch('http://localhost:5000/admin/stats', {
        //   credentials: 'include'
        // });
        // const data = await response.json();
        // setStats(data);

        // Simulate API response
        setTimeout(() => {
          setStats({
            totalPosts: 15,
            publishedPosts: 12,
            draftPosts: 3,
            totalComments: 45,
            totalUsers: 8,
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Posts</h3>
          <p className="stat-number">{stats.totalPosts}</p>
          <div className="stat-details">
            <span>{stats.publishedPosts} published</span>
            <span>{stats.draftPosts} drafts</span>
          </div>
          <Link to="/posts" className="view-all">
            View all posts
          </Link>
        </div>

        <div className="stat-card">
          <h3>Comments</h3>
          <p className="stat-number">{stats.totalComments}</p>
          <Link to="/comments" className="view-all">
            Manage comments
          </Link>
        </div>

        <div className="stat-card">
          <h3>Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <Link to="/users" className="view-all">
            Manage users
          </Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/posts/create" className="action-button">
            Create New Post
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
