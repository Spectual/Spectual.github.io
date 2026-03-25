import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { personalInfo } from "@/data/personalInfo";

const GetInTouchSection = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!form.name.trim()) {
      toast({ title: "error: name is required" });
      return false;
    }
    if (!form.email.trim()) {
      toast({ title: "error: email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "error: invalid email format" });
      return false;
    }
    if (!form.message.trim()) {
      toast({ title: "error: message is required" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const subject = encodeURIComponent(
      `Website Contact from ${form.name}${form.company ? " - " + form.company : ""}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Company: ${form.company || "N/A"}`,
        `Email: ${form.email}`,
        "",
        "Message:",
        form.message,
      ].join("\n")
    );
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--term-bg2)",
    border: "1px solid var(--term-border)",
    color: "var(--term-text)",
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "6px 10px",
    outline: "none",
    caretColor: "var(--term-green)",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--term-blue)",
    fontSize: "12px",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <section className="px-4 pb-10">
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
            bash — ~/contact
          </div>

          <div style={{ padding: "20px 24px" }}>
            {/* Command header */}
            <div style={{ marginBottom: "20px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--term-green)" }}>spectual</span>
                <span style={{ color: "var(--term-dim)" }}>@</span>
                <span style={{ color: "var(--term-blue)" }}>github.io</span>
                <span style={{ color: "var(--term-text)" }}>:~$</span>
                <span style={{ color: "var(--term-text)", marginLeft: "4px" }}>
                  contact --send-message
                </span>
              </div>
              <div style={{ color: "var(--term-dim)", fontSize: "11px", marginTop: "6px", marginLeft: "0" }}>
                # opens default email client with form pre-filled
              </div>
            </div>

            {/* Two column layout */}
            <div
              style={{ display: "grid" }}
              className="gap-6 lg:gap-8 lg:grid-cols-2"
            >
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>
                      name <span style={{ color: "var(--term-red)" }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      placeholder="your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--term-green)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--term-border)")}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" style={labelStyle}>
                      company{" "}
                      <span style={{ color: "var(--term-dim)", fontSize: "10px" }}>(optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      placeholder="company name"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--term-green)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--term-border)")}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label htmlFor="contact-email" style={labelStyle}>
                    email <span style={{ color: "var(--term-red)" }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--term-green)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--term-border)")}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label htmlFor="contact-message" style={labelStyle}>
                    message <span style={{ color: "var(--term-red)" }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="your message..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--term-green)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--term-border)")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    border: "1px solid var(--term-green)",
                    backgroundColor: "transparent",
                    color: "var(--term-green)",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    padding: "6px 16px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = "var(--term-green)";
                      e.currentTarget.style.color = "var(--term-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--term-green)";
                  }}
                >
                  {submitting ? "opening email client..." : "[send-message]"}
                </button>
              </form>

              {/* Contact info */}
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: "var(--term-green)", fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                    let's connect
                  </div>
                  <div style={{ color: "var(--term-dim)", fontSize: "12px", lineHeight: "1.6" }}>
                    Happy to connect about opportunities, collaboration, or any interesting ideas.
                  </div>
                </div>

                <div style={{ fontSize: "12px" }}>
                  {[
                    { key: "email", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
                    { key: "phone", value: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/\s/g, "")}` },
                    { key: "location", value: personalInfo.location, href: null },
                  ].map(({ key, value, href }) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 10px",
                        border: "1px solid var(--term-border)",
                        marginBottom: "6px",
                        backgroundColor: "var(--term-bg2)",
                      }}
                    >
                      <span style={{ color: "var(--term-blue)" }}>{key}</span>
                      <span style={{ color: "var(--term-dim)" }}>:</span>
                      {href ? (
                        <a
                          href={href}
                          className="contact-link"
                          style={{ color: "var(--term-text)", textDecoration: "none", transition: "color 0.15s" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <span style={{ color: "var(--term-text)" }}>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
