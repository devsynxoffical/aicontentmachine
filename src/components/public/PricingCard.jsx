import { Check } from "lucide-react";

export default function PricingCard({
  plan,
  yearly = false,
  preview = false,
}) {
  const isTeal = plan.color === "teal";
  const isBusiness = plan.color === "navy";

  return (
    <div
      className={`relative rounded-2xl border bg-white shadow-lg p-2 transition hover:-translate-y-2 hover:shadow-2xl

      ${
        isTeal
          ? "border-[#02A3B1] scale-105"
          : "border-gray-200"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F9BE00] text-[#1A1A2E] text-xs font-semibold px-4 py-2 rounded-full">
          Most Popular
        </span>
      )}

      <h3
        className={`text-2xl font-bold ${
          isBusiness
            ? "text-[#1A1A2E]"
            : "text-[#017A85]"
        }`}
      >
        {plan.name}
      </h3>

      <p className="text-gray-500 mt-2">
        {plan.description}
      </p>

      <div className="mt-8">
        <span className="text-5xl font-bold text-[#1A1A2E]">
          ${yearly ? plan.priceYearly : plan.priceMonthly}
        </span>

        <span className="text-gray-500">
          /month
        </span>
      </div>

      <ul className="mt-8 space-y-4">
        {(preview
          ? plan.features.slice(0, 4)
          : plan.features
        ).map((feature) => (
          <li
            key={feature}
            className="flex gap-3"
          >
            <Check
              size={18}
              className="text-[#02A3B1] mt-1"
            />

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-10 w-full py-3 rounded-xl font-semibold transition

        ${
          isTeal
            ? "bg-[#02A3B1] text-white hover:bg-[#017A85]"
            : isBusiness
            ? "bg-[#1A1A2E] text-white hover:bg-black"
            : "border border-[#02A3B1] text-[#02A3B1] hover:bg-[#02A3B1] hover:text-white"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}