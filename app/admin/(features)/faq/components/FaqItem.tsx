
import { FaQuestionCircle, FaEdit, FaTrash } from "react-icons/fa";

interface FaqItemProps {
    faq: { _id: string; question: string; answer: string };
    onEdit: (faq: any) => void;
    onDelete: (id: string) => void;
}

export const FaqItem = ({ faq, onEdit, onDelete }: FaqItemProps) => (
    <div className="group bg-gray-50/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between gap-3 md:gap-4">
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                    <FaQuestionCircle className="text-gray-300 shrink-0" size={12} />
                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-black break-words">{faq.question}</h3>
                </div>
                <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-500 font-medium pl-5 md:pl-6 break-words">{faq.answer}</p>
            </div>
            <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 bg-white/80 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                <button onClick={() => onEdit(faq)} className="p-1.5 md:p-2 text-gray-400 hover:text-black transition-colors"><FaEdit size={11} /></button>
                <button onClick={() => onDelete(faq._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={11} /></button>
            </div>
        </div>
    </div>
);