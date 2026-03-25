import { useState } from "react";
import { personalInfo } from "@/data/personalInfo";
import MatrixRain from "@/components/MatrixRain";
import TerminalFooter from "@/components/TerminalFooter";
import TerminalHeader from "@/components/TerminalHeader";

const ALL_TECHS = [
  ...new Set(personalInfo.projects.flatMap((p) => p.technologies)),
];

const Projects = () => {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const filteredProjects = activeTech
    ? personalInfo.projects.filter((p) => p.technologies.includes(activeTech))
    : personalInfo.projects;

  return (
    <div
      className="min-h-screen page-enter"
      style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)", position: "relative" }}
    >
      <MatrixRain />

      <div style={{ position: "relative", zIndex: 1 }}>
        <TerminalHeader />

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
                <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--term-green)" }}>spectual</span>
                    <span style={{ color: "var(--term-dim)" }}>@</span>
                    <span style={{ color: "var(--term-blue)" }}>github.io</span>
                    <span style={{ color: "var(--term-text)" }}>:~$</span>
                    <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>
                      {activeTech
                        ? `grep -i "${activeTech}" projects/`
                        : "ls -la ~/projects"}
                    </span>
                  </div>
                  <div style={{ color: "var(--term-dim)", fontSize: "11px" }}>
                    {filteredProjects.length === personalInfo.projects.length
                      ? `total ${personalInfo.projects.length} entries`
                      : `${filteredProjects.length} match${filteredProjects.length !== 1 ? "es" : ""} (${personalInfo.projects.length} total)`}
                  </div>
                </div>

                {/* Tech stack filter */}
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px 12px",
                    border: "1px solid var(--term-border)",
                    backgroundColor: "var(--term-bg2)",
                    fontSize: "11px",
                  }}
                >
                  <div style={{ color: "var(--term-dim)", marginBottom: "8px" }}>
                    # filter by tech — click to toggle
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {ALL_TECHS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                        style={{
                          border: `1px solid ${activeTech === tech ? "var(--term-green)" : "var(--term-border)"}`,
                          backgroundColor: activeTech === tech ? "rgba(57,255,20,0.08)" : "transparent",
                          color: activeTech === tech ? "var(--term-green)" : "var(--term-dim)",
                          fontSize: "10px",
                          padding: "2px 8px",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.15s",
                        }}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projects grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredProjects.map((project, index) => {
                    const isPatent = project.name.includes("Patent");
                    const hasGithub = "githubUrl" in project && project.githubUrl;
                    const hasLive = "liveUrl" in project && project.liveUrl;

                    return (
                      <div
                        key={project.name}
                        className="project-card"
                        style={{
                          border: "1px solid var(--term-border)",
                          backgroundColor: "var(--term-bg)",
                          padding: "16px",
                          transition: "border-color 0.15s, background-color 0.15s",
                          cursor: "default",
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
                                className="project-link-github"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--term-dim)",
                                  textDecoration: "none",
                                  border: "1px solid var(--term-border)",
                                  padding: "1px 6px",
                                  transition: "all 0.15s",
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
                                className="project-link-live"
                                style={{
                                  fontSize: "11px",
                                  color: "var(--term-dim)",
                                  textDecoration: "none",
                                  border: "1px solid var(--term-border)",
                                  padding: "1px 6px",
                                  transition: "all 0.15s",
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
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                border: `1px solid ${activeTech === tech ? "var(--term-green)" : "var(--term-border)"}`,
                                color: activeTech === tech ? "var(--term-green)" : "var(--term-dim)",
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
                    className="slide-underline github-profile-link"
                    style={{
                      color: "var(--term-blue)",
                      textDecoration: "none",
                      border: "1px solid var(--term-border)",
                      padding: "4px 12px",
                      display: "inline-block",
                      transition: "all 0.15s",
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
