import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-[#454745]">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-xl border border-[#E4E7EC] bg-white px-3 py-2.5 text-[14px] text-[#101828]',
            'placeholder:text-[#98A2B3] resize-none',
            'outline-none transition-all duration-150',
            'focus:border-[#948EEE] focus:shadow-[0_0_0_3px_rgba(211,212,248,0.5)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(254,202,202,0.5)]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500 ml-1">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

/** Floating-label pill variant — replaces MFLabeledPillTextarea */
export interface PillTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const PillTextarea = React.forwardRef<HTMLTextAreaElement, PillTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <fieldset
          className={cn(
            'rounded-xl border-[1.5px] border-[#E4E7EC] px-4 py-3 transition-all duration-150',
            'focus-within:border-[#948EEE] focus-within:shadow-[0_0_0_3px_rgba(211,212,248,0.5)]',
            error && 'border-red-400 focus-within:border-red-400 focus-within:shadow-[0_0_0_3px_rgba(254,202,202,0.5)]',
          )}
        >
          <legend className="px-2 text-[13px] font-medium text-[#454745] leading-none">
            {label}
          </legend>
          <textarea
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-transparent outline-none text-[#101828] text-[16px] resize-none',
              'placeholder:text-[#98A2B3]',
              className,
            )}
            {...props}
          />
        </fieldset>
        {error && <p className="text-[12px] text-red-500 ml-2">{error}</p>}
      </div>
    )
  },
)
PillTextarea.displayName = 'PillTextarea'

export { Textarea, PillTextarea }
