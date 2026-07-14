import {
  Menu,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { sidebarItems } from "../../data/sidebarData";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        bottom-0
        bg-[#1A1A2E]
        text-white
        flex
        flex-col
        shadow-2xl
        transition-all
        duration-300
        z-[60]
        ${sidebarOpen
          ? "w-72"
          : "w-20"
        }
      `}
    >
      {/* =========================
          Header
      ========================== */}

      <div
        className={`
          h-20
          border-b
          border-white/10
          flex
          items-center
          ${sidebarOpen
            ? "justify-between px-5"
            : "justify-center"
          }
        `}
      >
        {sidebarOpen ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">
                DEVSYNX
              </h2>

              <p className="text-s text-gray-400 mt-1">
                Main Menu
              </p>
            </div>

            {/* Close Sidebar */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="
                h-10
                w-10
                rounded-xl
                flex
                items-center
                justify-center
                hover:bg-white/10
                transition
              "
            >
              <ChevronRight
                size={22}
                className="rotate-180"
              />
            </button>
          </>
        ) : (
          /* Open Sidebar */
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              h-10
              w-10
              rounded-xl
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
            "
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {/* =========================
          Navigation
      ========================== */}

      <nav
        className="
          flex-1
          py-4
          overflow-y-auto
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        <style>
          {`
            nav::-webkit-scrollbar{
              display:none;
            }
          `}
        </style>

        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `
                  relative
                  mx-3
                  mb-1
                  flex
                  items-center
                  rounded-xl
                  transition-all
                  duration-200
                  ${sidebarOpen
                  ? "gap-3 px-5 py-3"
                  : "justify-center py-3"
                }
                  ${isActive
                  ? "bg-[#02A3B1] text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#F9BE00]" />
                  )}

                  <Icon
                    size={20}
                    className="shrink-0"
                  />

                  {sidebarOpen && (
                    <span className="font-medium whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* =========================
          Logout
      ========================== */}

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => navigate("/")}
          className={`
            w-full
            flex
            items-center
            rounded-xl
            text-red-400
            hover:bg-red-500/10
            transition
            ${sidebarOpen
              ? "gap-3 px-4 py-3"
              : "justify-center py-3"
            }
          `}
        >
          <LogOut size={20} />

          {sidebarOpen && (
            <span className="font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}