import React from "react";
import {Check} from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomCheckbox = ({ checked, onChange }: CustomCheckboxProps) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-checked={checked}
      />
      <span
        className={`flex items-center justify-center h-5 w-5 rounded-md border transition-colors ${
          checked ? 'bg-[#575AE5] border-[#575AE5]' : 'bg-white border-gray-300'
        }`}
        aria-hidden="true"
      >
        {checked ? <Check className="h-3 w-3 text-white" /> : null}
      </span>
    </label>
  )
}