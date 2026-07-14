import { RefreshCw } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm">
      <RefreshCw className="h-6 w-6 animate-spin text-[#02A3B1]" />
      <p className="text-sm font-medium text-[#1A1A2E]">Writing your content...</p>
    </div>
  );
}