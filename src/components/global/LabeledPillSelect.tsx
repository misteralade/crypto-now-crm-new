import React from 'react'
import { ChevronDown } from 'lucide-react'

interface MFLabeledPillSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
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
