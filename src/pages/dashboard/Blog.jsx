import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  AlertCircle,
  Filter,
  Sparkles,
  ArrowLeft,
  Eye,
  Save,
  Calendar,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  List,
  Quote,
  Info,
  Gauge,
  Clock,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DeleteModal from "../../components/dashboard/DeleteModal";
import EmptyState from "../../components/dashboard/EmptyState";
import api from "../../services/api";
import { initialBlogs } from "../../data/blogsdata";

// Predefined Tones, Languages, Categories
const TONES = ["Professional", "Friendly", "Casual", "Persuasive", "Humorous"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Urdu"];
const CATEGORIES = ["Marketing", "SEO", "Social Media", "Email Marketing", "Business", "Technology"];

export default function Blogs() {
  // Core blog posts state
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/content?type=blog");
      const mapped = (data.data || []).map(b => ({
        id: b.id,
        title: b.title,
        content: b.content,
        category: b.description ? b.description.split(" - ")[0] : "Marketing",
        focusKeyword: b.keywords || "",
        metaTitle: b.title,
        metaDescription: b.description || "",
        status: b.status.charAt(0) + b.status.slice(1).toLowerCase(),
        wordCount: b.wordCount || 0,
        seoScore: b.seoScore || 10,
        date: b.scheduledAt ? b.scheduledAt.split("T")[0] : b.updatedAt.split("T")[0],
        time: b.scheduledAt ? new Date(b.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
        isFavorite: b.isFavorite,
      }));
      setBlogs(mapped);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selection states & modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // AI Prompt Form State
  const [aiPrompt, setAiPrompt] = useState({
    topic: "",
    tone: "Professional",
    keywords: "",
    length: "Medium",
    language: "English"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFormExpanded, setAiFormExpanded] = useState(true);

  // SEO Panel Collapsible state
  const [seoPanelOpen, setSeoPanelOpen] = useState(true);

  // Schedule modal state
  const [scheduleDetails, setScheduleDetails] = useState({
    date: "",
    time: "09:00 AM"
  });

  // Individual action handlers
  const handleEditClick = (blog) => {
    setEditingBlog({ ...blog });
    setIsEditorOpen(true);
    setAiFormExpanded(false); // Collapsed by default when editing existing
  };

  const handleCreateNewClick = () => {
    setEditingBlog({
      id: null,
      title: "",
      category: "Marketing",
      content: "",
      focusKeyword: "",
      metaTitle: "",
      metaDescription: "",
      status: "Draft",
      wordCount: 0,
      seoScore: 10,
      date: new Date().toISOString().split("T")[0],
      time: "12:00 PM"
    });
    setAiPrompt({
      topic: "",
      tone: "Professional",
      keywords: "",
      length: "Medium",
      language: "English"
    });
    setIsEditorOpen(true);
    setAiFormExpanded(true); // Expanded by default when creating new
  };

  const handleDeleteClick = (blog) => {
    setDeleteTarget(blog);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.delete(`/content/${deleteTarget.id}`);
        setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      } catch (err) {
        console.error("Delete blog failed:", err);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  // SEO Score calculation engine (dynamic)
  const seoAnalysis = useMemo(() => {
    if (!editingBlog) return null;

    const title = editingBlog.title || "";
    const content = editingBlog.content || "";
    const kw = editingBlog.focusKeyword || "";
    const metaTitle = editingBlog.metaTitle || "";
    const metaDesc = editingBlog.metaDescription || "";

    let score = 0;
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const stats = {
      hasKeyword: false,
      keywordInTitle: false,
      keywordInMetaDesc: false,
      keywordDensity: 0,
      densityStatus: "missing", // "missing", "low", "optimal", "high"
      titleLengthStatus: "short", // "short", "optimal", "long"
      descLengthStatus: "short", // "short", "optimal", "long"
      wordCountStatus: "short", // "short", "optimal"
    };

    if (!kw || kw.trim() === "") {
      return { score: 10, wordCount, stats };
    }

    stats.hasKeyword = true;
    score += 10;

    const keywordLower = kw.toLowerCase().trim();

    // Check Keyword in Title
    if (title.toLowerCase().includes(keywordLower)) {
      stats.keywordInTitle = true;
      score += 20;
    }

    // Keyword Density Check
    if (wordCount > 0) {
      const escapedKw = keywordLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
      const matches = content.match(regex);
      const count = matches ? matches.length : 0;
      const density = (count / wordCount) * 100;
      stats.keywordDensity = parseFloat(density.toFixed(1));

      if (density >= 1.0 && density <= 2.5) {
        stats.densityStatus = "optimal";
        score += 20;
      } else if (density > 0 && density < 1.0) {
        stats.densityStatus = "low";
        score += 8;
      } else if (density > 2.5) {
        stats.densityStatus = "high";
        score += 5;
      } else {
        stats.densityStatus = "missing";
      }
    }

    // Word Count Check
    if (wordCount >= 500) {
      stats.wordCountStatus = "optimal";
      score += 15;
    } else if (wordCount > 0) {
      stats.wordCountStatus = "short";
      score += 5;
    }

    // Meta Title Length Check
    const titleLen = metaTitle.length;
    if (titleLen >= 40 && titleLen <= 60) {
      stats.titleLengthStatus = "optimal";
      score += 15;
    } else if (titleLen > 0) {
      stats.titleLengthStatus = titleLen < 40 ? "short" : "long";
      score += 5;
    }

    // Meta Description Length Check
    const descLen = metaDesc.length;
    if (descLen >= 120 && descLen <= 160) {
      stats.descLengthStatus = "optimal";
      score += 10;
    } else if (descLen > 0) {
      stats.descLengthStatus = descLen < 120 ? "short" : "long";
      score += 3;
    }

    // Keyword in Meta Description
    if (metaDesc.toLowerCase().includes(keywordLower)) {
      stats.keywordInMetaDesc = true;
      score += 10;
    }

    return {
      score: Math.min(score, 100),
      wordCount,
      stats
    };
  }, [editingBlog]);

  // Sync calculated word count and score to editingBlog state
  useEffect(() => {
    if (seoAnalysis && editingBlog) {
      if (
        editingBlog.wordCount !== seoAnalysis.wordCount ||
        editingBlog.seoScore !== seoAnalysis.score
      ) {
        setEditingBlog((prev) => ({
          ...prev,
          wordCount: seoAnalysis.wordCount,
          seoScore: seoAnalysis.score
        }));
      }
    }
  }, [seoAnalysis]);

  // Handle format tags insertion inside Editor textarea
  const handleFormatText = (type) => {
    const textarea = document.getElementById("editor-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = "";

    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "h1":
        replacement = `\n# ${selectedText || "Heading 1"}\n`;
        break;
      case "h2":
        replacement = `\n## ${selectedText || "Heading 2"}\n`;
        break;
      case "list":
        replacement = `\n- ${selectedText || "List item"}\n`;
        break;
      case "quote":
        replacement = `\n> ${selectedText || "Blockquote"}\n`;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setEditingBlog((prev) => ({
      ...prev,
      content: newContent
    }));

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  // Live AI Blog Content Generation
  const handleGenerateAIContent = async () => {
    if (!aiPrompt.topic) return;
    setIsGenerating(true);
    try {
      const response = await api.post("/content", {
        type: "blog",
        topic: aiPrompt.topic,
        tone: aiPrompt.tone,
        length: aiPrompt.length,
        language: aiPrompt.language,
        keywords: aiPrompt.keywords,
      });

      const generated = response.data.data;
      setEditingBlog((prev) => ({
        ...prev,
        title: generated.title || `The Ultimate Guide to ${aiPrompt.topic}`,
        content: generated.content,
        focusKeyword: generated.keywords || aiPrompt.keywords.split(",")[0].trim(),
        metaTitle: `${generated.title.substring(0, 45)} | DevSynx`,
        metaDescription: generated.description || `Read our comprehensive guide about ${aiPrompt.topic.substring(0, 50)}. Explore optimization tips, keyword suggestions, and strategic insights.`
      }));
      setAiFormExpanded(false);
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save changes handler (Draft or Published)
  const handleSaveBlog = async (statusValue) => {
    const isNew = editingBlog.id === null;
    const finalStatus = statusValue || editingBlog.status;
    
    let scheduledAt = null;
    if (finalStatus === "Scheduled") {
      scheduledAt = new Date(`${scheduleDetails.date}T${scheduleDetails.time || "09:00:00"}`);
    }

    try {
      if (isNew) {
        const response = await api.post("/content", {
          title: editingBlog.title,
          content: editingBlog.content,
          type: "BLOG",
          platform: "WEBSITE",
          tone: aiPrompt.tone || "Professional",
          language: aiPrompt.language || "English",
          keywords: editingBlog.focusKeyword,
          description: editingBlog.metaDescription || `${editingBlog.category} article`,
          status: finalStatus.toUpperCase(),
          seoScore: editingBlog.seoScore,
          wordCount: editingBlog.wordCount,
          scheduledAt,
        });
        
        const newBlog = response.data.data;
        const mapped = {
          id: newBlog.id,
          title: newBlog.title,
          content: newBlog.content,
          category: editingBlog.category || "Marketing",
          focusKeyword: newBlog.keywords || "",
          metaTitle: newBlog.title,
          metaDescription: newBlog.description || "",
          status: newBlog.status.charAt(0) + newBlog.status.slice(1).toLowerCase(),
          wordCount: newBlog.wordCount || 0,
          seoScore: newBlog.seoScore || 10,
          date: newBlog.scheduledAt ? newBlog.scheduledAt.split("T")[0] : newBlog.updatedAt.split("T")[0],
          time: newBlog.scheduledAt ? new Date(newBlog.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
          isFavorite: newBlog.isFavorite,
        };
        setBlogs(prev => [mapped, ...prev]);
      } else {
        await api.put(`/content/${editingBlog.id}`, {
          title: editingBlog.title,
          content: editingBlog.content,
          keywords: editingBlog.focusKeyword,
          description: editingBlog.metaDescription || `${editingBlog.category} article`,
          status: finalStatus.toUpperCase(),
          seoScore: editingBlog.seoScore,
          wordCount: editingBlog.wordCount,
          scheduledAt,
        });

        const mapped = {
          ...editingBlog,
          status: finalStatus,
          date: finalStatus === "Scheduled" ? scheduleDetails.date : editingBlog.date,
          time: finalStatus === "Scheduled" ? scheduleDetails.time : editingBlog.time,
        };
        setBlogs(prev => prev.map((b) => (b.id === editingBlog.id ? mapped : b)));
      }
      setIsEditorOpen(false);
      setEditingBlog(null);
    } catch (err) {
      console.error("Save blog failed:", err);
    }
  };

  // Preview article displayer
  const handlePreviewClick = (blog) => {
    setPreviewBlog(blog);
    setIsPreviewOpen(true);
  };

  // Apply filters
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Category filter
      if (categoryFilter !== "All" && blog.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== "All" && blog.status !== statusFilter) {
        return false;
      }
      // Search text query
      if (
        searchQuery &&
        !blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [blogs, categoryFilter, statusFilter, searchQuery]);

  // Color helper for SEO Score Badge
  const getSeoColorClass = (score) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-[#F9BE00] bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // Color helper for Status Badge
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Published":
        return "text-green-700 bg-green-50 border-green-200";
      case "Scheduled":
        return "text-[#017A85] bg-[#E0F7FA] border-[#b2ebf2]";
      case "Draft":
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      {isEditorOpen && editingBlog ? (
        <DashboardLayout title={editingBlog.id ? "Edit Blog Article" : "Write Blog Article"}>
          <div className="flex flex-col xl:flex-row gap-6 pb-20 relative">

            {/* Left Main Editor Component */}
            <div className="flex-1 space-y-6">

              {/* Back & Breadcrumb Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingBlog(null);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#02A3B1] font-semibold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Articles
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Status:
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(editingBlog.status)}`}>
                    {editingBlog.status}
                  </span>
                </div>
              </div>

              {/* Title Section */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-2xl font-bold text-[#1A1A2E] placeholder-gray-300 focus:outline-none focus:ring-0 border-b border-gray-100 pb-2 focus:border-[#02A3B1] transition"
                />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02A3B1] bg-white text-[#1A1A2E]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI Marketing"
                      value={editingBlog.focusKeyword}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, focusKeyword: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-[#1A1A2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Collapsible AI Assistant Form */}
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                <button
                  onClick={() => setAiFormExpanded(!aiFormExpanded)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#E0F7FA]/30 to-white border-b border-gray-100 hover:from-[#E0F7FA]/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#02A3B1]" />
                    <span className="font-bold text-[#1A1A2E] text-sm">
                      DevSynx AI Writer Assistant
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#017A85] font-semibold">
                      {aiFormExpanded ? "Collapse" : "Expand Generator"}
                    </span>
                    {aiFormExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 transform rotate-180 transition" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 transition" />
                    )}
                  </div>
                </button>

                {aiFormExpanded && (
                  <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-250">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Topic input */}
                      <div className="md:col-span-8 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500">
                          Topic or Article Goal
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 10 ways AI is changing UI design in 2026"
                          value={aiPrompt.topic}
                          onChange={(e) => setAiPrompt(prev => ({ ...prev, topic: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>

                      {/* Tone selection */}
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500">
                          Tone
                        </label>
                        <select
                          value={aiPrompt.tone}
                          onChange={(e) => setAiPrompt(prev => ({ ...prev, tone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                        >
                          {TONES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Keywords */}
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500">
                          Keywords to Include (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. design trends, artificial intelligence, UI patterns"
                          value={aiPrompt.keywords}
                          onChange={(e) => setAiPrompt(prev => ({ ...prev, keywords: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                        />
                      </div>

                      {/* Length selector */}
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500">
                          Length
                        </label>
                        <select
                          value={aiPrompt.length}
                          onChange={(e) => setAiPrompt(prev => ({ ...prev, length: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                        >
                          <option value="Short">Short (~300 words)</option>
                          <option value="Medium">Medium (~700 words)</option>
                          <option value="Long">Long (~1200 words)</option>
                        </select>
                      </div>

                      {/* Language */}
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500">
                          Language
                        </label>
                        <select
                          value={aiPrompt.language}
                          onChange={(e) => setAiPrompt(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                        >
                          {LANGUAGES.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Info className="w-3.5 h-3.5 text-[#02A3B1]" />
                        <span>This will consume 1 AI Credit.</span>
                      </div>
                      <button
                        type="button"
                        disabled={!aiPrompt.topic || isGenerating}
                        onClick={handleGenerateAIContent}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${!aiPrompt.topic || isGenerating
                            ? "bg-gray-150 text-gray-400 border border-gray-200 cursor-not-allowed"
                            : "bg-[#02A3B1] hover:bg-[#017A85] text-white shadow-sm"
                          }`}
                      >
                        {isGenerating ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            AI is Writing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate with AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text style Editor panel */}
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    Article Editor
                  </span>

                  {/* Rich Text formatting Toolbar */}
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-150 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => handleFormatText("bold")}
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("italic")}
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleFormatText("h1")}
                      className="px-2 py-1 hover:bg-gray-200 rounded-lg text-gray-600 text-xs font-bold transition"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("h2")}
                      className="px-2 py-1 hover:bg-gray-200 rounded-lg text-gray-600 text-xs font-bold transition"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleFormatText("list")}
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText("quote")}
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition"
                      title="Blockquote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="editor-textarea"
                    rows={16}
                    placeholder="Write your long-form article here..."
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full resize-none text-sm text-[#1A1A2E] leading-relaxed placeholder-gray-300 focus:outline-none focus:ring-0 focus:border-transparent min-h-[350px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Read Time: {Math.max(1, Math.round(editingBlog.wordCount / 200))} min</span>
                  </div>
                  <div className="font-semibold text-[#1A1A2E]">
                    {editingBlog.wordCount} words
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleSaveBlog("Draft")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 hover:border-[#02A3B1] hover:text-[#017A85] text-[#1A1A2E] text-sm font-semibold transition"
                >
                  Save as Draft
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handlePreviewClick(editingBlog)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#02A3B1] text-[#017A85] text-sm font-semibold transition hover:bg-[#E0F7FA]/30 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScheduleOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1A1A2E] hover:bg-[#2A2A4E] text-white text-sm font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveBlog("Published")}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#02A3B1] hover:bg-[#017A85] text-white text-sm font-semibold transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Publish Now
                  </button>
                </div>
              </div>

            </div>

            {/* Right Collapsible SEO Side Panel */}
            <div
              className={`transition-all duration-300 ${seoPanelOpen ? "w-full xl:w-80" : "w-full xl:w-16"
                } shrink-0`}
            >
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden sticky top-24">

                {/* Panel Header */}
                <button
                  type="button"
                  onClick={() => setSeoPanelOpen(!seoPanelOpen)}
                  className="w-full flex items-center justify-between p-4 border-b border-gray-100 bg-[#E0F7FA]/10"
                >
                  <div className="flex items-center gap-2 text-left">
                    <Gauge className="w-5 h-5 text-[#02A3B1]" />
                    {seoPanelOpen && (
                      <div>
                        <h4 className="font-bold text-[#1A1A2E] text-sm">SEO Optimizer</h4>
                        <p className="text-[10px] text-gray-400">Live score & validation</p>
                      </div>
                    )}
                  </div>

                  {seoPanelOpen ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeoColorClass(seoAnalysis?.score)}`}>
                        {seoAnalysis?.score}/100
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400 transform rotate-90" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${getSeoColorClass(seoAnalysis?.score)}`}>
                        {seoAnalysis?.score}
                      </span>
                    </div>
                  )}
                </button>

                {seoPanelOpen && seoAnalysis && (
                  <div className="p-5 space-y-6 animate-in fade-in duration-200">

                    {/* Circle Score visualization */}
                    <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${seoAnalysis.score >= 80
                                ? "text-green-500"
                                : seoAnalysis.score >= 60
                                  ? "text-[#F9BE00]"
                                  : "text-rose-500"
                              }`}
                            strokeWidth="3.5"
                            strokeDasharray={`${seoAnalysis.score}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-[#1A1A2E]">{seoAnalysis.score}</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 mt-2">
                        {seoAnalysis.score >= 80
                          ? "🎉 SEO Optimized!"
                          : seoAnalysis.score >= 60
                            ? "⚡ Good, needs minor tweaks"
                            : "⚠️ Poor optimization"}
                      </span>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4 border-t border-gray-100 pt-4">
                      <h5 className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
                        SEO Metadata
                      </h5>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-500">Meta Title</span>
                          <span className={`font-bold ${seoAnalysis.stats.titleLengthStatus === "optimal" ? "text-green-600" : "text-gray-400"}`}>
                            {editingBlog.metaTitle?.length || 0} / 60
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Meta title (optimal: 40-60 chars)"
                          value={editingBlog.metaTitle}
                          onChange={(e) => setEditingBlog(prev => ({ ...prev, metaTitle: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02A3B1]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-500">Meta Description</span>
                          <span className={`font-bold ${seoAnalysis.stats.descLengthStatus === "optimal" ? "text-green-600" : "text-gray-400"}`}>
                            {editingBlog.metaDescription?.length || 0} / 160
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Meta description (optimal: 120-160 chars)"
                          value={editingBlog.metaDescription}
                          onChange={(e) => setEditingBlog(prev => ({ ...prev, metaDescription: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#02A3B1] resize-none"
                        />
                      </div>
                    </div>

                    {/* Checklist section */}
                    <div className="space-y-3.5 border-t border-gray-100 pt-4">
                      <h5 className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider">
                        SEO Checkpoints
                      </h5>

                      <div className="space-y-2.5 text-xs text-gray-600">
                        {/* Target keyword set */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.hasKeyword ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span>Focus keyword is defined</span>
                        </div>

                        {/* Keyword in title */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.keywordInTitle ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span>Keyword in title</span>
                        </div>

                        {/* Keyword Density */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.densityStatus === "optimal" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span>Keyword Density</span>
                              <span className={`font-bold ${seoAnalysis.stats.densityStatus === "optimal"
                                  ? "text-green-600"
                                  : seoAnalysis.stats.densityStatus === "high"
                                    ? "text-rose-500"
                                    : "text-amber-500"
                                }`}>
                                {seoAnalysis.stats.keywordDensity}%
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {seoAnalysis.stats.densityStatus === "optimal"
                                ? "Optimal (1.0% - 2.5%)"
                                : seoAnalysis.stats.densityStatus === "high"
                                  ? "Too high (Keyword stuffing)"
                                  : seoAnalysis.stats.densityStatus === "low"
                                    ? "Low, add more keyword occurrences"
                                    : "Keyword not found in content"}
                            </p>
                          </div>
                        </div>

                        {/* Word Count */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.wordCountStatus === "optimal" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span>Length is 500+ words</span>
                        </div>

                        {/* Keyword in Meta Desc */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.keywordInMetaDesc ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span>Keyword in meta description</span>
                        </div>

                        {/* Meta length check */}
                        <div className="flex items-start gap-2.5">
                          {seoAnalysis.stats.titleLengthStatus === "optimal" &&
                            seoAnalysis.stats.descLengthStatus === "optimal" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span>Meta tags are optimal length</span>
                        </div>
                      </div>
                    </div>

                    {/* Readability Feedback */}
                    <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
                      <h5 className="font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#02A3B1]" />
                        Readability Analysis
                      </h5>
                      <div className="bg-[#E0F7FA]/30 border border-[#b2ebf2]/40 rounded-xl p-3 text-[#017A85]">
                        <p className="font-semibold mb-1">Standard (Good readability)</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          Your sentences are clear and easy to follow. Paragraph splits make scanning friendly.
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>
        </DashboardLayout>
      ) : (
        <DashboardLayout title="Blog Articles">
          <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E]">
                  Blog Articles
                </h1>
                <p className="text-gray-500 mt-2">
                  Create and manage SEO-optimized long-form articles with AI assistance.
                </p>
              </div>
              <button
                onClick={handleCreateNewClick}
                className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-5 py-3 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2 self-start md:self-auto"
              >
                <Plus className="w-5 h-5" />
                Write Blog
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Bar */}
                <div className="relative md:col-span-6">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles by title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm"
                  />
                </div>

                {/* Category filter */}
                <div className="md:col-span-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm text-[#1A1A2E] bg-white"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status filter */}
                <div className="md:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm text-[#1A1A2E] bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Pill resets filter bar */}
              {(categoryFilter !== "All" || statusFilter !== "All" || searchQuery !== "") && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    Active filters applied
                  </span>
                  <button
                    onClick={() => {
                      setCategoryFilter("All");
                      setStatusFilter("All");
                      setSearchQuery("");
                    }}
                    className="text-xs font-semibold text-[#02A3B1] hover:text-[#017A85] transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Articles Table Card */}
            {filteredBlogs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden pb-12">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-150 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Word Count</th>
                        <th className="px-6 py-4">SEO Score</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBlogs.map((blog, idx) => {
                        // Alternate row styling: white and light teal (#E0F7FA)
                        const rowBg = idx % 2 === 0 ? "bg-white" : "bg-[#E0F7FA]/20";

                        return (
                          <tr
                            key={blog.id}
                            className={`text-sm text-[#1A1A2E] hover:bg-gray-50/55 transition ${rowBg}`}
                          >
                            {/* Title */}
                            <td className="px-6 py-4.5 font-bold text-[#1A1A2E] max-w-xs truncate">
                              <button
                                onClick={() => handleEditClick(blog)}
                                className="hover:text-[#02A3B1] text-left transition"
                              >
                                {blog.title}
                              </button>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4.5 text-gray-500 font-medium">
                              {blog.category}
                            </td>

                            {/* Word Count */}
                            <td className="px-6 py-4.5 text-gray-500">
                              {blog.wordCount} words
                            </td>

                            {/* SEO Score with badge */}
                            <td className="px-6 py-4.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeoColorClass(blog.seoScore)}`}>
                                {blog.seoScore}/100
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(blog.status)}`}>
                                {blog.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4.5 text-gray-400 text-xs">
                              {blog.date}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4.5 text-right space-x-2 shrink-0">
                              <button
                                onClick={() => handlePreviewClick(blog)}
                                className="p-2 text-gray-400 hover:text-[#02A3B1] hover:bg-gray-100 rounded-lg transition"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditClick(blog)}
                                className="p-2 text-gray-400 hover:text-[#02A3B1] hover:bg-gray-100 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(blog)}
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
                    Showing {filteredBlogs.length} of {blogs.length} articles
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
                title={categoryFilter !== "All" || statusFilter !== "All" || searchQuery !== "" ? "No matching blogs" : "No blog articles yet"}
                description={
                  categoryFilter !== "All" || statusFilter !== "All" || searchQuery !== ""
                    ? "Try resetting filters or searching for another topic to find articles."
                    : "Generate and publish SEO-friendly long-form articles using AI assistance."
                }
                actionText={categoryFilter !== "All" || statusFilter !== "All" || searchQuery !== "" ? "Reset Filters" : "Write Blog"}
                onAction={
                  categoryFilter !== "All" || statusFilter !== "All" || searchQuery !== ""
                    ? () => {
                      setCategoryFilter("All");
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
        title="Delete Blog Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action is permanent and cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onDelete={handleConfirmDelete}
      />

      {/* Article Reader Preview Modal */}
      {isPreviewOpen && previewBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

            {/* Modal Header */}
            <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold bg-[#E0F7FA] text-[#017A85] border border-[#b2ebf2] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {previewBlog.category}
                </span>
                <h3 className="text-base font-bold text-[#1A1A2E] mt-1">Article Preview</h3>
              </div>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setPreviewBlog(null);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Pane */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 text-left">
              {/* Styled Mock Header Graphic */}
              <div className="w-full h-44 rounded-xl bg-gradient-to-r from-[#017A85] to-[#02A3B1] flex flex-col justify-end p-6 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/10 px-3 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-sm">
                  SEO Score: {previewBlog.seoScore}/100
                </div>
                <h1 className="text-xl md:text-2xl font-black max-w-xl">
                  {previewBlog.title || "Untitled Article"}
                </h1>
                <p className="text-xs text-white/70 mt-1">
                  Published on {previewBlog.date} &bull; {previewBlog.wordCount} words
                </p>
              </div>

              {/* Article Content */}
              <div className="space-y-4 text-[#1A1A2E] text-sm leading-relaxed whitespace-pre-line font-serif max-w-none">
                {previewBlog.content || (
                  <p className="text-gray-400 italic">No content written yet. Open editor or generate content with AI.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end bg-gray-50">
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  setPreviewBlog(null);
                }}
                className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Schedule Modal Dialog */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#02A3B1]" />
                Schedule Article
              </h3>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-left">
              <p className="text-sm text-gray-500">
                Select the date and time you want this blog article to go live.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Publish Date
                </label>
                <input
                  type="date"
                  required
                  value={scheduleDetails.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setScheduleDetails(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Publish Time
                </label>
                <select
                  value={scheduleDetails.time}
                  onChange={(e) => setScheduleDetails(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-sm transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scheduleDetails.date}
                onClick={() => {
                  setIsScheduleOpen(false);
                  handleSaveBlog("Scheduled");
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition ${!scheduleDetails.date
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#02A3B1] hover:bg-[#017A85] shadow-sm"
                  }`}
              >
                Schedule Article
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}