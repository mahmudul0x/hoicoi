import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-gradient-to-br from-foreground to-[hsl(220_45%_10%)] text-background dark:from-[hsl(230_28%_16%)] dark:to-[hsl(230_30%_8%)] dark:text-foreground overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 blob blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 blob blur-3xl" />

      <div className="container relative py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="" className="w-12 h-12" />
            <div>
              <div className="font-display text-xl font-bold">{SITE.name}</div>
              <div className="text-xs opacity-70">{SITE.nameBn}</div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Dinajpur's most exciting indoor play zone — where kids laugh, learn and make memories that last forever.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {[
              ["Home", "/"], ["About", "/about"], ["Gallery", "/gallery"],
              ["Packages", "/packages"], ["Events", "/events"], ["Contact", "/contact"],
            ].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-accent transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-accent">Contact</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" /> {SITE.address}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <a href={`tel:${SITE.phone}`} className="hover:text-accent">{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> <a href={`mailto:${SITE.email}`} className="hover:text-accent break-all">{SITE.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-accent">Follow Us</h4>
          <div className="flex gap-3">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/hckdinajpur/" },
              { Icon: Instagram, href: "https://www.instagram.com/hoichoikhelaghor/" },
              { Icon: Youtube, href: "https://www.youtube.com/@hoichoikhelaghor" },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-primary hover:scale-110 transition">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs opacity-60 leading-relaxed">
            Sat–Thu: 3 PM – 9 PM<br />
            Fri & Holidays: 9:30 AM – 10 PM
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-5 text-xs opacity-60 text-center">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
