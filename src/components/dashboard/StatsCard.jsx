import { TrendingDown, TrendingUp } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">

      {/* Top */}
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#1A1A2E]">
            {value}
          </h3>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#E8FAFC] flex items-center justify-center">

          <Icon
            size={28}
            className="text-[#02A3B1]"
          />

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-6 flex items-center gap-2">

        {trendUp ? (

          <TrendingUp
            size={18}
            className="text-green-500"
          />

        ) : (

          <TrendingDown
            size={18}
            className="text-red-500"
          />

        )}

        <span
          className={`text-sm font-semibold ${
            trendUp
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {trend}
        </span>

        <span className="text-sm text-gray-500">
          vs last week
        </span>

      </div>

    </div>
  );
}