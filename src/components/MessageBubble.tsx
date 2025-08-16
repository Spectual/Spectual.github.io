import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-sm ${
          message.isUser
            ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 shadow-lg"
            : "bg-white/10 text-slate-100 border border-white/20"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <p className={`text-xs mt-2 ${message.isUser ? "text-cyan-200/80" : "text-slate-400"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
