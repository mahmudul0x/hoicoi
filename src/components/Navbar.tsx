import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Moon, Sun } from "lucide-react";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/packages", label: "Packages" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between gap-4 rounded-full px-4 md:px-6 py-2.5 transition-all duration-300 ${
            scrolled
              ? "glass shadow-card"
              : "bg-white/30 dark:bg-card/30 backdrop-blur-md border border-white/30"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <motion.img
              src={logo}
              alt="Hoichoi Khelaghor logo"
              className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md"
              whileHover={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 0.6 }}
            />
            <div className="leading-tight">
              <div className="font-display text-lg md:text-xl font-bold text-gradient">
                {SITE.name}
              </div>
              <div className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">
                {SITE.nameBn}
              </div>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="navpill"
                          className="absolute inset-0 bg-gradient-primary rounded-full -z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{l.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-full grid place-items-center hover:bg-muted transition-colors"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <a
              href={`tel:${SITE.phone}`}
              className="hidden md:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold shadow-fun hover:scale-105 transition-transform"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-full grid place-items-center bg-muted"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 glass rounded-3xl p-4 shadow-card"
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-2xl font-semibold ${
                          isActive
                            ? "bg-gradient-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                <a
                  href={`tel:${SITE.phone}`}
                  className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-3 rounded-2xl font-bold"
                >
                  <Phone className="w-4 h-4" /> {SITE.phone}
                </a>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
