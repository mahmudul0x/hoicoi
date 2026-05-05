import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MapPin, Star, ChevronLeft, ChevronRight, Sparkles, Shield, Smile, Cake, PartyPopper, Users, Wand2, ArrowRight, Quote } from "lucide-react";
import { SITE } from "@/lib/site";
import Counter from "@/components/Counter";
import FloatingShapes from "@/components/FloatingShapes";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const slides = [
  {
    img: hero1,
    title: "আনন্দ আর উল্লাস",
    titleEn: "হইচই খেলাঘর",
    sub: "An Ultimate Play Zone for Kids",
    ctas: [
      { label: "Visit Now", to: "/contact", primary: true },
      { label: "Call Now", href: `tel:${SITE.phone}` },
    ],
  },
  {
    img: hero2,
    title: "Safe • Fun • Exciting",
    titleEn: "A World of Adventure",
    sub: "Modern equipment, safe environment, endless smiles",
    ctas: [{ label: "Explore Activities", to: "/gallery", primary: true }],
  },
  {
    img: hero3,
    title: "Celebrate Your Child's Special Day",
    titleEn: "Magical Birthdays",
    sub: "Decorations, cake, games — we handle the whole party",
    ctas: [{ label: "Book Birthday Party", to: "/events", primary: true }],
  },
];

const features = [
  { icon: Wand2, title: "Modern Play Equipment", desc: "Imported, kid-tested equipment for non-stop fun.", color: "from-primary to-pink" },
  { icon: Shield, title: "Safe Environment", desc: "Padded floors, trained staff and CCTV everywhere.", color: "from-secondary to-highlight" },
  { icon: Sparkles, title: "Clean & Hygienic", desc: "Sanitized daily so parents stay relaxed.", color: "from-accent to-primary" },
  { icon: Users, title: "Family Friendly", desc: "Comfortable seating and Wi-Fi for parents.", color: "from-highlight to-secondary" },
  { icon: Smile, title: "Fun Activities", desc: "Ball pit, slides, climbing walls, trampolines & more.", color: "from-pink to-accent" },
  { icon: PartyPopper, title: "Event Hosting", desc: "Birthdays, school trips & private bookings.", color: "from-primary to-accent" },
];

const galleryImages = [g1, g2, g3, g4, g5, g6];

const testimonials = [
  { name: "Rifat Ahmed", text: "My kids beg to come back every weekend! Super clean and the staff are amazing.", rating: 5 },
  { name: "Sumi Begum", text: "Best birthday party we ever hosted. Decorations, food, games — everything was perfect.", rating: 5 },
  { name: "Tanvir Hossain", text: "Finally a safe indoor play zone in Dinajpur. Highly recommended for all parents!", rating: 5 },
  { name: "Nusrat Jahan", text: "My 4-year-old never wants to leave. The ball pit is her favourite place on earth.", rating: 5 },
  { name: "Karim Uddin", text: "Affordable, fun and very well managed. We are now regular visitors.", rating: 5 },
];

