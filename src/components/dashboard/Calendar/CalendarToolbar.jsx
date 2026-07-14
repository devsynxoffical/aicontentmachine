import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

export default function CalendarToolbar({
  view = "month",
  setView,
  currentMonth = "July 2026",
  onPrevious,
  onNext,
}) {
  const views = [
    {
      id: "month",
      label: "Month",
    },
    {
      id: "week",
      label: "Week",
    },
    {
      id: "day",
      label: "Day",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        {/* Left */}

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-[#E0F7FA] flex items-center justify-center">

            <CalendarDays
              size={22}
              className="text-[#02A3B1]"
            />

          </div>

          <div>

            <h2 className="text-xl font-semibold text-[#1A1A2E]">
              {currentMonth}
            </h2>

            <p className="text-sm text-gray-500">
              Schedule and manage your marketing content.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* Month Navigation */}

          <div className="flex rounded-lg overflow-hidden border">

            <button
              onClick={onPrevious}
              className="px-3 py-2 hover:bg-[#F4F6F8]"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={onNext}
              className="px-3 py-2 border-l hover:bg-[#F4F6F8]"
            >
              <ChevronRight size={18} />
            </button>

          </div>

          {/* View Toggle */}

          <div className="flex rounded-lg border overflow-hidden">

            {views.map((item) => (

              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-5 py-2 text-sm font-medium transition

                ${view === item.id
                    ? "bg-[#02A3B1] text-white"
                    : "bg-white hover:bg-[#F4F6F8]"
                  }`}
              >
                {item.label}
              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}