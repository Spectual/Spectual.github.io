import { Link, useLocation } from "react-router-dom";
import { useLang } from "@/i18n/LanguageContext";

interface TerminalHeaderProps {
  title?: string;
}

const TerminalHeader = ({ title }: TerminalHeaderProps) => {
  const location = useLocation();
  const { t, toggleLang } = useLang();

  const NAV_LINKS = [
    { to: "/", label: t.nav.chat },
    { to: "/resume", label: t.nav.resume },
    { to: "/projects", label: t.nav.projects },
  ];

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

        {/* Right side: shell info + lang toggle */}
        <div className="flex items-center gap-3 px-3 sm:px-4 shrink-0">
          <span
            className="hidden sm:block"
            style={{ fontSize: "11px", color: "var(--term-dim)" }}
          >
            spectual@github.io
          </span>
          <button
            onClick={toggleLang}
            title="Switch language / 切换语言"
            style={{
              background: "transparent",
              border: "1px solid var(--term-border)",
              color: "var(--term-dim)",
              fontFamily: "inherit",
              fontSize: "11px",
              padding: "1px 6px",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
              lineHeight: 1.6,
            }}
            className="chat-quick-btn"
          >
            {t.langToggle}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TerminalHeader;
