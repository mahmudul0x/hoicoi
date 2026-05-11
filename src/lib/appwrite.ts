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
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type Product = {
  $id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  badge?: string;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.orderDesc("$createdAt"),
  ]);
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

export async function uploadImage(file: File): Promise<string> {
  const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
  const url = storage.getFilePreview(BUCKET_ID, res.$id, 800, 800);
  return url.toString();
}

export async function deleteImage(fileId: string) {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch {
    // ignore if already deleted
  }
}
