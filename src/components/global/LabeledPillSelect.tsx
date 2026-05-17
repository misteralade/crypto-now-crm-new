// Re-exports from ui/select for backwards compatibility.
// MFLabeledPillSelect maps to PillSelect (Radix-based).
// MFLabeledPillSearchSelect is kept as a full custom component
// since it has search/filter functionality not in the base select.

import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { PillSelect } from '../ui/select'

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

// Named export: search-capable select (kept custom)
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
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
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
    setIsDropdownClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsDropdownClosing(false);
      setSearchTerm('');
    }, 120);
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

  return (
    <Fragment>
      <div ref={dropdownRef} className="relative">
        <fieldset
          className={`relative rounded-xl border transition-all duration-150 ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'} px-4 py-3 bg-white`}
        >
          <legend className={`px-2 text-[13px] font-medium text-[#454745] leading-none ${labelClass}`}>{label}</legend>
          <div
            className={`w-full cursor-pointer bg-transparent outline-none pr-8 text-[#101828] text-[16px] ${valueClass} ${className} flex items-center justify-between`}
            onClick={() => isOpen ? closeDropdown() : setIsOpen(true)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2">
              {selectedOption?.logoUrl && (
                <img src={selectedOption.logoUrl} alt="" className="w-5 h-5 rounded-full object-contain" />
              )}
              <span className={!displayValue ? 'text-[#9A9A9A]' : ''}>{displayValue || placeholder}</span>
            </div>
            <div className="flex items-center gap-2">
              {displayValue && (
                <X className="w-4 h-4 text-[#9A9A9A] hover:text-[#101828] transition-colors" onClick={clearSelection} />
              )}
              <ChevronDown className={`w-5 h-5 text-[#9A9A9A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </fieldset>

        {(isOpen || isDropdownClosing) && (
          <div className={`absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[300px] overflow-hidden ${isDropdownClosing ? 'animate-modal-content-out' : 'animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150'}`}>
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
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-[13px] transition-all"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[240px]" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-2.5 cursor-pointer text-[13px] transition-colors rounded-lg mx-1 my-0.5 flex items-center gap-3 ${
                      opt.value === selectedItem ? 'bg-blue-50 text-blue-900 font-medium' : 'text-gray-900 hover:bg-gray-50'
                    } ${index === highlightedIndex ? 'bg-gray-50' : ''}`}
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
                <div className="px-4 py-8 text-center text-[13px] text-[#9A9A9A]">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};
