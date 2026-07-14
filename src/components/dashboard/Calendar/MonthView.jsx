import CalendarDay from "./CalendarDay";

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export default function MonthView({
  calendarData = [],
  onDayClick,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Week Header */}

      <div className="grid grid-cols-7 bg-[#F4F6F8]">

        {weekDays.map((day) => (
          <div
            key={day}
            className="py-4 text-center font-semibold text-[#1A1A2E] border-b border-r last:border-r-0"
          >
            {day}
          </div>
        ))}

      </div>

      {/* Month Grid */}

      <div className="grid grid-cols-7">

        {calendarData.map((day) => (
          <CalendarDay
            key={day.day}
            day={day}
            onClick={() => onDayClick?.(day)}
          />
        ))}

      </div>

    </div>
  );
}