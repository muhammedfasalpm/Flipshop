

const DashboardCard = ({
  title,
  value,
  color = "bg-blue-600",
}) => {
  return (
    <div
      className={`${color} text-white rounded-lg shadow p-6`}
    >
      <h3 className="text-lg">
        {title}
      </h3>

      <h1 className="text-3xl font-bold mt-3">
        {value}
      </h1>
    </div>
  );
};

export default DashboardCard;