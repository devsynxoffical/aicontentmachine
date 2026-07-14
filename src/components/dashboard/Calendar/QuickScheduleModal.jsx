import { X, CalendarPlus } from "lucide-react";
import { useState } from "react";

const platforms = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "X",
];

const statusOptions = [
  "Draft",
  "Scheduled",
  "Published",
];

export default function QuickScheduleModal({
  open,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: "",
    platform: "Facebook",
    date: "",
    time: "",
    status: "Scheduled",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    alert("Phase 1 UI only.\nScheduling will be implemented later.");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="fixed inset-0 flex items-center justify-center z-50 p-5">

        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

          {/* Header */}

          <div className="flex items-center justify-between border-b px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#E0F7FA] flex items-center justify-center">

                <CalendarPlus
                  size={22}
                  className="text-[#02A3B1]"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-[#1A1A2E]">
                  Quick Schedule
                </h2>

                <p className="text-sm text-gray-500">
                  Schedule content for your calendar.
                </p>

              </div>

            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>

          </div>

          {/* Body */}

          <div className="p-6 space-y-5">

            {/* Title */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Content Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                placeholder="Summer Sale Campaign"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#02A3B1]/20 outline-none"
              />

            </div>

            {/* Platform */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Platform
              </label>

              <select
                value={formData.platform}
                onChange={(e) =>
                  handleChange("platform", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                {platforms.map((platform) => (
                  <option key={platform}>
                    {platform}
                  </option>
                ))}
              </select>

            </div>

            {/* Date & Time */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    handleChange("date", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Time
                </label>

                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    handleChange("time", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

              </div>

            </div>

            {/* Status */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                {statusOptions.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Footer */}

          <div className="border-t px-6 py-5 flex justify-end gap-3">

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-[#02A3B1] hover:bg-[#017A85] text-white transition"
            >
              Schedule Content
            </button>

          </div>

        </div>

      </div>
    </>
  );
}