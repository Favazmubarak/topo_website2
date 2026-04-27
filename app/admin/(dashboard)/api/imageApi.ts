import axiosInstance from "@/src/lib/axiosInstance";

export type Section = "hero" | "about" | "why-choose" | "cta";

export interface SectionImage {
    _id: string;
    section: Section;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export const addSectionImage = async (
    formData: FormData
): Promise<{message:string, data:SectionImage}> => {
    const response = await axiosInstance.post("/cms/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const updateSectionImage = async (
    id: string,
    formData: FormData
): Promise<{message:string, data:SectionImage}> => {
    const response = await axiosInstance.put(
        `/cms/images/${id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
};

export const deleteSectionImage = async (id: string): Promise<{ message: string, data: SectionImage }> => {
    const response = await axiosInstance.delete(`/cms/images/${id}`);
    return response.data;
};