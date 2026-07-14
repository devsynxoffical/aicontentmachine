import React from "react";
import { CONTENT_TYPES } from "../../data/contentTypes";

export default function ContentTabs({ activeType, onSelect }) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
      {CONTENT_TYPES.map(({ id, label, icon: Icon }) => {
        const active = activeType === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-[#02A3B1] text-white border-[#02A3B1]"
                : "bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#02A3B1]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}