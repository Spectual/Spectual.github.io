import { useEffect, useRef } from "react";

const ML_CHARS = "01∑∇θσλWbxy∂αβγπφψΩε∞≈∫∏μν∈⊕⊗‖∥";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Lower density on mobile
    const isMobile = window.innerWidth < 768;

    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newCols = isMobile
        ? Math.floor(canvas.width / (fontSize * 3))
        : Math.floor(canvas.width / fontSize);
      if (newCols !== columns) {
        columns = newCols;
        drops = Array(columns).fill(1);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let animId: number;
    let lastTime = 0;
    const frameInterval = isMobile ? 160 : 90;

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw);
      if (timestamp - lastTime < frameInterval) return;
      lastTime = timestamp;

      // Very slow trail fade
      ctx.fillStyle = "rgba(13, 17, 23, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(63, 185, 80, 0.55)";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      const colSpacing = isMobile ? fontSize * 3 : fontSize;
      for (let i = 0; i < drops.length; i++) {
        const char = ML_CHARS[Math.floor(Math.random() * ML_CHARS.length)];
        ctx.fillText(char, i * colSpacing, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.035,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default MatrixRain;
