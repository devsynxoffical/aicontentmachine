import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  Share2,
  MousePointer,
  Users,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Globe,
  AtSign,
  Briefcase,
  Mail,
  BookOpen,
  ChevronUp,
  ChevronDown,
  BarChart2,
  PieChart,
  Activity,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

// ── Platform icon / style map ───────────────────────────────────────────────
const PLATFORM_META = {
  "Instagram":   { color: "from-pink-500 to-rose-500",    icon: AtSign },
  "Facebook":    { color: "from-blue-500 to-indigo-600",  icon: Globe },
  "LinkedIn":    { color: "from-sky-500 to-blue-700",     icon: Briefcase },
  "X (Twitter)": { color: "from-gray-700 to-gray-900",   icon: AtSign },
  "Email":       { color: "from-teal-500 to-cyan-600",    icon: Mail },
};

// ── Metric icon / style map ─────────────────────────────────────────────────
const METRIC_META = [
  { key: "impressions", icon: Eye,          color: "text-blue-500 bg-blue-50" },
  { key: "engagement",  icon: ThumbsUp,     color: "text-pink-500 bg-pink-50" },
  { key: "published",   icon: FileText,     color: "text-purple-500 bg-purple-50" },
  { key: "reach",       icon: Users,        color: "text-emerald-500 bg-emerald-50" },
  { key: "clicks",      icon: MousePointer, color: "text-amber-500 bg-amber-50" },
  { key: "shares",      icon: Share2,       color: "text-teal-500 bg-teal-50" },
];



function MiniBar({ value }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div className="h-1.5 rounded-full bg-[#02A3B1] transition-all duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}

function Sparkline({ data, color = "#02A3B1" }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 90;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Simple bar chart
function BarChartSimple({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold text-gray-400">{v}K</span>
          <div className="w-full rounded-t-lg bg-gradient-to-t from-[#017A85] to-[#02A3B1] transition-all duration-700"
            style={{ height: `${(v / max) * 100}%`, minHeight: "6px" }} />
          <span className="text-[9px] text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live data state
  const [metrics, setMetrics] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], impressions: [], engagement: [] });

  const fetchAnalytics = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const { data } = await api.get(`/analytics?period=${period}`);
      const d = data.data;
      // Merge metric meta (icons/colors) with API values
      const enriched = (d.metrics || []).map((m, i) => ({
        ...m,
        ...(METRIC_META[i] || {}),
      }));
      setMetrics(enriched);
      // Merge platform meta (icons/colors) with API values
      const enrichedPlatforms = (d.platformData || []).map((p) => ({
        ...p,
        ...(PLATFORM_META[p.name] || { color: "from-gray-400 to-gray-600", icon: Globe }),
      }));
      setPlatformData(enrichedPlatforms);
      setTopPosts(d.topPosts || []);
      setChartData(d.chartData || { labels: [], impressions: [], engagement: [] });
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refresh = () => fetchAnalytics();

  const platformTypeColors = {
    "Blog": "bg-purple-100 text-purple-700",
    "Post": "bg-blue-100 text-blue-700",
    "Email": "bg-teal-100 text-teal-700",
    "Ad": "bg-amber-100 text-amber-700",
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6 pb-12 text-left">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1.5">Track performance metrics across all your published content and campaigns.</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            {/* Period selector */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {[["7d", "7 Days"], ["30d", "30 Days"], ["90d", "90 Days"]].map(([id, label]) => (
                <button key={id} onClick={() => setPeriod(id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${period === id ? "bg-[#02A3B1] text-white shadow-sm" : "text-gray-400 hover:text-[#1A1A2E]"}`}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={refresh}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-[#02A3B1] hover:text-[#02A3B1] transition">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#02A3B1]" : ""}`} />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-[#02A3B1] hover:text-[#02A3B1] transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-100" />
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))
            : metrics.map((m) => {
                const Icon = m.icon;
                const up = m.change >= 0;
                return (
                  <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#1A1A2E]">{m.value}</div>
                      <div className="text-xs text-gray-400 font-medium leading-tight mt-0.5">{m.label}</div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${up ? "text-emerald-600" : "text-red-500"}`}>
                      {up ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {up ? "+" : ""}{m.change}% vs last period
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Impressions Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1A1A2E]">Impressions Over Time</h3>
              <span className="text-xs text-gray-400 font-semibold">(000s)</span>
            </div>
            {chartData.impressions.length > 0 ? (
              <>
                <BarChartSimple data={chartData.impressions} labels={chartData.labels} />
                <div className="h-8 w-full opacity-60">
                  <Sparkline data={chartData.impressions} color="#02A3B1" />
                </div>
              </>
            ) : <div className="h-32 flex items-center justify-center text-gray-300 text-sm">No data yet</div>}
          </div>

          {/* Engagements Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1A1A2E]">Engagements Over Time</h3>
              <span className="text-xs text-gray-400 font-semibold">(000s)</span>
            </div>
            {chartData.engagement.length > 0 ? (
              <>
                <BarChartSimple data={chartData.engagement} labels={chartData.labels} />
                <div className="h-8 w-full opacity-60">
                  <Sparkline data={chartData.engagement} color="#F9BE00" />
                </div>
              </>
            ) : <div className="h-32 flex items-center justify-center text-gray-300 text-sm">No data yet</div>}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-[#1A1A2E]">Platform Performance</h3>
          <div className="space-y-4">
            {platformData.map((p) => {
              const Icon = p.icon || Globe;
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${p.color} shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-24 shrink-0">
                    <span className="text-sm font-bold text-[#1A1A2E]">{p.name}</span>
                    <div className="text-[10px] text-gray-400">{p.posts} posts</div>
                  </div>
                  <div className="flex-1">
                    <MiniBar value={p.bar} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-xs font-bold text-[#1A1A2E]">{p.impressions}</div>
                      <div className="text-[10px] text-gray-400">Impressions</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1A2E]">{p.engagement}</div>
                      <div className="text-[10px] text-gray-400">Engagement</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1A2E]">{p.clicks}</div>
                      <div className="text-[10px] text-gray-400">Clicks</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top performing posts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#1A1A2E]">Top Performing Content</h3>
            <span className="text-xs text-gray-400">Last {period === "7d" ? "7" : period === "30d" ? "30" : "90"} days</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Content</th>
                  <th className="text-left px-4 py-3">Platform</th>
                  <th className="text-right px-4 py-3">Impressions</th>
                  <th className="text-right px-4 py-3">Engagement</th>
                  <th className="text-right px-4 py-3">Clicks</th>
                  <th className="text-right px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No content yet. Publish some content to see top performers here.</td>
                  </tr>
                ) : topPosts.map((post, i) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-gray-300 font-bold tabular-nums w-5 shrink-0">#{i + 1}</span>
                        <div>
                          <div className="font-semibold text-[#1A1A2E] line-clamp-1 text-sm">{post.title}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${platformTypeColors[post.type] || "bg-gray-100 text-gray-600"}`}>{post.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-gray-600">{post.platform}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[#1A1A2E]">{post.impressions}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-bold text-xs ${parseFloat(post.engagement) > 15 ? "text-emerald-600" : parseFloat(post.engagement) > 8 ? "text-amber-600" : "text-gray-500"}`}>
                        {post.engagement}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600">{post.clicks}</td>
                    <td className="px-6 py-3.5 text-right text-xs text-gray-400">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}