function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const s = slides[i];

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={s.img} alt={s.titleEn} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-pink/40 to-highlight/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </motion.div>
      </AnimatePresence>

      <FloatingShapes className="z-10" />

      <div className="relative z-20 h-full container flex flex-col justify-center items-start text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-sm font-semibold mb-5">
              ✨ Welcome to {SITE.name}
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.05] drop-shadow-2xl">
              {s.title}
            </h1>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold text-accent drop-shadow-lg">
              {s.titleEn}
            </h2>
            <p className="mt-5 text-lg md:text-2xl opacity-95 max-w-xl">{s.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {s.ctas.map((c, k) =>
                c.primary ? (
                  c.to ? (
                    <Link key={k} to={c.to} className="px-7 py-4 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
                      {c.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a key={k} href={c.href} className="px-7 py-4 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
                      {c.label} <ArrowRight className="w-4 h-4" />
                    </a>
                  )
                ) : (
                  <a key={k} href={c.href} className="px-7 py-4 rounded-full bg-white/15 backdrop-blur border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition inline-flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {c.label}
                  </a>
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 inset-x-0 z-20 container flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all ${k === i ? "w-10 bg-accent" : "w-2 bg-white/50"}`}
              aria-label={`Slide ${k + 1}`}
            />
          ))}
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={prev} className="w-12 h-12 rounded-full glass grid place-items-center text-white hover:bg-white hover:text-primary transition">
            <ChevronLeft />
          </button>
          <button onClick={next} className="w-12 h-12 rounded-full glass grid place-items-center text-white hover:bg-white hover:text-primary transition">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function QuickInfo() {
  const items = [
    { Icon: MapPin, label: "Dinajpur Location", sub: "Balubari, Nimnagar" },
    { Icon: Phone, label: SITE.phone, sub: "Call us anytime" },
    { Icon: Star, label: "100% Recommended", sub: "5 / 5 from parents" },
  ];
  return (
    <section className="relative mt-8 z-30 container">
      <div className="glass rounded-3xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-3 shadow-card">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center shrink-0 shadow-fun">
              <it.Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">{it.label}</div>
              <div className="text-sm text-muted-foreground">{it.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="container py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent blob animate-blob-morph" />
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-secondary/40 blob animate-blob-morph" />
          <img src={hero1} alt="Kids playing" className="relative rounded-5xl shadow-card w-full aspect-[4/3] object-cover" />
          <div className="absolute -bottom-6 left-6 glass rounded-2xl px-5 py-3 shadow-fun flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <div className="font-display text-2xl font-bold text-primary"><Counter to={5000} suffix="+" /></div>
              <div className="text-xs text-muted-foreground">Happy Kids</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-accent/30 text-accent-foreground text-sm font-bold mb-4">
            About Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Where Childhood <span className="text-gradient">Comes Alive</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Hoichoi Khelaghor is Dinajpur's premier indoor play zone — a magical world built specially for kids aged 2 to 12. From colorful slides to ball pits, climbing walls and trampolines, every corner is designed for safe, joyful play.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Parents can relax in our cozy lounge while their little ones explore, learn and make friends. We host unforgettable birthday parties and special events too!
          </p>
          <Link to="/about" className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-primary text-primary-foreground rounded-full font-bold shadow-fun hover:scale-105 transition">
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="relative py-24 bg-gradient-soft overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 blob animate-blob-morph" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 blob animate-blob-morph" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/15 text-primary text-sm font-bold mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Built for <span className="text-gradient">Big Smiles</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Every detail crafted to make playtime magical and worry-free for parents.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card rounded-4xl p-7 shadow-card hover:shadow-fun transition-all border border-border/50"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} grid place-items-center text-white shadow-fun mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { val: 5000, suffix: "+", label: "Happy Kids", emoji: "😊" },
    { val: 12000, suffix: "+", label: "Visitors", emoji: "👨‍👩‍👧" },
    { val: 200, suffix: "+", label: "Birthday Parties", emoji: "🎂" },
    { val: 100, suffix: "%", label: "Recommended", emoji: "⭐" },
  ];
  return (
    <section className="container py-20">
      <div className="rounded-5xl bg-gradient-fun p-10 md:p-14 text-white shadow-fun relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white blob animate-float" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white blob animate-float-slow" />
        </div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-5xl mb-2">{s.emoji}</div>
              <div className="font-display text-4xl md:text-6xl font-bold">
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div className="opacity-90 mt-1 font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="container py-20">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-pink/15 text-pink text-sm font-bold mb-3">Gallery</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Moments of <span className="text-gradient">Pure Joy</span>
          </h2>
        </div>
        <Link to="/gallery" className="px-6 py-3 rounded-full bg-foreground text-background font-bold hover:scale-105 transition inline-flex items-center gap-2">
          Full Gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-3xl group cursor-pointer ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <img src={img} alt="" loading="lazy" className={`w-full ${i === 0 ? "h-full md:aspect-square" : "aspect-square"} object-cover group-hover:scale-110 transition-transform duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden my-10">
      <img src={hero2} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110 animate-float-slow" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-pink/60 to-highlight/80 mix-blend-multiply" />
      <div className="relative h-full container grid place-items-center text-center text-white">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="font-display text-5xl md:text-7xl font-bold drop-shadow-2xl">Experience the Joy</h2>
          <p className="mt-4 text-xl opacity-90 max-w-xl mx-auto">Step inside Hoichoi Khelaghor and feel the laughter, the wonder and the magic.</p>
        </motion.div>
      </div>
    </section>
  );
}

function BirthdayPromo() {
  return (
    <section className="container py-20">
      <div className="grid lg:grid-cols-2 rounded-5xl overflow-hidden shadow-card bg-gradient-to-br from-pink/20 via-accent/20 to-primary/20">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-10 md:p-14 flex flex-col justify-center">
          <Cake className="w-12 h-12 text-pink mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Make Their <span className="text-gradient">Birthday Magical</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Decorations, cake, food, games, party host — we plan everything so you can just enjoy the smiles. Packages start from affordable rates.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/events" className="px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
              <PartyPopper className="w-4 h-4" /> Book Your Party
            </Link>
            <a href={`tel:${SITE.phone}`} className="px-7 py-3.5 rounded-full bg-white text-foreground font-bold shadow-card hover:scale-105 transition inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> {SITE.phone}
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative min-h-[300px]">
          <img src={hero3} alt="Birthday party" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-secondary/15 text-secondary text-sm font-bold mb-3">Testimonials</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Loved by <span className="text-gradient">Parents</span></h2>
        <div className="mt-3 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, k) => <Star key={k} className="w-5 h-5 text-accent fill-accent" />)}
          <span className="ml-2 text-sm text-muted-foreground">100% recommended (5 reviews)</span>
        </div>
      </div>
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-4xl p-8 md:p-12 shadow-card border border-border/50 relative"
          >
            <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10" />
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[i].rating)].map((_, k) => <Star key={k} className="w-5 h-5 text-accent fill-accent" />)}
            </div>
            <p className="text-xl md:text-2xl leading-relaxed font-medium">"{testimonials[i].text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold">
                {testimonials[i].name[0]}
              </div>
              <div>
                <div className="font-bold">{testimonials[i].name}</div>
                <div className="text-sm text-muted-foreground">Verified parent</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="container py-20">
      <div className="grid lg:grid-cols-5 gap-6 rounded-5xl overflow-hidden shadow-card">
        <div className="lg:col-span-2 p-10 bg-gradient-primary text-primary-foreground">
          <MapPin className="w-10 h-10 mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">Find Us in Dinajpur</h2>
          <p className="mt-4 opacity-95">{SITE.address}</p>
          <p className="opacity-80 text-sm mt-1">({SITE.addressNote})</p>
          <div className="mt-6 space-y-2">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:underline"><Phone className="w-4 h-4" /> {SITE.phone}</a>
          </div>
        </div>
        <iframe
          src={SITE.mapsEmbed}
          className="lg:col-span-3 w-full h-[400px] lg:h-auto border-0"
          loading="lazy"
          title="Map"
        />
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="container pb-20">
      <div className="rounded-5xl p-10 md:p-16 text-center bg-gradient-sunset text-white shadow-fun relative overflow-hidden">
        <FloatingShapes />
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative font-display text-4xl md:text-6xl font-bold drop-shadow-lg">
          Plan Your Visit Today!
        </motion.h2>
        <p className="relative mt-4 text-lg opacity-95 max-w-xl mx-auto">A whole day of laughter, learning and adventure is waiting for your little ones.</p>
        <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
          <a href={`tel:${SITE.phone}`} className="px-7 py-4 rounded-full bg-white text-primary font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
            <Phone className="w-5 h-5" /> Call {SITE.phone}
          </a>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="px-7 py-4 rounded-full bg-[#25D366] text-white font-bold shadow-fun hover:scale-105 transition inline-flex items-center gap-2">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  useEffect(() => {
    document.title = "Best Kids Play Zone in Dinajpur | Hoichoi Khelaghor";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute("content", "Hoichoi Khelaghor — Dinajpur's premier indoor kids play zone. Slides, ball pits, trampolines, birthday parties & more. Safe, fun, exciting!");
  }, []);

  return (
    <>
      <HeroSlider />
      <QuickInfo />
      <AboutPreview />
      <Features />
      <Stats />
      <GalleryPreview />
      <VideoSection />
      <BirthdayPromo />
      <Testimonials />
      <MapSection />
      <ContactCTA />
    </>
  );
};

export default Index;
