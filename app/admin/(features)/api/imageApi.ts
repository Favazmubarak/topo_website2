import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    
        const response = await axios.post(`${API_BASE_URL}/cms/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
   
};

export const updateSectionImage = async (
    id: string,
    formData: FormData
): Promise<{message:string, data:SectionImage}> => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/cms/images/${id}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const deleteSectionImage = async (id: string): Promise<{ message: string, data: SectionImage }> => {
    console.log("correct")
    try {
        const response = await axios.delete(`${API_BASE_URL}/cms/images/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};