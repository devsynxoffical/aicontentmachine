import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  Share2,
  FileText,
  Mail,
  Megaphone,
  Image,
  RefreshCcw,
  BarChart3,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Content",
    path: "/dashboard/create-content",
    icon: Sparkles,
  },
  {
    title: "Content Calendar",
    path: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    title: "Social Posts",
    path: "/dashboard/social-posts",
    icon: Share2,
  },
  {
    title: "Blog Articles",
    path: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "Email Campaigns",
    path: "/dashboard/email",
    icon: Mail,
  },
  {
    title: "Ad Copy",
    path: "/dashboard/ads",
    icon: Megaphone,
  },
  {
    title: "Image Generator",
    path: "/dashboard/images",
    icon: Image,
  },
  {
    title: "Repurpose Content",
    path: "/dashboard/repurpose",
    icon: RefreshCcw,
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export const userData = {
  name: "Muhammad Shehryar",
  role: "Content Strategist",
  avatar: null,
};