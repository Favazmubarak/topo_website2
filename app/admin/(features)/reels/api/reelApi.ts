import axiosInstance from "@/src/lib/axiosInstance";

export interface Reel {
  _id: string;
  thumbnail: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllReels = async (): Promise<Reel[]> => {
  const response = await axiosInstance.get("/reels");
  return response.data;
};

export const createReel = async (data: FormData): Promise<Reel> => {
  const response = await axiosInstance.post("/reels", data);
  return response.data;
};

export const updateReel = async (id: string, data: FormData): Promise<Reel> => {
  const response = await axiosInstance.patch(`/reels/${id}`, data);
  return response.data;
};

export const deleteReel = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/reels/${id}`);
};
