import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { month: "Nov", attempts: 260, score: 30 },
  { month: "Jan", attempts: 300, score: 35 },
  { month: "Dec", attempts: 430, score: 50 },
  { month: "Feb", attempts: 470, score: 55 },
  { month: "Mar", attempts: 620, score: 65 },
  { month: "Apr", attempts: 510, score: 75 },
  { month: "May", attempts: 580, score: 85 },
  { month: "Jun", attempts: 650, score: 90 },
];

const TestPerformanceGraph = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-inherit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Overall Test Performance</h2>
        <div className="flex gap-2 text-sm">
          <select className="border rounded-md px-2 py-1">
            <option>Last 6 Months</option>
          </select>
          <select className="border rounded-md px-2 py-1">
            <option>All Tests</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="attemptsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#e5e7eb"
            yAxisId="left"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: '500' }}
          />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="attempts"
            stroke="#3b82f6"
            name="Attempts"
            strokeWidth={3}
            fill="url(#attemptsGrad)"
            dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#scoreGrad)"
            dot={{ r: 4, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestPerformanceGraph;