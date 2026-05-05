import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";

export default function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 flex flex-col gap-3">
      <motion.a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="relative w-14 h-14 rounded-full grid place-items-center text-white shadow-fun"
        style={{ background: "#25D366" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40" />
        <MessageCircle className="w-6 h-6 relative" />
      </motion.a>
      <motion.a
        href={`tel:${SITE.phone}`}
        aria-label="Call"
        className="w-14 h-14 rounded-full grid place-items-center bg-gradient-primary text-primary-foreground shadow-fun"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Phone className="w-6 h-6" />
      </motion.a>
    </div>
  );
}
