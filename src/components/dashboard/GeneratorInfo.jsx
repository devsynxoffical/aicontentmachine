import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * Header/info card shown above the generator form + output grid.
 *
 * Props:
 * - title: string
 * - description: string
 * - tips: string[]            (optional)
 * - platforms: string[]       (optional — omit for non-social generators like Blog/Email)
 */
export default function GeneratorInfo({ title, description, tips = [], platforms = [] }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E0F7FA]">
          <Sparkles className="h-5 w-5 text-[#017A85]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#1A1A2E] md:text-xl">{title}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
        </div>
      </div>

      {(tips.length > 0 || platforms.length > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-5 border-t border-[#E5E7EB] pt-5 sm:grid-cols-2">
          {tips.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-[#6B7280]">Tips for best results</p>
              <ul className="flex flex-col gap-1.5">
                {tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-[#1A1A2E]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#02A3B1]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {platforms.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-[#6B7280]">Available for</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full bg-[#F4F6F8] px-3 py-1 text-xs font-medium text-[#1A1A2E]"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}