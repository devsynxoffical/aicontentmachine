import { FileText, Mail, Megaphone, Package, Globe, Share2 } from "lucide-react";

// Used by components/pages/dashboard/contenttabs.jsx
export const CONTENT_TYPES = [
  { id: "social", label: "Social Post", icon: Share2 },
  { id: "blog", label: "Blog Article", icon: FileText },
  { id: "email", label: "Email", icon: Mail },
  { id: "ad", label: "Ad Copy", icon: Megaphone },
  { id: "product", label: "Product Description", icon: Package },
  { id: "website", label: "Website Copy", icon: Globe },
];