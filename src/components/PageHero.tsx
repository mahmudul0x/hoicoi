import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FloatingShapes from "./FloatingShapes";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  bg,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bg?: string;
}) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft" />
      {bg && (
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        />
      )}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blob blur-3xl animate-blob-morph" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/20 blob blur-3xl animate-blob-morph" />
      <FloatingShapes />

      <div className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4"
        >
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-semibold">{eyebrow || title}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold"
        >
          <span className="text-gradient">{title}</span>
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
