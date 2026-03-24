import { useState, useEffect } from "react";
import { personalInfo } from "@/data/personalInfo";
import { useTypewriter } from "@/hooks/useTypewriter";

// ── Skill progress bars ────────────────────────────────────────────────────
const SKILL_LEVELS = [
  { name: "Python", level: 95 },
  { name: "PyTorch", level: 90 },
  { name: "ML", level: 88 },
  { name: "LLM/RAG", level: 85 },
  { name: "CV", level: 80 },
];

const BAR_TOTAL = 20;

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilled(Math.round((level / 100) * BAR_TOTAL));
    }, delay);
    return () => clearTimeout(t);
  }, [level, delay]);

  const empty = BAR_TOTAL - filled;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        marginBottom: "4px",
        fontFamily: "inherit",
      }}
    >
      <span style={{ color: "var(--term-blue)", minWidth: "72px", display: "inline-block" }}>
        {name}
      </span>
      <span>
        <span
          style={{
            color: "var(--term-green)",
            transition: "all 0.8s ease-out",
          }}
        >
          {"█".repeat(filled)}
        </span>
        <span style={{ color: "var(--term-border)" }}>{"░".repeat(empty)}</span>
      </span>
      <span style={{ color: "var(--term-dim)" }}>{level}%</span>
    </div>
  );
};

// ── Auto-typing CLI demo ───────────────────────────────────────────────────
const DEMO_COMMANDS = [
  "cat about.txt",
  "python train.py --model multimodal-llm",
  "git push origin main",
  "docker run -p 8080:8080 portfolio",
];

const AutoTypeCLI = () => {
  const [text, setText] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const cmd = DEMO_COMMANDS[cmdIndex];

    if (phase === "typing") {
      if (text.length < cmd.length) {
        const t = setTimeout(() => setText(cmd.slice(0, text.length + 1)), 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), 1600);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 500);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else {
        setCmdIndex((i) => (i + 1) % DEMO_COMMANDS.length);
        setPhase("typing");
      }
    }
  }, [text, cmdIndex, phase]);

  return (
    <div
      style={{
        fontSize: "12px",
        marginTop: "16px",
        paddingTop: "14px",
        borderTop: "1px solid var(--term-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ color: "var(--term-green)" }}>spectual</span>
        <span style={{ color: "var(--term-dim)" }}>@</span>
        <span style={{ color: "var(--term-blue)" }}>github.io</span>
        <span style={{ color: "var(--term-text)" }}>:~$</span>
        <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>{text}</span>
        <span className="cursor-blink" />
      </div>
    </div>
  );
};

// ── ProfileSection ─────────────────────────────────────────────────────────
const ProfileSection = () => {
  const skills = personalInfo.skills;

  // Chained typewriter: name first, then role after name finishes
  const [nameTyped, setNameTyped] = useState(false);
  const { displayed: displayedName } = useTypewriter(personalInfo.name, {
    speed: 65,
    startDelay: 200,
    onComplete: () => setNameTyped(true),
  });
  const { displayed: displayedRole } = useTypewriter(
    nameTyped ? personalInfo.title : "",
    { speed: 50, startDelay: 100 }
  );

  return (
    <section className="px-4 py-6" style={{ position: "relative", zIndex: 1 }}>
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
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
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
                {/* Name — typewriter */}
                <div
                  style={{
                    color: "var(--term-green)",
                    fontWeight: 700,
                    fontSize: "20px",
                    marginBottom: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {displayedName}
                  {!nameTyped && <span className="cursor-blink" />}
                </div>

                {/* Role — typewriter, starts after name */}
                <div
                  style={{
                    color: "var(--term-cyan)",
                    fontSize: "12px",
                    marginBottom: "12px",
                    minHeight: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {displayedRole}
                  {nameTyped && displayedRole !== personalInfo.title && (
                    <span className="cursor-blink" />
                  )}
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
                        className="slide-underline"
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

                {/* Skills text */}
                <div style={{ marginBottom: "4px", lineHeight: "1.6" }}>
                  <span style={{ color: "var(--term-blue)" }}>skills</span>
                  <span style={{ color: "var(--term-dim)" }}>: </span>
                  <span style={{ color: "var(--term-text)" }}>{skills.slice(0, 5).join(" | ")}</span>
                </div>
                {skills.length > 5 && (
                  <div style={{ marginBottom: "4px", lineHeight: "1.6", paddingLeft: "54px" }}>
                    <span style={{ color: "var(--term-text)" }}>{skills.slice(5).join(" | ")}</span>
                  </div>
                )}

                <div style={{ color: "var(--term-border)", margin: "12px 0", fontSize: "12px" }}>
                  {"─".repeat(36)}
                </div>

                {/* Skills progress bars */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "var(--term-dim)", marginBottom: "8px" }}>
                    # proficiency
                  </div>
                  {SKILL_LEVELS.map((s, i) => (
                    <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 120 + 400} />
                  ))}
                </div>

                <div style={{ color: "var(--term-border)", margin: "12px 0", fontSize: "12px" }}>
                  {"─".repeat(36)}
                </div>

                {/* Bio */}
                <div style={{ color: "var(--term-dim)", fontSize: "12px", lineHeight: "1.7", maxWidth: "560px" }}>
                  {personalInfo.background}
                </div>

                {/* Auto-type CLI */}
                <AutoTypeCLI />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
