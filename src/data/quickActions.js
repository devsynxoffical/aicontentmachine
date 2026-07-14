import {
  Share2,
  FileText,
  Mail,
  Megaphone,
} from "lucide-react";

export const quickActions = [
  {
    title: "Write Social Post",
    icon: Share2,
    path: "/dashboard/social-posts",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Write Blog",
    icon: FileText,
    path: "/dashboard/blog",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Write Email",
    icon: Mail,
    path: "/dashboard/email",
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    title: "Generate Ad Copy",
    icon: Megaphone,
    path: "/dashboard/ads",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];