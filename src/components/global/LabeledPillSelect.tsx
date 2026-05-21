// Re-exports from ui/select for backwards compatibility.
// MFLabeledPillSelect maps to PillSelect (Radix-based).
// MFLabeledPillSearchSelect is kept as a full custom component
// since it has search/filter functionality not in the base select.

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { PillSelect } from '../ui/select'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Default export: simple pill select (wraps Radix)
interface MFLabeledPillSelectProps {
  label: string
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export default function MFLabeledPillSelect({ label, options, value, onChange, onValueChange, disabled, className }: MFLabeledPillSelectProps) {
  const handleValueChange = (val: string) => {
    onValueChange?.(val)
    if (onChange) {
      // Synthesize a native-like event for backwards compat
      const syntheticEvent = { target: { value: val === '__empty__' ? '' : val } } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  return (
    <PillSelect
      label={label}
      value={value === '' ? '__empty__' : value}
      onValueChange={handleValueChange}
      options={options}
      disabled={disabled}
      className={className}
    />
  )
}

// Named export: search-capable select (kept custom but updated styling)
interface MFLabeledPillSearchSelectProps {
  options: Array<{ value: string; label: string; logoUrl?: string }>;
  label: string;
  placeholder?: string;
  valueClass?: string;
  labelClass?: string;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
}

export const MFLabeledPillSearchSelect = ({ label, options, onChange, labelClass = '', valueClass = '', className = '', placeholder = 'Search...', value: controlledValue }: MFLabeledPillSearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(controlledValue || '')
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) setSelectedItem(controlledValue);
  }, [controlledValue]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === selectedItem);
  const displayValue = selectedOption ? selectedOption.label : '';

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(true); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlightedIndex(prev => prev < filteredOptions.length - 1 ? prev + 1 : prev); break;
      case 'ArrowUp': e.preventDefault(); setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0); break;
      case 'Enter': e.preventDefault(); if (filteredOptions[highlightedIndex]) handleSelect(filteredOptions[highlightedIndex].value); break;
      case 'Escape': e.preventDefault(); closeDropdown(); break;
    }
  };

  const handleSelect = (optionValue: string) => {
    setSelectedItem(optionValue);
    onChange(optionValue);
    closeDropdown();
    setHighlightedIndex(0);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem('');
    onChange('');
  };

  const isLabelFloating = isOpen || !!selectedItem;

  return (
    <div ref={dropdownRef} className="relative w-full mb-5">
      <div
        className={cn(
          "relative w-full h-14 rounded-full border bg-white flex items-center px-8 cursor-pointer transition-all duration-200",
          isOpen ? "border-blue-500 ring-1 ring-blue-500/10 shadow-sm" : "border-gray-300",
          className
        )}
        onClick={() => isOpen ? closeDropdown() : setIsOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={cn(
            "absolute left-7 px-2 font-medium transition-all duration-200 pointer-events-none z-10 bg-white rounded-sm",
            isLabelFloating
              ? "-top-[9px] text-[12px] text-gray-600 scale-90 origin-left"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400",
            isOpen && "text-blue-600",
            labelClass
          )}
        >
          {label}
        </span>

        <div className={cn("flex-1 flex items-center gap-2 truncate text-base text-[#101828]", isLabelFloating && "pt-5 pb-1", valueClass)}>
          {selectedOption?.logoUrl && (
            <img src={selectedOption.logoUrl} alt="" className="w-6 h-6 rounded-full object-contain" />
          )}
          <span className={!displayValue ? 'text-gray-400' : ''}>{displayValue || placeholder}</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {displayValue && (
            <X className="w-4 h-4 text-[#9A9A9A] hover:text-[#101828] transition-colors" onClick={clearSelection} />
          )}
          <ChevronDown className={cn("w-5 h-5 text-[#9A9A9A] opacity-70 transition-transform duration-200", isOpen && "rotate-180")} />
        </div>
      </div>

      <AnimatePresence>
        {(isOpen) && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[9999] w-full mt-2 bg-white border border-gray-200 rounded-[20px] shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setHighlightedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 text-sm transition-all"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[240px] p-1.5" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "px-4 py-2.5 cursor-pointer text-sm transition-colors rounded-xl flex items-center gap-3",
                      opt.value === selectedItem ? 'bg-blue-50 text-blue-900 font-bold' : 'text-gray-900 hover:bg-gray-50',
                      index === highlightedIndex && opt.value !== selectedItem ? 'bg-gray-50' : ''
                    )}
                    role="option"
                    aria-selected={opt.value === selectedItem}
                  >
                    {opt.logoUrl && (
                      <img src={opt.logoUrl} alt="" className="w-5 h-5 rounded-full object-contain" />
                    )}
                    <span>{opt.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-400 font-medium">No options found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
