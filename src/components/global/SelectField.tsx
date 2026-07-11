import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  children,
  className = "",
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer transition-colors pr-10";

  const stateClasses = disabled
    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
    : error
    ? "border-red-500 text-gray-700"
    : "border-[#E9E7E2] text-gray-700";

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses}`}
        >
          {children}
        </select>
        {/* Custom Chevron Icon */}
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
