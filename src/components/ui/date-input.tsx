import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DateInputProps {
  value: Date | undefined
  onChange: (date: Date) => void
  placeholder?: string
  className?: string
  label?: string
}

const DateInput = ({ value, onChange, placeholder = 'Pick a date', className, label }: DateInputProps) => {
  const ref = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] font-medium text-[#454745]">{label}</span>}
      <div className="relative">
        {!value && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-[13px] pointer-events-none z-10">
            {placeholder}
          </span>
        )}
        <input
          ref={ref}
          type="date"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            if (e.target.value) onChange(new Date(e.target.value))
          }}
          className={cn(
            'w-full border border-[#E4E7EC] rounded-xl px-4 py-2.5 pr-10',
            'text-[13px] text-[#101828] bg-white',
            'outline-none transition-all duration-150',
            'focus:border-[#948EEE] focus:shadow-[0_0_0_3px_rgba(211,212,248,0.5)]',
            !value && '[color-scheme:light] [&::-webkit-datetime-edit]:opacity-0',
            '[&::-webkit-calendar-picker-indicator]:hidden',
            className,
          )}
        />
        <button
          type="button"
          onClick={() => {
            if (ref.current?.showPicker) ref.current.showPicker()
            else ref.current?.focus()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#03034D] transition-colors"
          aria-label="Open date picker"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export { DateInput }
