import {
  X,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function DayDetailDrawer({
  selectedDay,
  onClose,
  onDelete,
}) {
  const navigate = useNavigate();

  const getEditRoute = (type, id) => {
    switch (type) {
      case "social":
        return `/dashboard/social-post?id=${id}`;

      case "blog":
        return `/dashboard/blog?id=${id}`;

      case "email":
        return `/dashboard/email?id=${id}`;

      case "ad-copy":
        return `/dashboard/ad-copy?id=${id}`;

      case "product-description":
        return `/dashboard/product-description?id=${id}`;

      case "seo":
        return `/dashboard/seo?id=${id}`;

      default:
        return "/dashboard/create-content";
    }
  };

  return (
    <>
      {/* Backdrop */}

      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed
          top-20
          right-0
          bottom-0
          h-[calc(100vh-5rem)]
          w-full
          sm:w-[420px]
          bg-white
          shadow-2xl
          border-l
          z-50
          transition-transform
          duration-300
          ${
            selectedDay
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div>

            <h2 className="text-2xl font-bold text-[#1A1A2E]">
              Day {selectedDay?.day}
            </h2>

            <p className="text-sm text-gray-500">
              Scheduled Content
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={22} />
          </button>

        </div>

        {/* Content */}

        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-88px)]">

          {!selectedDay ||
          selectedDay.events.length === 0 ? (

            <div className="text-center mt-20">

              <h3 className="font-semibold text-[#1A1A2E]">
                No Content Scheduled
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Nothing has been scheduled for this day.
              </p>

            </div>

          ) : (

            selectedDay.events.map((event) => (

              <div
                key={event.id}
                className="rounded-xl border border-gray-200 p-5 shadow-sm"
              >
                {/* Title */}

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-[#1A1A2E]">
                    {event.title}
                  </h3>

                  <span
                    className={`
                      ${event.color}
                      text-white
                      px-3
                      py-1
                      rounded-full
                      text-xs
                    `}
                  >
                    {event.platform}
                  </span>

                </div>

                {/* Time */}

                <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">

                  <Clock size={16} />

                  <span>{event.time}</span>

                </div>

                {/* Actions */}

                <div className="flex gap-3 mt-5">

                  {/* Edit */}

                  <button
                    onClick={() =>
                      navigate(
                        getEditRoute(
                          event.type,
                          event.id
                        )
                      )
                    }
                    className="
                      flex-1
                      border
                      border-[#02A3B1]
                      text-[#02A3B1]
                      rounded-lg
                      py-2
                      hover:bg-[#E0F7FA]
                      transition
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  {/* Delete */}

                  <button
                    onClick={() => onDelete(event)}
                    className="
                      flex-1
                      border
                      border-red-500
                      text-red-500
                      rounded-lg
                      py-2
                      hover:bg-red-50
                      transition
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </>
  );
}