import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
  activeCount?: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  isOpenDefault = false, 
  children,
  activeCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border-b border-onyx-700 py-4 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-white hover:text-onyx-accent transition-colors"
      >
        <span className="flex items-center gap-2">
          {title}
          {activeCount > 0 && (
            <span className="bg-onyx-accent text-white text-[10px] px-1.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-onyx-muted" /> : <ChevronDown className="w-4 h-4 text-onyx-muted" />}
      </button>
      
      {isOpen && (
        <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};