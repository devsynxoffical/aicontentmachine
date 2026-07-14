import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import FeaturesHero from "../../components/public/FeaturesHero";
import FeatureSection from "../../components/public/FeatureSection";

const features = [
  {
    title: "Social Media Posts",
    description:
      "Generate engaging posts for Facebook, Instagram, LinkedIn, and X in seconds with AI-powered writing tailored for each platform.",
    points: [
      "Platform-specific captions",
      "AI hashtag suggestions",
      "Emoji & CTA optimization",
    ],
  },
  {
    title: "Blog Articles",
    description:
      "Create long-form SEO-friendly blog posts with intelligent structure, keywords, and formatting.",
    points: [
      "SEO optimization",
      "Keyword integration",
      "Professional formatting",
    ],
  },
  {
    title: "Website Copy",
    description:
      "Generate landing pages, homepage copy, service pages, and persuasive website content.",
    points: [
      "Conversion focused",
      "Professional tone",
      "Brand consistency",
    ],
  },
  {
    title: "Product Descriptions",
    description:
      "Create compelling product descriptions that increase engagement and conversions.",
    points: [
      "Benefits driven",
      "SEO ready",
      "E-commerce optimized",
    ],
  },
  {
    title: "Email Marketing",
    description:
      "Generate newsletters, welcome emails, promotional campaigns and follow-up emails effortlessly.",
    points: [
      "High-converting subject lines",
      "Personalized messaging",
      "Clear CTAs",
    ],
  },
  {
    title: "Ad Copy",
    description:
      "Generate Google Ads and Meta Ads with multiple headline and description variations.",
    points: [
      "Google Ads",
      "Facebook Ads",
      "Instagram Ads",
    ],
  },
  {
    title: "Content Calendar",
    description:
      "Plan, organize, and schedule your marketing content from one powerful dashboard.",
    points: [
      "Weekly planning",
      "Monthly scheduling",
      "Publishing reminders",
    ],
  },
  {
    title: "AI Image Generation",
    description:
      "Generate professional AI marketing visuals for social media campaigns and advertisements.",
    points: [
      "Multiple image styles",
      "Marketing ready",
      "High resolution",
    ],
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track content performance across all channels using intuitive charts and reports.",
    points: [
      "Performance metrics",
      "Engagement insights",
      "Export reports",
    ],
  },
  {
    title: "Multi-language Support",
    description:
      "Generate marketing content in multiple languages with natural and localized writing.",
    points: [
      "50+ languages",
      "Native quality",
      "Automatic localization",
    ],
  },
  {
    title: "SEO Optimization",
    description:
      "Improve search engine rankings with built-in SEO analysis and recommendations.",
    points: [
      "SEO scoring",
      "Keyword density",
      "Meta tags generation",
    ],
  },
  {
    title: "Content Repurposing",
    description:
      "Turn one blog into social posts, newsletters, ad copy, summaries and much more.",
    points: [
      "One-click repurposing",
      "Multiple formats",
      "Save hours every week",
    ],
  },
];

export default function Features() {
  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* Hero */}
        <FeaturesHero />

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.title}
            title={feature.title}
            description={feature.description}
            points={feature.points}
            reverse={index % 2 === 1}
          />
        ))}

        {/* CTA Banner */}
        <section className="py-24 bg-[#F4F6F8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-[#02A3B1] rounded-3xl text-center py-20 px-8 shadow-xl">

              <span className="inline-block bg-white/20 text-white px-5 py-2 rounded-full text-sm mb-6">
                Start Creating Today
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Start?
              </h2>

              <p className="text-white/90 text-lg max-w-3xl mx-auto mt-6 leading-8">
                Join thousands of businesses using AI Content Machine to create
                blogs, social media posts, marketing emails, advertisements,
                product descriptions and much more.
              </p>

              <button className="mt-10 bg-white text-[#02A3B1] px-10 py-4 rounded-xl font-semibold hover:scale-105 transition duration-300">
                Try It Free
              </button>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}