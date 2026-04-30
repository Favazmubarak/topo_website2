
import { FaExclamationCircle } from "react-icons/fa";

export const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
        <p className="flex items-center gap-1 text-[9px] text-red-500 font-semibold mt-1 animate-in fade-in duration-200">
            <FaExclamationCircle size={8} /> {msg}
        </p>
    ) : null;