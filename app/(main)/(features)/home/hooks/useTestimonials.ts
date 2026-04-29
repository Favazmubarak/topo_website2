import { useEffect } from "react";
import { create } from "zustand";
import { Testimonial, getAllTestimonials } from "../api/testimonialApi";

interface TestimonialState {
    testimonials: Testimonial[];
    loading: boolean;
    error: string | null;
    fetchTestimonials: () => Promise<void>;
}

const useTestimonialStore = create<TestimonialState>((set, get) => ({
    testimonials: [],
    loading: false,
    error: null,

    fetchTestimonials: async () => {
        try {
            if (get().loading) return;

            set({ loading: true, error: null });

            const data = await getAllTestimonials();

            set({
                testimonials: data.testimonials || [],
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch testimonials";

            set({
                error: message,
            });
        } finally {
            set({ loading: false });
        }   
    },
}));


export const useTestimonials = () => {
    const testimonials = useTestimonialStore((s) => s.testimonials);
    const loading = useTestimonialStore((s) => s.loading);
    const error = useTestimonialStore((s) => s.error);
    const fetchTestimonials = useTestimonialStore((s) => s.fetchTestimonials);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    return { testimonials, loading, error };
};