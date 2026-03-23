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
    <section className="px-6 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 p-5 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-stone-800 border border-stone-700 rounded-xl flex items-center justify-center shrink-0">
                <Bot className="text-[#cf6b47]" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-stone-100">Ask Anything About Me</h2>
                <p className="text-stone-500 text-xs">Powered by RAG · instant answers about background & projects</p>
              </div>
              {/* Server status pill */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isServerOnline
                  ? "bg-emerald-950/60 border-emerald-800/50 text-emerald-400"
                  : "bg-red-950/60 border-red-800/50 text-red-400"
              }`}>
                {isServerOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                {isServerOnline ? "Online" : "Offline"}
              </div>
            </div>

            {!isServerOnline && (
              <div className="mt-3 bg-red-950/40 rounded-xl p-3 border border-red-900/50 flex items-center gap-2.5">
                <AlertCircle className="text-red-400 shrink-0" size={15} />
                <p className="text-sm text-red-400">AI server is offline. Responses may be unavailable.</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="h-96 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-800 rounded-2xl px-4 py-3 border border-stone-700/60">
                  <div className="flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input + Chips */}
          <div className="p-5 bg-stone-950/50 border-t border-stone-800 space-y-3">
            {/* Input row */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about my background..."
                className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500 rounded-xl focus-visible:ring-[#cf6b47]/40 focus-visible:border-stone-600"
                disabled={isLoading || !isServerOnline}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim() || !isServerOnline}
                className="rounded-xl px-3.5 bg-[#cf6b47]/20 hover:bg-[#cf6b47]/30 text-[#cf6b47] border border-[#cf6b47]/30 hover:border-[#cf6b47]/50 transition-all duration-150 disabled:opacity-40"
              >
                <Send size={15} />
              </Button>
            </div>

            {/* Predefined question chips */}
            <div>
              <p className="text-xs text-stone-600 mb-2 font-medium uppercase tracking-wider">Try asking</p>
              <div className="flex flex-wrap gap-1.5">
                {PREDEFINED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    disabled={isLoading || !isServerOnline}
                    className="px-3 py-1.5 text-xs border border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-300 rounded-full transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
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
