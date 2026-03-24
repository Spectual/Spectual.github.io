import { Link, useLocation } from "react-router-dom";
import ProfileSection from "@/components/ProfileSection";
import ChatSection from "@/components/ChatSection";
import GetInTouchSection from "@/components/GetInTouchSection";

const NAV_LINKS = [
  { to: "/", label: "~/chat" },
  { to: "/resume", label: "~/resume" },
  { to: "/projects", label: "~/projects" },
];

const Index = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)" }}>
      {/* Terminal title bar */}
      <header style={{ borderBottom: "1px solid var(--term-border)", backgroundColor: "var(--term-bg2)" }}>
        <div className="max-w-4xl mx-auto px-4 py-0 flex items-stretch gap-0">
          {/* Window controls */}
          <div className="flex gap-1.5 items-center px-4 shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-red)" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-yellow)" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-green)" }} />
          </div>

          {/* Tab bar */}
          <nav className="flex items-stretch flex-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    color: isActive ? "var(--term-text)" : "var(--term-dim)",
                    backgroundColor: isActive ? "var(--term-bg)" : "transparent",
                    padding: "8px 16px",
                    fontSize: "12px",
                    borderLeft: `1px solid ${isActive ? "var(--term-border)" : "transparent"}`,
                    borderRight: `1px solid ${isActive ? "var(--term-border)" : "transparent"}`,
                    borderTop: `2px solid ${isActive ? "var(--term-green)" : "transparent"}`,
                    borderBottom: `1px solid ${isActive ? "var(--term-bg)" : "transparent"}`,
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    transition: "color 0.15s",
                    marginBottom: isActive ? "-1px" : "0",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Shell info */}
          <div className="flex items-center px-4 shrink-0" style={{ fontSize: "11px", color: "var(--term-dim)" }}>
            spectual@github.io
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="animate-fade-in-up">
        <ProfileSection />
      </div>
      <div className="animate-fade-in-up-delay-1">
        <ChatSection />
      </div>
      <div className="animate-fade-in-up-delay-2">
        <GetInTouchSection />
      </div>
    </div>
  );
};

export default Index;
