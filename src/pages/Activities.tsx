import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { usePageView } from "@/hooks/useAnalytics";

const zones = [
  {
    emoji: "🏍️",
    title: "Motor Bike",
    color: "from-primary to-pink",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  },
  {
    emoji: "🚗",
    title: "Car Ride",
    color: "from-highlight to-secondary",
    image: "https://images.unsplash.com/photo-1594787317109-f04c882b4a7f?w=500&q=80",
  },
  {
    emoji: "⚽",
    title: "Table Soccer",
    color: "from-secondary to-highlight",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80",
  },
  {
    emoji: "🏠",
    title: "Toy House",
    color: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1617195737496-bc30194e3a19?w=500&q=80",
  },
  {
    emoji: "🛒",
    title: "Super Shop",
    color: "from-pink to-accent",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80",
  },
  {
    emoji: "🧩",
    title: "Puzzle Zone",
    color: "from-primary to-highlight",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&q=80",
  },
  {
    emoji: "🎨",
    title: "Drawing Zone",
    color: "from-secondary to-pink",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&q=80",
  },
  {
    emoji: "🎮",
    title: "Video Games",
    color: "from-highlight to-primary",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80",
  },
  {
    emoji: "🛝",
    title: "Soft Play Zone",
    color: "from-accent to-secondary",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80",
  },
  {
    emoji: "🎂",
    title: "Birthday Party Hall",
    color: "from-pink to-primary",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
  },
];

const playActivities = [
  {
    emoji: "⚽",
    title: "Ball House",
    image: "https://images.unsplash.com/photo-1566220853133-9d17b5d939ce?w=500&q=80",
    color: "from-secondary to-highlight",
  },
  {
    emoji: "🛝",
    title: "Slides",
    image: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=500&q=80",
    color: "from-primary to-pink",
  },
  {
    emoji: "🧗",
    title: "Climbing",
    image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=500&q=80",
    color: "from-highlight to-secondary",
  },
  {
    emoji: "🤸",
    title: "Trampoline",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80",
    color: "from-accent to-primary",
  },
  {
    emoji: "🎠",
    title: "Merry-Go-Round",
    image: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=500&q=80",
    color: "from-pink to-accent",
  },
  {
    emoji: "🚲",
    title: "Paddle Bike",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80",
    color: "from-highlight to-primary",
  },
  {
    emoji: "📚",
    title: "Book Reading",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    color: "from-secondary to-pink",
  },
];

const included = [
  "Full Play Zone Access",
  "Safe Equipment",
  "Trained Supervision",
  "Free Wi-Fi",
];

export default function Activities() {
  usePageView("activities");

  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Our Activities"
        subtitle="Something exciting for every child — safe, fun and unforgettable."
      />

      <section className="container pb-24 space-y-20">

        {/* Zones grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Play Zones
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              What's Inside <span className="text-gradient">Hoichoi Khelaghor</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {zones.map((z, i) => (
              <motion.div
                key={z.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.07 }}
                whileHover={{ y: -5 }}
                className="group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-card hover:shadow-fun transition-all"
              >
                {/* Image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={z.image}
                    alt={z.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${z.color} opacity-50`} />
                  <span className="absolute top-2 right-2 text-xl drop-shadow-lg">{z.emoji}</span>
                </div>
                {/* Title */}
                <div className="px-3 py-3 text-center">
                  <p className="font-bold text-xs leading-snug">{z.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Play activities */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-3">
              Activities
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Play <span className="text-gradient">Activities</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {playActivities.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                whileHover={{ y: -5 }}
                className="group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-card hover:shadow-fun transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${a.color} opacity-40`} />
                  <span className="absolute top-2 right-2 text-2xl drop-shadow-lg">{a.emoji}</span>
                </div>
                <div className="px-4 py-3 text-center">
                  <p className="font-bold text-sm">{a.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl shadow-fun p-8 md:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4">
                Every Visit
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Everything is Included</h3>
              <p className="text-white/80 text-sm">No hidden charges — one price covers everything.</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-white/30 grid place-items-center shrink-0 text-xs font-bold">✓</div>
                  <span className="font-semibold text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/packages"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition shadow-fun"
            >
              See Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-5 text-lg">Ready to visit? Check our packages!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/packages"
              className="px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
              View Packages <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact"
              className="px-7 py-3.5 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-primary-foreground transition inline-flex items-center gap-2">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}
