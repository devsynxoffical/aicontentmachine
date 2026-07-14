import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const FALLBACK_DATA = [
  { day: "Mon", impressions: 1200, engagement: 400 },
  { day: "Tue", impressions: 1900, engagement: 600 },
  { day: "Wed", impressions: 3000, engagement: 800 },
  { day: "Thu", impressions: 5000, engagement: 1200 },
  { day: "Fri", impressions: 4000, engagement: 900 },
  { day: "Sat", impressions: 3000, engagement: 700 },
  { day: "Sun", impressions: 4500, engagement: 1100 },
];

export default function ChartCard({ performance }) {
  // Build chart data from API performance or use fallback
  const chartData = performance?.labels
    ? performance.labels.map((label, i) => ({
        day: label,
        impressions: performance.impressions?.[i] ?? 0,
        engagement: performance.engagement?.[i] ?? 0,
      }))
    : FALLBACK_DATA;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-semibold text-[#1A1A2E]">
          Performance Snapshot
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Content impressions vs engagement during the last 7 days.
        </p>

      </div>

      {/* Chart */}
      <div className="h-[360px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              dataKey="day"
              tick={{ fill: "#64748B" }}
            />

            <YAxis tick={{ fill: "#64748B" }} />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#02A3B1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Impressions"
            />

            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Engagement"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}