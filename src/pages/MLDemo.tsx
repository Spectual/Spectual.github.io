import { useState, useRef, useCallback } from "react";
import MatrixRain from "@/components/MatrixRain";
import TerminalFooter from "@/components/TerminalFooter";
import TerminalHeader from "@/components/TerminalHeader";
import { useLang } from "@/i18n/LanguageContext";

type ModelStatus = "idle" | "loading" | "ready" | "running";

interface LoadProgress {
  status: string;
  name?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface SentimentResult {
  label: string;
  score: number;
}

// Ordered so POSITIVE always renders first
const LABEL_ORDER = ["POSITIVE", "NEGATIVE"];

const EXAMPLE_TEXTS = [
  "This project is absolutely incredible and I love using it!",
  "The weather today is terrible and I feel completely miserable.",
  "The product works as expected, nothing special.",
  "I can't believe how powerful this browser-side ML is!",
  "Worst experience ever — complete waste of time.",
];

const LABEL_COLOR: Record<string, string> = {
  POSITIVE: "var(--term-green)",
  NEGATIVE: "var(--term-red)",
};

function confidenceBar(score: number, width = 24): string {
  const filled = Math.round(score * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

const MLDemo = () => {
  const { t } = useLang();
  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [loadProgress, setLoadProgress] = useState<LoadProgress | null>(null);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<SentimentResult[] | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipelineRef = useRef<any>(null);

  const loadModel = useCallback(async () => {
    if (pipelineRef.current) return;
    setModelStatus("loading");
    setError(null);
    try {
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false;
      pipelineRef.current = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        {
          progress_callback: (p: LoadProgress) => setLoadProgress(p),
        }
      );
      setModelStatus("ready");
      setLoadProgress(null);
    } catch {
      setError(t.mlDemo.errorLoad);
      setModelStatus("idle");
    }
  }, [t.mlDemo.errorLoad]);

  const analyze = useCallback(async () => {
    if (!pipelineRef.current || !inputText.trim()) return;
    setModelStatus("running");
    setError(null);
    try {
      const start = performance.now();
      const output: SentimentResult[] = await pipelineRef.current(
        inputText.trim(),
        { topk: 2 }
      );
      const elapsed = performance.now() - start;
      const sorted = [...output].sort(
        (a, b) => LABEL_ORDER.indexOf(a.label) - LABEL_ORDER.indexOf(b.label)
      );
      setResults(sorted);
      setInferenceTime(Math.round(elapsed));
      setModelStatus("ready");
    } catch {
      setError(t.mlDemo.errorInfer);
      setModelStatus("ready");
    }
  }, [inputText, t.mlDemo.errorInfer]);

  const progressPercent = (() => {
    if (!loadProgress) return 0;
    if (loadProgress.progress !== undefined)
      return Math.round(loadProgress.progress);
    if (loadProgress.loaded && loadProgress.total)
      return Math.round((loadProgress.loaded / loadProgress.total) * 100);
    return 0;
  })();

  const progressStatus = (() => {
    if (!loadProgress) return "";
    if (loadProgress.status === "downloading")
      return `downloading ${loadProgress.name ?? ""}`;
    if (loadProgress.status === "loading") return "loading model...";
    return loadProgress.status ?? "";
  })();

  return (
    <div
      className="min-h-screen page-enter"
      style={{
        backgroundColor: "var(--term-bg)",
        color: "var(--term-text)",
        position: "relative",
      }}
    >
      <MatrixRain />
      <div style={{ position: "relative", zIndex: 1 }}>
        <TerminalHeader />
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="animate-fade-in-up"
              style={{
                border: "1px solid var(--term-border)",
                backgroundColor: "var(--term-bg)",
              }}
            >
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
                bash — ~/ml-demo
              </div>

              <div style={{ padding: "20px 24px" }}>
                {/* Shell prompt */}
                <div style={{ marginBottom: "20px", fontSize: "13px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "var(--term-green)" }}>spectual</span>
                    <span style={{ color: "var(--term-dim)" }}>@</span>
                    <span style={{ color: "var(--term-blue)" }}>github.io</span>
                    <span style={{ color: "var(--term-text)" }}>:~$</span>
                    <span style={{ marginLeft: "4px" }}>
                      python inference.py --model distilbert-sst2 --device wasm
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div
                  style={{
                    marginBottom: "20px",
                    fontSize: "12px",
                    color: "var(--term-dim)",
                    lineHeight: "1.8",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--term-green)" }}>#</span>{" "}
                    {t.mlDemo.infoTitle}
                  </div>
                  <div>
                    {">"} {t.mlDemo.infoLine1}
                  </div>
                  <div>
                    {">"} {t.mlDemo.infoLine2}{" "}
                    <span style={{ color: "var(--term-blue)" }}>
                      Transformers.js
                    </span>{" "}
                    + WebAssembly
                  </div>
                  <div>
                    {">"} {t.mlDemo.infoLine3}{" "}
                    <span style={{ color: "var(--term-yellow)" }}>
                      distilbert-base-uncased-finetuned-sst-2-english
                    </span>{" "}
                    (~26 MB)
                  </div>
                </div>

                {/* Load button */}
                {modelStatus === "idle" && (
                  <div style={{ marginBottom: "20px" }}>
                    <button
                      onClick={loadModel}
                      className="chat-quick-btn"
                      style={{
                        border: "1px solid var(--term-border)",
                        color: "var(--term-green)",
                        background: "transparent",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        padding: "6px 16px",
                        cursor: "pointer",
                      }}
                    >
                      [{t.mlDemo.loadBtn}]
                    </button>
                  </div>
                )}

                {/* Loading progress */}
                {modelStatus === "loading" && (
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--term-dim)",
                        marginBottom: "6px",
                        minHeight: "1.4em",
                      }}
                    >
                      {progressStatus}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "280px",
                          height: "4px",
                          backgroundColor: "var(--term-border)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            backgroundColor: "var(--term-green)",
                            width: `${progressPercent}%`,
                            transition: "width 0.25s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--term-dim)",
                          minWidth: "36px",
                        }}
                      >
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Demo area — shown once model is ready */}
                {(modelStatus === "ready" || modelStatus === "running") && (
                  <>
                    {/* Section header */}
                    <div
                      style={{
                        marginBottom: "12px",
                        fontSize: "12px",
                        color: "var(--term-dim)",
                      }}
                    >
                      <span style={{ color: "var(--term-green)" }}>#</span>{" "}
                      {t.mlDemo.sectionLabel}
                    </div>

                    {/* Text input */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        border: "1px solid var(--term-border)",
                        backgroundColor: "var(--term-bg2)",
                        padding: "10px 12px",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--term-green)",
                          fontSize: "13px",
                          flexShrink: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        {">"}
                      </span>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void analyze();
                          }
                        }}
                        placeholder={t.mlDemo.placeholder}
                        disabled={modelStatus === "running"}
                        rows={2}
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "var(--term-text)",
                          fontFamily: "inherit",
                          fontSize: "13px",
                          resize: "none",
                          lineHeight: "1.5",
                        }}
                      />
                    </div>

                    {/* Example texts */}
                    <div
                      style={{
                        marginBottom: "14px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: "11px", color: "var(--term-dim)" }}
                      >
                        {t.mlDemo.examplesLabel}
                      </span>
                      {EXAMPLE_TEXTS.map((text, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText(text)}
                          className="chat-quick-btn"
                          style={{
                            border: "1px solid var(--term-border)",
                            color: "var(--term-dim)",
                            background: "transparent",
                            fontFamily: "inherit",
                            fontSize: "11px",
                            padding: "2px 8px",
                            cursor: "pointer",
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Analyze button */}
                    <div style={{ marginBottom: "20px" }}>
                      <button
                        onClick={() => void analyze()}
                        disabled={
                          !inputText.trim() || modelStatus === "running"
                        }
                        className="chat-quick-btn"
                        style={{
                          border: "1px solid var(--term-border)",
                          color: inputText.trim()
                            ? "var(--term-green)"
                            : "var(--term-dim)",
                          background: "transparent",
                          fontFamily: "inherit",
                          fontSize: "12px",
                          padding: "5px 14px",
                          cursor: inputText.trim() ? "pointer" : "default",
                          opacity: modelStatus === "running" ? 0.5 : 1,
                        }}
                      >
                        [
                        {modelStatus === "running"
                          ? t.mlDemo.runningBtn
                          : t.mlDemo.analyzeBtn}
                        ]
                      </button>
                    </div>

                    {/* Results */}
                    {results && (
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--term-green)",
                            marginBottom: "10px",
                          }}
                        >
                          # {t.mlDemo.outputLabel}
                        </div>
                        {results.map((r) => (
                          <div
                            key={r.label}
                            style={{
                              marginBottom: "8px",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                color:
                                  LABEL_COLOR[r.label] ?? "var(--term-blue)",
                                minWidth: "80px",
                                fontWeight: "500",
                              }}
                            >
                              {r.label}
                            </span>
                            <span
                              style={{
                                color: "var(--term-dim)",
                                letterSpacing: "0.03em",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {confidenceBar(r.score)}
                            </span>
                            <span
                              style={{
                                color:
                                  LABEL_COLOR[r.label] ?? "var(--term-blue)",
                                minWidth: "52px",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {(r.score * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                        {inferenceTime !== null && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--term-dim)",
                              marginTop: "10px",
                            }}
                          >
                            {t.mlDemo.inferLabel}: {inferenceTime}ms &nbsp;|&nbsp; device: wasm
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Error */}
                {error && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--term-red)",
                      marginTop: "10px",
                    }}
                  >
                    error: {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <TerminalFooter />
      </div>
    </div>
  );
};

export default MLDemo;
