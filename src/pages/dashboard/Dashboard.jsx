import { useState, useEffect } from "react";
import { FileText, CalendarDays, CheckCircle2, Sparkles } from "lucide-react";
import api from "../../services/api";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsCard from "../../components/dashboard/StatsCard";
import CalendarPreview from "../../components/dashboard/CalendarPreview";
import TableCard from "../../components/dashboard/TableCard";
import QuickActionCard from "../../components/dashboard/QuickActioncard";
import ChartCard from "../../components/dashboard/ChartCard";

import { quickActions } from "../../data/quickActions";

// Icon mapping for stats returned from API
const STAT_ICONS = [FileText, CalendarDays, CheckCircle2, Sparkles];

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes, perfRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/recent"),
          api.get("/dashboard/performance"),
        ]);

        // Attach icons to each stat
        const statsWithIcons = (statsRes.data.data || []).map((s, i) => ({
          ...s,
          icon: STAT_ICONS[i] || Sparkles,
        }));

        setStats(statsWithIcons);
        setRecentContent(recentRes.data.data || []);
        setPerformance(perfRes.data.data || null);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Dashboard Overview">

      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse h-36"
              />
            ))
          : stats.map((stat) => (
              <StatsCard
                key={stat.title}
                {...stat}
              />
            ))}
      </div>

      {/* Calendar + Recent Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* Calendar Preview */}
        <div className="xl:col-span-1">
          <CalendarPreview />
        </div>

        {/* Recent Content Table */}
        <div className="xl:col-span-2">
          <TableCard recentContent={recentContent} />
        </div>

      </div>

      {/* Quick Create */}
      <div className="mt-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6">
            Quick Create
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {quickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                {...action}
              />
            ))}

          </div>

        </div>

      </div>

      {/* Performance Snapshot */}
      <div className="mt-8">
        <ChartCard performance={performance} />
      </div>

    </DashboardLayout>
  );
}