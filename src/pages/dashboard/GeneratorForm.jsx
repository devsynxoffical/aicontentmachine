import React from "react";
import { ChevronDown, Sparkles, RefreshCw } from "lucide-react";
import { PLATFORMS } from "../../dashboard/SocialIcons";
import { TONES, LENGTHS, LANGUAGES, GENERATE_CREDIT_COST } from "../../data/contentGeneratorconfig";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#6B7280]">{label}</label>
      {children}
    </div>
  );
}

function Dropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#1A1A2E] outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
    </div>
  );
}

export default function GeneratorForm({
  isSocial,
  platform,
  onPlatformChange,
  topic,
  onTopicChange,
  tone,
  onToneChange,
  length,
  onLengthChange,
  language,
  onLanguageChange,
  details,
  onDetailsChange,
  onGenerate,
  isGenerating,
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm md:p-6">
      <h2 className="mb-4 text-base font-semibold text-[#1A1A2E]">Content details</h2>

      <div className="flex flex-col gap-4">
        {isSocial && (
          <Field label="Platform">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ id, label, icon: Icon }) => {
                const active = platform === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onPlatformChange(id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#E0F7FA] border-[#02A3B1] text-[#017A85]"
                        : "bg-white border-[#E5E7EB] text-[#1A1A2E]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        <Field label="Topic or keyword">
          <input
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Announcing our new AI content feature"
            className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Tone">
            <Dropdown value={tone} onChange={onToneChange} options={TONES} />
          </Field>
          <Field label="Length">
            <Dropdown value={length} onChange={onLengthChange} options={LENGTHS} />
          </Field>
          <Field label="Language">
            <Dropdown value={language} onChange={onLanguageChange} options={LANGUAGES} />
          </Field>
        </div>

        <Field label="Extra details (optional)">
          <textarea
            value={details}
            onChange={(e) => onDetailsChange(e.target.value)}
            rows={4}
            placeholder="Anything specific the AI should include — offers, links, key points..."
            className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
          />
        </Field>
      </div>

      {/* Generate Button */}
      <div className="mt-5 flex flex-col gap-2 border-t border-[#E5E7EB] pt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#02A3B1] py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-70"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate with AI"}
        </button>
        <p className="text-center text-xs text-[#6B7280]">
          This will use {GENERATE_CREDIT_COST} AI credit{GENERATE_CREDIT_COST === 1 ? "" : "s"}.
        </p>
      </div>
    </div>
  );
}