import React from "react";
import { FaVideo } from "react-icons/fa";
import { Reel } from "../api/reelApi";
import { ReelItem } from "./ReelItem";
import { ReelSkeleton } from "./ReelSkeleton";

interface ReelListProps {
    reels: Reel[];
    loading: boolean;
    onEdit: (reel: Reel) => void;
    onDelete: (id: string) => void;
}

export const ReelList = ({ reels, loading, onEdit, onDelete }: ReelListProps) => {
    if (loading && reels.length === 0) {
        return <ReelSkeleton />;
    }

    if (reels.length === 0) {
        return (
            <div className="text-center py-16 md:py-24 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex flex-col items-center gap-3">
                <FaVideo size={32} className="text-gray-200 md:text-[40px]" />
                <p className="text-sm md:text-base text-gray-400 font-medium">No reels yet. Add your first reel.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {reels.map((reel) => (
                <ReelItem key={reel._id} reel={reel} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
};
