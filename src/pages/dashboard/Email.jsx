import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  Eye,
  Mail,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Copy,
  Save,
  Info,
  Layers,
  Award,
  Users,
  Target,
  FileText,
  Volume2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DeleteModal from "../../components/dashboard/DeleteModal";
import EmptyState from "../../components/dashboard/EmptyState";
import api from "../../services/api";
import { initialEmails } from "../../data/emailsdata";

// Campaign type configs
const CAMPAIGN_TYPES = [
  {
    id: "Newsletter",
    title: "Newsletter",
    desc: "Keep your list engaged with regular product news, articles, and brand updates.",
    icon: Mail,
    color: "text-[#02A3B1] bg-[#E0F7FA]"
  },
  {
    id: "Promotional",
    title: "Promotional",
    desc: "Pitch a sale, discounts, or advertise new launches to maximize conversions.",
    icon: Award,
    color: "text-amber-600 bg-amber-50"
  },
  {
    id: "Welcome",
    title: "Welcome",
    desc: "Greet new subscribers immediately after signup and explain next steps.",
    icon: Users,
    color: "text-purple-600 bg-purple-50"
  },
  {
    id: "Follow-Up",
    title: "Follow-Up",
    desc: "Re-engage cold subscribers or check in with post-purchase workflows.",
    icon: Target,
    color: "text-emerald-600 bg-emerald-50"
  }
];

const TONES = ["Professional", "Friendly", "Casual", "Persuasive", "Humorous"];

