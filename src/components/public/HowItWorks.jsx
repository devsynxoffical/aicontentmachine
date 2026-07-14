import {
  FileText,
  Sparkles,
  CalendarCheck2,
} from "lucide-react";

const steps = [
  {
    id: "01",
    icon: FileText,
    title: "Choose Your Content Type",
    description:
      "Select whether you want to create a social post, blog article, email campaign, ad copy, or website content.",
  },
  {
    id: "02",
    icon: Sparkles,
    title: "Let AI Write It",
    description:
      "Provide your topic and preferences, then let AI generate high-quality marketing content in seconds.",
  },
  {
    id: "03",
    icon: CalendarCheck2,
    title: "Schedule or Publish",
    description:
      "Save your content, schedule it for later, or publish it across your marketing channels.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white py-20"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy">
            How It Works
          </h2>

          <p className="text-grayText mt-3 max-w-2xl mx-auto">
            Create professional marketing content in just three simple
            steps using the power of artificial intelligence.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="bg-white rounded-xl shadow-md p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mx-auto">
                  {step.id}
                </div>

                <div className="mt-6 flex justify-center">
                  <Icon
                    size={42}
                    className="text-primary"
                  />
                </div>

                <h3 className="text-xl font-semibold text-navy mt-6">
                  {step.title}
                </h3>

                <p className="text-grayText mt-4 leading-7">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}