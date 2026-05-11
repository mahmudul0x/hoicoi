import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Loader2, PackageOpen, Search, X, SlidersHorizontal } from "lucide-react";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { type Product, fetchProducts } from "@/lib/appwrite";

const BADGES = ["All", "New", "Hot", "Sale"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [activeBadge, setActiveBadge] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchBadge = activeBadge === "All" || p.badge?.toLowerCase() === activeBadge.toLowerCase();
    return matchSearch && matchBadge;
  });

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Exclusive Hoichoi Khelaghor merchandise and kids' goodies — order with a single call!"
      />

      <section className="container py-16">

        {/* Search + filter bar */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-3 rounded-full border border-border bg-card shadow-card focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted grid place-items-center hover:bg-destructive/10 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              {BADGES.map((b) => (
                <button key={b} onClick={() => setActiveBadge(b)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeBadge === b ? "bg-gradient-primary text-primary-foreground shadow-fun" : "bg-card border border-border hover:border-primary hover:text-primary"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-muted-foreground text-lg">Could not load products. Please try again later.</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32">
            <PackageOpen className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="font-display text-3xl font-bold mb-3">
              {search || activeBadge !== "All" ? "No products found" : "No Products Yet"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {search || activeBadge !== "All"
                ? "Try a different search or filter."
                : "Products will appear here once the admin adds them. Check back soon!"}
            </p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.$id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelected(p)}
                  className="group bg-card rounded-4xl overflow-hidden shadow-card hover:shadow-fun transition-all border border-border/50 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {p.image ? (
                      <img src={p.image} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-6xl bg-gradient-soft">🎁</div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-bold bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/30">
                        Quick View
                      </span>
                    </div>
                    {p.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold shadow-fun">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-1 line-clamp-1">{p.name}</h3>
                    <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-2xl font-bold text-primary">৳{p.price}</span>
                      </div>
                      <a href={`tel:${SITE.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold shadow-fun hover:scale-105 transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Order
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="mt-20 rounded-4xl bg-gradient-fun p-10 md:p-14 text-white text-center shadow-fun relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-24 h-24 bg-white blob animate-float" />
            <div className="absolute bottom-4 right-8 w-32 h-32 bg-white blob animate-float-slow" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Want to Order?</h2>
            <p className="opacity-90 mb-7 text-lg">Call or WhatsApp us directly — we deliver to your doorstep!</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`tel:${SITE.phone}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-bold shadow-fun hover:scale-105 transition"
              >
                <Phone className="w-4 h-4" /> Call {SITE.phone}
              </a>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-bold shadow-fun hover:scale-105 transition"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-card rounded-4xl overflow-hidden shadow-card border border-border/50"
            >
              <div className="relative aspect-video bg-muted">
                {selected.image
                  ? <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full grid place-items-center text-7xl bg-gradient-soft">🎁</div>
                }
                <button onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur text-white grid place-items-center hover:bg-black/70 transition">
                  <X className="w-4 h-4" />
                </button>
                {selected.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold shadow-fun">
                    {selected.badge}
                  </span>
                )}
              </div>
              <div className="p-7">
                <h2 className="font-display text-2xl font-bold mb-2">{selected.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{selected.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="font-display text-4xl font-bold text-primary">৳{selected.price}</span>
                  <div className="flex gap-3">
                    <a href={`tel:${SITE.phone}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition"
                    >
                      <Phone className="w-4 h-4" /> Call to Order
                    </a>
                    <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold hover:scale-105 transition"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
