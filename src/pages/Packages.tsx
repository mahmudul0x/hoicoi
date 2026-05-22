import { motion } from "framer-motion";
import { Check, Star, Phone, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { usePageView } from "@/hooks/useAnalytics";

const sessions = [
  {
    emoji: "⏱️",
    name: "30 Minutes",
    price: "100",
    unit: "per child",
    color: "from-highlight to-secondary",
    popular: false,
  },
  {
    emoji: "🕐",
    name: "60 Minutes",
    price: "180",
    unit: "per child",
    color: "from-primary to-pink",
    popular: true,
  },
  {
    emoji: "♾️",
    name: "Unlimited",
    price: "350",
    unit: "per child",
    color: "from-accent to-primary",
    popular: false,
  },
];

const memberships = [
  {
    name: "1 Month",
    price: "1,200",
    note: "যত খুশি ততবার (Daily 1 Hour)",
    sub: "Unlimited visits for 1 month",
    color: "from-secondary to-highlight",
    icon: Star,
  },
  {
    name: "2 Months",
    price: "2,000",
    note: "যত খুশি ততবার",
    sub: "Unlimited visits for 2 months",
    color: "from-primary to-pink",
    icon: Crown,
  },
  {
    name: "6 Months",
    price: "4,000",
    note: "যত খুশি ততবার",
    sub: "Unlimited visits for 6 months",
    color: "from-accent to-primary",
    icon: Star,
  },
];

const perks = [
  "Full Play Zone Access",
  "Safe Equipment",
  "Trained Supervision",
  "Free Wi-Fi for Parents",
];

export default function Packages() {
  usePageView("packages");

  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Pricing & Packages"
        subtitle="Affordable, transparent pricing for every family. No hidden fees."
      />

      <section className="container pb-24 space-y-16">

        {/* Session pricing */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Entry Pricing
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Session <span className="text-gradient">Packages</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Choose the session that fits your visit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sessions.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-3xl border-2 p-7 shadow-card hover:-translate-y-2 transition-all ${
                  s.popular ? "border-primary scale-[1.03]" : "border-border"
                }`}
              >
                {s.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-fun flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" /> MOST POPULAR
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center text-2xl shadow-fun mb-5`}>
                  {s.emoji}
                </div>
                <h3 className="font-display text-xl font-bold">{s.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-gradient">৳{s.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5">{s.unit}</p>

                <ul className="mt-6 space-y-2.5">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-secondary/15 text-secondary grid place-items-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href={`tel:${SITE.phone}`}
                  className={`mt-6 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition ${
                    s.popular
                      ? "bg-gradient-primary text-primary-foreground shadow-fun hover:opacity-90"
                      : "bg-muted hover:bg-foreground hover:text-background"
                  }`}
                >
                  <Phone className="w-4 h-4" /> Book Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Membership */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-3">
              Membership
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Monthly <span className="text-gradient">Membership</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Visit as many times as you want — যত খুশি ততবার!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {memberships.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-3xl shadow-card p-7 hover:-translate-y-2 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} grid place-items-center shadow-fun mb-5`}>
                  <m.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold">{m.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-gradient">৳{m.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{m.sub}</p>
                <div className="mt-4 flex items-center gap-2 bg-primary/8 rounded-xl px-4 py-2.5">
                  <span className="text-lg">♾️</span>
                  <span className="font-bold text-sm text-primary">{m.note}</span>
                </div>
                <a
                  href={`tel:${SITE.phone}`}
                  className="mt-6 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-fun hover:opacity-90 transition"
                >
                  <Phone className="w-4 h-4" /> Get Membership
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-soft p-10 md:p-14 text-center border border-border/50"
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold">
            Need a <span className="text-gradient">Group or Birthday</span> package?
          </h3>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Group discounts, school trips, and birthday combos available. Just call and ask!
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <a href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-primary text-primary-foreground rounded-full font-bold shadow-fun hover:scale-105 transition">
              <Phone className="w-4 h-4" /> Call {SITE.phone}
            </a>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition">
              Contact Us
            </Link>
          </div>
        </motion.div>

      </section>
    </>
  );
}
