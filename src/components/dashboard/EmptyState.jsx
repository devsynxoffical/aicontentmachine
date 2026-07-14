import React from "react";
import { Sparkles } from "lucide-react";

export default function EmptyState({
  title = "No items found",
  description = "Get started by creating your first item.",
  icon: Icon = Sparkles,
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm py-16">
      {/* Icon Frame */}
      <div className="w-16 h-16 rounded-2xl bg-[#E0F7FA] flex items-center justify-center text-[#02A3B1] mb-5 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      {/* Texts */}
      <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
        {title}
      </h3>
      <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
