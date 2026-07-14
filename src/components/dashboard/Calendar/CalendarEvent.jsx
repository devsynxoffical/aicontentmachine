const platformStyles = {
  Facebook: "bg-[#02A3B1] text-white",
  Instagram: "bg-pink-500 text-white",
  LinkedIn: "bg-blue-700 text-white",
  X: "bg-[#1A1A2E] text-white",
};

export default function CalendarEvent({ event }) {
  return (
    <div
      className={`
        rounded-md
        px-2
        py-1
        text-xs
        font-medium
        truncate
        cursor-pointer
        transition
        hover:opacity-90
        ${
          platformStyles[event.platform] ??
          "bg-gray-500 text-white"
        }
      `}
      title={`${event.title} • ${event.platform}`}
    >
      {event.title}
    </div>
  );
}