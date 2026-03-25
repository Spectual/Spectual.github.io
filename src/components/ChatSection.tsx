import { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { sendMessage, checkHealth } from "@/utils/api";
import { toast } from "sonner";
import type { Message } from "@/types/chat";

const PREDEFINED_QUESTIONS = [
  "What is your background?",
  "Tell me about your projects",
  "What are your technical skills?",
  "Where did you study?",
  "What's your work experience?",
  "Any patents or publications?",
];

// ── Neural network thinking indicator ─────────────────────────────────────
const NN_FRAMES = [
  "[●○○] ──▶ [○○] ──▶ [○]",
  "[○●○] ──▶ [○○] ──▶ [○]",
  "[○○●] ──▶ [○○] ──▶ [○]",
  "[○○○] ──▶ [●○] ──▶ [○]",
  "[○○○] ──▶ [○●] ──▶ [○]",
  "[○○○] ──▶ [○○] ──▶ [●]",
];

const ThinkingIndicator = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % NN_FRAMES.length), 180);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <span style={{ color: "var(--term-blue)", fontSize: "11px", flexShrink: 0 }}>ai</span>
      <span style={{ color: "var(--term-dim)" }}>: </span>
      <span
        style={{
          color: "var(--term-dim)",
          fontSize: "11px",
          fontFamily: "inherit",
          letterSpacing: "0.5px",
        }}
      >
        {NN_FRAMES[frame]}
      </span>
      <span style={{ color: "var(--term-green)", fontSize: "12px" }}>thinking</span>
      <span className="cursor-blink" />
    </div>
  );
};

