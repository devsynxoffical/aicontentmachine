import {
  FileText,
  CalendarDays,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Content Created",
    value: "245",
    trend: "+18%",
    trendUp: true,
    icon: FileText,
  },
  {
    title: "Posts Scheduled",
    value: "38",
    trend: "+6%",
    trendUp: true,
    icon: CalendarDays,
  },
  {
    title: "Published This Week",
    value: "17",
    trend: "-3%",
    trendUp: false,
    icon: CheckCircle2,
  },
  {
    title: "AI Credits Remaining",
    value: "1,248",
    trend: "0%",
    trendUp: true,
    icon: Sparkles,
  },
];