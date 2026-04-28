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

            <div className="relative mt-4 md:mt-6 aspect-[9/16] w-full bg-black rounded-lg md:rounded-xl overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500">
                <img 
                    src={reel.thumbnail} 
                    alt="Reel Thumbnail" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <a
                        href={reel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] md:text-[10px] font-bold text-white hover:bg-white/20 transition-all border border-white/20"
                    >
                        <FaExternalLinkAlt size={8} /> VIEW ON INSTAGRAM
                    </a>
                </div>
            </div>

            <div className="mt-3 md:mt-4 flex items-center justify-between text-[8px] md:text-[9px] text-gray-400 font-medium font-mono uppercase tracking-tighter">
                <span>REEL #{reel._id.slice(-4)}</span>
                <span>{new Date(reel.updatedAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};
