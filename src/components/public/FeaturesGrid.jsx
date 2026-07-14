import {
  Share2,
  BookOpen,
  Mail,
  Megaphone,
  CalendarDays,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "Social Posts",
    desc: "Generate engaging posts for Facebook, Instagram, LinkedIn, and X in seconds.",
  },
  {
    icon: BookOpen,
    title: "Blog Writer",
    desc: "Create long-form SEO-optimized blog articles with AI assistance.",
  },
  {
    icon: Mail,
    title: "Email Copy",
    desc: "Write high-converting email campaigns and newsletters easily.",
  },
  {
    icon: Megaphone,
    title: "Ad Generator",
    desc: "Produce powerful ad copy for Google Ads and social media campaigns.",
  },
  {
    icon: CalendarDays,
    title: "Content Calendar",
    desc: "Plan, schedule, and organize all your marketing content visually.",
  },
  {
    icon: Languages,
    title: "Multi-language",
    desc: "Generate content in multiple languages with SEO optimization.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="bg-[#F4F6F8] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy">
            Powerful Features
          </h2>
          <p className="text-grayText mt-3">
            Everything you need to create, manage, and scale your content
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-lightTeal flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-navy">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-grayText mt-2 leading-6">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}