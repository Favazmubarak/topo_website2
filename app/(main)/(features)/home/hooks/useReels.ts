import { useEffect } from "react";
import { create } from "zustand";
import { Reel, getAllReels } from "../api/reelApi";

interface ReelState {
    reels: Reel[];
    loading: boolean;
    error: string | null;
    fetchReels: () => Promise<void>;
}

const useReelStore = create<ReelState>((set, get) => ({
    reels: [],
    loading: false,
    error: null,

    fetchReels: async () => {
        try {
            if (get().loading) return;

            set({ loading: true, error: null });

            const data = await getAllReels();

            set({
                reels: data,
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch reels";

            set({
                error: message,
            });
        } finally {
            set({ loading: false });
        }   
    },
}));


export const useReels = () => {
    const reels = useReelStore((s) => s.reels);
    const loading = useReelStore((s) => s.loading);
    const error = useReelStore((s) => s.error);
    const fetchReels = useReelStore((s) => s.fetchReels);

    useEffect(() => {
        fetchReels();
    }, [fetchReels]);

    return { reels, loading, error };
};
