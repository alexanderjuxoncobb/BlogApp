import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function PostsChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Posts Activity</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "none",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="published"
              stroke="#0284c7"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Published"
            />
            <Line
              type="monotone"
              dataKey="draft"
              stroke="#9ca3af"
              strokeWidth={2}
              name="Draft"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PostsChart;
