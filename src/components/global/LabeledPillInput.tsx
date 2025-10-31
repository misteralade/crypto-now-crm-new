import type  {InputHTMLAttributes} from 'react'

interface MFLabeledPillInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  valueClass?: string
  labelClass?: string
}

export default function MFLabeledPillInput({
  label,
  className = '',
  valueClass = 'text-[18px]',
  labelClass = 'text-[14px] font-medium leading-[24px] text-[#454745]',
  ...props
}: MFLabeledPillInputProps) {
  return (
    <fieldset className="rounded-full border-[1.5px] border-[#E4E7EC] px-[16px] py-[12px]">
      <legend className={`px-3 font-medium ${labelClass}`}>{label}</legend>
      <input
        {...props}
        className={`w-full bg-transparent outline-none text-[#101828] placeholder:text-[#98A2B3] ${valueClass} ${className}`}
      />
    </fieldset>
  )
}
