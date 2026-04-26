import { useEffect } from "react";
import { create } from "zustand";
import { FAQ, getAllFAQs } from "../api/faqApi";

interface FAQState {
    faqs: FAQ[];
    loading: boolean;
    error: string | null;
    fetchFAQs: () => Promise<void>;
}

const useFAQStore = create<FAQState>((set, get) => ({
    faqs: [],
    loading: false,
    error: null,

    fetchFAQs: async () => {

        
        try {
            if (get().loading) return;

            set({ loading: true, error: null });

            const data = await getAllFAQs();

            set({
                faqs: data,
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch FAQs";

            set({
                error: message,
            });
        } finally {
            set({ loading: false });
        }
    },
}));

export const useFAQ = () => {
    const faqs = useFAQStore((s) => s.faqs);
    const loading = useFAQStore((s) => s.loading);
    const error = useFAQStore((s) => s.error);
    const fetchFAQs = useFAQStore((s) => s.fetchFAQs);

    useEffect(() => {
        fetchFAQs();
    }, [fetchFAQs]);

    return { faqs, loading, error };
};