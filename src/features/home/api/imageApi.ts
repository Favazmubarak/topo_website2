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

export const getImageBySectionServer = async (section: Section): Promise<SectionImage[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/cms/images/${section}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${section} images on server:`, error);
    return [];
  }
};