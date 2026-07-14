import React from "react";
import { Sparkles, RefreshCw, Copy, Save, CalendarClock, X } from "lucide-react";

export default function EditorPanel({
  output,
  onOutputChange,
  isGenerating,
  isSocial,
  hashtags,
  onRemoveHashtag,
  onCopy,
  copied,
  onRegenerate,
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1A1A2E]">AI output</h2>
        {output && !isGenerating && (
          <span className="rounded-full bg-[#E0F7FA] px-2.5 py-1 text-xs font-medium text-[#017A85]">
            Ready to review
          </span>
        )}
      </div>

      {!output && !isGenerating && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#E5E7EB] text-center">
          <Sparkles className="mb-2 h-6 w-6 text-[#02A3B1]" />
          <p className="text-sm font-medium text-[#1A1A2E]">Nothing generated yet</p>
          <p className="mt-1 max-w-xs text-xs text-[#6B7280]">
            Fill in the details on the left and click Generate with AI.
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#E5E7EB]">
          <RefreshCw className="mb-2 h-6 w-6 animate-spin text-[#02A3B1]" />
          <p className="text-sm font-medium text-[#1A1A2E]">Writing your content...</p>
        </div>
      )}

      {output && !isGenerating && (
        <>
          <textarea
            value={output}
            onChange={(e) => onOutputChange(e.target.value)}
            rows={10}
            className="w-full resize-none rounded-lg border border-[#E5E7EB] p-3 text-sm leading-relaxed text-[#1A1A2E] outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
          />

          {/* Hashtag Suggestions */}
          {isSocial && hashtags.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-[#6B7280]">Hashtag suggestions</p>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full bg-[#E0F7FA] px-3 py-1.5 text-xs font-medium text-[#017A85]"
                  >
                    {tag}
                    <button onClick={() => onRemoveHashtag(tag)} aria-label={`Remove ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
            <button
              onClick={onCopy}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#02A3B1] px-4 py-2 text-sm font-medium text-[#017A85] transition-colors"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors">
              <Save className="h-4 w-4" />
              Save as Draft
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-lg bg-[#02A3B1] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <CalendarClock className="h-4 w-4" />
              Schedule
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  );
}