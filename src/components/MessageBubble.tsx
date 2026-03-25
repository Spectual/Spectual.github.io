import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}

// Shared markdown components for AI responses
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <span style={{ display: "block", lineHeight: "1.6", color: "var(--term-text)" }}>
      {children}
    </span>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: "var(--term-green)", fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em style={{ color: "var(--term-yellow)" }}>{children}</em>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code
      style={{
        backgroundColor: "var(--term-bg2)",
        border: "1px solid var(--term-border)",
        padding: "0 4px",
        color: "var(--term-cyan)",
        fontSize: "12px",
      }}
    >
      {children}
    </code>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ paddingLeft: "16px", margin: "4px 0", color: "var(--term-text)" }}>{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ listStyleType: "none", paddingLeft: "0", color: "var(--term-text)" }}>
      <span style={{ color: "var(--term-green)", marginRight: "6px" }}>·</span>
      {children}
    </li>
  ),
};

const MessageBubble = ({ message, isTyping = false, onTypingComplete }: MessageBubbleProps) => {
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const onCompleteRef = useRef(onTypingComplete);
  onCompleteRef.current = onTypingComplete;

  // Typewriter for AI messages — 10ms/char is fast enough for long responses
  const { displayed, done } = useTypewriter(
    !message.isUser && isTyping ? message.text : "",
    { speed: 10, onComplete: () => onCompleteRef.current?.() }
  );

  const ref = useRef<HTMLDivElement>(null);

  if (message.isUser) {
    return (
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <span style={{ color: "var(--term-green)", flexShrink: 0, marginTop: "1px" }}>❯</span>
          <div style={{ flex: 1 }}>
            <span style={{ color: "var(--term-dim)", fontSize: "11px" }}>user</span>
            <span style={{ color: "var(--term-dim)" }}>: </span>
            <span style={{ color: "var(--term-text)" }}>{message.text}</span>
          </div>
        </div>
        <div style={{ fontSize: "10px", color: "var(--term-dim)", paddingLeft: "22px", marginTop: "2px" }}>
          {time}
        </div>
      </div>
    );
  }

  // Determine what text to render
  const renderText = isTyping ? displayed : message.text;
  const showCursor = isTyping && !done;

  return (
    <div ref={ref} style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
        <span
          style={{
            color: "var(--term-blue)",
            flexShrink: 0,
            fontSize: "11px",
            marginTop: "2px",
          }}
        >
          ai
        </span>
        <div style={{ flex: 1 }}>
          <span style={{ color: "var(--term-dim)" }}>: </span>
          <span style={{ color: "var(--term-text)" }} className="prose prose-sm max-w-none">
            <ReactMarkdown components={markdownComponents}>{renderText}</ReactMarkdown>
          </span>
          {showCursor && <span className="cursor-blink" />}
        </div>
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "var(--term-dim)",
          paddingLeft: "22px",
          marginTop: "2px",
        }}
      >
        {time}
      </div>
    </div>
  );
};

export default MessageBubble;
