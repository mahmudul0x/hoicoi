import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, LogOut, X, Save,
  ShieldCheck, Search, Loader2, Upload, ImageIcon,
  Tag, Package, LayoutGrid, List, CheckCircle2, Mail, Lock,
  UserPlus, ExternalLink, Users, KeyRound, Image, Megaphone,
  BarChart2, TrendingUp, Eye, Globe, ToggleLeft, ToggleRight, Menu, Video, Play,
} from "lucide-react";
import {
  type Product, type GalleryPhoto, type Offer,
  fetchProducts, createProduct, updateProduct, deleteProduct,
  loginAdmin, logoutAdmin, getCurrentUser,
  fetchGallery, createGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto,
  fetchAllOffers, createOffer, updateOffer, deleteOffer,
  fetchAnalyticsSummary,
} from "@/lib/appwrite";
import { uploadToCloudinary } from "@/lib/cloudinary";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

type UnsplashPhoto = {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
};

type FormData = {
  name: string;
  price: string;
  description: string;
  image: string;
  badge: string;
};

const emptyForm: FormData = { name: "", price: "", description: "", image: "", badge: "" };
const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm placeholder:text-muted-foreground/60";

// ── Stat card ──────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "gallery" | "offers" | "analytics" | "admins">("products");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Gallery state
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeCaption, setYoutubeCaption] = useState("");
  const [youtubeSaving, setYoutubeSaving] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryPhoto | null>(null);
  const [editingGalleryCaption, setEditingGalleryCaption] = useState("");

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offerForm, setOfferForm] = useState({ title: "", description: "", badge: "", bgColor: "from-primary to-pink", active: true, image: "", showPopup: false });
  const [offerImageUploading, setOfferImageUploading] = useState(false);
  const offerImageRef = useRef<HTMLInputElement>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerSaving, setOfferSaving] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState<Awaited<ReturnType<typeof fetchAnalyticsSummary>>>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [listSearch, setListSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [imgTab, setImgTab] = useState<"unsplash" | "upload">("unsplash");
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<UnsplashPhoto[]>([]);
  const [unsplashSearching, setUnsplashSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setAuthed(true);
        setCurrentUser({ name: user.name || "Admin", email: user.email });
      }
      setCheckingSession(false);
    });
  }, []);

  useEffect(() => { if (authed) loadProducts(); }, [authed]);

  useEffect(() => {
    if (!authed) return;
    if (activeTab === "gallery") loadGallery();
    if (activeTab === "offers") loadOffers();
    if (activeTab === "analytics") loadAnalytics();
  }, [activeTab, authed]);

  async function loadGallery() {
    setGalleryLoading(true);
    try { setGallery(await fetchGallery()); } catch { /* silent */ }
    finally { setGalleryLoading(false); }
  }

  async function loadOffers() {
    setOffersLoading(true);
    try { setOffers(await fetchAllOffers()); } catch { /* silent */ }
    finally { setOffersLoading(false); }
  }

  async function loadAnalytics() {
    setAnalyticsLoading(true);
    try { setAnalytics(await fetchAnalyticsSummary()); } catch { /* silent */ }
    finally { setAnalyticsLoading(false); }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const { secure_url, public_id } = await uploadToCloudinary(file, "image");
      await createGalleryPhoto({ image: secure_url, caption: galleryCaption, publicId: public_id, type: "image" });
      setGalleryCaption("");
      await loadGallery();
    } catch { /* silent */ }
    finally {
      setGalleryUploading(false);
      if (galleryFileRef.current) galleryFileRef.current.value = "";
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const { secure_url, public_id } = await uploadToCloudinary(file, "video");
      await createGalleryPhoto({ image: secure_url, caption: galleryCaption, publicId: public_id, type: "video" });
      setGalleryCaption("");
      await loadGallery();
    } catch { /* silent */ }
    finally {
      setVideoUploading(false);
      if (videoFileRef.current) videoFileRef.current.value = "";
    }
  }

  async function handleAddYoutube() {
    if (!youtubeUrl.trim()) return;
    setYoutubeSaving(true);
    try {
      await createGalleryPhoto({ image: youtubeUrl.trim(), caption: youtubeCaption, type: "youtube" as "video" });
      setYoutubeUrl("");
      setYoutubeCaption("");
      await loadGallery();
    } catch { /* silent */ }
    finally { setYoutubeSaving(false); }
  }

  async function handleDeleteGalleryPhoto(id: string) {
    try { await deleteGalleryPhoto(id); await loadGallery(); } catch { /* silent */ }
  }

  async function handleSaveGalleryEdit() {
    if (!editingGallery) return;
    try {
      await updateGalleryPhoto(editingGallery.$id, { caption: editingGalleryCaption });
      setEditingGallery(null);
      await loadGallery();
    } catch { /* silent */ }
  }

  async function handleOfferImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOfferImageUploading(true);
    try {
      const { secure_url } = await uploadToCloudinary(file);
      setOfferForm(f => ({ ...f, image: secure_url }));
    } catch { /* silent */ }
    finally { setOfferImageUploading(false); if (offerImageRef.current) offerImageRef.current.value = ""; }
  }

  async function handleSaveOffer() {
    if (!offerForm.title.trim()) return;
    setOfferSaving(true);
    try {
      if (editingOffer) await updateOffer(editingOffer.$id, offerForm);
      else await createOffer(offerForm);
      setShowOfferForm(false);
      setEditingOffer(null);
      setOfferForm({ title: "", description: "", badge: "", bgColor: "from-primary to-pink", active: true, image: "", showPopup: false });
      await loadOffers();
    } catch { /* silent */ }
    finally { setOfferSaving(false); }
  }

  async function toggleOfferActive(offer: Offer) {
    try { await updateOffer(offer.$id, { active: !offer.active }); await loadOffers(); } catch { /* silent */ }
  }

  async function handleDeleteOffer(id: string) {
    try { await deleteOffer(id); await loadOffers(); } catch { /* silent */ }
  }

  async function loadProducts() {
    setLoading(true);
    try { setProducts(await fetchProducts()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function login() {
    if (!email.trim() || !pw.trim()) return;
    setLoginLoading(true);
    setLoginError("");
    try {
      await loginAdmin(email.trim(), pw);
      const user = await getCurrentUser();
      if (user) setCurrentUser({ name: user.name || "Admin", email: user.email });
      setAuthed(true);
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    setAuthed(false);
    setCurrentUser(null);
    setEmail("");
    setPw("");
  }

  function openAdd() {
    setEditing(null); setForm(emptyForm);
    setUnsplashQuery(""); setUnsplashResults([]);
    setUploadSuccess(false); setImgTab("unsplash"); setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, price: p.price, description: p.description, image: p.image, badge: p.badge || "" });
    setUnsplashQuery(""); setUnsplashResults([]);
    setUploadSuccess(false); setImgTab("unsplash"); setShowForm(true);
  }

  function closeForm() {
    setShowForm(false); setEditing(null); setForm(emptyForm);
    setUnsplashQuery(""); setUnsplashResults([]); setUploadSuccess(false);
  }

  async function searchUnsplash() {
    if (!unsplashQuery.trim()) return;
    setUnsplashSearching(true);
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=15&client_id=${UNSPLASH_KEY}`);
      const data = await res.json();
      setUnsplashResults(data.results || []);
    } catch (e) { console.error(e); }
    finally { setUnsplashSearching(false); }
  }

  // auto upload on file select — no extra button click needed
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);
    setForm((f) => ({ ...f, image: "" }));
    try {
      const { secure_url } = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, image: secure_url }));
      setUploadSuccess(true);
    } catch (e) { console.error(e); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price.trim()) return;
    setSaving(true);
    try {
      const data = { name: form.name, price: form.price, description: form.description, image: form.image, badge: form.badge };
      if (editing) await updateProduct(editing.$id, data);
      else await createProduct(data);
      await loadProducts();
      closeForm();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try { await deleteProduct(id); await loadProducts(); setDeleteConfirm(null); }
    catch (e) { console.error(e); }
    finally { setDeleting(false); }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(listSearch.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(listSearch.toLowerCase())
  );

  // ── Session check ─────────────────────────────────────────────
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // ── Login page ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-5 shadow-fun">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground text-sm mt-1">Hoichoi Khelaghor</p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  placeholder="Admin email"
                  className={`${inputCls} pl-9 ${loginError ? "border-destructive focus:ring-destructive/50" : ""}`}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={pw}
                  onChange={(e) => { setPw(e.target.value); setLoginError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  placeholder="Password"
                  className={`${inputCls} pl-9 ${loginError ? "border-destructive focus:ring-destructive/50" : ""}`}
                />
              </div>
              {loginError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs flex items-center gap-1">
                  <X className="w-3 h-3" /> {loginError}
                </motion.p>
              )}
              <button onClick={login} disabled={loginLoading || !email.trim() || !pw.trim()}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100 inline-flex items-center justify-center gap-2">
                {loginLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">Restricted access • Authorized personnel only</p>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  const NAV = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "gallery" as const, label: "Gallery", icon: Image },
    { id: "offers" as const, label: "Offers", icon: Megaphone },
    { id: "analytics" as const, label: "Analytics", icon: BarChart2 },
    { id: "admins" as const, label: "Admin Management", icon: Users },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-[#f4f6fb] dark:bg-[#0f1117]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-card border-r border-border/60 h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-fun shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Hoichoi Admin</p>
            <p className="text-[11px] text-muted-foreground">Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-2">Menu</p>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? "bg-primary text-primary-foreground shadow-fun"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {id === "products" && products.length > 0 && (
                <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  {products.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-border/60 space-y-2">
          {currentUser && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/60">
              <div className="w-8 h-8 rounded-full bg-gradient-primary grid place-items-center shrink-0">
                <span className="text-white text-xs font-bold">{currentUser.email[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{currentUser.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border/60 md:hidden shadow-xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-fun shrink-0">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Hoichoi Admin</p>
                    <p className="text-[11px] text-muted-foreground">Dashboard</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-2">Menu</p>
                {NAV.map(({ id, label, icon: Icon }) => (
                  <button key={id}
                    onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground shadow-fun"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                    {id === "products" && products.length > 0 && (
                      <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                        {products.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Drawer user + logout */}
              <div className="px-3 py-4 border-t border-border/60 space-y-2">
                {currentUser && (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/60">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary grid place-items-center shrink-0">
                      <span className="text-white text-xs font-bold">{currentUser.email[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                  </div>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Top bar (mobile + page header) */}
        <header className="shrink-0 sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border/50 px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary grid place-items-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="font-bold text-base">
              {NAV.find(n => n.id === activeTab)?.label ?? "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "products" && (
              <button onClick={openAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-fun hover:opacity-90 transition">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}

            {/* Hamburger (mobile only) */}
            <button onClick={() => setMobileMenuOpen(true)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">

          {/* ── Products Tab ── */}
          {activeTab === "products" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Package className="w-5 h-5 text-white" />} label="Total Products" value={products.length} color="bg-gradient-primary" />
                <StatCard icon={<Tag className="w-5 h-5 text-white" />} label="With Badge" value={products.filter(p => p.badge).length} color="bg-gradient-to-br from-secondary to-highlight" />
                <StatCard icon={<ImageIcon className="w-5 h-5 text-white" />} label="With Image" value={products.filter(p => p.image).length} color="bg-gradient-to-br from-accent to-primary" />
                <StatCard icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Showing" value={filtered.length} color="bg-gradient-to-br from-pink to-secondary" />
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={listSearch} onChange={(e) => setListSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm"
                  />
                  {listSearch && (
                    <button onClick={() => setListSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
                  <button onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product list */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">Loading products...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-32 bg-card rounded-2xl border border-border/50">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-semibold text-lg mb-1">{listSearch ? "No results found" : "No products yet"}</p>
                  <p className="text-muted-foreground text-sm">
                    {listSearch ? "Try a different keyword" : "Click \"Add Product\" to get started"}
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((p) => (
                    <motion.div key={p.$id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card group hover:shadow-fun transition-shadow"
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full grid place-items-center"><Package className="w-10 h-10 text-muted-foreground/30" /></div>}
                        {p.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground text-[11px] font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                          <span className="font-bold text-primary text-sm shrink-0">৳{p.price}</span>
                        </div>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">{p.description}</p>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-xs font-semibold transition">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(p.$id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive text-xs font-semibold transition">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filtered.map((p) => (
                    <motion.div key={p.$id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border/50 shadow-sm flex items-center gap-4 p-3 hover:shadow-card transition-shadow"
                    >
                      <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full grid place-items-center"><Package className="w-5 h-5 text-muted-foreground/30" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                          {p.badge && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">{p.badge}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</p>
                      </div>
                      <span className="font-bold text-primary text-sm shrink-0">৳{p.price}</span>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => openEdit(p)}
                          className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.$id)}
                          className="p-2 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Gallery Tab ── */}
          {activeTab === "gallery" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {/* Upload bar */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 mb-6">
                <h2 className="font-bold text-base mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-primary" /> Upload to Gallery</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)}
                    placeholder="Caption (optional)" className={`${inputCls} flex-1`} />
                  <button onClick={() => galleryFileRef.current?.click()} disabled={galleryUploading || videoUploading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:opacity-90 transition disabled:opacity-60 shrink-0">
                    {galleryUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Image className="w-4 h-4" /> Upload Photo</>}
                  </button>
                  <button onClick={() => videoFileRef.current?.click()} disabled={galleryUploading || videoUploading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition disabled:opacity-60 shrink-0">
                    {videoUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Video className="w-4 h-4" /> Upload Video</>}
                  </button>
                  <input ref={galleryFileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                  <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </div>

                {/* YouTube row */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-border/40">
                  <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="YouTube video URL (e.g. https://www.youtube.com/watch?v=...)" className={`${inputCls} flex-1`} />
                  <input value={youtubeCaption} onChange={e => setYoutubeCaption(e.target.value)}
                    placeholder="Caption (optional)" className={`${inputCls} sm:w-48`} />
                  <button onClick={handleAddYoutube} disabled={youtubeSaving || !youtubeUrl.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:opacity-90 transition disabled:opacity-50 shrink-0">
                    {youtubeSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Play className="w-4 h-4 fill-white" /> Add YouTube</>}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Photos and videos upload to Cloudinary. YouTube links are saved directly.</p>
              </div>

              {/* Edit caption modal */}
              <AnimatePresence>
                {editingGallery && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setEditingGallery(null)}>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      onClick={e => e.stopPropagation()}
                      className="bg-card rounded-2xl p-6 shadow-card border border-border/50 w-full max-w-sm space-y-4">
                      <h3 className="font-bold">Edit Caption</h3>
                      {editingGallery.type === "youtube" ? (
                        <img src={`https://img.youtube.com/vi/${getYouTubeId(editingGallery.image)}/hqdefault.jpg`} alt="" className="w-full aspect-video object-cover rounded-xl" />
                      ) : editingGallery.type === "video" ? (
                        <video src={editingGallery.image} className="w-full aspect-video object-cover rounded-xl" controls muted />
                      ) : (
                        <img src={editingGallery.image} alt="" className="w-full aspect-video object-cover rounded-xl" />
                      )}
                      <input value={editingGalleryCaption} onChange={e => setEditingGalleryCaption(e.target.value)}
                        placeholder="Caption..." className={inputCls} />
                      <div className="flex gap-3">
                        <button onClick={() => setEditingGallery(null)} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition">Cancel</button>
                        <button onClick={handleSaveGalleryEdit}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2">
                          <Save className="w-4 h-4" /> Save
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {galleryLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
              ) : gallery.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-2xl border border-border/50">
                  <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-semibold">No photos yet</p>
                  <p className="text-sm text-muted-foreground">Upload your first photo above</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {gallery.map(photo => (
                    <motion.div key={photo.$id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-card bg-muted">
                      {photo.type === "youtube" ? (
                        <>
                          <img src={`https://img.youtube.com/vi/${getYouTubeId(photo.image)}/hqdefault.jpg`}
                            alt={photo.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-red-600 grid place-items-center">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                        </>
                      ) : photo.type === "video" ? (
                        <>
                          <video src={photo.image} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-black/50 grid place-items-center">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img src={photo.image} alt={photo.caption || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                        {photo.caption && <p className="text-white text-[11px] font-semibold text-center line-clamp-2">{photo.caption}</p>}
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingGallery(photo); setEditingGalleryCaption(photo.caption || ""); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => handleDeleteGalleryPhoto(photo.$id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-destructive/80 text-white text-xs font-bold hover:bg-destructive transition">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Offers Tab ── */}
          {activeTab === "offers" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Active offer টি homepage-এ banner হিসেবে দেখাবে।</p>
                <button onClick={() => { setEditingOffer(null); setOfferForm({ title: "", description: "", badge: "", bgColor: "from-primary to-pink", active: true }); setShowOfferForm(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-fun hover:opacity-90 transition">
                  <Plus className="w-4 h-4" /> New Offer
                </button>
              </div>

              <AnimatePresence>
                {showOfferForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-card rounded-2xl border border-border/50 shadow-card p-6 mb-6 space-y-3">
                    <h3 className="font-bold mb-2">{editingOffer ? "Edit Offer" : "New Offer"}</h3>
                    <input value={offerForm.title} onChange={e => setOfferForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Offer title *" className={inputCls} />
                    <input value={offerForm.description} onChange={e => setOfferForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Description (optional)" className={inputCls} />
                    <div className="flex gap-3">
                      <input value={offerForm.badge} onChange={e => setOfferForm(f => ({ ...f, badge: e.target.value }))}
                        placeholder="Badge (e.g. 🎉 EID OFFER)" className={`${inputCls} flex-1`} />
                      <select value={offerForm.bgColor} onChange={e => setOfferForm(f => ({ ...f, bgColor: e.target.value }))}
                        className={`${inputCls} flex-1`}>
                        <option value="from-primary to-pink">Purple → Pink</option>
                        <option value="from-orange-500 to-red-500">Orange → Red</option>
                        <option value="from-green-500 to-teal-500">Green → Teal</option>
                        <option value="from-blue-500 to-purple-500">Blue → Purple</option>
                        <option value="from-yellow-400 to-orange-500">Yellow → Orange</option>
                      </select>
                    </div>

                    {/* Image upload */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Offer Image <span className="normal-case font-normal">(optional — shows in slider & popup)</span></label>
                      <input ref={offerImageRef} type="file" accept="image/*" className="hidden" onChange={handleOfferImageUpload} />
                      {offerForm.image ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-border">
                          <img src={offerForm.image} alt="offer" className="w-full h-full object-cover" />
                          <button onClick={() => setOfferForm(f => ({ ...f, image: "" }))}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-white grid place-items-center hover:opacity-90 transition">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                            <CheckCircle2 className="w-3 h-3 text-green-400" /> Image selected
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => offerImageRef.current?.click()} disabled={offerImageUploading}
                          className="w-full h-28 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-muted-foreground hover:text-primary">
                          {offerImageUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Click to upload image</>}
                        </button>
                      )}
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={offerForm.active} onChange={e => setOfferForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-semibold">Active (banner + slider)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={offerForm.showPopup} onChange={e => setOfferForm(f => ({ ...f, showPopup: e.target.checked }))} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-semibold">Show as Popup</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setShowOfferForm(false)} className="px-5 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition">Cancel</button>
                      <button onClick={handleSaveOffer} disabled={offerSaving || !offerForm.title.trim() || offerImageUploading}
                        className="flex-1 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
                        {offerSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Offer</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {offersLoading ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
              ) : offers.length === 0 ? (
                <div className="text-center py-24 bg-card rounded-2xl border border-border/50">
                  <Megaphone className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-semibold">No offers yet</p>
                  <p className="text-sm text-muted-foreground">Create your first offer above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offers.map(offer => (
                    <motion.div key={offer.$id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
                      {offer.image && (
                        <div className="relative h-28 overflow-hidden">
                          <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-gradient-to-r ${offer.bgColor || "from-primary to-pink"} opacity-40`} />
                        </div>
                      )}
                      <div className="p-4 flex items-center gap-4">
                        {!offer.image && <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${offer.bgColor || "from-primary to-pink"} shrink-0`} />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm truncate">{offer.title}</p>
                            {offer.badge && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">{offer.badge}</span>}
                            {offer.showPopup && <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold shrink-0">Popup</span>}
                          </div>
                          {offer.description && <p className="text-xs text-muted-foreground truncate">{offer.description}</p>}
                        </div>
                        <button onClick={() => toggleOfferActive(offer)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${offer.active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                          {offer.active ? <><ToggleRight className="w-4 h-4" /> Active</> : <><ToggleLeft className="w-4 h-4" /> Off</>}
                        </button>
                        <button onClick={() => { setEditingOffer(offer); setOfferForm({ title: offer.title, description: offer.description || "", badge: offer.badge || "", bgColor: offer.bgColor || "from-primary to-pink", active: offer.active, image: offer.image || "", showPopup: offer.showPopup || false }); setShowOfferForm(true); }}
                          className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition shrink-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteOffer(offer.$id)}
                          className="p-2 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive transition shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {analyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">Loading analytics...</p>
                </div>
              ) : !analytics ? (
                <div className="text-center py-32 bg-card rounded-2xl border border-border/50">
                  <BarChart2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-semibold">No data yet</p>
                  <p className="text-sm text-muted-foreground">Visitors will appear here after they browse the site</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Eye className="w-5 h-5 text-white" />} label="Total Page Views" value={analytics.totalVisits} color="bg-gradient-primary" />
                    <StatCard icon={<TrendingUp className="w-5 h-5 text-white" />} label="Product Views" value={analytics.totalProductViews} color="bg-gradient-to-br from-secondary to-highlight" />
                    <StatCard icon={<Globe className="w-5 h-5 text-white" />} label="Pages Tracked" value={analytics.pageBreakdown.length} color="bg-gradient-to-br from-accent to-primary" />
                    <StatCard icon={<Package className="w-5 h-5 text-white" />} label="Products Viewed" value={analytics.topProducts.length} color="bg-gradient-to-br from-pink to-secondary" />
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Daily visits */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary" /> Last 7 Days Visits</h3>
                      <div className="space-y-2">
                        {analytics.dailyVisits.map(([day, count]) => {
                          const max = Math.max(...analytics.dailyVisits.map(([, c]) => c), 1);
                          return (
                            <div key={day} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-16 shrink-0">{day}</span>
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(count / max) * 100}%` }}
                                  className="h-full bg-gradient-primary rounded-full" />
                              </div>
                              <span className="text-xs font-bold w-6 text-right shrink-0">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top products */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Most Viewed Products</h3>
                      {analytics.topProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No product views yet</p>
                      ) : (
                        <div className="space-y-3">
                          {analytics.topProducts.map((p, i) => {
                            const max = Math.max(...analytics.topProducts.map(x => x.count), 1);
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold grid place-items-center shrink-0">{i + 1}</span>
                                <span className="text-sm flex-1 truncate">{p.name}</span>
                                <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(p.count / max) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-secondary to-highlight rounded-full" />
                                </div>
                                <span className="text-xs font-bold w-6 text-right shrink-0">{p.count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Page breakdown */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 lg:col-span-2">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Page Breakdown</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {analytics.pageBreakdown.map(([page, count]) => (
                          <div key={page} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                            <span className="text-sm font-semibold capitalize">/{page}</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{count} views</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">Analytics collect করা হয় শুধুমাত্র page visits থেকে। কোনো personal data store হয় না।</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Admin Management Tab ── */}
          {activeTab === "admins" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">

              {/* Current user */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Logged-in Admin
                </h2>
                {currentUser && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="w-11 h-11 rounded-xl bg-gradient-primary grid place-items-center shadow-fun shrink-0">
                      <span className="text-white text-lg font-bold">{currentUser.email[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                    <span className="ml-auto px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold shrink-0">● Active</span>
                  </div>
                )}
              </div>

              {/* Add admin */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                <h2 className="font-bold text-base mb-1 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" /> Add New Admin
                </h2>
                <p className="text-sm text-muted-foreground mb-5">নতুন admin add করতে Appwrite Dashboard থেকে user create করতে হবে।</p>
                <ol className="space-y-3 mb-6">
                  {[
                    'Appwrite Dashboard-এ যাও এবং project open করো',
                    'বাম সাইডবারে "Auth" → "Users" tab click করো',
                    '"Create User" button click করো',
                    'নতুন admin-এর Email ও Password দাও',
                    'Save করো — সাথে সাথে login করতে পারবে',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm">{text}</span>
                    </li>
                  ))}
                </ol>
                <a href="https://cloud.appwrite.io" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:opacity-90 transition text-sm">
                  <ExternalLink className="w-4 h-4" /> Appwrite Dashboard খোলো
                </a>
              </div>

              {/* Change password */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                <h2 className="font-bold text-base mb-1 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" /> Password Change
                </h2>
                <p className="text-sm text-muted-foreground mb-5">যেকোনো admin-এর password Appwrite Dashboard থেকে change করা যাবে।</p>
                <ol className="space-y-3 mb-6">
                  {[
                    'Appwrite Dashboard → "Auth" → "Users"',
                    'যে admin-এর password change করতে চাও তাকে click করো',
                    '"Update Password" থেকে নতুন password দাও',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-highlight text-white text-xs font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm">{text}</span>
                    </li>
                  ))}
                </ol>
                <a href="https://cloud.appwrite.io" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border font-semibold hover:bg-primary/10 hover:text-primary transition text-sm">
                  <ExternalLink className="w-4 h-4" /> Dashboard-এ যাও
                </a>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-3xl bg-card rounded-2xl shadow-card border border-border/50 max-h-[92vh] flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center shadow-fun">
                    {editing ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                  </div>
                  <h2 className="font-bold text-lg">{editing ? "Edit Product" : "New Product"}</h2>
                </div>
                <button onClick={closeForm} className="w-8 h-8 rounded-lg bg-muted grid place-items-center hover:bg-destructive/10 hover:text-destructive transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* LEFT: fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Product Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Hoichoi T-Shirt" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Price (৳) *</label>
                      <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="e.g. 350" className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Short product description..." rows={4}
                        className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">Badge <span className="normal-case font-normal">(optional)</span></label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                          placeholder="New, Hot, Sale..." className={`${inputCls} pl-9`} />
                      </div>
                    </div>

                    {/* Selected image preview */}
                    {form.image && (
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-border">
                        <img src={form.image} alt="selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                          <button onClick={() => { setForm({ ...form, image: "" }); setUploadSuccess(false); }}
                            className="px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-semibold flex items-center gap-1">
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3 text-green-400" /> Image selected
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: image picker */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">Product Image</label>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4">
                      {(["unsplash", "upload"] as const).map((tab) => (
                        <button key={tab} onClick={() => setImgTab(tab)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition ${imgTab === tab ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {tab === "unsplash"
                            ? <><Search className="w-3.5 h-3.5" /> Unsplash</>
                            : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                        </button>
                      ))}
                    </div>

                    {/* Unsplash tab */}
                    {imgTab === "unsplash" && (
                      <div>
                        <div className="flex gap-2 mb-3">
                          <input value={unsplashQuery}
                            onChange={(e) => setUnsplashQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
                            placeholder="Search images..."
                            className={inputCls}
                          />
                          <button onClick={searchUnsplash} disabled={unsplashSearching}
                            className="px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold hover:opacity-90 transition disabled:opacity-60 shrink-0">
                            {unsplashSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          </button>
                        </div>
                        {unsplashResults.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                            {unsplashResults.map((photo) => (
                              <button key={photo.id}
                                onClick={() => setForm({ ...form, image: photo.urls.regular })}
                                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition hover:scale-105 ${form.image === photo.urls.regular ? "border-primary shadow-fun" : "border-transparent hover:border-border"}`}
                              >
                                <img src={photo.urls.small} alt={photo.alt_description || ""} className="w-full h-full object-cover" />
                                {form.image === photo.urls.regular && (
                                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border-2 border-dashed border-border h-48 grid place-items-center text-muted-foreground text-sm text-center px-4">
                            <div>
                              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              <p className="font-medium">Search for images</p>
                              <p className="text-xs mt-1 opacity-70">Powered by Unsplash</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload tab */}
                    {imgTab === "upload" && (
                      <div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                        {uploading ? (
                          <div className="h-48 rounded-xl border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-sm font-semibold text-primary">Uploading to Cloudinary...</p>
                          </div>
                        ) : uploadSuccess && form.image ? (
                          <div className="h-48 rounded-xl border-2 border-green-500/40 bg-green-500/5 flex flex-col items-center justify-center gap-3">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                            <p className="text-sm font-semibold text-green-600">Upload Successful!</p>
                            <button onClick={() => fileRef.current?.click()}
                              className="text-xs text-muted-foreground hover:text-primary underline transition">
                              Upload a different image
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => fileRef.current?.click()}
                            className="w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary group"
                          >
                            <div className="w-14 h-14 rounded-xl bg-muted group-hover:bg-primary/10 grid place-items-center transition">
                              <Upload className="w-7 h-7" />
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-semibold">Click to upload image</p>
                              <p className="text-xs mt-0.5 opacity-70">PNG, JPG, WEBP • Auto uploads instantly</p>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-border/50 shrink-0 bg-muted/30 rounded-b-2xl">
                <button onClick={closeForm}
                  className="px-6 py-2.5 rounded-xl bg-background border border-border font-semibold text-sm hover:bg-muted transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.name.trim() || !form.price.trim() || saving || uploading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2 text-sm"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    : <><Save className="w-4 h-4" /> {editing ? "Update Product" : "Save Product"}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-card rounded-2xl p-7 shadow-card border border-border/50 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 grid place-items-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-bold text-lg mb-1">Delete Product?</h3>
              <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm!)} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
