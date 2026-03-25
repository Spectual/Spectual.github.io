import { useState, useEffect, useRef } from "react";

interface TypewriterOptions {
  speed?: number;       // ms per character
  startDelay?: number;  // ms before typing starts
  onComplete?: () => void;
}

export const useTypewriter = (text: string, options?: TypewriterOptions) => {
  const { speed = 60, startDelay = 0 } = options ?? {};
  const onCompleteRef = useRef(options?.onComplete);
  onCompleteRef.current = options?.onComplete;

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;
    let cancelled = false;
    let delayTimer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        onCompleteRef.current?.();
      } else {
        delayTimer = setTimeout(step, speed);
      }
    };

    delayTimer = setTimeout(step, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
};
