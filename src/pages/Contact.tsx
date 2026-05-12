import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { usePageView } from "@/hooks/useAnalytics";

const infoItems = [
  {
    icon: Phone,
    label: "Phone",
    value: SITE.phone,
    sub: "Call us anytime",
    href: `tel:${SITE.phone}`,
    color: "bg-gradient-primary",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Send a message",
    sub: "Quick replies",
    href: `https://wa.me/${SITE.whatsapp}`,
    color: "bg-gradient-to-br from-green-500 to-teal-500",
  },
  {
    icon: MapPin,
    label: "Address",
    value: SITE.address,
    sub: SITE.addressNote,
    href: null,
    color: "bg-gradient-to-br from-secondary to-highlight",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Sat–Thu: 9 AM – 9 PM",
    sub: "Friday: 2 PM – 9 PM",
    href: null,
    color: "bg-gradient-to-br from-accent to-primary",
  },
];

export default function Contact() {
  usePageView("contact");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Questions, bookings or just want to say hi? We'd love to hear from you."
      />

      <section className="container pb-24 space-y-12">

        {/* Info cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infoItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-3xl border border-border/50 shadow-card p-5 flex flex-col gap-3"
            >
              <div className={`w-11 h-11 rounded-2xl ${item.color} grid place-items-center shadow-fun shrink-0`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="font-bold text-sm mt-0.5 leading-snug">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
              {item.href && (
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                  {item.label === "WhatsApp" ? "Chat Now →" : item.label === "Phone" ? "Call Now →" : "Open →"}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Map + CTA */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">

          {/* Left CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Main CTA */}
            <div className="flex-1 rounded-3xl bg-gradient-primary text-primary-foreground p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="relative">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="font-display text-2xl font-bold mb-2">Visit Us Today!</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {SITE.address}<br />
                  <span className="text-white/60 text-xs">({SITE.addressNote})</span>
                </p>
              </div>
              <div className="relative flex flex-col gap-3">
                <a href={`tel:${SITE.phone}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-primary font-bold text-sm hover:scale-[1.02] transition shadow-fun">
                  <Phone className="w-4 h-4" /> {SITE.phone}
                </a>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:scale-[1.02] transition">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="bg-card rounded-3xl border border-border/50 shadow-card p-6">
              <p className="font-bold text-sm mb-4">Follow Us on Social Media</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, href: "#", bg: "hover:bg-blue-600" },
                  { Icon: Instagram, href: "#", bg: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400" },
                  { Icon: Youtube, href: "#", bg: "hover:bg-red-600" },
                ].map(({ Icon, href, bg }, i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer"
                    className={`w-11 h-11 rounded-2xl bg-muted grid place-items-center text-muted-foreground ${bg} hover:text-white transition-all hover:scale-110 hover:shadow-fun`}>
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Stay updated with our latest events and offers!</p>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-3xl overflow-hidden border border-border/50 shadow-card min-h-[420px]"
          >
            <iframe
              src={SITE.mapsEmbed}
              className="w-full h-full min-h-[420px] border-0 block"
              loading="lazy"
              title="Hoichoi Khelaghor Location"
              allowFullScreen
            />
          </motion.div>
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-5xl bg-gradient-fun p-10 md:p-14 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-4 left-8 w-24 h-24 bg-white blob animate-float" />
            <div className="absolute bottom-4 right-8 w-32 h-32 bg-white blob animate-float-slow" />
          </div>
          <div className="relative">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Ready to Play?</h2>
            <p className="opacity-90 mb-7 text-lg max-w-xl mx-auto">
              Bring your kids and make unforgettable memories. Walk-ins welcome every day!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`tel:${SITE.phone}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-bold shadow-fun hover:scale-105 transition">
                <Phone className="w-4 h-4" /> Call {SITE.phone}
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-bold shadow-fun hover:scale-105 transition">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>

      </section>
    </>
  );
}
