function StatCard({ title, value, icon, trend, trendValue }) {
  const getTrendClass = () => {
    if (!trend) return "";
    return trend === "up" ? "text-green-500" : "text-red-500";
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend === "up") {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 01-1 1H9v2a1 1 0 01-2 0V8H5a1 1 0 010-2h2V4a1 1 0 112 0v2h2a1 1 0 011 1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-admin-100 text-admin-600">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${getTrendClass()}`}>
            {getTrendIcon()}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
