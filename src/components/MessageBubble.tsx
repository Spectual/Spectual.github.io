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
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (message.isUser) {
    return (
      <div style={{ marginBottom: "12px" }}>
        {/* Prompt line */}
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

  return (
    <div style={{ marginBottom: "12px" }}>
      {/* AI response */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
        <span style={{ color: "var(--term-blue)", flexShrink: 0, fontSize: "11px", marginTop: "2px" }}>ai</span>
        <div style={{ flex: 1 }}>
          <span style={{ color: "var(--term-dim)" }}>: </span>
          <span
            style={{ color: "var(--term-text)" }}
            className="prose prose-sm max-w-none"
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <span style={{ display: "block", lineHeight: "1.6", color: "var(--term-text)" }}>
                    {children}
                  </span>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: "var(--term-green)", fontWeight: 600 }}>{children}</strong>
                ),
                em: ({ children }) => (
                  <em style={{ color: "var(--term-yellow)" }}>{children}</em>
                ),
                code: ({ children }) => (
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
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: "16px", margin: "4px 0", color: "var(--term-text)" }}>{children}</ul>
                ),
                li: ({ children }) => (
                  <li style={{ listStyleType: "none", paddingLeft: "0", color: "var(--term-text)" }}>
                    <span style={{ color: "var(--term-green)", marginRight: "6px" }}>·</span>
                    {children}
                  </li>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </span>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "var(--term-dim)", paddingLeft: "22px", marginTop: "2px" }}>
        {time}
      </div>
    </div>
  );
};

export default MessageBubble;
