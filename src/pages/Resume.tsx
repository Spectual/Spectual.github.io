import TerminalHeader from "@/components/TerminalHeader";

const Resume = () => {

  const resumeLinks = {
    googleDrive: "https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/view?usp=sharing",
    directDownload: "https://drive.google.com/uc?export=download&id=1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1",
  };

  const btnStyle: React.CSSProperties = {
    border: "1px solid var(--term-border)",
    backgroundColor: "transparent",
    color: "var(--term-dim)",
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)" }}>
      <TerminalHeader />

      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div style={{ border: "1px solid var(--term-border)", backgroundColor: "var(--term-bg)" }}>
            {/* Title bar */}
            <div
              style={{
                borderBottom: "1px solid var(--term-border)",
                backgroundColor: "var(--term-bg2)",
                padding: "6px 16px",
                fontSize: "12px",
                color: "var(--term-dim)",
              }}
            >
              bash — ~/resume
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Command header */}
              <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ color: "var(--term-green)" }}>spectual</span>
                  <span style={{ color: "var(--term-dim)" }}>@</span>
                  <span style={{ color: "var(--term-blue)" }}>github.io</span>
                  <span style={{ color: "var(--term-text)" }}>:~$</span>
                  <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>
                    cat Yifei_Bao_BU_MSCS.pdf
                  </span>
                </div>
                <div style={{ color: "var(--term-dim)", fontSize: "11px" }}>
                  # rendering PDF preview... use buttons below to open or download
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <a
                  href={resumeLinks.googleDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={btnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--term-blue)";
                    e.currentTarget.style.color = "var(--term-blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--term-border)";
                    e.currentTarget.style.color = "var(--term-dim)";
                  }}
                >
                  [open-in-drive]
                </a>
                <a
                  href={resumeLinks.directDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...btnStyle, color: "var(--term-green)", borderColor: "var(--term-green)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--term-green)";
                    e.currentTarget.style.color = "var(--term-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--term-green)";
                  }}
                >
                  [download-pdf]
                </a>
              </div>

              {/* File info */}
              <div
                style={{
                  border: "1px solid var(--term-border)",
                  backgroundColor: "var(--term-bg2)",
                  padding: "8px 12px",
                  marginBottom: "12px",
                  fontSize: "11px",
                  color: "var(--term-dim)",
                  display: "flex",
                  gap: "16px",
                }}
              >
                <span><span style={{ color: "var(--term-blue)" }}>file</span>: Yifei_Bao_BU_MSCS.pdf</span>
                <span><span style={{ color: "var(--term-blue)" }}>type</span>: application/pdf</span>
                <span><span style={{ color: "var(--term-blue)" }}>source</span>: google-drive</span>
              </div>

              {/* PDF embed */}
              <div
                style={{
                  border: "1px solid var(--term-border)",
                  overflow: "hidden",
                  height: "800px",
                }}
              >
                <iframe
                  src="https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/preview"
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  title="Resume PDF"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
