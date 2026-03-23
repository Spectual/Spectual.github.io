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
      <div className="max-w-4xl mx-auto">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form side */}
            <div>
              <h2 className="text-2xl font-bold text-stone-100 mb-1.5 tracking-tight">
                Get in Touch
              </h2>
              <p className="text-stone-500 text-sm mb-6 flex items-center gap-1.5">
                <ExternalLink size={12} className="shrink-0" />
                Clicking "Send" will open your default email client with the form pre-filled.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 text-sm mb-1.5 font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-[#cf6b47]/40 focus-visible:border-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-sm mb-1.5 font-medium">Company</label>
                    <Input
                      placeholder="Company (optional)"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-[#cf6b47]/40 focus-visible:border-stone-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-400 text-sm mb-1.5 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-[#cf6b47]/40 focus-visible:border-stone-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-sm mb-1.5 font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell me about your needs and how I can help..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 focus-visible:ring-[#cf6b47]/40 focus-visible:border-stone-600 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#cf6b47]/20 hover:bg-[#cf6b47]/30 text-[#cf6b47] border border-[#cf6b47]/30 hover:border-[#cf6b47]/50 rounded-xl px-5 transition-all duration-150"
                >
                  {submitting ? "Opening email client…" : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact info side */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-stone-100 mb-2">Let's Start a Conversation</h3>
                <p className="text-stone-500 text-sm">
                  Happy to connect about opportunities, collaboration, or any interesting ideas.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    icon: <Mail size={16} className="text-stone-400" />,
                    label: "Email",
                    content: (
                      <a href="mailto:baoyifei@bu.edu" className="text-stone-300 hover:text-stone-100 transition-colors text-sm">
                        baoyifei@bu.edu
                      </a>
                    ),
                  },
                  {
                    icon: <Phone size={16} className="text-stone-400" />,
                    label: "Phone",
                    content: (
                      <a href="tel:+18573403064" className="text-stone-300 hover:text-stone-100 transition-colors text-sm">
                        +1 857 340 3064
                      </a>
                    ),
                  },
                  {
                    icon: <MapPin size={16} className="text-stone-400" />,
                    label: "Location",
                    content: <span className="text-stone-300 text-sm">Boston, MA</span>,
                  },
                ].map(({ icon, label, content }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-stone-700 transition-all duration-150"
                  >
                    <div className="shrink-0">{icon}</div>
                    <div>
                      <div className="text-stone-600 text-xs mb-0.5">{label}</div>
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