export default function Email() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/content?type=email");
      const mapped = (data.data || []).map(e => {
        let subject = e.title;
        let body = e.content;
        let ctaText = "Get Started Now";
        let ctaUrl = "https://devsynx.com/dashboard";
        
        if (e.content.includes("Subject:")) {
          const matchSub = e.content.match(/Subject:\s*(.*)/i);
          if (matchSub) subject = matchSub[1].trim();
        }
        
        return {
          id: e.id,
          name: e.title,
          subject: subject,
          type: e.description ? e.description.split(" - ")[0] : "Newsletter",
          status: e.status.charAt(0) + e.status.slice(1).toLowerCase(),
          fromName: "DevSynx Team",
          body: body,
          ctaText: ctaText,
          ctaUrl: ctaUrl,
          dateCreated: e.createdAt.split("T")[0],
          isFavorite: e.isFavorite,
        };
      });
      setEmails(mapped);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // List search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selection states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewEmail, setPreviewEmail] = useState(null);

  // AI Wizard stepper state
  const [wizardStep, setWizardStep] = useState(1); // Steps: 1 (Type), 2 (Inputs), 3 (Generating), 4 (Refine & Export)
  const [selectedType, setSelectedType] = useState("Newsletter");
  
  const [wizardInputs, setWizardInputs] = useState({
    productName: "",
    goal: "",
    audience: "",
    tone: "Professional"
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Filter campaigns
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      if (typeFilter !== "All" && item.type !== typeFilter) {
        return false;
      }
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.subject.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [emails, typeFilter, statusFilter, searchQuery]);

  // Individual Actions
  const handleEditClick = (campaign) => {
    setEditingEmail({ ...campaign });
    setSelectedType(campaign.type);
    setWizardInputs({
      productName: "DevSynx App",
      goal: "Promote features",
      audience: "Standard user base",
      tone: "Professional"
    });
    setWizardStep(4); // Skip to Step 4 (Editor) when editing
    setIsWizardOpen(true);
  };

  const handleCreateNewClick = () => {
    setEditingEmail({
      id: null,
      name: "",
      subject: "",
      type: "Newsletter",
      status: "Draft",
      fromName: "DevSynx Team",
      body: "",
      ctaText: "Check It Out",
      ctaUrl: "https://devsynx.com",
      dateCreated: new Date().toISOString().split("T")[0]
    });
    setSelectedType("Newsletter");
    setWizardInputs({
      productName: "",
      goal: "",
      audience: "",
      tone: "Professional"
    });
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleDeleteClick = (campaign) => {
    setDeleteTarget(campaign);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.delete(`/content/${deleteTarget.id}`);
        setEmails((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      } catch (err) {
        console.error("Delete email failed:", err);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const handlePreviewClick = (campaign) => {
    setPreviewEmail(campaign);
    setIsPreviewOpen(true);
  };

  // Live AI Content Writer
  const handleTriggerAIEmailWrite = async () => {
    setWizardStep(3);
    setIsGenerating(true);

    try {
      const response = await api.post("/content", {
        type: "email",
        topic: wizardInputs.productName || "DevSynx Content Tool",
        tone: wizardInputs.tone,
        keywords: wizardInputs.goal,
        details: `Target Audience: ${wizardInputs.audience}. Campaign Type: ${selectedType}.`,
      });

      const generated = response.data.data;
      let subject = generated.title || `Quick question about ${wizardInputs.productName}`;
      if (generated.content.includes("Subject:")) {
        const matchSub = generated.content.match(/Subject:\s*(.*)/i);
        if (matchSub) subject = matchSub[1].trim();
      }

      setEditingEmail((prev) => ({
        ...prev,
        type: selectedType,
        name: `${selectedType} - ${wizardInputs.productName || "AI Campaign"}`,
        subject: subject,
        body: generated.content,
        ctaText: "Explore Updates",
        ctaUrl: "https://devsynx.com/dashboard"
      }));

      setWizardStep(4);
    } catch (err) {
      console.error("AI Email generation failed:", err);
      setWizardStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  // Plain Text Copy
  const handleCopyPlainText = () => {
    if (!editingEmail) return;
    const text = `From: ${editingEmail.fromName}\nSubject: ${editingEmail.subject}\n\n${editingEmail.body}\n\n[CTA: ${editingEmail.ctaText} - ${editingEmail.ctaUrl}]`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // HTML Copy Simulator
  const handleCopyHtml = () => {
    if (!editingEmail) return;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #F4F6F8; padding: 20px; margin: 0; }
    .email-card { background-color: #FFFFFF; max-width: 600px; margin: 20px auto; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .email-hdr { bg-color: #017A85; background: linear-gradient(135deg, #017A85 0%, #02A3B1 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .email-body { padding: 32px 24px; font-size: 15px; color: #1A1A2E; line-height: 1.6; }
    .btn-wrap { text-align: center; margin: 28px 0; }
    .btn-cta { background-color: #02A3B1; color: #FFFFFF !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; }
    .email-ftr { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 11px; color: #6B7280; border-top: 1px solid #F3F4F6; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="email-hdr">
      <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">${editingEmail.fromName}</h2>
    </div>
    <div class="email-body">
      <p style="font-weight: bold; font-size: 17px; margin-top: 0; margin-bottom: 20px; color: #1A1A2E;">${editingEmail.subject}</p>
      <p style="white-space: pre-wrap; margin-bottom: 24px;">${editingEmail.body}</p>
      <div class="btn-wrap">
        <a href="${editingEmail.ctaUrl || '#'}" class="btn-cta">${editingEmail.ctaText}</a>
      </div>
    </div>
    <div class="email-ftr">
      <p style="margin: 0;">Sent via DevSynx AI Content Machine. You are receiving this because you subscribed to our list.</p>
    </div>
  </div>
</body>
</html>`;
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Save campaign to database
  const handleSaveCampaign = async (statusValue) => {
    const isNew = editingEmail.id === null;
    const finalStatus = statusValue || editingEmail.status;

    try {
      if (isNew) {
        const response = await api.post("/content", {
          title: editingEmail.name || `${editingEmail.type} - Campaign`,
          content: editingEmail.body,
          type: "EMAIL",
          platform: "EMAIL",
          tone: wizardInputs.tone || "Professional",
          description: `${editingEmail.type} - ${wizardInputs.productName || "Manual"}`,
          status: finalStatus.toUpperCase(),
        });
        const newEmail = response.data.data;
        const mapped = {
          id: newEmail.id,
          name: newEmail.title,
          subject: editingEmail.subject,
          type: editingEmail.type,
          status: newEmail.status.charAt(0) + newEmail.status.slice(1).toLowerCase(),
          fromName: "DevSynx Team",
          body: newEmail.content,
          ctaText: editingEmail.ctaText,
          ctaUrl: editingEmail.ctaUrl,
          dateCreated: newEmail.createdAt.split("T")[0],
          isFavorite: newEmail.isFavorite,
        };
        setEmails((prev) => [mapped, ...prev]);
      } else {
        await api.put(`/content/${editingEmail.id}`, {
          title: editingEmail.name,
          content: editingEmail.body,
          description: `${editingEmail.type} - campaign`,
          status: finalStatus.toUpperCase(),
        });
        const mapped = {
          ...editingEmail,
          status: finalStatus,
        };
        setEmails((prev) => prev.map((item) => (item.id === editingEmail.id ? mapped : item)));
      }
      setIsWizardOpen(false);
      setEditingEmail(null);
    } catch (err) {
      console.error("Save campaign failed:", err);
    }
  };

  // Badge styler
  const getTypeColor = (type) => {
    const found = CAMPAIGN_TYPES.find((item) => item.id === type);
    return found ? found.color : "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Scheduled":
        return "bg-[#E0F7FA] text-[#017A85] border-[#b2ebf2]";
      case "Draft":
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      {isWizardOpen && editingEmail ? (
        <DashboardLayout title={editingEmail.id ? "Edit Campaign" : "New Email Campaign"}>
          <div className="space-y-6 pb-20 text-left">
            {/* Header / Wizard timeline navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <button
                onClick={() => {
                  setIsWizardOpen(false);
                  setEditingEmail(null);
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#02A3B1] font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Campaigns
              </button>

              {/* Stepper Wizard Indicator (only for new creations) */}
              {editingEmail.id === null && (
                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-1">
                  {[1, 2, 3, 4].map((step) => {
                    const stepNames = ["Choose Type", "AI Details", "Writing", "Refine & Export"];
                    const isActive = wizardStep === step;
                    const isCompleted = wizardStep > step;

                    return (
                      <div key={step} className="flex items-center gap-2 shrink-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                            isActive
                              ? "bg-[#02A3B1] text-white border-[#02A3B1]"
                              : isCompleted
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-400 border-gray-200"
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                        </span>
                        <span
                          className={`text-xs font-semibold whitespace-nowrap ${
                            isActive ? "text-[#1A1A2E]" : "text-gray-400"
                          }`}
                        >
                          {stepNames[step - 1]}
                        </span>
                        {step < 4 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stepper Views rendering */}
            {wizardStep === 1 && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A2E]">
                    Choose Campaign Type
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the objective format for your automated email campaign.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CAMPAIGN_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;

                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                          isSelected
                            ? "border-[#02A3B1] ring-2 ring-[#02A3B1]/20 bg-white"
                            : "border-gray-200 bg-white hover:border-gray-350"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#1A1A2E]">
                            <span>{type.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#02A3B1]" />}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#02A3B1]" />
                    AI Copywriter Parameters
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Describe your product and newsletter objective. Our AI assistant will formulate high-converting subject lines and body copy.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Product name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Product or Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DevSynx Cloud"
                      value={wizardInputs.productName}
                      onChange={(e) => setWizardInputs(prev => ({ ...prev, productName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                    />
                  </div>

                  {/* Campaign goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      What is the Goal of this Email?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Announce a summer discount sale, invite them to book a free onboarding call, read our latest article"
                      value={wizardInputs.goal}
                      onChange={(e) => setWizardInputs(prev => ({ ...prev, goal: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Audience description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. marketers, designers, developers"
                        value={wizardInputs.audience}
                        onChange={(e) => setWizardInputs(prev => ({ ...prev, audience: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                      />
                    </div>

                    {/* Tone dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Tone
                      </label>
                      <select
                        value={wizardInputs.tone}
                        onChange={(e) => setWizardInputs(prev => ({ ...prev, tone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                      >
                        {TONES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#1A1A2E] hover:bg-gray-50 transition"
                  >
                    Back
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Info className="w-3.5 h-3.5 text-[#02A3B1]" />
                      <span>1 AI Credit</span>
                    </div>
                    <button
                      disabled={!wizardInputs.productName || !wizardInputs.goal}
                      onClick={handleTriggerAIEmailWrite}
                      className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center gap-1.5 ${
                        !wizardInputs.productName || !wizardInputs.goal
                          ? "bg-gray-150 text-gray-400 cursor-not-allowed border border-gray-250"
                          : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      Write Email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-150 p-12 text-center shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-[#E0F7FA] text-[#02A3B1] rounded-2xl animate-bounce">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-[#1A1A2E]">
                    DevSynx Writer is Drafting Your Email
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    Formulating email subject hook, personalization greeting tags, and designing clear button calls-to-action...
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                  <div className="bg-[#02A3B1] h-full w-2/3 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left panel edit configuration form */}
                <div className="flex-1 space-y-6">
                  
                  {/* Campaign configuration details card */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-[#1A1A2E] text-base border-b border-gray-100 pb-2">
                      Configure Campaign Info
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Campaign Name */}
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. July Newsletter Promo"
                          value={editingEmail.name}
                          onChange={(e) => setEditingEmail(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>

                      {/* From Name */}
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Sender "From" Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. DevSynx Team"
                          value={editingEmail.fromName}
                          onChange={(e) => setEditingEmail(prev => ({ ...prev, fromName: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {/* Subject line */}
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        placeholder="Enter email subject hook..."
                        value={editingEmail.subject}
                        onChange={(e) => setEditingEmail(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Body Text Editor */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-3">
                    <h4 className="font-bold text-[#1A1A2E] text-base border-b border-gray-100 pb-2">
                      Email Body Content
                    </h4>
                    <textarea
                      rows={10}
                      placeholder="Write your email marketing content body..."
                      value={editingEmail.body}
                      onChange={(e) => setEditingEmail(prev => ({ ...prev, body: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm leading-relaxed"
                    />
                  </div>

                  {/* CTA Setup */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
                    <h4 className="font-bold text-[#1A1A2E] text-base border-b border-gray-100 pb-2">
                      Call to Action Button Setup
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Button Text
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Get Started Now"
                          value={editingEmail.ctaText}
                          onChange={(e) => setEditingEmail(prev => ({ ...prev, ctaText: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Button Redirect Link (URL)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. https://devsynx.com/pricing"
                          value={editingEmail.ctaUrl}
                          onChange={(e) => setEditingEmail(prev => ({ ...prev, ctaUrl: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Campaign Wizard action pane */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                    <button
                      onClick={() => handleSaveCampaign("Draft")}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#1A1A2E] hover:border-[#02A3B1] transition"
                    >
                      Save as Draft
                    </button>

                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleSaveCampaign("Scheduled")}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#02A3B1] text-[#017A85] text-sm font-semibold transition hover:bg-[#E0F7FA]/30"
                      >
                        Schedule later
                      </button>
                      <button
                        onClick={() => handleSaveCampaign("Published")}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#02A3B1] hover:bg-[#017A85] text-white text-sm font-semibold transition shadow-sm"
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Panel Inbox Mock Previewer */}
                <div className="w-full lg:w-96 shrink-0 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-150 shadow-md overflow-hidden sticky top-24">
                    
                    {/* Header: Mock Mail Client header */}
                    <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-rose-400 block" />
                          <span className="w-3 h-3 rounded-full bg-amber-400 block" />
                          <span className="w-3 h-3 rounded-full bg-green-400 block" />
                        </div>
                        <span className="text-[11px] text-gray-400 font-bold ml-1.5">Mock Mail Preview</span>
                      </div>
                      
                      <span className="text-[10px] font-bold bg-[#E0F7FA] text-[#017A85] px-2.5 py-0.5 rounded-full uppercase">
                        {editingEmail.type}
                      </span>
                    </div>

                    {/* Mail Metadata envelopes */}
                    <div className="p-4 border-b border-gray-100 bg-[#E0F7FA]/5 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">From:</span>
                        <span className="font-bold text-[#1A1A2E]">{editingEmail.fromName || "(No Name Defined)"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">To:</span>
                        <span className="font-semibold text-gray-600">contact@branduser.com</span>
                      </div>
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-gray-400">Subject:</span>
                        <span className="font-bold text-[#1A1A2E] text-right flex-1 break-words">{editingEmail.subject || "(Empty Subject)"}</span>
                      </div>
                    </div>

                    {/* Simulated Body Pane */}
                    <div className="p-6 min-h-[300px] flex flex-col justify-between bg-white text-xs text-[#1A1A2E] space-y-6">
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[#E0F7FA] flex items-center justify-center font-bold text-sm text-[#02A3B1]">
                          {editingEmail.fromName ? editingEmail.fromName.charAt(0) : "D"}
                        </div>

                        {/* Editable dynamic body */}
                        <div className="space-y-3 leading-relaxed whitespace-pre-line text-gray-700">
                          {editingEmail.body || (
                            <span className="text-gray-300 italic">Start writing email body inside the left editor pane to see live preview updates...</span>
                          )}
                        </div>
                      </div>

                      {/* CTA Button Render */}
                      {editingEmail.ctaText && (
                        <div className="text-center py-4">
                          <a
                            href={editingEmail.ctaUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#02A3B1] hover:bg-[#017A85] text-white font-bold px-6 py-2.5 rounded-lg inline-block text-xs transition shadow-sm pointer-events-none"
                          >
                            {editingEmail.ctaText}
                          </a>
                        </div>
                      )}

                      <div className="border-t border-gray-100 pt-4 text-[10px] text-center text-gray-400">
                        © 2026 DevSynx AI. All rights reserved. &bull; Unsubscribe
                      </div>
                    </div>

                    {/* Export Actions button array */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <button
                        onClick={handleCopyPlainText}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#02A3B1] hover:text-[#017A85] transition text-[11px] font-semibold text-gray-600 bg-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedText ? "Copied Text!" : "Copy Text"}
                      </button>
                      <button
                        onClick={handleCopyHtml}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#02A3B1] hover:text-[#017A85] transition text-[11px] font-semibold text-gray-600 bg-white"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {copiedHtml ? "Copied HTML!" : "Copy HTML"}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </DashboardLayout>
      ) : (
        <DashboardLayout title="Email Campaigns">
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E]">
                  Email Campaigns
                </h1>
                <p className="text-gray-500 mt-2">
                  Build newsletters, welcome emails, and follow-ups with AI-powered copywriting.
                </p>
              </div>
              <button
                onClick={handleCreateNewClick}
                className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-5 py-3 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2 self-start md:self-auto"
              >
                <Plus className="w-5 h-5" />
                Create Campaign
              </button>
            </div>

            {/* Filters panel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search field */}
                <div className="relative md:col-span-6">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm"
                  />
                </div>

                {/* Campaign type filter */}
                <div className="md:col-span-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm bg-white text-[#1A1A2E]"
                  >
                    <option value="All">All Types</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Promotional">Promotional</option>
                    <option value="Welcome">Welcome</option>
                    <option value="Follow-Up">Follow-Up</option>
                  </select>
                </div>

                {/* Status filter */}
                <div className="md:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm bg-white text-[#1A1A2E]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Resets bar */}
              {(typeFilter !== "All" || statusFilter !== "All" || searchQuery !== "") && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Active filters applied</span>
                  <button
                    onClick={() => {
                      setTypeFilter("All");
                      setStatusFilter("All");
                      setSearchQuery("");
                    }}
                    className="text-xs font-semibold text-[#02A3B1] hover:text-[#017A85] transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Campaign Table Grid */}
            {filteredEmails.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden pb-12">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-150 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Campaign Name</th>
                        <th className="px-6 py-4">Subject Line</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date Created</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEmails.map((item, idx) => {
                        // Alternate row styling: white vs light teal (#E0F7FA)
                        const rowBg = idx % 2 === 0 ? "bg-white" : "bg-[#E0F7FA]/20";

                        return (
                          <tr
                            key={item.id}
                            className={`text-sm text-[#1A1A2E] hover:bg-gray-50/55 transition ${rowBg}`}
                          >
                            {/* Campaign Name */}
                            <td className="px-6 py-4.5 font-bold text-[#1A1A2E] max-w-xs truncate">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="hover:text-[#02A3B1] text-left transition"
                              >
                                {item.name}
                              </button>
                            </td>

                            {/* Subject Line */}
                            <td className="px-6 py-4.5 text-gray-500 font-medium max-w-xs truncate">
                              {item.subject}
                            </td>

                            {/* Type Badge */}
                            <td className="px-6 py-4.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getTypeColor(item.type)}`}>
                                {item.type}
                              </span>
                            </td>

                            {/* Status Badge */}
                            <td className="px-6 py-4.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                                {item.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4.5 text-gray-400 text-xs">
                              {item.dateCreated}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4.5 text-right space-x-2 shrink-0">
                              <button
                                onClick={() => handlePreviewClick(item)}
                                className="p-2 text-gray-400 hover:text-[#02A3B1] hover:bg-gray-100 rounded-lg transition"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-gray-400 hover:text-[#02A3B1] hover:bg-gray-100 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-between px-6 pt-5 text-xs text-gray-400 border-t border-gray-100">
                  <span>
                    Showing {filteredEmails.length} of {emails.length} campaigns
                  </span>
                  <div className="flex items-center gap-2">
                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 cursor-not-allowed">
                      Previous
                    </button>
                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <EmptyState
                title={typeFilter !== "All" || statusFilter !== "All" || searchQuery !== "" ? "No matching campaigns" : "No campaigns yet"}
                description={
                  typeFilter !== "All" || statusFilter !== "All" || searchQuery !== ""
                    ? "Try adjusting filters or searching for another keyword to locate campaigns."
                    : "Create, template and publish automated marketing newsletters using our AI suite."
                }
                actionText={typeFilter !== "All" || statusFilter !== "All" || searchQuery !== "" ? "Reset Filters" : "Create Campaign"}
                onAction={
                  typeFilter !== "All" || statusFilter !== "All" || searchQuery !== ""
                    ? () => {
                        setTypeFilter("All");
                        setStatusFilter("All");
                        setSearchQuery("");
                      }
                    : handleCreateNewClick
                }
              />
            )}

          </div>
        </DashboardLayout>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteTarget !== null}
        title="Delete Campaign"
        message={`Are you sure you want to delete campaign "${deleteTarget?.name}"? All templates, AI logs and analytics details will be permanently removed.`}
        onCancel={() => setDeleteTarget(null)}
        onDelete={handleConfirmDelete}
      />

      {/* Inbox Reading preview Modal */}
      {isPreviewOpen && previewEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] text-left">
            
            {/* Modal Header */}
            <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-gray-50">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTypeColor(previewEmail.type)}`}>
                  {previewEmail.type}
                </span>
                <h3 className="text-base font-bold text-[#1A1A2E] mt-1">Inbox Live Preview</h3>
              </div>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setPreviewEmail(null);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Envelope Body Frame */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F4F6F8]">
              
              <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
                
                {/* Header envelope bar */}
                <div className="bg-[#017A85] p-6 text-white text-center">
                  <h2 className="text-lg font-black tracking-wider uppercase">{previewEmail.fromName}</h2>
                </div>

                {/* Envelope details */}
                <div className="px-6 py-4 border-b border-gray-100 bg-[#E0F7FA]/10 text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-semibold text-gray-400">Subject: </span>
                    <span className="font-bold text-[#1A1A2E]">{previewEmail.subject}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Sent Date: </span>
                    <span>{previewEmail.dateCreated}</span>
                  </div>
                </div>

                {/* Core email body rendering */}
                <div className="p-6 md:p-8 space-y-6 text-sm text-[#1A1A2E] leading-relaxed">
                  <div className="w-8 h-8 rounded-full bg-[#E0F7FA] text-[#02A3B1] flex items-center justify-center font-bold text-xs">
                    {previewEmail.fromName.charAt(0)}
                  </div>
                  <div className="whitespace-pre-line text-gray-700 font-sans">
                    {previewEmail.body}
                  </div>

                  {previewEmail.ctaText && (
                    <div className="text-center pt-4">
                      <a
                        href={previewEmail.ctaUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-6 py-2.5 rounded-lg text-xs font-bold inline-block transition pointer-events-none shadow-sm"
                      >
                        {previewEmail.ctaText}
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer text */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
                  You are receiving this email because you are a valued DevSynx customer.<br />
                  © 2026 DevSynx AI. All rights reserved. &bull; Unsubscribe
                </div>

              </div>
            </div>

            {/* Modal actions */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end bg-gray-50">
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setPreviewEmail(null);
                }}
                className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}