import { motion } from "framer-motion";
import { Sparkles, Star, Heart, Cloud } from "lucide-react";

const items = [
  { Icon: Star, color: "text-accent", x: "8%", y: "15%", size: 32, dur: 6 },
  { Icon: Sparkles, color: "text-pink", x: "85%", y: "20%", size: 28, dur: 7 },
  { Icon: Heart, color: "text-primary", x: "12%", y: "75%", size: 26, dur: 5 },
  { Icon: Cloud, color: "text-highlight", x: "80%", y: "80%", size: 36, dur: 8 },
  { Icon: Star, color: "text-secondary", x: "50%", y: "10%", size: 22, dur: 6.5 },
];

export default function FloatingShapes({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map(({ Icon, color, x, y, size, dur }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color} drop-shadow-lg`}
          style={{ left: x, top: y }}
          animate={{ y: [0, -25, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon style={{ width: size, height: size }} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}
