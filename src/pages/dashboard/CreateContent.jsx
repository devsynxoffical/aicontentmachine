import { useState } from "react";
import { FileText, Mail, Megaphone, Package, Globe, Share2 } from "lucide-react";
import api from "../../services/api";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GeneratorInfo from "../../components/dashboard/GeneratorInfo";
import ContentForm from "../../components/dashboard/ContentForm";
import OutputPanel from "../../components/dashboard/OutputPanel";
import LoadingOverlay from "../../components/dashboard/LoadingOverlay";

const CONTENT_TYPES = {
  social: {
    label: "Social Post",
    icon: Share2,
    title: "Create Social Media Posts",
    description: "Generate engaging social media content for Facebook, Instagram, LinkedIn and X.",
    tips: [
      "Start with a strong hook.",
      "Include a clear Call-to-Action.",
      "Keep sentences short and readable.",
      "Use relevant keywords and hashtags.",
    ],
    platforms: ["Facebook", "Instagram", "LinkedIn", "X"],
    defaultFormData: {
      platform: "Facebook",
      topic: "",
      tone: "Professional",
      length: "Medium",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `🚀 AI Generated Social Media Post\n\nTopic: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nPlatform: ${formData.platform}\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
  blog: {
    label: "Blog Article",
    icon: FileText,
    title: "Write Blog Articles",
    description: "Generate SEO-friendly, long-form blog content from a topic and a few keywords.",
    tips: [
      "Give a specific topic, not a broad one.",
      "Mention your target keyword for SEO.",
      "Longer length works better for in-depth guides.",
    ],
    defaultFormData: {
      topic: "",
      tone: "Professional",
      length: "Medium",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `📝 AI Generated Blog Article\n\nTitle: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
  email: {
    label: "Email",
    icon: Mail,
    title: "Write Email Campaigns",
    description: "Generate newsletters, promotions, and follow-up emails.",
    tips: [
      "State the offer or goal clearly.",
      "Keep the subject line under 50 characters.",
      "End with one clear call to action.",
    ],
    defaultFormData: {
      topic: "",
      tone: "Friendly",
      length: "Medium",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `📧 AI Generated Email\n\nSubject: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
  ad: {
    label: "Ad Copy",
    icon: Megaphone,
    title: "Generate Ad Copy",
    description: "Create headlines and descriptions for Google Ads and Meta Ads.",
    tips: [
      "Include your main keyword in the topic.",
      "Persuasive tone usually performs best for ads.",
      "Keep it short — ad space is limited.",
    ],
    defaultFormData: {
      topic: "",
      tone: "Persuasive",
      length: "Short",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `📣 AI Generated Ad Copy\n\nProduct: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
  product: {
    label: "Product Description",
    icon: Package,
    title: "Write Product Descriptions",
    description: "Generate persuasive product copy for your store or catalog.",
    tips: [
      "Mention the product's key benefit, not just features.",
      "Keep it scannable — short sentences work best.",
    ],
    defaultFormData: {
      topic: "",
      tone: "Persuasive",
      length: "Short",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `📦 AI Generated Product Description\n\nProduct: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
  website: {
    label: "Website Copy",
    icon: Globe,
    title: "Write Website Copy",
    description: "Generate homepage, landing page, or about-page copy.",
    tips: [
      "Say what the page needs to say (topic), not just the page name.",
      "Professional or friendly tone both work well here.",
    ],
    defaultFormData: {
      topic: "",
      tone: "Professional",
      length: "Medium",
      language: "English",
      details: "",
    },
    placeholder: (formData) =>
      `🌐 AI Generated Website Copy\n\nSection: ${formData.topic}\n\nThis is placeholder content for the frontend.\n\nTone: ${formData.tone}\nLanguage: ${formData.language}\n\nReplace this with the AI response later.`,
  },
};

export default function CreateContent() {
  const [activeType, setActiveType] = useState("social");
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [formData, setFormData] = useState(CONTENT_TYPES.social.defaultFormData);

  const config = CONTENT_TYPES[activeType];

  const handleSelectType = (typeId) => {
    setActiveType(typeId);
    setFormData(CONTENT_TYPES[typeId].defaultFormData);
    setGeneratedText("");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post("/content", {
        type: activeType,
        platform: formData.platform || null,
        topic: formData.topic,
        tone: formData.tone,
        length: formData.length,
        language: formData.language,
        details: formData.details,
      });
      setGeneratedText(response.data.data?.content || "");
    } catch (err) {
      console.error("Generation failed:", err);
      // Fall back to placeholder so user sees output even on error
      setGeneratedText(config.placeholder(formData));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* =========================
          Page Header
      ========================== */}
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">
            Create Content
          </h1>

          <p className="mt-2 text-gray-500">
            Generate high-quality AI content for social media posts, blog
            articles, email campaigns, ad copy, product descriptions, and
            website content using AI in seconds.
          </p>
        </div>

        {/* =========================
          Content Type Tabs
      ========================== */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.entries(CONTENT_TYPES).map(([id, type]) => {
            const active = activeType === id;
            const Icon = type.icon;

            return (
              <button
                key={id}
                onClick={() => handleSelectType(id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${active
                  ? "bg-[#02A3B1] text-white border-[#02A3B1]"
                  : "bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#02A3B1]"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* =========================
          Generator Info
      ========================== */}
        <GeneratorInfo
          title={config.title}
          description={config.description}
          tips={config.tips}
          platforms={config.platforms || []}
        />

        {/* =========================
          Content Form + Output
      ========================== */}
        <div className="grid xl:grid-cols-2 gap-6 relative">

          {loading && <LoadingOverlay />}

          <ContentForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={handleGenerate}
            loading={loading}
          />

          <OutputPanel
            generatedText={generatedText}
            setGeneratedText={setGeneratedText}
            onGenerate={handleGenerate}
            navigate={() => { }}
          />

        </div>

      </div>
    </DashboardLayout>
  );
}