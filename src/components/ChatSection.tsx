import { useState, useEffect, useRef } from "react";
import { AlertCircle, Download } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { sendMessageStream, checkHealth } from "@/utils/api";
import { toast } from "sonner";
import type { Message } from "@/types/chat";
import { useLang } from "@/i18n/LanguageContext";

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
const INITIAL_MSG_ID = "1";

const ChatSection = () => {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: INITIAL_MSG_ID,
      text: t.chat.greeting,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const pendingInputRef = useRef("");

  // Update greeting when language changes (if no user messages yet)
  useEffect(() => {
    setMessages((prev) => {
      const hasUserMsg = prev.some((m) => m.isUser);
      if (hasUserMsg) return prev;
      return [{ id: INITIAL_MSG_ID, text: t.chat.greeting, isUser: false, timestamp: prev[0].timestamp }];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
        toast.error(t.chat.offlineToast);
      }
    };
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = () => {
    if (messages.length <= 1) {
      toast.info(t.chat.exportNothing);
      return;
    }
    const lines = messages.map((m) => {
      const time = m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return m.isUser
        ? `**[${time}] ${t.chat.youLabel}:** ${m.text}`
        : `**[${time}] ${t.chat.aiLabel}:** ${m.text}`;
    });
    const content = `${t.chat.exportHeader}\n\n_${t.chat.exportedOn} ${new Date().toLocaleString()}_\n\n---\n\n${lines.join("\n\n---\n\n")}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    if (!isServerOnline) {
      toast.error(t.chat.offlineToast);
      return;
    }

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

    const aiId = crypto.randomUUID();

    await sendMessageStream(
      messageText,
      // onChunk: first chunk creates the message, subsequent ones append
      (chunk) => {
        setIsLoading(false);
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === aiId);
          if (existing) {
            return prev.map((m) => (m.id === aiId ? { ...m, text: m.text + chunk } : m));
          }
          // First chunk — add message and mark it streaming
          setStreamingMessageId(aiId);
          requestAnimationFrame(scrollChatToBottom);
          return [
            ...prev,
            { id: aiId, text: chunk, isUser: false, timestamp: new Date() },
          ];
        });
      },
      // onDone
      () => {
        setIsLoading(false);
        setStreamingMessageId(null);
        inputRef.current?.focus();
      },
      // onError
      (error) => {
        console.error("Stream error:", error);
        setIsLoading(false);
        setStreamingMessageId(null);
        toast.error(t.chat.streamError);
        setMessages((prev) => {
          const hasAiMessage = prev.some((m) => m.id === aiId);
          if (hasAiMessage) return prev;
          return [
            ...prev,
            {
              id: aiId,
              text: t.chat.fallbackError,
              isUser: false,
              timestamp: new Date(),
            },
          ];
        });
        inputRef.current?.focus();
      }
    );
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
          {/* Terminal title bar */}
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
              <span style={{ color: "var(--term-text)" }}>{t.chat.titleBar}</span>
              <span style={{ color: "var(--term-dim)" }}>
                {" "}| {t.chat.modelLabel}:{" "}
              </span>
              <span style={{ color: "var(--term-cyan)" }}>rag-powered</span>
              <span style={{ color: "var(--term-dim)" }}>
                {" "}| {t.chat.statusLabel}:{" "}
              </span>
              <span style={{ color: isServerOnline ? "var(--term-green)" : "var(--term-red)" }}>
                {isServerOnline ? t.chat.statusOnline : t.chat.statusOffline}
              </span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                {isServerOnline ? t.chat.serverOnline : t.chat.serverOffline}
              </span>
              {/* Export button */}
              <button
                onClick={handleExport}
                title={t.chat.exportTooltip}
                style={{
                  background: "transparent",
                  border: "1px solid var(--term-border)",
                  color: "var(--term-dim)",
                  cursor: "pointer",
                  padding: "2px 6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  transition: "color 0.15s, border-color 0.15s",
                }}
                className="chat-quick-btn"
              >
                <Download size={11} />
                {t.chat.exportBtn}
              </button>
            </div>
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
              {t.chat.offlineError}
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
                  isStreaming={streamingMessageId === message.id}
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
                {t.chat.quickCommands}
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                {t.chat.questions.map((question, index) => (
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
                placeholder={t.chat.placeholder}
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
                {t.chat.enterBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
