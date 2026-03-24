import { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { sendMessage, checkHealth } from "@/utils/api";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const PREDEFINED_QUESTIONS = [
  "What is your background?",
  "Tell me about your projects",
  "What are your technical skills?",
  "Where did you study?",
  "What's your work experience?",
  "Any patents or publications?",
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    const userMessage: Message = {
      id: Date.now().toString(),
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
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.success
          ? response.response
          : response.response || "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      if (!response.success) toast.error("Failed to get response. Please try again.");
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response. Please try again later.");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
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
    }
  };

  return (
    <section className="px-4 pb-6">
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
            }}
          >
            <span style={{ color: "var(--term-dim)", fontSize: "12px" }}>
              bash — ~/chat
            </span>
            {/* Server status */}
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
            className="terminal-scroll"
            style={{
              height: "384px",
              overflowY: "auto",
              padding: "16px",
              fontFamily: "inherit",
              fontSize: "13px",
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--term-dim)" }}>
                <span style={{ color: "var(--term-blue)" }}>ai</span>
                <span style={{ color: "var(--term-dim)" }}>: </span>
                <span style={{ color: "var(--term-green)" }}>
                  thinking
                  <span className="cursor-blink" />
                </span>
              </div>
            )}
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {PREDEFINED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading || !isServerOnline}
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
                    onMouseEnter={(e) => {
                      if (!isLoading && isServerOnline) {
                        e.currentTarget.style.borderColor = "var(--term-green)";
                        e.currentTarget.style.color = "var(--term-green)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--term-border)";
                      e.currentTarget.style.color = "var(--term-dim)";
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
                style={{
                  background: "transparent",
                  border: "none",
                  color: inputValue.trim() && !isLoading && isServerOnline
                    ? "var(--term-green)"
                    : "var(--term-border)",
                  cursor: inputValue.trim() && !isLoading && isServerOnline ? "pointer" : "default",
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
