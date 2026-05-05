import { motion } from "framer-motion";
import { Heart, Shield, Sparkles, Target, Eye, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import Counter from "@/components/Counter";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import g3 from "@/assets/gallery-3.jpg";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Our Story"
        subtitle="A magical play zone built with love for the children of Dinajpur."
        bg={hero1}
      />

      <section className="container py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.img initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={hero1} alt="" className="rounded-5xl shadow-card aspect-[4/3] object-cover" />
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Welcome to <span className="text-gradient">Hoichoi Khelaghor</span></h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Hoichoi Khelaghor (হইচই খেলাঘর) is Dinajpur's premier indoor kids play zone — a vibrant, safe and imaginative space where children aged 2 to 12 can run wild, dream big and create unforgettable memories.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We were born from a simple wish: every child in our city deserves a magical place to play, learn and grow — no matter the weather. From our giant ball pit to climbing structures, slides, trampolines and creative zones, every inch is built around joy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="container grid md:grid-cols-2 gap-6">
          {[
            { Icon: Target, title: "Our Mission", text: "To create a safe, joyful and inspiring space where every child can play freely, learn through fun, and build precious memories with family and friends." },
            { Icon: Eye, title: "Our Vision", text: "To be the most loved indoor entertainment destination in northern Bangladesh — known for joy, safety and the bright smiles of every child who visits us." },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card p-8 rounded-4xl shadow-card border border-border/50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4 shadow-fun">
                <c.Icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold">{c.title}</h3>
              <p className="mt-3 text-muted-foreground">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Safety & <span className="text-gradient-sky">Cleanliness First</span></h2>
            <p className="mt-5 text-lg text-muted-foreground">Parents trust us — and we never let them down. Every detail is designed with your child's wellbeing at the centre.</p>
            <ul className="mt-6 space-y-3">
              {([
                { t: "Padded soft floors and rounded edges everywhere", I: Shield },
                { t: "Trained, friendly staff watching over every zone", I: Heart },
                { t: "Sanitization and deep cleaning multiple times daily", I: Sparkles },
                { t: "CCTV coverage and secure entry / exit", I: Award },
              ]).map(({ t, I }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary grid place-items-center shrink-0">
                    <I className="w-5 h-5" />
                  </div>
                  <span className="pt-1.5">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.img initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={g3} alt="" loading="lazy" className="rounded-5xl shadow-card aspect-square object-cover" />
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-5xl bg-gradient-fun p-10 md:p-14 text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-fun">
          {[
            { v: 5000, s: "+", l: "Happy Kids" },
            { v: 200, s: "+", l: "Birthday Parties" },
            { v: 12000, s: "+", l: "Happy Visits" },
            { v: 100, s: "%", l: "Safe & Loved" },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-display text-4xl md:text-5xl font-bold"><Counter to={s.v} suffix={s.s} /></div>
              <div className="opacity-90 mt-1 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
