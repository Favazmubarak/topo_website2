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

export interface TestimonialsResponse {
    testimonials: Testimonial[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export const getAllTestimonials = async (): Promise<TestimonialsResponse> => {
    const res = await axiosInstance.get<TestimonialsResponse>("/testimonials?limit=20");
    return res.data;
};