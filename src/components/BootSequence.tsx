import { useState, useEffect, useRef, useCallback } from "react";

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
  const completedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    timersRef.current.forEach(clearTimeout);
    setFading(true);
    setTimeout(onComplete, 380);
  }, [onComplete]);

  useEffect(() => {
    const timers = timersRef.current;

    BOOT_LINES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), i * 340 + 150);
      timers.push(t);
    });

    const totalTime = BOOT_LINES.length * 340 + 150;
    const t1 = setTimeout(() => {
      if (!completedRef.current) setFading(true);
    }, totalTime + 400);
    const t2 = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, totalTime + 850);
    timers.push(t1, t2);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    window.addEventListener("keydown", finish);
    window.addEventListener("touchstart", finish);
    return () => {
      window.removeEventListener("keydown", finish);
      window.removeEventListener("touchstart", finish);
    };
  }, [finish]);

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
      {/* Scanline overlay */}
      <div className="boot-scanline-wrap" />

      <div style={{ fontFamily: "inherit", fontSize: "13px", minWidth: "320px", position: "relative", zIndex: 2 }}>
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
        <div style={{ color: "var(--term-dim)", fontSize: "11px", marginTop: "24px" }}>
          Press any key to skip...
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
