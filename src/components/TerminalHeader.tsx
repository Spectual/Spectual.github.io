import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "~/chat" },
  { to: "/resume", label: "~/resume" },
  { to: "/projects", label: "~/projects" },
];

interface TerminalHeaderProps {
  title?: string;
}

const TerminalHeader = ({ title }: TerminalHeaderProps) => {
  const location = useLocation();

  return (
    <header
      aria-label={title}
      style={{
        borderBottom: "1px solid var(--term-border)",
        backgroundColor: "var(--term-bg2)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-0 flex items-stretch gap-0">
        {/* Window controls — hidden on mobile */}
        <div className="hidden sm:flex gap-1.5 items-center px-4 shrink-0">
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
                className={`${isActive ? "nav-active" : "nav-tab"} flex items-center text-[11px] sm:text-[12px] px-2.5 sm:px-4 py-1.5 sm:py-2`}
                style={{
                  color: isActive ? "var(--term-text)" : "var(--term-dim)",
                  backgroundColor: isActive ? "var(--term-bg)" : "transparent",
                  borderLeft: `1px solid ${isActive ? "var(--term-border)" : "transparent"}`,
                  borderRight: `1px solid ${isActive ? "var(--term-border)" : "transparent"}`,
                  borderTop: `2px solid ${isActive ? "var(--term-green)" : "transparent"}`,
                  borderBottom: `1px solid ${isActive ? "var(--term-bg)" : "transparent"}`,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  marginBottom: isActive ? "-1px" : "0",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Shell info — hidden on mobile */}
        <div
          className="hidden sm:flex items-center px-4 shrink-0"
          style={{ fontSize: "11px", color: "var(--term-dim)" }}
        >
          spectual@github.io
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
