import axiosInstance from "@/src/lib/axiosInstance";

export type Section = "hero" | "about" | "why-choose" | "cta";

export interface SectionImage {
  _id: string;
  section: Section;
  imageUrl: string;
}

export const getImageBySection = async (section: Section) => {
  const res = await axiosInstance.get(`/cms/images/${section}`);
  return res.data;
};
