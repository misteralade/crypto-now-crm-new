import * as React from 'react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5 mb-5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-600 ml-1">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'flex min-h-[100px] w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900',
            'placeholder:text-gray-400 resize-none outline-none transition-all duration-200',
            'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className,
          )}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[12px] text-red-500 ml-2 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

/** Floating-label pill variant — Refined version matching the new design system */
export interface PillTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const PillTextarea = React.forwardRef<HTMLTextAreaElement, PillTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const [isFocused, setIsFocused] = React.useState(false)

    const hasValue = props.value !== undefined && props.value !== null && String(props.value).length > 0
    const hasDefaultValue = props.defaultValue !== undefined && props.defaultValue !== null && String(props.defaultValue).length > 0
    const hasPlaceholder = props.placeholder !== undefined && props.placeholder !== null && String(props.placeholder).length > 0
    const isLabelFloating = isFocused || hasValue || hasDefaultValue || hasPlaceholder

    return (
      <div className="flex flex-col gap-1 w-full mb-5">
        <div className="relative">
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-7 px-2 font-medium transition-all duration-200 pointer-events-none z-10 bg-white rounded-sm",
              isLabelFloating
                ? "-top-[9px] text-[12px] text-gray-600 scale-90 origin-left"
                : "top-5 text-sm text-gray-400",
              error && "text-red-500",
              isFocused && !error && "text-blue-600"
            )}
          >
            {label}
          </label>
          <textarea
            id={inputId}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            className={cn(
              'w-full min-h-[120px] bg-white border border-gray-300 rounded-[24px] px-8 transition-all duration-200 text-gray-900 text-base outline-none resize-none',
              'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10',
              'placeholder:text-gray-400',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              props.disabled && 'opacity-50 bg-gray-50',
              isLabelFloating ? 'pt-6 pb-2' : 'pt-5 pb-2',
              className,
            )}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[12px] text-red-500 ml-8 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
PillTextarea.displayName = 'PillTextarea'

export { Textarea, PillTextarea }
