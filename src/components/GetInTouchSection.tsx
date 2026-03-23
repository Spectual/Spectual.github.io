import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const GetInTouchSection = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required" });
      return false;
    }
    if (!form.email.trim()) {
      toast({ title: "Email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "Please enter a valid email" });
      return false;
    }
    if (!form.message.trim()) {
      toast({ title: "Message is required" });
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
    window.location.href = `mailto:baoyifei@bu.edu?subject=${subject}&body=${body}`;
    setSubmitting(false);
  };

  return (
    <section className="px-6 pt-2 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form side */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
                Get in Touch
              </h2>
              {/* mailto notice */}
              <p className="text-slate-400 text-sm mb-6 flex items-center gap-1.5">
                <ExternalLink size={13} className="shrink-0 text-slate-500" />
                Clicking "Send" will open your default email client with the form pre-filled.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm mb-1.5 font-medium">Name <span className="text-red-400">*</span></label>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm mb-1.5 font-medium">Company</label>
                    <Input
                      placeholder="Company (optional)"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5 font-medium">Email <span className="text-red-400">*</span></label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5 font-medium">Message <span className="text-red-400">*</span></label>
                  <Textarea
                    placeholder="Tell me about your needs and how I can help..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500/50 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl px-6 transition-all duration-200 hover:scale-[1.02]"
                >
                  {submitting ? "Opening email client…" : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact info side */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Let's Start a Conversation</h3>
                <p className="text-slate-400 text-sm">
                  Happy to connect about opportunities, collaboration, or any interesting ideas.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: <Mail className="text-cyan-400" />,
                    bg: "bg-cyan-600/20",
                    label: "Email",
                    content: <a href="mailto:baoyifei@bu.edu" className="text-white hover:text-cyan-300 transition-colors text-sm">baoyifei@bu.edu</a>,
                  },
                  {
                    icon: <Phone className="text-emerald-400" />,
                    bg: "bg-emerald-600/20",
                    label: "Phone",
                    content: <a href="tel:+18573403064" className="text-white hover:text-emerald-300 transition-colors text-sm">+1 857 340 3064</a>,
                  },
                  {
                    icon: <MapPin className="text-blue-400" />,
                    bg: "bg-blue-600/20",
                    label: "Location",
                    content: <span className="text-white text-sm">Boston, MA</span>,
                  },
                ].map(({ icon, bg, label, content }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200">
                    <div className={`p-2.5 rounded-lg ${bg} shrink-0`}>{icon}</div>
                    <div>
                      <div className="text-slate-500 text-xs mb-0.5">{label}</div>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
