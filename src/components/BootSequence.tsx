import { useState, useEffect } from "react";

const BOOT_LINES = [
  { text: "[  OK  ] Starting neural network...", color: "var(--term-green)" },
  { text: "[  OK  ] Loading model weights...", color: "var(--term-green)" },
  { text: "[  OK  ] Initializing RAG pipeline...", color: "var(--term-green)" },
  { text: "[  OK  ] Mounting vector database...", color: "var(--term-green)" },
  { text: "[  OK  ] System ready.", color: "var(--term-green)" },
  { text: "", color: "" },
  { text: "Welcome to spectual.github.io", color: "var(--term-text)" },
];

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 340 + 150));
    });

    const totalTime = BOOT_LINES.length * 340 + 150;
    timers.push(setTimeout(() => setFading(true), totalTime + 400));
    timers.push(setTimeout(() => onComplete(), totalTime + 850));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--term-bg)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.45s ease-out",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div style={{ fontFamily: "inherit", fontSize: "13px", minWidth: "320px" }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color || "transparent",
              marginBottom: line.text ? "5px" : "14px",
              animation: "fadeInLine 0.18s ease-out",
            }}
          >
            {line.text || "\u00a0"}
          </div>
        ))}
        {visibleLines > 0 && visibleLines <= BOOT_LINES.length && (
          <span className="cursor-blink" />
        )}
      </div>
    </div>
  );
};

export default BootSequence;
