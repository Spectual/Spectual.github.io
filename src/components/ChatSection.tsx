import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, AlertCircle, Wifi, WifiOff } from "lucide-react";
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <section className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/30 shrink-0">
                <Bot className="text-white" size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">Ask Anything About Me</h2>
                <p className="text-slate-400 text-sm">Powered by RAG · instant answers about background & projects</p>
              </div>
              {/* Server status pill */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isServerOnline
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-red-500/10 border-red-500/20 text-red-300"
              }`}>
                {isServerOnline
                  ? <Wifi size={12} />
                  : <WifiOff size={12} />
                }
                {isServerOnline ? "Online" : "Offline"}
              </div>
            </div>

            {!isServerOnline && (
              <div className="mt-4 bg-red-500/10 rounded-xl p-3 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="text-red-400 shrink-0" size={16} />
                <p className="text-sm text-red-300">AI server is offline. Responses may be unavailable.</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3">
                  <div className="flex space-x-1.5 items-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Chips */}
          <div className="p-6 bg-slate-900/30 border-t border-white/10 space-y-4">
            {/* Input row */}
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about my background..."
                className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 backdrop-blur-sm rounded-xl focus-visible:ring-cyan-500/50"
                disabled={isLoading || !isServerOnline}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim() || !isServerOnline}
                className="rounded-xl px-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all duration-200 disabled:opacity-40"
              >
                <Send size={16} />
              </Button>
            </div>

            {/* Predefined question chips — flex-wrap */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading || !isServerOnline}
                    className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-white rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
