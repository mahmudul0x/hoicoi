import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const activities = [
  {
    emoji: "🎱",
    title: "Ball Pit",
    desc: "Thousands of colorful balls for kids to dive, splash and play in. Perfect for toddlers and young children to develop motor skills while having unlimited fun.",
    age: "2 – 8 yrs",
    color: "from-primary to-pink",
    image: "https://images.unsplash.com/photo-1566220853133-9d17b5d939ce?w=600&q=80",
  },
  {
    emoji: "🛝",
    title: "Slides",
    desc: "Multiple slides of different heights and speeds — from gentle baby slides to thrilling twister slides. Safe padded landings on every one.",
    age: "3 – 12 yrs",
    color: "from-secondary to-highlight",
    image: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=600&q=80",
  },
  {
    emoji: "🧗",
    title: "Climbing Wall",
    desc: "Colorful grip-wall climbing sections that build strength, confidence and coordination. Trained staff always nearby for safety.",
    age: "4 – 12 yrs",
    color: "from-highlight to-secondary",
    image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=600&q=80",
  },
  {
    emoji: "🤸",
    title: "Trampoline",
    desc: "Bounce to new heights on our safety-netted trampolines. Kids love it and parents love the energy burn! Available in junior and full-size sections.",
    age: "4 – 12 yrs",
    color: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80",
  },
  {
    emoji: "🎠",
    title: "Merry-Go-Round",
    desc: "A classic spinning ride that never gets old. Gentle speed for little ones, laughter guaranteed for everyone on board.",
    age: "2 – 8 yrs",
    color: "from-pink to-accent",
    image: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600&q=80",
  },
  {
    emoji: "🧩",
    title: "Soft Play Zone",
    desc: "A fully cushioned indoor play area with foam blocks, tunnels, and crawl spaces — the safest spot for our tiniest adventurers.",
    age: "1 – 5 yrs",
    color: "from-primary to-accent",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
  },
  {
    emoji: "🎯",
    title: "Arcade Games",
    desc: "Fun token-based arcade games including racing, shooting hoops and skill games. Win prizes and bring home big smiles.",
    age: "5 – 12 yrs",
    color: "from-secondary to-pink",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
  },
  {
    emoji: "🎨",
    title: "Arts & Crafts Corner",
    desc: "A creative space where kids can paint, draw, and make things with their hands. Activities change weekly to keep the creativity flowing.",
    age: "3 – 10 yrs",
    color: "from-highlight to-primary",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&q=80",
  },
  {
    emoji: "🎂",
    title: "Birthday Party Hall",
    desc: "A dedicated decorated party hall for private birthday celebrations. We handle decorations, cake, food and games — you just enjoy the moment.",
    age: "All ages",
    color: "from-pink to-secondary",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  },
];

export default function Activities() {
  return (
    <>
      <PageHero
        title="Our Activities"
        subtitle="Something exciting for every child — safe, fun and unforgettable."
      />

      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/15 text-primary text-sm font-bold mb-4">
            Play Zone Activities
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            What's Inside <span className="text-gradient">Hoichoi Khelaghor</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From toddlers to tweens — we have the perfect activity for every age group.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-4xl overflow-hidden shadow-card hover:shadow-fun transition-all border border-border/50"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${a.color} opacity-40`} />
                <div className="absolute top-3 right-3 text-3xl drop-shadow-lg">{a.emoji}</div>
                <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
                  {a.age}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">Ready to visit? Check our packages or book a party!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/packages"
              className="px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2"
            >
              View Packages <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
