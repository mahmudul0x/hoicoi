import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PageHero from "@/components/PageHero";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";

type Cat = "All" | "Play Area" | "Activities" | "Events";
const items: { src: string; cat: Exclude<Cat, "All"> }[] = [
  { src: h1, cat: "Play Area" },
  { src: g1, cat: "Activities" },
  { src: g2, cat: "Activities" },
  { src: g3, cat: "Play Area" },
  { src: h2, cat: "Play Area" },
  { src: g4, cat: "Activities" },
  { src: g5, cat: "Events" },
  { src: h3, cat: "Events" },
  { src: g6, cat: "Activities" },
];

export default function Gallery() {
  const [cat, setCat] = useState<Cat>("All");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = items.filter((it) => cat === "All" || it.cat === cat);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Gallery" subtitle="A glimpse into the joy that happens every day at Hoichoi Khelaghor." />

      <section className="container pb-24">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(["All", "Play Area", "Activities", "Events"] as Cat[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                cat === c ? "bg-gradient-primary text-primary-foreground shadow-fun" : "bg-muted hover:bg-muted/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          <AnimatePresence>
            {filtered.map((it, i) => (
              <motion.button
                key={it.src + cat}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                onClick={() => setOpen(it.src)}
                className="mb-4 block w-full overflow-hidden rounded-3xl group relative break-inside-avoid"
              >
                <img src={it.src} alt={it.cat} loading="lazy" className="w-full transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 font-bold">
                  {it.cat}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] bg-black/85 grid place-items-center p-4 backdrop-blur-sm"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={open}
              alt=""
              className="max-w-full max-h-[90vh] rounded-3xl shadow-fun"
            />
            <button onClick={() => setOpen(null)} className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white text-foreground grid place-items-center">
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
