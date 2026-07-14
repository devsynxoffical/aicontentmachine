const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
];

const events = [
  {
    time: "09:00",
    title: "Facebook Campaign",
    platform: "Facebook",
    color: "bg-[#02A3B1]",
  },
  {
    time: "11:00",
    title: "Instagram Reel",
    platform: "Instagram",
    color: "bg-pink-500",
  },
  {
    time: "02:00",
    title: "LinkedIn Article",
    platform: "LinkedIn",
    color: "bg-blue-600",
  },
  {
    time: "04:00",
    title: "X Promotion",
    platform: "X",
    color: "bg-[#1A1A2E]",
  },
];

export default function DayView() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b bg-[#F8FAFC]">

        <h2 className="text-xl font-semibold text-[#1A1A2E]">
          Today's Schedule
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Manage all scheduled content for today.
        </p>

      </div>

      {/* Timeline */}

      <div>

        {hours.map((hour) => {

          const event = events.find(
            (item) => item.time === hour
          );

          return (
            <div
              key={hour}
              className="grid grid-cols-12 border-b last:border-b-0 min-h-[72px]"
            >
              {/* Time */}

              <div className="col-span-2 border-r p-4 text-sm text-gray-500 font-medium">
                {hour}
              </div>

              {/* Event */}

              <div className="col-span-10 p-3">

                {event ? (

                  <div
                    className={`${event.color} text-white rounded-xl px-4 py-3 shadow`}
                  >
                    <h3 className="font-semibold">
                      {event.title}
                    </h3>

                    <p className="text-sm opacity-90 mt-1">
                      {event.platform}
                    </p>
                  </div>

                ) : (

                  <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    No scheduled content
                  </div>

                )}

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}