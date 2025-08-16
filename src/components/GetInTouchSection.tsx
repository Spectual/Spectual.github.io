import { Mail, Phone, MapPin } from "lucide-react";
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
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
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

    const subject = encodeURIComponent(`Website Contact from ${form.name}${form.company ? ' - ' + form.company : ''}`);
    const bodyLines = [
      `Name: ${form.name}`,
      `Company: ${form.company || 'N/A'}`,
      `Email: ${form.email}`,
      "",
      "Message:",
      form.message,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:baoyifei@bu.edu?subject=${subject}&body=${body}`;

    window.location.href = mailto;
    setSubmitting(false);
  };

  return (
    <section className="px-6 pt-2 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">Company</label>
                    <Input
                      placeholder="Company (optional)"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Email *</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Message *</label>
                  <Textarea
                    placeholder="Tell me about your needs and how I can help..."
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <div>
                  <Button type="submit" disabled={submitting} className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30">
                    {submitting ? "Opening email..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">Let's Start a Conversation</h3>
              <p className="text-slate-300">
                I'm happy to connect about opportunities, collaboration, or any interesting ideas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-3 rounded-lg bg-cyan-600/20">
                    <Mail className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Email</div>
                    <a href="mailto:baoyifei@bu.edu" className="text-white">baoyifei@bu.edu</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-3 rounded-lg bg-emerald-600/20">
                    <Phone className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Phone</div>
                    <a href="tel:+18573403064" className="text-white">+1 8573403064</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-3 rounded-lg bg-blue-600/20">
                    <MapPin className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Office</div>
                    <div className="text-white">Boston</div>
                  </div>
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