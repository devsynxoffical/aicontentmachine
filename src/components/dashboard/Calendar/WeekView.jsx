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

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const events = {
  Mon: [
    {
      time: "10:00",
      title: "LinkedIn Post",
      color: "bg-blue-600",
    },
  ],

  Tue: [
    {
      time: "01:00",
      title: "Instagram Reel",
      color: "bg-pink-500",
    },
  ],

  Wed: [
    {
      time: "11:00",
      title: "Blog Article",
      color: "bg-green-500",
    },
  ],

  Thu: [
    {
      time: "03:00",
      title: "Email Campaign",
      color: "bg-yellow-500",
    },
  ],

  Fri: [
    {
      time: "09:00",
      title: "Facebook Ad",
      color: "bg-[#02A3B1]",
    },
  ],

  Sat: [],

  Sun: [],
};

export default function WeekView() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-auto">

      {/* Header */}

      <div className="grid grid-cols-8 border-b bg-[#F8FAFC]">

        <div className="p-4 border-r"></div>

        {weekDays.map((day) => (
          <div
            key={day}
            className="p-4 text-center font-semibold border-r last:border-r-0"
          >
            {day}
          </div>
        ))}

      </div>

      {/* Body */}

      {hours.map((hour) => (

        <div
          key={hour}
          className="grid grid-cols-8 border-b min-h-[70px]"
        >

          {/* Time */}

          <div className="border-r text-sm text-gray-500 p-3">
            {hour}
          </div>

          {weekDays.map((day) => {

            const event = events[day].find(
              (e) => e.time === hour
            );

            return (
              <div
                key={day}
                className="border-r last:border-r-0 p-2"
              >

                {event && (

                  <div
                    className={`${event.color} text-white rounded-lg px-3 py-2 text-xs shadow`}
                  >
                    {event.title}
                  </div>

                )}

              </div>
            );

          })}

        </div>

      ))}

    </div>
  );
}