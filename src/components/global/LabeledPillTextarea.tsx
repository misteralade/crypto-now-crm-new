import type { TextareaHTMLAttributes } from 'react'

interface MFLabeledPillTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  valueClass?: string
  labelClass?: string
}

const MFLabeledPillTextarea = ({
  label,
  className = '',
  valueClass = 'text-[18px]',
  labelClass = 'text-[14px] font-medium leading-[24px] text-[#454745]',
  rows = 3,
  ...props
}: MFLabeledPillTextareaProps) => {
  return (
    <fieldset className="rounded-2xl border-[1.5px] border-[#E4E7EC] px-[16px] py-[12px]">
      <legend className={`px-3 font-medium ${labelClass}`}>{label}</legend>
      <textarea
        {...props}
        rows={rows}
        className={`w-full resize-none bg-transparent outline-none text-[#101828] placeholder:text-[#98A2B3] ${valueClass} ${className}`}
      />
    </fieldset>
  )
}

export default MFLabeledPillTextarea;
