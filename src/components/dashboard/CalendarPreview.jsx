import { Link } from "react-router-dom";
import {
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import { calendarData } from "../../data/calendardata";

export default function CalendarPreview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-2">

          <CalendarDays
            size={22}
            className="text-[#02A3B1]"
          />

          <h2 className="text-lg font-semibold text-[#1A1A2E]">
            Upcoming Schedule
          </h2>

        </div>

        <Link
          to="/dashboard/calendar"
          className="text-sm text-[#02A3B1] hover:underline flex items-center gap-1"
        >
          View Full

          <ChevronRight size={16} />

        </Link>

      </div>

      {/* Schedule */}

      <div className="space-y-4">

        {calendarData
          .filter((day) => day.events.length > 0)
          .flatMap((day) =>
            day.events.map((event) => (

              <div
                key={`${day.day}-${event.id}`}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 text-sm font-semibold text-gray-500">
                    {day.day}
                  </div>

                  <div>

                    <h4 className="font-medium text-[#1A1A2E]">
                      {event.title}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {event.platform} • {event.time}
                    </p>

                  </div>

                </div>

                <div
                  className={`w-3 h-3 rounded-full ${event.color}`}
                />

              </div>

            ))
          )}

      </div>

    </div>
  );
}