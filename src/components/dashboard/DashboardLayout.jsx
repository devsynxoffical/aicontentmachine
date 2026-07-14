import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-[#F4F6F8] overflow-hidden">

      {/* =========================
          Top Bar
      ========================== */}
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =========================
          Sidebar
      ========================== */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =========================
          Main Content
      ========================== */}
      <main
        className={`
          fixed
          top-20
          right-0
          bottom-0
          overflow-y-auto
          transition-all
          duration-300
          scrollbar-hide
          ${sidebarOpen
            ? "left-72"
            : "left-20"
          }
        `}
      >
        <div className="p-8 min-h-full">
          {children}
        </div>
      </main>

    </div>
  );
}