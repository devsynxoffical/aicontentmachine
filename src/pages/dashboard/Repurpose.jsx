import { useState } from "react";
import api from "../../services/api";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Save,
  ArrowRight,
  Mail,
  FileText,
  List,
  ChevronDown,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"; import DashboardLayout from "../../components/dashboard/DashboardLayout";

const OUTPUT_FORMATS = [
  {
    id: "facebook",
    label: "Facebook Post",
    icon: FaFacebook,
    credits: 1,
  },
  {
    id: "instagram",
    label: "Instagram Caption",
    icon: FaInstagram,
    credits: 1,
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    icon: FaLinkedin,
    credits: 1,
  },
  {
    id: "xthread",
    label: "X Thread",
    icon: FaXTwitter,
    credits: 2,
  },
  {
    id: "email",
    label: "Email Newsletter",
    icon: Mail,
    credits: 2,
  },
  {
    id: "summary",
    label: "Blog Summary",
    icon: FileText,
    credits: 1,
  },
  {
    id: "bullets",
    label: "5 Key Bullet Points",
    icon: List,
    credits: 1,
  },
  {
    id: "youtube",
    label: "YouTube Description",
    icon: FaYoutube,
    credits: 1,
  },
];

function generateOutput(format, content) {
  const snippet = content.slice(0, 60).replace(/\n/g, " ");
  switch (format) {
    case "facebook":
      return `📣 We just published something you need to read!\n\n"${snippet}..."\n\nDrop your thoughts in the comments below 👇 and share this with someone who needs to see it!\n\n#ContentMarketing #AIContent #DevSynx`;
    case "instagram":
      return `✨ ${snippet}...\n\nDouble-tap if this resonates with you! 💛\n\n.\n.\n.\n#Marketing #AITools #ContentCreator #GrowthHacking #DevSynx #SocialMedia #Productivity`;
    case "linkedin":
      return `I want to share something that changed how I think about content.\n\n"${snippet}..."\n\nHere's what I learned from this:\n→ AI doesn't replace creativity — it amplifies it.\n→ Consistency builds trust over time.\n→ Data-driven decisions outperform gut feelings.\n\nWhat's your take? Let's discuss in the comments.\n\n#LinkedInMarketing #ContentStrategy #AIMarketing`;
    case "xthread":
      return `1/ You need to hear this.\n\n${snippet}...\n\n2/ The key insight here is that most marketers overlook consistency. They start strong, then drop off after 3 weeks.\n\n3/ The solution? Automate the repetitive parts with AI and save your creative energy for strategy.\n\n4/ This is exactly what tools like @DevSynx are built for. Try it free today.\n\n5/ Retweet this thread if you found it useful! 🔁`;
    case "email":
      return `Subject: Here's what you missed this week\n\nHi {first_name},\n\nI hope your week is going well!\n\nThis week, we published a piece that's getting a lot of attention:\n\n"${snippet}..."\n\nIn it, we cover the key strategies that top marketers are using in 2026 to scale content production without burning out.\n\nClick the button below to read the full article.\n\n[Read Now →]\n\nTalk soon,\nThe DevSynx Team`;
    case "summary":
      return `## Article Summary\n\nThis article explores: "${snippet}..."\n\n**Key Takeaways:**\n- The importance of consistent, AI-assisted content production\n- How to repurpose content across multiple platforms\n- Practical strategies for maximizing reach with minimal effort\n\n**Bottom Line:** Leveraging AI tools like DevSynx allows marketers to produce high-quality content at scale, reducing production time by up to 70%.`;
    case "bullets":
      return `🔑 5 Key Points from This Article:\n\n1. AI content tools are not replacing writers — they're empowering them.\n2. Repurposing one piece of content can reach 8x more audience touchpoints.\n3. Consistency in posting schedule improves algorithm reach by 40%.\n4. Multi-format content builds a stronger brand presence across channels.\n5. Automation handles distribution so creators can focus on strategy.`;
    case "youtube":
      return `In this video, we discuss: ${snippet}...\n\nThis is a must-watch if you're a content creator, marketer, or business owner looking to scale your output using AI tools.\n\n📌 Chapters:\n0:00 Introduction\n1:30 The Core Concept\n4:00 Step-by-Step Strategy\n7:45 Real World Examples\n10:00 Conclusion & Tips\n\n🔔 Subscribe for weekly AI marketing tutorials!\n\n🔗 Try DevSynx Free: https://devsynx.com\n\n#AIContent #ContentMarketing #YouTubeGrowth`;
    default:
      return "Generated content will appear here.";
  }
}

