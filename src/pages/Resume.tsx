import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "~/chat" },
  { to: "/resume", label: "~/resume" },
  { to: "/projects", label: "~/projects" },
];

const Resume = () => {
  const location = useLocation();

  const resumeLinks = {
    googleDrive: "https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/view?usp=sharing",
    directDownload: "https://drive.google.com/uc?export=download&id=1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1",
  };

  const btnStyle: React.CSSProperties = {
    border: "1px solid var(--term-border)",
    backgroundColor: "transparent",
    color: "var(--term-dim)",
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)" }}>
      {/* Terminal title bar */}
      <header style={{ borderBottom: "1px solid var(--term-border)", backgroundColor: "var(--term-bg2)" }}>
        <div className="max-w-4xl mx-auto px-4 py-0 flex items-stretch gap-0">
          <div className="hidden sm:flex gap-1.5 items-center px-4 shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-red)" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-yellow)" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--term-green)" }} />
          </div>
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
          <div className="hidden sm:flex items-center px-4 shrink-0" style={{ fontSize: "11px", color: "var(--term-dim)" }}>
            spectual@github.io
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div style={{ border: "1px solid var(--term-border)", backgroundColor: "var(--term-bg)" }}>
            {/* Title bar */}
            <div
              style={{
                borderBottom: "1px solid var(--term-border)",
                backgroundColor: "var(--term-bg2)",
                padding: "6px 16px",
                fontSize: "12px",
                color: "var(--term-dim)",
              }}
            >
              bash — ~/resume
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Command header */}
              <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ color: "var(--term-green)" }}>spectual</span>
                  <span style={{ color: "var(--term-dim)" }}>@</span>
                  <span style={{ color: "var(--term-blue)" }}>github.io</span>
                  <span style={{ color: "var(--term-text)" }}>:~$</span>
                  <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>
                    cat Yifei_Bao_BU_MSCS.pdf
                  </span>
                </div>
                <div style={{ color: "var(--term-dim)", fontSize: "11px" }}>
                  # rendering PDF preview... use buttons below to open or download
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <a
                  href={resumeLinks.googleDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={btnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--term-blue)";
                    e.currentTarget.style.color = "var(--term-blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--term-border)";
                    e.currentTarget.style.color = "var(--term-dim)";
                  }}
                >
                  [open-in-drive]
                </a>
                <a
                  href={resumeLinks.directDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...btnStyle, color: "var(--term-green)", borderColor: "var(--term-green)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--term-green)";
                    e.currentTarget.style.color = "var(--term-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--term-green)";
                  }}
                >
                  [download-pdf]
                </a>
              </div>

              {/* File info */}
              <div
                style={{
                  border: "1px solid var(--term-border)",
                  backgroundColor: "var(--term-bg2)",
                  padding: "8px 12px",
                  marginBottom: "12px",
                  fontSize: "11px",
                  color: "var(--term-dim)",
                  display: "flex",
                  gap: "16px",
                }}
              >
                <span><span style={{ color: "var(--term-blue)" }}>file</span>: Yifei_Bao_BU_MSCS.pdf</span>
                <span><span style={{ color: "var(--term-blue)" }}>type</span>: application/pdf</span>
                <span><span style={{ color: "var(--term-blue)" }}>source</span>: google-drive</span>
              </div>

              {/* PDF embed */}
              <div
                style={{
                  border: "1px solid var(--term-border)",
                  overflow: "hidden",
                  height: "800px",
                }}
              >
                <iframe
                  src="https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/preview"
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  title="Resume PDF"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
