const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export type CloudinaryResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadToCloudinary(file: File, resourceType: "image" | "video" = "image"): Promise<CloudinaryResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}