// ── ChatSection ────────────────────────────────────────────────────────────
const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm representing Yifei. Ask me anything about my background, skills, projects, or experience!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const pendingInputRef = useRef("");

  const isNearBottom = (): boolean => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const scrollChatToBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (isNearBottom()) scrollChatToBottom();
  }, [messages]);

  useEffect(() => {
    const checkServerStatus = async () => {
      const isOnline = await checkHealth();
      setIsServerOnline(isOnline);
      if (!isOnline) {
        toast.error("AI server is currently offline. Please try again later.");
      }
    };
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    if (!isServerOnline) {
      toast.error("AI server is currently offline. Please try again later.");
      return;
    }
    // Finish any ongoing typewriter immediately
    setTypingMessageId(null);

    historyRef.current = [messageText, ...historyRef.current];
    historyIndexRef.current = -1;
    pendingInputRef.current = "";

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    requestAnimationFrame(scrollChatToBottom);

    try {
      const response = await sendMessage(messageText);
      const aiId = crypto.randomUUID();
      const aiMessage: Message = {
        id: aiId,
        text: response.success
          ? response.response
          : response.response || "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      if (!response.success) toast.error("Failed to get response. Please try again.");
      setMessages((prev) => [...prev, aiMessage]);
      setTypingMessageId(aiId);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response. Please try again later.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
      return;
    }
    const history = historyRef.current;
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      if (historyIndexRef.current === -1) {
        pendingInputRef.current = inputValue;
      }
      const next = Math.min(historyIndexRef.current + 1, history.length - 1);
      historyIndexRef.current = next;
      setInputValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndexRef.current <= 0) {
        historyIndexRef.current = -1;
        setInputValue(pendingInputRef.current);
      } else {
        historyIndexRef.current--;
        setInputValue(history[historyIndexRef.current]);
      }
    }
  };

  return (
    <section className="px-4 pb-6" style={{ position: "relative", zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">
        <div style={{ border: "1px solid var(--term-border)", backgroundColor: "var(--term-bg)" }}>
          {/* Terminal title bar — enhanced AI style */}
          <div
            style={{
              borderBottom: "1px solid var(--term-border)",
              backgroundColor: "var(--term-bg2)",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <span style={{ color: "var(--term-dim)", fontSize: "12px" }}>
              🧠{" "}
              <span style={{ color: "var(--term-text)" }}>AI Assistant v2.0</span>
              <span style={{ color: "var(--term-dim)" }}>
                {" "}| model:{" "}
              </span>
              <span style={{ color: "var(--term-cyan)" }}>rag-powered</span>
              <span style={{ color: "var(--term-dim)" }}>
                {" "}| status:{" "}
              </span>
              <span style={{ color: isServerOnline ? "var(--term-green)" : "var(--term-red)" }}>
                {isServerOnline ? "online" : "offline"}
              </span>
            </span>
            {/* Server status dot */}
            <span
              style={{
                fontSize: "11px",
                color: isServerOnline ? "var(--term-green)" : "var(--term-red)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: isServerOnline ? "var(--term-green)" : "var(--term-red)",
                  display: "inline-block",
                  animation: isServerOnline ? "neuralPulse 2s ease-in-out infinite" : "none",
                }}
              />
              {isServerOnline ? "server:online" : "server:offline"}
            </span>
          </div>

          {/* Header command */}
          <div style={{ padding: "12px 16px 0", fontSize: "12px", borderBottom: "1px solid var(--term-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "10px" }}>
              <span style={{ color: "var(--term-green)" }}>spectual</span>
              <span style={{ color: "var(--term-dim)" }}>@</span>
              <span style={{ color: "var(--term-blue)" }}>github.io</span>
              <span style={{ color: "var(--term-text)" }}>:~$</span>
              <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>
                chat --model rag-powered
              </span>
            </div>
          </div>

          {!isServerOnline && (
            <div
              style={{
                margin: "8px 16px",
                padding: "8px 12px",
                border: "1px solid var(--term-red)",
                backgroundColor: "rgba(248, 81, 73, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "var(--term-red)",
              }}
            >
              <AlertCircle size={13} />
              error: AI server is offline. Responses unavailable.
            </div>
          )}

          {/* Messages area */}
          <div
            ref={scrollContainerRef}
            role="log"
            aria-live="polite"
            className="terminal-scroll"
            style={{
              height: "min(384px, 50dvh)",
              overflowY: "auto",
              padding: "16px",
              fontFamily: "inherit",
              fontSize: "13px",
            }}
          >
            {messages.map((message) => (
              <div key={message.id} className="msg-slide-up">
                <MessageBubble
                  message={message}
                  isTyping={typingMessageId === message.id}
                  onTypingComplete={() => setTypingMessageId(null)}
                />
              </div>
            ))}
            {isLoading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              borderTop: "1px solid var(--term-border)",
              padding: "12px 16px",
              backgroundColor: "var(--term-bg)",
            }}
          >
            {/* Predefined questions */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", color: "var(--term-dim)", marginBottom: "6px" }}>
                # quick commands:
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                {PREDEFINED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading || !isServerOnline}
                    className="chat-quick-btn"
                    style={{
                      padding: "2px 8px",
                      border: "1px solid var(--term-border)",
                      backgroundColor: "transparent",
                      color: "var(--term-dim)",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      opacity: isLoading || !isServerOnline ? 0.4 : 1,
                    }}
                  >
                    [{index + 1}] {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Command prompt input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid var(--term-border)",
                padding: "8px 12px",
                backgroundColor: "var(--term-bg2)",
              }}
              onClick={() => inputRef.current?.focus()}
            >
              <span style={{ color: "var(--term-green)", fontSize: "13px", flexShrink: 0 }}>❯</span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="type your question..."
                disabled={isLoading || !isServerOnline}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--term-text)",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  caretColor: "var(--term-green)",
                }}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim() || !isServerOnline}
                className="hidden sm:block"
                style={{
                  background: "transparent",
                  border: "none",
                  color:
                    inputValue.trim() && !isLoading && isServerOnline
                      ? "var(--term-green)"
                      : "var(--term-border)",
                  cursor:
                    inputValue.trim() && !isLoading && isServerOnline ? "pointer" : "default",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  padding: "0 4px",
                  transition: "color 0.15s",
                  flexShrink: 0,
                }}
              >
                [enter]
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
