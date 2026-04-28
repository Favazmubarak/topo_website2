// components/faq/FaqHeader.tsx
import { FaPlus } from "react-icons/fa";

interface FaqHeaderProps {
    onAddClick: () => void;
}

export const FaqHeader = ({ onAddClick }: FaqHeaderProps) => (
    <div className="mb-6 md:mb-12 flex items-center justify-between border-b pb-4 md:pb-6">
        <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Frequently Asked Questions</h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">
                Manage site-wide help and support
            </p>
        </div>
        <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
        </button>
    </div>
);