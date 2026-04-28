import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Section } from "../api/imageApi";

export const SECTIONS: { value: Section; label: string; description: string }[] = [
  { value: "hero",        label: "Hero",          description: "Main banner / hero section" },
  { value: "about",       label: "About Us",       description: "About page imagery" },
  { value: "why-choose",  label: "Why Choose Us",  description: "Why-choose section" },
  { value: "cta",         label: "CTA",            description: "Call-to-action section" },
];

interface SectionFilterProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export const SectionFilter = ({ activeSection, onSectionChange }: SectionFilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeLabel = SECTIONS.find((s) => s.value === activeSection)?.label;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
        Section
      </span>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 transition-all"
        >
          <span>{activeLabel}</span>
          <FaChevronDown
            size={8}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
            {SECTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => { onSectionChange(s.value); setOpen(false); }}
                className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                  s.value === activeSection
                    ? "bg-black text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    s.value === activeSection ? "bg-white" : "bg-gray-300"
                  }`}
                />
                <span className="text-[11px] font-bold tracking-tight">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
