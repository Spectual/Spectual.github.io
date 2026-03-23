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
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          message.isUser
            ? "bg-[#cf6b47]/15 text-stone-100 border border-[#cf6b47]/25"
            : "bg-stone-800 text-stone-200 border border-stone-700/60"
        }`}
      >
        <div className="prose prose-sm prose-invert max-w-none prose-p:text-stone-200 prose-strong:text-stone-100">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <p className={`text-xs mt-1.5 ${message.isUser ? "text-stone-400" : "text-stone-500"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
