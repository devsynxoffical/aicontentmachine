import { ChevronDown, Sparkles, RefreshCw } from "lucide-react";

const PLATFORM_OPTIONS = ["Facebook", "Instagram", "LinkedIn", "X"];
const TONE_OPTIONS = ["Professional", "Friendly", "Casual", "Persuasive", "Humorous"];
const LENGTH_OPTIONS = ["Short", "Medium", "Long"];
const LANGUAGE_OPTIONS = ["English", "Urdu", "Spanish", "French", "German", "Arabic"];

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

/**
 * Generic AI content input form.
 *
 * Renders a field only if that key exists on `formData`, so the same
 * component works for Social Posts (platform + topic + tone + length +
 * language + details), Blog/Email/Ad forms that skip `platform`, etc.
 *
 * Props:
 * - formData: object
 * - setFormData: (updater) => void
 * - onGenerate: () => void
 * - loading: boolean
 * - creditCost: number (optional, default 1)
 */
export default function ContentForm({ formData, setFormData, onGenerate, loading, creditCost = 1 }) {
  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm md:p-6">
      <h2 className="mb-4 text-base font-semibold text-[#1A1A2E]">Content details</h2>

      <div className="flex flex-col gap-4">
        {"platform" in formData && (
          <Field label="Platform">
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((option) => {
                const active = formData.platform === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("platform", option)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#E0F7FA] border-[#02A3B1] text-[#017A85]"
                        : "bg-white border-[#E5E7EB] text-[#1A1A2E]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        {"topic" in formData && (
          <Field label="Topic or keyword">
            <input
              value={formData.topic}
              onChange={(e) => update("topic", e.target.value)}
              placeholder="e.g. Announcing our new AI content feature"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
            />
          </Field>
        )}

        {("tone" in formData || "length" in formData || "language" in formData) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {"tone" in formData && (
              <Field label="Tone">
                <Dropdown value={formData.tone} onChange={(v) => update("tone", v)} options={TONE_OPTIONS} />
              </Field>
            )}
            {"length" in formData && (
              <Field label="Length">
                <Dropdown value={formData.length} onChange={(v) => update("length", v)} options={LENGTH_OPTIONS} />
              </Field>
            )}
            {"language" in formData && (
              <Field label="Language">
                <Dropdown
                  value={formData.language}
                  onChange={(v) => update("language", v)}
                  options={LANGUAGE_OPTIONS}
                />
              </Field>
            )}
          </div>
        )}

        {"details" in formData && (
          <Field label="Extra details (optional)">
            <textarea
              value={formData.details}
              onChange={(e) => update("details", e.target.value)}
              rows={4}
              placeholder="Anything specific the AI should include — offers, links, key points..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[#02A3B1]"
            />
          </Field>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[#E5E7EB] pt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#02A3B1] py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-70"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating..." : "Generate with AI"}
        </button>
        <p className="text-center text-xs text-[#6B7280]">
          This will use {creditCost} AI credit{creditCost === 1 ? "" : "s"}.
        </p>
      </div>
    </div>
  );
}