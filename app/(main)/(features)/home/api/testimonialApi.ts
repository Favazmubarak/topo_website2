import axiosInstance from "@/src/lib/axiosInstance";

export interface Testimonial {
    _id: string;
    name: string;
    review: string;
    rating: number;
    avatar?: string;   
    createdAt: string;
    updatedAt: string;
}

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
    const res = await axiosInstance.get<Testimonial[]>("/testimonials");
    return res.data;
};