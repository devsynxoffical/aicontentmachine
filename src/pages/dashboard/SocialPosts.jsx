import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  Edit3,
  Trash2,
  X,
  Check,
  Download,
  AlertCircle,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DeleteModal from "../../components/dashboard/DeleteModal";
import EmptyState from "../../components/dashboard/EmptyState";
import api from "../../services/api";
import { initialPosts } from "../../data/postsdata";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "../../components/dashboard/SocialIcons";

export default function SocialPosts() {
  const navigate = useNavigate();

  // Core posts state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/content?type=social");
      const mapped = (data.data || []).map(p => ({
        id: p.id,
        title: p.title,
        content: p.content,
        platform: p.platform ? p.platform.charAt(0) + p.platform.slice(1).toLowerCase() : "Facebook",
        status: p.status.charAt(0) + p.status.slice(1).toLowerCase(),
        date: p.scheduledAt ? p.scheduledAt.split("T")[0] : p.updatedAt.split("T")[0],
        time: p.scheduledAt ? new Date(p.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
        isFavorite: p.isFavorite,
      }));
      setPosts(mapped);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filters state
  const [platformFilter, setPlatformFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null); // 'bulk' or post object
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Platform styling helpers
  const getPlatformConfig = (platform) => {
    switch (platform) {
      case "Facebook":
        return {
          icon: FacebookIcon,
          color: "text-[#1877F2]",
          bg: "bg-[#1877F2]/10",
          border: "border-[#1877F2]/20",
        };
      case "Instagram":
        return {
          icon: InstagramIcon,
          color: "text-[#E1306C]",
          bg: "bg-[#E1306C]/10",
          border: "border-[#E1306C]/20",
        };
      case "LinkedIn":
        return {
          icon: LinkedInIcon,
          color: "text-[#0A66C2]",
          bg: "bg-[#0A66C2]/10",
          border: "border-[#0A66C2]/20",
        };
      case "X":
        return {
          icon: XIcon,
          color: "text-[#1A1A2E]",
          bg: "bg-[#1A1A2E]/10",
          border: "border-[#1A1A2E]/20",
        };
      default:
        return {
          icon: Sparkles,
          color: "text-[#02A3B1]",
          bg: "bg-[#02A3B1]/10",
          border: "border-[#02A3B1]/20",
        };
    }
  };

  // Status styling helpers
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

  // Apply search & filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Platform Filter
      if (platformFilter !== "All" && post.platform !== platformFilter) {
        return false;
      }
      // Status Filter
      if (statusFilter !== "All" && post.status !== statusFilter) {
        return false;
      }
      // Text Search Filter (Title or Content)
      if (
        searchQuery &&
        !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Date range Filter
      if (startDate && post.date < startDate) {
        return false;
      }
      if (endDate && post.date > endDate) {
        return false;
      }
      return true;
    });
  }, [posts, platformFilter, statusFilter, searchQuery, startDate, endDate]);

  // Bulk selection functions
  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPosts.map((post) => post.id));
    }
  };

  // Bulk actions operations
  const handleBulkSchedule = async () => {
    try {
      await Promise.all(selectedIds.map(id => api.put(`/content/${id}`, { status: "SCHEDULED" })));
      setPosts((prev) =>
        prev.map((post) =>
          selectedIds.includes(post.id) ? { ...post, status: "Scheduled" } : post
        )
      );
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk schedule failed:", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/content/${id}`)));
      setPosts((prev) => prev.filter((post) => !selectedIds.includes(post.id)));
      setSelectedIds([]);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  const handleBulkExport = () => {
    const selectedPosts = posts.filter((post) => selectedIds.includes(post.id));
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(selectedPosts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "exported_social_posts.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSelectedIds([]);
  };

  // Individual action handlers
  const handleEditClick = (post) => {
    setEditingPost({ ...post });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/content/${editingPost.id}`, {
        title: editingPost.title,
        content: editingPost.content,
        platform: editingPost.platform.toUpperCase(),
        status: editingPost.status.toUpperCase(),
      });
      setPosts((prev) =>
        prev.map((post) => (post.id === editingPost.id ? editingPost : post))
      );
      setIsEditModalOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Update post failed:", err);
    }
  };

  const handleDeleteClick = (post) => {
    setDeleteTarget(post);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget === "bulk") {
      await handleBulkDelete();
    } else if (deleteTarget) {
      try {
        await api.delete(`/content/${deleteTarget.id}`);
        setPosts((prev) => prev.filter((post) => post.id !== deleteTarget.id));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      } catch (err) {
        console.error("Delete post failed:", err);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  // Reset Filters helper
  const isFilterActive =
    platformFilter !== "All" ||
    statusFilter !== "All" ||
    searchQuery !== "" ||
    startDate !== "" ||
    endDate !== "";

  const handleResetFilters = () => {
    setPlatformFilter("All");
    setStatusFilter("All");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <DashboardLayout title="Social Posts">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">
              Social Media Posts
            </h1>
            <p className="text-gray-500 mt-2">
              View, search, filter, and schedule your social media posts across networks.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/create-content")}
            className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-5 py-3 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          {/* Top Row: Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm"
              />
            </div>

            {/* Status Dropdown */}
            <div className="lg:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] focus:border-transparent text-sm text-[#1A1A2E] bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Date Pickers */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-xs text-[#1A1A2E] bg-white"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-xs text-[#1A1A2E] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: Platforms & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
            {/* Platforms Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <Filter className="w-4 h-4 text-gray-400 mr-1 shrink-0" />
              {["All", "Facebook", "Instagram", "LinkedIn", "X"].map((plat) => {
                const isActive = platformFilter === plat;
                const config = plat !== "All" ? getPlatformConfig(plat) : null;
                const Icon = config ? config.icon : null;

                return (
                  <button
                    key={plat}
                    onClick={() => setPlatformFilter(plat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${isActive
                        ? "bg-[#02A3B1] text-white border-[#02A3B1]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#02A3B1]"
                      }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : config.color}`} />}
                    {plat}
                  </button>
                );
              })}
            </div>

            {/* Clear Filter */}
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#02A3B1] hover:text-[#017A85] transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Master Select Bar when there are posts */}
        {filteredPosts.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handleSelectAllToggle}
              className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-[#1A1A2E]"
            >
              {selectedIds.length === filteredPosts.length ? (
                <CheckSquare className="w-4 h-4 text-[#02A3B1]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              {selectedIds.length === filteredPosts.length
                ? "Deselect All"
                : `Select All on Page (${filteredPosts.length})`}
            </button>
            <span className="text-xs text-gray-500">
              Showing {filteredPosts.length} of {posts.length} posts
            </span>
          </div>
        )}

        {/* Content Cards Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredPosts.map((post) => {
              const config = getPlatformConfig(post.platform);
              const Icon = config.icon;
              const isSelected = selectedIds.includes(post.id);

              return (
                <div
                  key={post.id}
                  className={`group relative bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#02A3B1]/40 flex flex-col justify-between ${isSelected ? "ring-2 ring-[#02A3B1] border-transparent" : "border-gray-200/80"
                    }`}
                >
                  {/* Select Checkbox Indicator */}
                  <button
                    onClick={() => handleSelectToggle(post.id)}
                    className="absolute top-4 left-4 z-10 p-1 text-gray-400 hover:text-[#02A3B1] transition rounded-md bg-white border border-gray-100"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#02A3B1]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </button>

                  <div className="p-6 pt-14 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Upper row: Platform Icon & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${config.bg} ${config.border} ${config.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{post.platform}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </div>

                    {/* Post Text Details */}
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-[#1A1A2E] text-base group-hover:text-[#02A3B1] transition">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* Date/Time Row */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {post.date} &bull; {post.time}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar inside Card */}
                  <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 rounded-b-2xl flex items-center justify-end gap-3.5">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="text-xs font-semibold text-gray-500 hover:text-[#02A3B1] transition flex items-center gap-1 py-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={isFilterActive ? "No matching posts" : "No posts yet"}
            description={
              isFilterActive
                ? "Try clearing filters or refining your search parameters to find posts."
                : "Generate and manage your social posts using AI tools."
            }
            actionText={isFilterActive ? "Reset Filters" : "Create Social Post"}
            onAction={
              isFilterActive
                ? handleResetFilters
                : () => navigate("/dashboard/create-content")
            }
          />
        )}

        {/* Floating Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A2E] text-white border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#F9BE00]" />
              {selectedIds.length} items selected
            </span>
            <div className="h-px w-full sm:h-6 sm:w-px bg-white/20" />
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkSchedule}
                className="bg-[#02A3B1] hover:bg-[#017A85] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Schedule All
              </button>
              <button
                onClick={() => handleDeleteClick("bulk")}
                className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Delete All
              </button>
              <button
                onClick={handleBulkExport}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-gray-400 hover:text-white text-xs font-semibold px-2 py-2 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Inline Edit Modal */}
        {isEditModalOpen && editingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A1A2E]">Edit Social Post</h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPost(null);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Post Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Post Body / Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, content: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm leading-relaxed"
                  />
                </div>

                {/* Platform & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Platform
                    </label>
                    <select
                      value={editingPost.platform}
                      onChange={(e) =>
                        setEditingPost((prev) => ({
                          ...prev,
                          platform: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="X">X (Twitter)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={editingPost.status}
                      onChange={(e) =>
                        setEditingPost((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={editingPost.date}
                      onChange={(e) =>
                        setEditingPost((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Publish Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM"
                      value={editingPost.time}
                      onChange={(e) =>
                        setEditingPost((prev) => ({ ...prev, time: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingPost(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#02A3B1] hover:bg-[#017A85] text-white text-sm font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={!!deleteTarget}
          title={deleteTarget === "bulk" ? "Bulk Delete Posts" : "Delete Social Post"}
          message={
            deleteTarget === "bulk"
              ? `Are you sure you want to delete all ${selectedIds.length} selected social posts? This operation cannot be undone.`
              : `Are you sure you want to delete the post "${deleteTarget?.title}"? This operation cannot be undone.`
          }
          onCancel={() => setDeleteTarget(null)}
          onDelete={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}
