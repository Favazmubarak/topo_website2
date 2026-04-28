import axiosInstance from "@/src/lib/axiosInstance";

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllGalleryImages = async (): Promise<GalleryImage[]> => {
  const response = await axiosInstance.get("/gallery");
  return response.data;
};

export const createGalleryImage = async (formData: FormData): Promise<GalleryImage> => {
  const response = await axiosInstance.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGalleryImage = async (id: string, formData: FormData): Promise<GalleryImage> => {
  const response = await axiosInstance.put(`/gallery/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/gallery/${id}`);
};
