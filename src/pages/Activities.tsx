import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, X, Clock, Users, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import { usePageView } from "@/hooks/useAnalytics";
import ballHouseImg from "@/assets/ball-house.jpg";
import slidesImg from "@/assets/Slides.jpg";
import climbingImg from "@/assets/Climbing.jpg";
import trampolineImg from "@/assets/trampoline.jpg";
import merryGoRoundImg from "@/assets/merry-go-round.jpg";
import paddleBikeImg from "@/assets/paddle-bike.jpg";

const zones = [
  {
    emoji: "🏍️",
    title: "Motor Bike",
    color: "from-primary to-pink",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&q=80",
  },
  {
    emoji: "🚗",
    title: "Car Ride",
    color: "from-highlight to-secondary",
    image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=500&q=80",
  },
  {
    emoji: "⚽",
    title: "Table Soccer",
    color: "from-secondary to-highlight",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&q=80",
  },
  {
    emoji: "🏠",
    title: "Toy House",
    color: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ac6823d?w=500&q=80",
  },
  {
    emoji: "🛒",
    title: "Super Shop",
    color: "from-pink to-accent",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80",
  },
  {
    emoji: "🧩",
    title: "Puzzle Zone",
    color: "from-primary to-highlight",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&q=80",
  },
  {
    emoji: "🎨",
    title: "Drawing Zone",
    color: "from-secondary to-pink",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&q=80",
  },
  {
    emoji: "🎮",
    title: "Video Games",
    color: "from-highlight to-primary",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=80",
  },
  {
    emoji: "🛝",
    title: "Soft Play Zone",
    color: "from-accent to-secondary",
    image: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=500&q=80",
  },
  {
    emoji: "🎂",
    title: "Birthday Party Hall",
    color: "from-pink to-primary",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80",
  },
];

type Activity = {
  emoji: string;
  title: string;
  image: string;
  color: string;
  age: string;
  duration: string;
  desc: string;
  highlights: string[];
};

const playActivities: Activity[] = [
  {
    emoji: "⚽",
    title: "Ball House",
    image: ballHouseImg,
    color: "from-secondary to-highlight",
    age: "1 – 10 yrs",
    duration: "Unlimited",
    desc: "Dive into thousands of colorful balls in our giant ball pit! Kids can splash, jump and laugh to their hearts' content in a fully padded, safe environment. Perfect for building motor skills and sensory development.",
    highlights: ["Thousands of colorful balls", "Fully padded walls & floor", "Safe for toddlers", "Supervised at all times"],
  },
  {
    emoji: "🛝",
    title: "Slides",
    image: slidesImg,
    color: "from-primary to-pink",
    age: "2 – 10 yrs",
    duration: "Unlimited",
    desc: "Our exciting slides offer thrills for every age — from gentle baby slides to fast twisting ones. Safe padded landings and trained staff ensure every ride is both fun and secure.",
    highlights: ["Multiple slide heights", "Padded safe landings", "Staff supervised", "Indoor weather-proof"],
  },
  {
    emoji: "🧗",
    title: "Climbing",
    image: climbingImg,
    color: "from-highlight to-secondary",
    age: "3 – 10 yrs",
    duration: "Unlimited",
    desc: "Build strength, confidence and coordination on our colorful climbing structures. Kids challenge themselves at their own pace while our trained staff stay close for safety.",
    highlights: ["Multiple grip levels", "Builds coordination", "Safety harness available", "Boosts confidence"],
  },
  {
    emoji: "🤸",
    title: "Trampoline",
    image: trampolineImg,
    color: "from-accent to-primary",
    age: "3 – 10 yrs",
    duration: "Unlimited",
    desc: "Bounce to new heights on our safety-netted trampolines! Kids burn energy, improve balance, and have an absolute blast. Available in junior and standard sizes.",
    highlights: ["Full safety netting", "Junior & standard sizes", "Balance & fitness", "High energy fun"],
  },
  {
    emoji: "🎠",
    title: "Merry-Go-Round",
    image: merryGoRoundImg,
    color: "from-pink to-accent",
    age: "1 – 8 yrs",
    duration: "Unlimited",
    desc: "A classic spinning ride that never gets old! Our Merry-Go-Round spins gently for the little ones, bringing smiles and laughter every time. A must-try for every visit.",
    highlights: ["Gentle safe speed", "Perfect for toddlers", "Classic fun", "Always supervised"],
  },
  {
    emoji: "🚲",
    title: "Paddle Bike",
    image: paddleBikeImg,
    color: "from-highlight to-primary",
    age: "2 – 10 yrs",
    duration: "Unlimited",
    desc: "Pedal around our indoor track on fun colorful bikes! Paddle biking builds leg strength, coordination and independence in a safe, enclosed space.",
    highlights: ["Various bike sizes", "Indoor safe track", "Builds leg strength", "Fun for all ages"],
  },
  {
    emoji: "📚",
    title: "Book Reading",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80",
    color: "from-secondary to-pink",
    age: "1 – 10 yrs",
    duration: "Unlimited",
    desc: "A cozy, quiet corner filled with colorful children's books. Perfect for kids who love stories or need a calm break between activities. Parents are welcome to read together!",
    highlights: ["Wide book collection", "Cozy seating", "Quiet calm space", "Parents welcome"],
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
  const [selected, setSelected] = useState<Activity | null>(null);

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
                <div className="relative h-32 overflow-hidden">
                  <img src={z.image} alt={z.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${z.color} opacity-50`} />
                  <span className="absolute top-2 right-2 text-xl drop-shadow-lg">{z.emoji}</span>
                </div>
                <div className="px-3 py-3 text-center">
                  <p className="font-bold text-xs leading-snug">{z.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Play activities — clickable */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest mb-3">
              Activities
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Play <span className="text-gradient">Activities</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3">Tap any activity to learn more</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {playActivities.map((a, i) => (
              <motion.button
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelected(a)}
                className="group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-card hover:shadow-fun transition-all text-left w-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${a.color} opacity-40`} />
                  <span className="absolute top-2 right-2 text-2xl drop-shadow-lg">{a.emoji}</span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/30">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="font-bold text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.age}</p>
                </div>
              </motion.button>
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
            <Link to="/packages"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition shadow-fun">
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

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-3xl overflow-hidden shadow-card border border-border/50"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img src={selected.image} alt={selected.title}
                  className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${selected.color} opacity-50`} />
                <span className="absolute top-4 left-4 text-4xl drop-shadow-lg">{selected.emoji}</span>
                <button onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white grid place-items-center hover:bg-black/80 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-7">
                <h2 className="font-display text-2xl font-bold mb-1">{selected.title}</h2>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" /> Age: {selected.age}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {selected.duration}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selected.desc}</p>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {selected.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 bg-primary/8 rounded-xl px-3 py-2">
                      <Star className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-semibold">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link to="/packages"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-fun hover:opacity-90 transition">
                    See Pricing <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setSelected(null)}
                    className="px-5 py-3 rounded-xl bg-muted text-muted-foreground font-semibold text-sm hover:bg-foreground hover:text-background transition">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
