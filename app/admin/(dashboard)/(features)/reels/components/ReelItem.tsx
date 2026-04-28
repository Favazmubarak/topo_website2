import React from "react";
import { FaPlay, FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { Reel } from "../api/reelApi";

interface ReelItemProps {
    reel: Reel;
    onEdit: (reel: Reel) => void;
    onDelete: (id: string) => void;
}

export const ReelItem = ({ reel, onEdit, onDelete }: ReelItemProps) => {
    return (
        <div className="group relative bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="p-2 md:p-3 bg-black text-white rounded-lg md:rounded-xl shadow-md">
                    <FaPlay size={12} className="md:hidden" />
                    <FaPlay size={14} className="hidden md:block" />
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(reel)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                    >
                        <FaEdit size={13} className="md:hidden" />
                        <FaEdit size={15} className="hidden md:block" />
                    </button>
                    <button
                        onClick={() => onDelete(reel._id)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                    >
                        <FaTrash size={13} className="md:hidden" />
                        <FaTrash size={15} className="hidden md:block" />
                    </button>
                </div>
            </div>

            <div className="mt-4 md:mt-6 space-y-1 md:space-y-2">
                <h3 className="text-sm md:text-base font-bold tracking-tight line-clamp-1">{reel.title}</h3>
                <a
                    href={reel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <FaExternalLinkAlt size={8} /> View Source
                </a>
            </div>

            <div className="mt-3 md:mt-4 text-[8px] md:text-[9px] text-gray-400 font-medium italic">
                Updated: {new Date(reel.updatedAt).toLocaleDateString()}
            </div>
        </div>
    );
};
