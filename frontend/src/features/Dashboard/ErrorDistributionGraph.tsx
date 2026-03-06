import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Accepted",           value: 55, fill: "#6366f1" },
  { name: "Failed",             value: 25, fill: "#2dd4bf" },
  { name: "Runtime Error",      value: 3,  fill: "#f87171" },
  { name: "Not Attempted",      value: 25, fill: "#f43f5e" },
  { name: "Compilation Error",  value: 10, fill: "#38bdf8" },
  { name: "Partially Accepted", value: 8,  fill: "#fbbf24" },
];

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, value } = props;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
      fill="#4b5563"
    >
      {`${value}%`}
    </text>
  );
};

const ErrorDistributionChart = () => {
  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border-inherit w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Error Distribution
      </h2>

      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={renderCustomLabel}
              strokeWidth={0}
            />
            <Tooltip formatter={(value) => [`${value}%`]} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <div className="text-2xl font-bold text-gray-700">55%</div>
          <div className="text-[10px] text-gray-400 uppercase">Accepted</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                style={{ backgroundColor: item.fill }}
                className="w-2.5 h-2.5 rounded-full shrink-0"
              />
              <span className="text-gray-600 text-[11px] truncate">{item.name}</span>
            </div>
            <span className="font-bold text-gray-700 text-[11px] ml-1">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorDistributionChart;