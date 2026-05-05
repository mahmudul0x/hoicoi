import { motion } from "framer-motion";
import { Cake, Gift, PartyPopper, Music, Camera, Utensils, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";
import h3 from "@/assets/hero-3.jpg";
import g5 from "@/assets/gallery-5.jpg";

const includes = [
  { Icon: Cake, t: "Custom Cake", d: "Themed cake of your choice" },
  { Icon: PartyPopper, t: "Decorations", d: "Balloons, banners & themed setup" },
  { Icon: Music, t: "Party Host", d: "Energetic host running games" },
  { Icon: Utensils, t: "Food & Drinks", d: "Snacks, drinks and lunch combos" },
  { Icon: Camera, t: "Photography", d: "Capture every magical moment" },
  { Icon: Gift, t: "Return Gifts", d: "Goodie bags for every guest" },
];

const packages = [
  { name: "Mini Party", kids: "Up to 10 kids", price: 7000, perks: ["2hr venue", "Basic decoration", "Cake & juice", "Party host"] },
  { name: "Grand Party", kids: "Up to 20 kids", price: 12000, popular: true, perks: ["3hr venue", "Themed decoration", "Cake + lunch combo", "Games & host", "Photo session"] },
  { name: "Royal Party", kids: "Up to 35 kids", price: 20000, perks: ["4hr private venue", "Premium themed decor", "Custom cake + full meal", "Pro photographer", "Goodie bags"] },
];

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Events" title="Birthday & Events" subtitle="Unforgettable parties planned end-to-end. You bring the kids — we bring the magic." bg={h3} />

      <section className="container py-16 grid lg:grid-cols-3 gap-6">
        {includes.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-card rounded-4xl p-7 shadow-card border border-border/50 hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-fun mb-4">
              <it.Icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg">{it.t}</h3>
            <p className="text-muted-foreground mt-1">{it.d}</p>
          </motion.div>
        ))}
      </section>

      <section className="container py-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Choose Your <span className="text-gradient">Party Package</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`rounded-5xl p-8 shadow-card border-2 ${p.popular ? "border-primary bg-card scale-[1.03]" : "border-border bg-card"} relative`}>
              {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-fun">⭐ POPULAR</div>}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className="text-muted-foreground text-sm">{p.kids}</p>
              <div className="mt-3 font-display text-4xl font-bold text-gradient">৳{p.price.toLocaleString()}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.perks.map((perk) => <li key={perk}>✨ {perk}</li>)}
              </ul>
              <a href={`tel:${SITE.phone}`} className={`mt-6 block text-center px-6 py-3 rounded-full font-bold transition ${p.popular ? "bg-gradient-primary text-primary-foreground shadow-fun" : "bg-muted hover:bg-foreground hover:text-background"}`}>
                Book Now
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container pb-24 grid lg:grid-cols-2 gap-6">
        <motion.img initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={h3} loading="lazy" alt="" className="rounded-5xl object-cover w-full h-full shadow-card aspect-[4/3]" />
        <motion.img initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={g5} loading="lazy" alt="" className="rounded-5xl object-cover w-full h-full shadow-card aspect-[4/3]" />
      </section>

      <section className="container pb-24">
        <div className="rounded-5xl p-10 md:p-14 text-center bg-gradient-fun text-white shadow-fun">
          <h3 className="font-display text-3xl md:text-5xl font-bold">Ready to Plan the Big Day?</h3>
          <p className="mt-3 opacity-95 max-w-xl mx-auto">Talk to our event team and we'll customize everything to your child's dream party.</p>
          <a href={`tel:${SITE.phone}`} className="mt-7 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-bold shadow-fun hover:scale-105 transition">
            <Phone className="w-4 h-4" /> Book Your Party — {SITE.phone}
          </a>
        </div>
      </section>
    </>
  );
}
