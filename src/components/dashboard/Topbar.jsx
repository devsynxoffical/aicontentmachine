import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TopBar({ sidebarOpen }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const firstName = user?.fullName
    ? user.fullName.split(" ")[0]
    : "User";

  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "U";

  const plan = user?.plan
    ? user.plan.charAt(0).toUpperCase() +
    user.plan.slice(1).toLowerCase()
    : "Free";

  return (
    <header
      className={`
        fixed
        top-0
        right-0
        h-20
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        justify-between
        px-8
        z-50
        transition-all
        duration-300
        ${sidebarOpen ? "left-72" : "left-20"}
      `}
    >
      {/* Left */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <h1 className="text-2xl font-bold text-[#1A1A2E]">
          AI Content Machine
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="relative h-11 w-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Bell
            size={22}
            className="text-gray-600"
          />

          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-2 py-1 transition"
        >
          {/* Avatar */}
          <div className="h-11 w-11 rounded-full bg-[#02A3B1] text-white font-bold text-lg flex items-center justify-center">
            {initial}
          </div>

          {/* Info */}
          <div className="hidden xl:block text-left">
            <h3 className="text-sm font-semibold text-[#1A1A2E]">
              {firstName}
            </h3>

            <p className="text-xs text-gray-500">
              {plan} Plan
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}