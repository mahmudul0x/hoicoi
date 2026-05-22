import { Client, Databases, Storage, Account, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export async function loginAdmin(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}
export async function logoutAdmin() {
  return account.deleteSession("current");
}
export async function getCurrentUser() {
  try { return await account.get(); } catch { return null; }
}

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const GALLERY_COLLECTION = "gallery";
export const OFFERS_COLLECTION = "offers";
export const ANALYTICS_COLLECTION = "analytics";

// ── Product ──────────────────────────────────────────────────────
export type Product = {
  $id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  badge?: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [Query.orderDesc("$createdAt")]);
  return res.documents as unknown as Product[];
}
export async function createProduct(data: Omit<Product, "$id">) {
  return databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data);
}
export async function updateProduct(id: string, data: Omit<Product, "$id">) {
  return databases.updateDocument(DB_ID, COLLECTION_ID, id, data);
}
export async function deleteProduct(id: string) {
  return databases.deleteDocument(DB_ID, COLLECTION_ID, id);
}

// ── Gallery ──────────────────────────────────────────────────────
export type GalleryPhoto = {
  $id: string;
  image: string;
  caption?: string;
  publicId?: string;
  type?: "image" | "video" | "youtube";
};

export async function fetchGallery(): Promise<GalleryPhoto[]> {
  const res = await databases.listDocuments(DB_ID, GALLERY_COLLECTION, [Query.orderDesc("$createdAt")]);
  return res.documents as unknown as GalleryPhoto[];
}
export async function createGalleryPhoto(data: Omit<GalleryPhoto, "$id">) {
  return databases.createDocument(DB_ID, GALLERY_COLLECTION, ID.unique(), data);
}
export async function updateGalleryPhoto(id: string, data: Partial<Omit<GalleryPhoto, "$id">>) {
  return databases.updateDocument(DB_ID, GALLERY_COLLECTION, id, data);
}
export async function deleteGalleryPhoto(id: string) {
  return databases.deleteDocument(DB_ID, GALLERY_COLLECTION, id);
}

// ── Offers ───────────────────────────────────────────────────────
export type Offer = {
  $id: string;
  title: string;
  description?: string;
  badge?: string;
  active: boolean;
  bgColor?: string;
  image?: string;
  showPopup?: boolean;
};

export async function fetchActiveOffer(): Promise<Offer | null> {
  try {
    const res = await databases.listDocuments(DB_ID, OFFERS_COLLECTION, [
      Query.equal("active", true),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    return res.documents.length > 0 ? (res.documents[0] as unknown as Offer) : null;
  } catch { return null; }
}

export async function fetchPopupOffer(): Promise<Offer | null> {
  try {
    const res = await databases.listDocuments(DB_ID, OFFERS_COLLECTION, [
      Query.equal("active", true),
      Query.equal("showPopup", true),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);
    return res.documents.length > 0 ? (res.documents[0] as unknown as Offer) : null;
  } catch { return null; }
}
export async function fetchAllOffers(): Promise<Offer[]> {
  const res = await databases.listDocuments(DB_ID, OFFERS_COLLECTION, [Query.orderDesc("$createdAt")]);
  return res.documents as unknown as Offer[];
}
export async function createOffer(data: Omit<Offer, "$id">) {
  return databases.createDocument(DB_ID, OFFERS_COLLECTION, ID.unique(), data);
}
export async function updateOffer(id: string, data: Partial<Omit<Offer, "$id">>) {
  return databases.updateDocument(DB_ID, OFFERS_COLLECTION, id, data);
}
export async function deleteOffer(id: string) {
  return databases.deleteDocument(DB_ID, OFFERS_COLLECTION, id);
}

// ── Analytics ────────────────────────────────────────────────────
export async function trackEvent(data: {
  type: "page_view" | "product_view";
  page?: string;
  productId?: string;
  productName?: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    await databases.createDocument(DB_ID, ANALYTICS_COLLECTION, ID.unique(), {
      ...data,
      userAgent: navigator.userAgent.slice(0, 500),
      referrer: document.referrer.slice(0, 500),
    });
  } catch { /* silent */ }
}

export async function fetchAnalyticsSummary() {
  try {
    const res = await databases.listDocuments(DB_ID, ANALYTICS_COLLECTION, [
      Query.orderDesc("$createdAt"),
      Query.limit(5000),
    ]);
    const docs = res.documents as unknown as {
      type: string; page?: string; productId?: string; productName?: string; $createdAt: string;
    }[];

    const pageViews = docs.filter(d => d.type === "page_view");
    const productViews = docs.filter(d => d.type === "product_view");

    // total visitors (unique by day — approximate)
    const totalVisits = pageViews.length;

    // page breakdown
    const pageMap: Record<string, number> = {};
    pageViews.forEach(d => {
      const p = d.page || "unknown";
      pageMap[p] = (pageMap[p] || 0) + 1;
    });

    // product breakdown
    const productMap: Record<string, { name: string; count: number }> = {};
    productViews.forEach(d => {
      if (!d.productId) return;
      if (!productMap[d.productId]) productMap[d.productId] = { name: d.productName || "Unknown", count: 0 };
      productMap[d.productId].count++;
    });

    // visits per day (last 7 days)
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyMap[d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })] = 0;
    }
    pageViews.forEach(d => {
      const day = new Date(d.$createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      if (day in dailyMap) dailyMap[day]++;
    });

    return {
      totalVisits,
      totalProductViews: productViews.length,
      pageBreakdown: Object.entries(pageMap).sort((a, b) => b[1] - a[1]),
      topProducts: Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 5),
      dailyVisits: Object.entries(dailyMap),
    };
  } catch { return null; }
}

// ── Storage (legacy) ─────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
  const url = storage.getFilePreview(BUCKET_ID, res.$id, 800, 800);
  return url.toString();
}
export async function deleteImage(fileId: string) {
  try { await storage.deleteFile(BUCKET_ID, fileId); } catch { /* ignore */ }
}
