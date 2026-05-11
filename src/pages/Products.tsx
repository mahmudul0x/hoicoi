import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  badge?: string;
};

export function getProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("hk_products") || "[]");
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("hk_products", JSON.stringify(products));
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Grab exclusive Hoichoi Khelaghor merchandise and kids' goodies!"
      />

      <section className="container py-20">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-7xl mb-6">🛍️</div>
            <h2 className="font-display text-3xl font-bold mb-3">No Products Yet</h2>
            <p className="text-muted-foreground text-lg">
              Products will appear here once the admin adds them. Check back soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group bg-card rounded-4xl overflow-hidden shadow-card hover:shadow-fun transition-all border border-border/50"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-6xl">🎁</div>
                  )}
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold shadow-fun">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{p.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-primary">৳{p.price}</span>
                    <a
                      href={`tel:${SITE.phone}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold shadow-fun hover:scale-105 transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Order
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">To order, call or WhatsApp us directly</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition"
            >
              <Phone className="w-4 h-4" /> Call {SITE.phone}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-bold shadow-fun hover:scale-105 transition"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
