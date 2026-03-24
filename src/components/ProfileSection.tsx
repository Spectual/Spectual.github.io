import { personalInfo } from "@/data/personalInfo";

const ProfileSection = () => {
  const skills = personalInfo.skills;

  return (
    <section className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Terminal window */}
        <div style={{ border: "1px solid var(--term-border)", backgroundColor: "var(--term-bg)" }}>
          {/* Title bar */}
          <div
            style={{
              borderBottom: "1px solid var(--term-border)",
              backgroundColor: "var(--term-bg2)",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "var(--term-dim)", fontSize: "12px" }}>bash — neofetch</span>
          </div>

          {/* Content */}
          <div style={{ padding: "24px", fontSize: "13px" }}>
            {/* Command line */}
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--term-green)" }}>spectual</span>
              <span style={{ color: "var(--term-dim)" }}>@</span>
              <span style={{ color: "var(--term-blue)" }}>github.io</span>
              <span style={{ color: "var(--term-text)" }}>:~$</span>
              <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>neofetch</span>
            </div>

            {/* neofetch layout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
              className="lg:flex-row"
            >
              {/* Avatar column */}
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    border: "1px solid var(--term-border)",
                    overflow: "hidden",
                    width: "140px",
                    height: "140px",
                  }}
                >
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="eager"
                  />
                </div>
                <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--term-green)", textAlign: "center" }}>
                  ● available
                </div>
              </div>

              {/* Info column */}
              <div style={{ flex: 1, fontFamily: "inherit" }}>
                {/* Name */}
                <div style={{ color: "var(--term-green)", fontWeight: 700, fontSize: "20px", marginBottom: "4px" }}>
                  {personalInfo.name}
                </div>
                <div style={{ color: "var(--term-border)", marginBottom: "12px", fontSize: "12px" }}>
                  {"─".repeat(36)}
                </div>

                {/* Key-value info */}
                {[
                  { key: "role", value: personalInfo.title, color: "var(--term-blue)" },
                  { key: "location", value: personalInfo.location, color: "var(--term-blue)" },
                  {
                    key: "email",
                    value: personalInfo.email,
                    color: "var(--term-blue)",
                    href: `mailto:${personalInfo.email}`,
                  },
                  {
                    key: "github",
                    value: "github.com/spectual",
                    color: "var(--term-blue)",
                    href: personalInfo.social.github,
                    external: true,
                  },
                  {
                    key: "linkedin",
                    value: "linkedin.com/in/yifei-bao-mscs",
                    color: "var(--term-blue)",
                    href: personalInfo.social.linkedin,
                    external: true,
                  },
                ].map(({ key, value, color, href, external }) => (
                  <div key={key} style={{ marginBottom: "4px", lineHeight: "1.6" }}>
                    <span style={{ color }}>{key}</span>
                    <span style={{ color: "var(--term-dim)" }}>: </span>
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        style={{ color: "var(--term-text)", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--term-green)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--term-text)")}
                      >
                        {value}
                      </a>
                    ) : (
                      <span style={{ color: "var(--term-text)" }}>{value}</span>
                    )}
                  </div>
                ))}

                <div style={{ color: "var(--term-border)", margin: "12px 0", fontSize: "12px" }}>
                  {"─".repeat(36)}
                </div>

                {/* Skills */}
                <div style={{ marginBottom: "4px", lineHeight: "1.6" }}>
                  <span style={{ color: "var(--term-blue)" }}>skills</span>
                  <span style={{ color: "var(--term-dim)" }}>: </span>
                  <span style={{ color: "var(--term-text)" }}>
                    {skills.slice(0, 5).join(" | ")}
                  </span>
                </div>
                {skills.length > 5 && (
                  <div style={{ marginBottom: "4px", lineHeight: "1.6", paddingLeft: "54px" }}>
                    <span style={{ color: "var(--term-text)" }}>
                      {skills.slice(5).join(" | ")}
                    </span>
                  </div>
                )}

                <div style={{ color: "var(--term-border)", margin: "12px 0", fontSize: "12px" }}>
                  {"─".repeat(36)}
                </div>

                {/* Bio */}
                <div style={{ color: "var(--term-dim)", fontSize: "12px", lineHeight: "1.7", maxWidth: "560px" }}>
                  {personalInfo.background}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
