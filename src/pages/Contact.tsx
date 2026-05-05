import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Thanks! We'll get back to you very soon.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in Touch" subtitle="Questions, bookings or just want to say hi? We'd love to hear from you." />

      <section className="container pb-24 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[
            { Icon: Phone, t: "Phone", v: SITE.phone, href: `tel:${SITE.phone}` },
            { Icon: Mail, t: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
            { Icon: MapPin, t: "Address", v: SITE.address, sub: SITE.addressNote },
          ].map((c, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              href={c.href}
              className="flex items-start gap-4 bg-card p-6 rounded-3xl shadow-card border border-border/50 hover:-translate-y-1 transition block"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-fun shrink-0">
                <c.Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg">{c.t}</div>
                <div className="text-muted-foreground">{c.v}</div>
                {c.sub && <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>}
              </div>
            </motion.a>
          ))}

          <div className="flex gap-3 pt-2">
            {[Facebook, Instagram, Youtube].map((I, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-fun hover:scale-110 transition">
                <I className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 bg-card p-8 md:p-10 rounded-5xl shadow-card border border-border/50 space-y-4"
        >
          <h3 className="font-display text-3xl font-bold">Send us a message</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required name="name" placeholder="Your name" className="px-5 py-3.5 rounded-2xl bg-muted/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none" />
            <input required name="phone" placeholder="Phone number" className="px-5 py-3.5 rounded-2xl bg-muted/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none" />
          </div>
          <input name="email" type="email" placeholder="Email (optional)" className="w-full px-5 py-3.5 rounded-2xl bg-muted/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none" />
          <input name="subject" placeholder="What's it about?" className="w-full px-5 py-3.5 rounded-2xl bg-muted/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none" />
          <textarea required name="message" placeholder="Your message..." rows={5} className="w-full px-5 py-3.5 rounded-2xl bg-muted/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none resize-none" />
          <button disabled={sending} className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-primary text-primary-foreground rounded-full font-bold shadow-fun hover:scale-105 transition disabled:opacity-60">
            {sending ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
          </button>
        </motion.form>
      </section>

      <section className="container pb-24">
        <div className="rounded-5xl overflow-hidden shadow-card">
          <iframe src={SITE.mapsEmbed} className="w-full h-[420px] border-0" loading="lazy" title="Map" />
        </div>
      </section>
    </>
  );
}