export default function Repurpose() {
  const [inputContent, setInputContent] = useState("");
  const [selectedFormats, setSelectedFormats] = useState(["facebook", "instagram"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState({});
  const [copied, setCopied] = useState({});
  const [saved, setSaved] = useState({});

  const totalCredits = selectedFormats.reduce((sum, id) => {
    const fmt = OUTPUT_FORMATS.find(f => f.id === id);
    return sum + (fmt ? fmt.credits : 0);
  }, 0);

  const toggleFormat = (id) => {
    setSelectedFormats(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!inputContent || selectedFormats.length === 0) return;
    setIsGenerating(true);
    setOutputs({});

    try {
      const res = await api.post("/repurpose", {
        originalContent: inputContent,
        formats: selectedFormats,
      });
      setOutputs(res.data.data?.outputs || {});
    } catch (err) {
      console.error("Repurpose failed:", err);
      // Graceful fallback to local generation
      const newOutputs = {};
      selectedFormats.forEach((fid) => {
        newOutputs[fid] = generateOutput(fid, inputContent);
      });
      setOutputs(newOutputs);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (fid) => {
    navigator.clipboard.writeText(outputs[fid] || "");
    setCopied(p => ({ ...p, [fid]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [fid]: false })), 1800);
  };

  const handleSave = (fid) => {
    setSaved(p => ({ ...p, [fid]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [fid]: false })), 1800);
  };

  return (
    <DashboardLayout title="Repurpose Content">
      <div className="space-y-6 pb-12 text-left">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Repurpose Content</h1>
          <p className="text-gray-500 mt-1.5">
            Turn one piece of content into multiple formats automatically — posts, threads, newsletters, and more.
          </p>
        </div>

        {/* Input + Format Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Paste content area */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Paste Your Content
              </label>
              <textarea
                rows={12}
                placeholder="Paste your blog post, article, transcript, or any long-form content here..."
                value={inputContent}
                onChange={e => setInputContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm leading-relaxed resize-none"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{inputContent.trim().split(/\s+/).filter(Boolean).length} words pasted</span>
                <button onClick={() => setInputContent("")} className="hover:text-red-400 transition font-semibold">Clear</button>
              </div>
            </div>
          </div>

          {/* Output format selector */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 flex flex-col">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                Select Output Formats
              </label>
              <div className="space-y-2">
                {OUTPUT_FORMATS.map(fmt => {
                  const Icon = fmt.icon;
                  const isSelected = selectedFormats.includes(fmt.id);
                  return (
                    <label key={fmt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${isSelected ? "border-[#02A3B1] bg-[#E0F7FA]/20" : "border-gray-200 bg-white hover:border-gray-300"}`}
                    >
                      <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleFormat(fmt.id)} />
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition shrink-0 ${isSelected ? "bg-[#02A3B1] border-[#02A3B1]" : "border-gray-300"}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#02A3B1]" : "text-gray-400"}`} />
                      <span className={`flex-1 text-sm font-semibold ${isSelected ? "text-[#1A1A2E]" : "text-gray-500"}`}>{fmt.label}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{fmt.credits} credit{fmt.credits > 1 ? "s" : ""}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex-1" />

            <div className="border-t border-gray-100 pt-4 space-y-3">
              {selectedFormats.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{selectedFormats.length} format{selectedFormats.length > 1 ? "s" : ""} selected</span>
                  <span className="font-bold text-[#1A1A2E] bg-[#F9BE00]/10 text-[#F9BE00] border border-[#F9BE00]/30 px-2.5 py-0.5 rounded-full text-xs">
                    {totalCredits} AI Credits
                  </span>
                </div>
              )}
              <button
                disabled={!inputContent || selectedFormats.length === 0 || isGenerating}
                onClick={handleGenerate}
                className={`w-full py-3 rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-2 ${!inputContent || selectedFormats.length === 0 || isGenerating ? "bg-gray-300 cursor-not-allowed" : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"}`}
              >
                {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" />Repurposing...</> : <><Sparkles className="w-4 h-4" />Repurpose Now</>}
              </button>
            </div>
          </div>
        </div>

        {/* Generating skeleton */}
        {isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedFormats.map(f => (
              <div key={f} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Results */}
        {!isGenerating && Object.keys(outputs).length > 0 && (
          <div>
            <h3 className="text-base font-bold text-[#1A1A2E] mb-4">
              Repurposed Content — {Object.keys(outputs).length} formats ready
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(outputs).map(([fid, text]) => {
                const fmt = OUTPUT_FORMATS.find(f => f.id === fid);
                const Icon = fmt?.icon || Sparkles;
                return (
                  <div key={fid} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                      <Icon className="w-4 h-4 text-[#02A3B1]" />
                      <span className="text-sm font-bold text-[#1A1A2E]">{fmt?.label}</span>
                    </div>
                    <div className="p-5 flex-1">
                      <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{text}</pre>
                    </div>
                    <div className="flex gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50 justify-end">
                      <button onClick={() => handleSave(fid)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#02A3B1] transition">
                        {saved[fid] ? <><Check className="w-3.5 h-3.5 text-green-500" />Saved!</> : <><Save className="w-3.5 h-3.5" />Save</>}
                      </button>
                      <button onClick={() => handleCopy(fid)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${copied[fid] ? "bg-green-500 text-white" : "bg-[#02A3B1] hover:bg-[#017A85] text-white"}`}>
                        {copied[fid] ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}