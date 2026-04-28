import React from "react";
import { FaVideo, FaEdit, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import { Reel } from "../api/reelApi";

interface ReelItemProps {
    reel: Reel;
    onEdit: (reel: Reel) => void;
    onDelete: (id: string) => void;
}

export const ReelItem = ({ reel, onEdit, onDelete }: ReelItemProps) => {
    return (
        <div className="group bg-white rounded-xl sm:rounded-3xl border border-gray-100 p-2 sm:p-4 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div className="p-1.5 sm:p-2.5 bg-gray-50 rounded-lg sm:rounded-2xl text-gray-400 group-hover:text-black transition-colors">
                    <FaVideo size={12} className="sm:hidden" />
                    <FaVideo size={18} className="hidden sm:block" />
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 sm:translate-y-1 sm:group-hover:translate-y-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={() => onEdit(reel)}
                        className="p-1 sm:p-2 bg-gray-100 hover:bg-black hover:text-white rounded-lg sm:rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <FaEdit size={10} className="sm:hidden" />
                        <FaEdit size={14} className="hidden sm:block" />
                    </button>
                    <button
                        onClick={() => onDelete(reel._id)}
                        className="p-1 sm:p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg sm:rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <FaTrash size={10} className="sm:hidden" />
                        <FaTrash size={14} className="hidden sm:block" />
                    </button>
                </div>
            </div>

            <div className="relative mt-2 sm:mt-4 aspect-[9/16] w-full bg-black rounded-lg sm:rounded-2xl overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500 text-[8px] sm:text-[10px]">
                <img 
                    src={reel.thumbnail} 
                    alt="Reel Thumbnail" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-center">
                    <a
                        href={reel.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full font-bold text-white hover:bg-white/20 transition-all border border-white/40 sm:border-white/20 shadow-lg active:scale-95 truncate"
                    >
                        <FaExternalLinkAlt size={7} className="sm:size-[8px] shrink-0" /> 
                        <span className="truncate uppercase tracking-tight sm:tracking-widest">VIEW</span>
                    </a>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[7px] sm:text-[9px] text-gray-400 font-medium font-mono uppercase tracking-tighter mt-auto pt-2 sm:pt-4 border-t border-gray-50">
                <span>#{reel._id.slice(-4)}</span>
                <span>{new Date(reel.updatedAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}</span>
            </div>
        </div>
    );
};
