import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, LogOut, X, Save,
  ShieldCheck, Search, Loader2, Upload, ImageIcon,
  Tag, Package, LayoutGrid, List, CheckCircle2,
} from "lucide-react";
import {
  type Product,
  fetchProducts, createProduct, updateProduct, deleteProduct,
} from "@/lib/appwrite";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ADMIN_PASSWORD = "hoichoi2024";
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

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
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

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

  useEffect(() => { if (authed) loadProducts(); }, [authed]);

  async function loadProducts() {
    setLoading(true);
    try { setProducts(await fetchProducts()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
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
              <input type="password" value={pw}
                onChange={(e) => { setPw(e.target.value); setPwError(false); }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="Enter password"
                className={`${inputCls} ${pwError ? "border-destructive focus:ring-destructive/50" : ""}`}
              />
              {pwError && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs flex items-center gap-1">
                  <X className="w-3 h-3" /> Incorrect password
                </motion.p>
              )}
              <button onClick={login}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:opacity-90 hover:scale-[1.02] transition-all">
                Sign In
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">Restricted access • Authorized personnel only</p>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-muted/30">

      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b border-border/50 shadow-sm">
        <div className="container max-w-7xl flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center shadow-fun">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base">Product Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-bold shadow-fun hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={() => setAuthed(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-semibold hover:bg-destructive/10 hover:text-destructive transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        {/* Product grid / list */}
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
                <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full grid place-items-center"><Package className="w-6 h-6 text-muted-foreground/30" /></div>}
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
