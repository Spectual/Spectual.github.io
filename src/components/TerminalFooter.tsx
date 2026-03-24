const TerminalFooter = () => {
  const now = new Date();
  const loginStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer
      style={{
        maxWidth: "896px",
        margin: "0 auto",
        padding: "0 16px 28px",
        fontSize: "11px",
        color: "var(--term-dim)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ borderTop: "1px solid var(--term-border)", paddingTop: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <span>
            <span style={{ color: "var(--term-green)" }}>spectual</span>
            <span style={{ color: "var(--term-dim)" }}>@</span>
            <span style={{ color: "var(--term-blue)" }}>github.io</span>
            <span style={{ color: "var(--term-dim)" }}>
              {" "}| Built with React + TypeScript +{" "}
            </span>
            <span style={{ color: "var(--term-red)" }}>❤</span>
          </span>
          <span style={{ color: "var(--term-dim)" }}>
            Last login:{" "}
            <span style={{ color: "var(--term-text)" }}>{loginStr}</span>
            {" "}from visitor.ip
          </span>
        </div>
      </div>
    </footer>
  );
};

export default TerminalFooter;
