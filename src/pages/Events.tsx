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
