import { motion } from "framer-motion";
import { Check, Star, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

const plans = [
  {
    name: "Mini Fun",
    price: 200,
    duration: "1 Hour",
    color: "from-highlight to-secondary",
    perks: ["Full play zone access", "Safe equipment", "Trained supervision", "Free Wi-Fi for parents"],
  },
  {
    name: "Super Fun",
    price: 350,
    duration: "2 Hours",
    color: "from-primary to-pink",
    popular: true,
    perks: ["Everything in Mini Fun", "Priority access", "Welcome juice & snack", "Photo memory print"],
  },
  {
    name: "Full Day",
    price: 500,
    duration: "Whole Day",
    color: "from-accent to-primary",
    perks: ["All-day unlimited play", "Lunch combo included", "Activity workshop", "Goodie bag to take home"],
  },
];

export default function Packages() {
  return (
    <>
      <PageHero eyebrow="Packages" title="Pricing & Packages" subtitle="Affordable, transparent packages designed for the whole family. Special discounts for groups!" />

      <section className="container pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-5xl p-8 shadow-card border-2 transition-all hover:-translate-y-2 ${
                p.popular ? "border-primary bg-card scale-[1.03]" : "border-border bg-card"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-fun flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> MOST POPULAR
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} grid place-items-center text-white text-3xl mb-5 shadow-fun`}>
                🎈
              </div>
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold text-gradient">৳{p.price}</span>
                <span className="text-muted-foreground">/ child</span>
              </div>
              <div className="text-sm text-muted-foreground">{p.duration}</div>

              <ul className="mt-6 space-y-3">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-secondary/20 text-secondary grid place-items-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm">{perk}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className={`mt-7 block text-center px-6 py-3.5 rounded-full font-bold transition ${p.popular ? "bg-gradient-primary text-primary-foreground shadow-fun hover:scale-105" : "bg-muted hover:bg-foreground hover:text-background"}`}>
                Choose {p.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-5xl bg-gradient-soft p-10 md:p-14 text-center border border-border/50">
          <h3 className="font-display text-3xl md:text-4xl font-bold">
            Looking for a <span className="text-gradient">special offer?</span>
          </h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Group discounts, school trips, family bundles and birthday combos available. Just call and ask!</p>
          <a href={`tel:${SITE.phone}`} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-primary text-primary-foreground rounded-full font-bold shadow-fun hover:scale-105 transition">
            <Phone className="w-4 h-4" /> Call {SITE.phone}
          </a>
        </div>
      </section>
    </>
  );
}
