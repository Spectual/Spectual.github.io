import { useState, useEffect, useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const target = Math.round((level / 100) * BAR_TOTAL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let current = 0;
        const step = () => {
          if (current >= target) return;
          current++;
          setFilled(current);
          setTimeout(step, 45);
        };
        setTimeout(step, delay);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, delay]);

  const empty = BAR_TOTAL - filled;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        marginBottom: "4px",
        fontFamily: "inherit",
      }}
    >
      <span style={{ color: "var(--term-blue)", minWidth: "60px", display: "inline-block" }}>
        {name}
      </span>
      <span>
        <span style={{ color: "var(--term-green)" }}>{"█".repeat(filled)}</span>
        <span style={{ color: "var(--term-border)" }}>{"░".repeat(empty)}</span>
      </span>
      <span style={{ color: "var(--term-dim)" }}>{level}%</span>
    </div>
  );
};

// ── Auto-typing CLI demo ───────────────────────────────────────────────────
const DEMO_COMMANDS: { cmd: string; output: string }[] = [
  { cmd: "cat about.txt", output: "> ML Engineer | Boston, MA | 3+ yrs research" },
  {
    cmd: "python train.py --model multimodal-llm",
    output: "Training...  Epoch 1/100  loss=0.342\nDone ✓  best_val_loss=0.184",
  },
  {
    cmd: "git push origin main",
    output: "Counting objects: 5, done.\nTo github.com:spectual → main ✓",
  },
  { cmd: "docker run -p 8080:8080 portfolio", output: "Container started. Listening on :8080 ✓" },
];

const AutoTypeCLI = () => {
  const [text, setText] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "deleting">("typing");

  useEffect(() => {
    const { cmd } = DEMO_COMMANDS[cmdIndex];

    if (phase === "typing") {
      if (text.length < cmd.length) {
        // Random typing speed: 50–150ms per char
        const delay = 50 + Math.random() * 100;
        const t = setTimeout(() => setText(cmd.slice(0, text.length + 1)), delay);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("output"), 300);
        return () => clearTimeout(t);
      }
    }

    if (phase === "output") {
      const t = setTimeout(() => setPhase("deleting"), 2200);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 25);
        return () => clearTimeout(t);
      } else {
        setCmdIndex((i) => (i + 1) % DEMO_COMMANDS.length);
        setPhase("typing");
      }
    }
  }, [text, cmdIndex, phase]);

  const { output } = DEMO_COMMANDS[cmdIndex];

  return (
    <div
      style={{
        fontSize: "12px",
        marginTop: "16px",
        paddingTop: "14px",
        borderTop: "1px solid var(--term-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", flexWrap: "wrap", minHeight: "2.6em" }}>
        <span style={{ color: "var(--term-green)" }}>spectual</span>
        <span style={{ color: "var(--term-dim)" }}>@</span>
        <span style={{ color: "var(--term-blue)" }}>github.io</span>
        <span style={{ color: "var(--term-text)" }}>:~$</span>
        <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>{text}</span>
        {phase !== "output" && <span className="cursor-blink" />}
      </div>
      <div
        style={{
          color: "var(--term-dim)",
          marginTop: "6px",
          whiteSpace: "pre-line",
          borderLeft: "2px solid var(--term-border)",
          paddingLeft: "8px",
          fontSize: "11px",
          minHeight: "2.8em",
          visibility: phase === "output" ? "visible" : "hidden",
        }}
      >
        {output}
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
          <div style={{ padding: "16px", fontSize: "13px" }} className="sm:p-6">
            {/* Command line */}
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "var(--term-green)" }}>spectual</span>
              <span style={{ color: "var(--term-dim)" }}>@</span>
              <span style={{ color: "var(--term-blue)" }}>github.io</span>
              <span style={{ color: "var(--term-text)" }}>:~$</span>
              <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>neofetch</span>
            </div>

            {/* neofetch layout — vertical on mobile, horizontal on lg */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              className="lg:flex-row items-center lg:items-start lg:gap-6"
            >
              {/* Avatar column */}
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                {/* ASCII-style terminal frame */}
                <div
                  style={{
                    fontFamily: "inherit",
                    fontSize: "12px",
                    color: "var(--term-border)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  ┌────────────────┐
                </div>
                <div
                  style={{
                    border: "1px solid var(--term-border)",
                    borderTop: "none",
                    borderBottom: "none",
                    overflow: "hidden",
                    width: "140px",
                    height: "140px",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={personalInfo.avatar}
                    alt={personalInfo.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="eager"
                  />
                </div>
                <div
                  style={{
                    fontFamily: "inherit",
                    fontSize: "12px",
                    color: "var(--term-border)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  └────────────────┘
                </div>
                <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--term-green)" }}>
                  ● available
                </div>
              </div>

              {/* Info column */}
              <div style={{ flex: 1, fontFamily: "inherit", width: "100%" }}>
                {/* Name — typewriter */}
                <div
                  style={{
                    color: "var(--term-green)",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                  className="sm:text-xl"
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

                {/* Skills text — wraps on mobile */}
                <div style={{ marginBottom: "4px", lineHeight: "1.6" }}>
                  <span style={{ color: "var(--term-blue)" }}>skills</span>
                  <span style={{ color: "var(--term-dim)" }}>: </span>
                  <span
                    style={{
                      color: "var(--term-text)",
                      display: "inline-flex",
                      flexWrap: "wrap",
                      gap: "0 2px",
                    }}
                  >
                    {skills.slice(0, 5).map((s, i) => (
                      <span key={s}>
                        {s}
                        {i < 4 && <span style={{ color: "var(--term-dim)" }}> | </span>}
                      </span>
                    ))}
                  </span>
                </div>
                {skills.length > 5 && (
                  <div
                    style={{
                      marginBottom: "4px",
                      lineHeight: "1.6",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0 2px",
                      paddingLeft: "54px",
                    }}
                  >
                    {skills.slice(5).map((s, i) => (
                      <span key={s} style={{ color: "var(--term-text)" }}>
                        {s}
                        {i < skills.slice(5).length - 1 && (
                          <span style={{ color: "var(--term-dim)" }}> | </span>
                        )}
                      </span>
                    ))}
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
                    <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 120} />
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
