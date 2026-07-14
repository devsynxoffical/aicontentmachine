export default function BillingToggle({ yearly, setYearly }) {
  return (
    <div className="flex justify-center py-10">

      <div className="flex items-center gap-5 bg-white rounded-full shadow-md px-6 py-4 border">

        <span
          className={`font-medium transition ${
            !yearly
              ? "text-[#1A1A2E]"
              : "text-gray-400"
          }`}
        >
          Monthly
        </span>

        {/* Toggle */}

        <button
          onClick={() => setYearly(!yearly)}
          className={`w-16 h-8 rounded-full relative transition

          ${
            yearly
              ? "bg-[#02A3B1]"
              : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition

            ${
              yearly
                ? "left-9"
                : "left-1"
            }`}
          />
        </button>

        <span
          className={`font-medium transition ${
            yearly
              ? "text-[#1A1A2E]"
              : "text-gray-400"
          }`}
        >
          Yearly
        </span>

        <span className="bg-[#F9BE00] text-[#1A1A2E] text-xs font-semibold px-3 py-1 rounded-full">
          Save 20%
        </span>

      </div>

    </div>
  );
}