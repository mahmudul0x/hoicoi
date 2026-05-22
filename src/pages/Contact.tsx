import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MapPin, Clock, Mail, MessageCircle, Send, CheckCircle2,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { usePageView } from "@/hooks/useAnalytics";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition";

export default function Contact() {
  usePageView("contact");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }, 800);
  }

  const ready = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative text-center max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5"
          >
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4"
          >
            Let's <span className="text-gradient">Talk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Questions, bookings, or just want to say hi? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Two cards */}
      <section className="container py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">

          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-3xl shadow-card flex flex-col"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-border/40">
              <h2 className="font-display text-2xl font-bold">Contact Info</h2>
              <p className="text-muted-foreground text-sm mt-1">Find us through any of these channels.</p>
            </div>

            {/* Info grid */}
            <div className="px-8 py-6 flex-1 grid grid-cols-2 gap-6 content-start">
              {[
                { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
                { icon: MessageCircle, label: "WhatsApp", value: SITE.phone, href: SITE.whatsappUrl, external: true },
                { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
                { icon: Clock, label: "Hours", value: "Sat–Thu: 3 PM – 9 PM", value2: "Fri & Govt. Holiday: 9:30 AM – 10 PM", href: null },
                { icon: MapPin, label: "Address", value: SITE.address, href: null, full: true },
              ].map(({ icon: Icon, label, value, value2, href, external, full }) => (
                <div key={label} className={`flex flex-col gap-2 ${full ? "col-span-2" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={external ? "_blank" : undefined} rel="noreferrer"
                        className="text-sm font-semibold text-foreground hover:text-primary transition break-all">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-foreground break-words leading-snug">{value}</p>
                    )}
                    {value2 && <p className="text-sm font-semibold text-foreground">{value2}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="px-8 pb-8 grid grid-cols-2 gap-3">
              <a href={`tel:${SITE.phone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition">
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right — email form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-3xl shadow-card flex flex-col"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-border/40">
              <h2 className="font-display text-2xl font-bold">Send a Message</h2>
              <p className="text-muted-foreground text-sm mt-1">We'll get back to you as soon as possible.</p>
            </div>

            <div className="px-8 py-6 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 grid place-items-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Message Sent!</p>
                      <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                        Your email app should have opened. We'll reply soon!
                      </p>
                    </div>
                    <button onClick={() => setSent(false)}
                      className="text-sm font-semibold text-primary hover:underline">
                      Send another →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 flex-1"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Name</label>
                        <input name="name" value={form.name} onChange={handleChange}
                          placeholder="Your name" className={inputCls} required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="you@example.com" className={inputCls} required />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-sm font-semibold mb-1.5">Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        placeholder="Ask about packages, timings, events..."
                        className={`${inputCls} resize-none flex-1 min-h-[140px]`} required />
                    </div>
                    <button type="submit" disabled={sending || !ready}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-fun hover:opacity-90 disabled:opacity-50 transition">
                      {sending ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Opening email...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      This will open your default email app with the message pre-filled.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Map */}
      <section className="container pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-border/50 shadow-card h-72 md:h-96"
        >
          <iframe src={SITE.mapsEmbed} className="w-full h-full border-0 block"
            loading="lazy" title="Hoichoi Khelaghor Location" allowFullScreen />
        </motion.div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          <MapPin className="inline w-3.5 h-3.5 mr-1 text-primary" />
          {SITE.address}
        </p>
      </section>

    </div>
  );
}
