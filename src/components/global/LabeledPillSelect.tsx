import {Fragment, type SelectHTMLAttributes, useEffect, useRef, useState} from 'react'
import {ChevronDown, Search, X} from 'lucide-react'

interface MFLabeledPillSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  valueClass?: string
  labelClass?: string
  options: Array<{ value: string; label: string }>
}

export default function MFLabeledPillSelect({
  label,
  className = '',
  valueClass = 'text-[18px] placeholder:text-[#9A9A9A]',
  labelClass = 'text-[14px] font-me  leading-[24px] text-[#454745]',
  options,
  ...props
}: MFLabeledPillSelectProps) {
  return (
    <fieldset className="relative rounded-full border-[1.5px] border-[#E4E7EC] px-[16px] py-[12px]">
      <legend className={`px-3 font-medium ${labelClass}`}>{label}</legend>
      <select
        {...props}
        className={`w-full cursor-pointer bg-transparent outline-none pr-8 text-[#101828] ${valueClass} ${className} appearance-none`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#9A9A9A]" />
    </fieldset>
  )
}

interface MFLabeledPillSearchSelectProps {
  options: Array<{ value: string; label: string }>;
  label: string;
  placeholder?: string;
  valueClass?: string;
  labelClass?: string;
  className?: string;
  onChange: (value: string) => void;
}

export const MFLabeledPillSearchSelect = ({ label, options, onChange, labelClass = '', valueClass = '', className = '', placeholder = 'Search...' }: MFLabeledPillSearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState('')
  const dropdownRef = useRef<any>(null);
  const searchInputRef = useRef<any>(null);
  
  // Filter options based on search term
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get selected option label
  const selectedOption = options.find(opt => opt.value === selectedItem);
  const displayValue = selectedOption ? selectedOption.label : '';
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: any) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };
  
  const handleSelect = (optionValue: string) => {
    setSelectedItem(optionValue);
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
  };
  
  const clearSelection = (e: any) => {
    e.stopPropagation();
    setSelectedItem('')
    onChange('');
  };
  
  return (
    <Fragment>
      <div ref={dropdownRef} className="relative">
        <fieldset className="relative rounded-full border-[1.5px] border-[#E4E7EC] px-[16px] py-[12px]">
          <legend className={`px-3 font-medium ${labelClass}`}>{label}</legend>
          
          <div
            className={`w-full cursor-pointer bg-transparent outline-none pr-8 text-[#101828] ${valueClass} ${className} flex items-center justify-between`}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className={!displayValue ? 'text-[#9A9A9A]' : ''}>
              {displayValue || placeholder}
            </span>
            <div className="flex items-center gap-2">
              {displayValue && (
                <X
                  className="w-[16px] h-[16px] text-[#9A9A9A] hover:text-[#101828] transition-colors"
                  onClick={clearSelection}
                />
              )}
              <ChevronDown
                className={`w-[20px] h-[20px] text-[#9A9A9A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </fieldset>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-[1.5px] border-[#E4E7EC] rounded-2xl shadow-lg max-h-[300px] overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-[#E4E7EC]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9A9A9A]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#E4E7EC] outline-none focus:border-[#101828] transition-colors"
                />
              </div>
            </div>
            
            {/* Options list */}
            <div className="overflow-y-auto max-h-[240px]" role="listbox">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      opt.value === selectedItem
                        ? 'bg-[#F9FAFB] text-[#101828] font-medium'
                        : 'hover:bg-[#F9FAFB]'
                    } ${
                      index === highlightedIndex ? 'bg-[#F3F4F6]' : ''
                    }`}
                    role="option"
                    aria-selected={opt.value === selectedItem}
                  >
                    {opt.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-[#9A9A9A]">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};