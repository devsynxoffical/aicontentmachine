import CalendarEvent from "./CalendarEvent";

export default function CalendarDay({
  day,
  onClick,
}) {
  const events = day?.events || [];

  return (
    <button
      onClick={onClick}
      className="
        min-h-[130px]
        border-r
        border-b
        p-3
        text-left
        hover:bg-[#F8FAFC]
        transition
        flex
        flex-col
      "
    >
      {/* Day Number */}

      <div className="flex items-center justify-between mb-3">

        <span className="text-sm font-semibold text-[#1A1A2E]">
          {day.day}
        </span>

        {events.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-[#F9BE00]" />
        )}

      </div>

      {/* Events */}

      <div className="space-y-2">

        {events.length === 0 ? (

          <div className="text-xs text-gray-400">
            No content
          </div>

        ) : (

          events.map((event) => (
            <CalendarEvent
              key={`${day.day}-${event.platform}-${event.title}`}
              event={event}
            />
          ))

        )}

      </div>

    </button>
  );
}