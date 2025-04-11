import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/Dashboard/StatCard";
import PostsChart from "../components/Dashboard/PostsChart";
import RecentActivity from "../components/Dashboard/RecentActivity";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    publishedPosts: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, you would fetch this data from your API
        // For now, we'll use mock data to demonstrate the UI

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock stats data
        setStats({
          totalPosts: 24,
          totalUsers: 15,
          totalComments: 48,
          publishedPosts: 18,
        });

        // Mock chart data
        setChartData([
          { name: "Jan", published: 4, draft: 2 },
          { name: "Feb", published: 3, draft: 1 },
          { name: "Mar", published: 2, draft: 3 },
          { name: "Apr", published: 5, draft: 1 },
          { name: "May", published: 4, draft: 2 },
        ]);

        // Mock activity data
        setActivities([
          {
            type: "post_created",
            message: 'New post created: "Getting Started with React"',
            date: new Date(Date.now() - 3600000),
            link: "/posts/1",
          },
          {
            type: "comment_added",
            message: 'New comment by User123 on "JavaScript Tips and Tricks"',
            date: new Date(Date.now() - 7200000),
            link: "/posts/2",
          },
          {
            type: "user_registered",
            message: "New user registered: jane.doe@example.com",
            date: new Date(Date.now() - 86400000),
            link: "/users",
          },
          {
            type: "post_updated",
            message: 'Post updated: "Introduction to CSS Grid"',
            date: new Date(Date.now() - 172800000),
            link: "/posts/3",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            }
          />
          <StatCard
            title="Published Posts"
            value={stats.publishedPosts}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
            trend="up"
            trendValue="75% of total"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Comments"
            value={stats.totalComments}
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
            trend="up"
            trendValue="12% increase"
          />
        </div>

        {/* Chart and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PostsChart data={chartData} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
