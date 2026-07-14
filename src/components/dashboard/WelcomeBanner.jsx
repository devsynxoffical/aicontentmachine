import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();

  let greeting = "Good Evening";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <section className="bg-gradient-to-r from-[#02A3B1] to-[#017A85] rounded-2xl p-8 text-white shadow-md">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Left */}
        <div>

          <p className="text-white/80 text-sm">
            {today}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {greeting},
          </h2>

          <h3 className="mt-1 text-2xl font-semibold">
            {firstName}!
          </h3>

          <p className="mt-4 text-white/90 max-w-xl">
            Welcome back! Here's an overview of your AI marketing activity today.
          </p>

        </div>

        {/* Right */}
        <Link
          to="/dashboard/create-content"
          className="inline-flex items-center gap-2 bg-white text-[#017A85] font-semibold px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          <Plus size={18} />
          Create New Content
        </Link>

      </div>

    </section>
  );
}