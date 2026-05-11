import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, X, Save, ShieldCheck } from "lucide-react";
import { type Product, getProducts, saveProducts } from "./Products";

const ADMIN_PASSWORD = "hoichoi2024";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const emptyForm: Omit<Product, "id"> = {
  name: "",
  price: "",
  description: "",
  image: "",
  badge: "",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (authed) setProducts(getProducts());
  }, [authed]);

  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function logout() {
    setAuthed(false);
    setPw("");
    setShowForm(false);
    setEditing(null);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, price: p.price, description: p.description, image: p.image, badge: p.badge || "" });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price.trim()) return;
    let updated: Product[];
    if (editing) {
      updated = products.map((p) => p.id === editing.id ? { ...form, id: editing.id } : p);
    } else {
      updated = [...products, { ...form, id: generateId() }];
    }
    saveProducts(updated);
    setProducts(updated);
    closeForm();
  }

  function handleDelete(id: string) {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
    setDeleteConfirm(null);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-card rounded-4xl p-8 shadow-card border border-border/50"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-fun">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground text-sm mt-1">Hoichoi Khelaghor</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Password</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setPwError(false); }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="Enter admin password"
                className={`w-full px-4 py-3 rounded-2xl border ${pwError ? "border-destructive" : "border-border"} bg-background focus:outline-none focus:ring-2 focus:ring-primary transition`}
              />
              {pwError && <p className="text-destructive text-xs mt-1.5">Wrong password. Try again.</p>}
            </div>
            <button
              onClick={login}
              className="w-full py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft pt-8 pb-20">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold">Product Admin</h1>
            <p className="text-muted-foreground mt-1">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted text-foreground font-semibold hover:bg-destructive hover:text-white transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Product list */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-4xl border border-border/50">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-muted-foreground text-lg">No products yet. Click "Add Product" to start.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-5xl">🎁</div>
                  )}
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base line-clamp-1">{p.name}</h3>
                    <span className="font-bold text-primary shrink-0">৳{p.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted hover:bg-primary/10 text-sm font-semibold transition"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive text-sm font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card rounded-4xl p-7 shadow-card border border-border/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">{editing ? "Edit Product" : "Add Product"}</h2>
                <button onClick={closeForm} className="w-8 h-8 rounded-full bg-muted grid place-items-center hover:bg-destructive/10 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Hoichoi T-Shirt"
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Price (৳) *</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 350"
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Short product description..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... (paste image link)"
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Badge <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. New, Hot, Sale"
                    className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeForm}
                  className="flex-1 py-3 rounded-2xl bg-muted font-semibold hover:bg-muted/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.price.trim()}
                  className="flex-1 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-fun hover:scale-105 transition disabled:opacity-50 disabled:scale-100 inline-flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {editing ? "Update" : "Add"} Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-card rounded-4xl p-7 shadow-card border border-border/50 text-center"
            >
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="font-bold text-xl mb-2">Delete Product?</h3>
              <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl bg-muted font-semibold hover:bg-muted/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
