import {
  History,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const prompts = [
  {
    title: "Summer Sale Campaign",
    type: "Social Post",
    time: "2 mins ago",
  },
  {
    title: "AI Marketing Blog",
    type: "Blog Article",
    time: "15 mins ago",
  },
  {
    title: "Black Friday Promotion",
    type: "Ad Copy",
    time: "Today",
  },
  {
    title: "Product Launch Email",
    type: "Email",
    time: "Yesterday",
  },
  {
    title: "Real Estate Listing",
    type: "Website Copy",
    time: "Yesterday",
  },
];

export default function RecentPrompts() {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#E0F7FA] flex items-center justify-center">
            <History
              size={22}
              className="text-[#02A3B1]"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1A2E]">
              Recent Prompts
            </h2>

            <p className="text-sm text-gray-500">
              Reuse your previous AI prompts.
            </p>
          </div>

        </div>

        <button className="text-[#02A3B1] font-medium hover:underline">
          View History
        </button>

      </div>

      <div className="space-y-4">

        {prompts.map((prompt, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-gray-200
              p-4
              hover:border-[#02A3B1]
              hover:bg-[#E0F7FA]
              transition
              cursor-pointer
            "
          >

            <div>

              <h3 className="font-semibold text-[#1A1A2E]">
                {prompt.title}
              </h3>

              <div className="flex items-center gap-3 mt-2">

                <span className="text-xs bg-[#E0F7FA] text-[#017A85] px-3 py-1 rounded-full">
                  {prompt.type}
                </span>

                <span className="text-xs text-gray-500">
                  {prompt.time}
                </span>

              </div>

            </div>

            <button
              className="
                w-10
                h-10
                rounded-lg
                bg-[#02A3B1]
                hover:bg-[#017A85]
                text-white
                flex
                items-center
                justify-center
                transition
              "
            >
              <ArrowUpRight size={18} />
            </button>

          </div>

        ))}

      </div>

      <div className="mt-6 rounded-xl bg-[#F4F6F8] p-5 flex items-center gap-4">

        <Sparkles className="text-[#F9BE00]" size={26} />

        <div>

          <h4 className="font-semibold text-[#1A1A2E]">
            AI Tip
          </h4>

          <p className="text-sm text-gray-600">
            Reusing previous prompts saves time and helps maintain a consistent
            brand voice across campaigns.
          </p>

        </div>

      </div>

    </section>
  );
}