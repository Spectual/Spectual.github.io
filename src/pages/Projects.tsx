import { personalInfo } from "@/data/personalInfo";
import { Link, useLocation } from "react-router-dom";
import MatrixRain from "@/components/MatrixRain";
import TerminalFooter from "@/components/TerminalFooter";

const NAV_LINKS = [
  { to: "/", label: "~/chat" },
  { to: "/resume", label: "~/resume" },
  { to: "/projects", label: "~/projects" },
];

const Projects = () => {
  const location = useLocation();

  return (
    <div
      className="min-h-screen page-enter"
      style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)", position: "relative" }}
    >
      <MatrixRain />

      <div style={{ position: "relative", zIndex: 1 }}>
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
            <div
              className="animate-fade-in-up"
              style={{ border: "1px solid var(--term-border)", backgroundColor: "var(--term-bg)" }}
            >
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
                bash — ~/projects
              </div>

              <div style={{ padding: "20px 24px" }}>
                {/* Command header */}
                <div style={{ marginBottom: "20px", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--term-green)" }}>spectual</span>
                    <span style={{ color: "var(--term-dim)" }}>@</span>
                    <span style={{ color: "var(--term-blue)" }}>github.io</span>
                    <span style={{ color: "var(--term-text)" }}>:~$</span>
                    <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>ls -la ~/projects</span>
                  </div>
                  <div style={{ color: "var(--term-dim)", fontSize: "11px" }}>
                    total {personalInfo.projects.length} entries
                  </div>
                </div>

                {/* Projects grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {personalInfo.projects.map((project, index) => {
                    const isPatent = project.name.includes("Patent");
                    const hasGithub = "githubUrl" in project && project.githubUrl;
                    const hasLive = "liveUrl" in project && project.liveUrl;

                    return (
                      <div
                        key={index}
                        className="project-card"
                        style={{
                          border: "1px solid var(--term-border)",
                          backgroundColor: "var(--term-bg)",
                          padding: "16px",
                          transition: "border-color 0.15s, background-color 0.15s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--term-green)";
                          e.currentTarget.style.backgroundColor = "rgba(63,185,80,0.03)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--term-border)";
                          e.currentTarget.style.backgroundColor = "var(--term-bg)";
                        }}
                      >
                        {/* Project name row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <span style={{ color: "var(--term-dim)", fontSize: "11px", marginRight: "6px" }}>
                              {String(index + 1).padStart(2, "0")}.
                            </span>
                            <span
                              className="glitch-title"
                              style={{
                                color: isPatent ? "var(--term-yellow)" : "var(--term-green)",
                                fontWeight: 600,
                                fontSize: "13px",
                                display: "inline-block",
                              }}
                            >
                              {isPatent ? "⊕ " : ""}
                              {project.name}
                            </span>
                          </div>
                          {/* Links */}
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                            {hasGithub && (
                              <a
                                href={project.githubUrl as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--term-dim)",
                                  textDecoration: "none",
                                  border: "1px solid var(--term-border)",
                                  padding: "1px 6px",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "var(--term-blue)";
                                  e.currentTarget.style.borderColor = "var(--term-blue)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "var(--term-dim)";
                                  e.currentTarget.style.borderColor = "var(--term-border)";
                                }}
                              >
                                [github]
                              </a>
                            )}
                            {hasLive && (
                              <a
                                href={project.liveUrl as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--term-dim)",
                                  textDecoration: "none",
                                  border: "1px solid var(--term-border)",
                                  padding: "1px 6px",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "var(--term-green)";
                                  e.currentTarget.style.borderColor = "var(--term-green)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "var(--term-dim)";
                                  e.currentTarget.style.borderColor = "var(--term-border)";
                                }}
                              >
                                [live]
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            color: "var(--term-dim)",
                            fontSize: "12px",
                            lineHeight: "1.6",
                            marginBottom: "10px",
                            borderLeft: "2px solid var(--term-border)",
                            paddingLeft: "10px",
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Tech tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              style={{
                                border: "1px solid var(--term-border)",
                                color: "var(--term-dim)",
                                fontSize: "10px",
                                padding: "1px 6px",
                                fontFamily: "inherit",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* More projects footer */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 16px",
                    border: "1px solid var(--term-border)",
                    backgroundColor: "var(--term-bg2)",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ color: "var(--term-dim)", marginBottom: "8px" }}>
                    # for more repos and code, visit github profile
                  </div>
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="slide-underline"
                    style={{
                      color: "var(--term-blue)",
                      textDecoration: "none",
                      border: "1px solid var(--term-border)",
                      padding: "4px 12px",
                      display: "inline-block",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--term-blue)";
                      e.currentTarget.style.backgroundColor = "rgba(88, 166, 255, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--term-border)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    [→ github.com/spectual]
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TerminalFooter />
      </div>
    </div>
  );
};

export default Projects;
