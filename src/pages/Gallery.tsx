import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon, Play } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
import PageHero from "@/components/PageHero";
import { fetchGallery, type GalleryPhoto } from "@/lib/appwrite";
import { usePageView } from "@/hooks/useAnalytics";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";

const staticPhotos: GalleryPhoto[] = [
  { $id: "s1", image: h1, caption: "Play Area" },
  { $id: "s2", image: g1, caption: "Activities" },
  { $id: "s3", image: g2, caption: "Activities" },
  { $id: "s4", image: g3, caption: "Play Area" },
  { $id: "s5", image: h2, caption: "Play Area" },
  { $id: "s6", image: g4, caption: "Activities" },
  { $id: "s7", image: g5, caption: "Events" },
  { $id: "s8", image: h3, caption: "Events" },
  { $id: "s9", image: g6, caption: "Activities" },
];

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<GalleryPhoto | null>(null);

  usePageView("gallery");

  useEffect(() => {
    fetchGallery()
      .then((data) => setPhotos(data.length > 0 ? data : staticPhotos))
      .catch(() => setPhotos(staticPhotos))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Gallery" subtitle="A glimpse into the joy that happens every day at Hoichoi Khelaghor." />

      <section className="container pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-32">
            <ImageIcon className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((photo, i) => (
                <motion.button
                  key={photo.$id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                  onClick={() => setOpen(photo)}
                  className="relative aspect-square overflow-hidden rounded-3xl group bg-muted"
                >
                  {photo.type === "youtube" ? (
                    <>
                      <img src={`https://img.youtube.com/vi/${getYouTubeId(photo.image)}/hqdefault.jpg`}
                        alt={photo.caption || "Video"} loading="lazy"
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600 backdrop-blur-sm grid place-items-center group-hover:scale-110 transition shadow-fun">
                          <Play className="w-7 h-7 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : photo.type === "video" ? (
                    <>
                      <video src={photo.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" muted playsInline preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center group-hover:scale-110 transition">
                          <Play className="w-7 h-7 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={photo.image} alt={photo.caption || "Gallery"} loading="lazy"
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition" />
                  {photo.caption && (
                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 font-bold text-left text-sm">
                      {photo.caption}
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] bg-black/85 grid place-items-center p-4 backdrop-blur-sm"
          >
            {open.type === "youtube" ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-3xl aspect-video rounded-3xl overflow-hidden shadow-fun"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(open.image)}?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </motion.div>
            ) : open.type === "video" ? (
              <motion.video
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                src={open.image}
                controls autoPlay
                onClick={e => e.stopPropagation()}
                className="max-w-full max-h-[90vh] rounded-3xl shadow-fun"
              />
            ) : (
              <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                src={open.image} alt={open.caption || ""}
                className="max-w-full max-h-[90vh] rounded-3xl shadow-fun"
              />
            )}
            {open.caption && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full backdrop-blur">
                {open.caption}
              </motion.p>
            )}
            <button onClick={(e) => { e.stopPropagation(); setOpen(null); }}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur text-white grid place-items-center hover:bg-black/80 transition">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
