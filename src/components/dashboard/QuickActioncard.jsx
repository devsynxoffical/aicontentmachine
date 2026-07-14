import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActionCard({
  title,
  icon: Icon,
  path,
  color,
  iconColor,
}) {
  return (
    <Link
      to={path}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5"
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon
          size={28}
          className={iconColor}
        />
      </div>

      {/* Title */}
      <h3 className="mt-5 text-lg font-semibold text-[#1A1A2E]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Start creating instantly using AI.
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-2 text-[#02A3B1] font-medium">

        <span>Open</span>

        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />

      </div>
    </Link>
  );
}