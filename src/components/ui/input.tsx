import * as React from 'react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, iconRight, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2 w-full mb-5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "ml-1 text-[13px] font-medium leading-none text-[#454745]",
              error && "text-red-500",
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={cn(
              'flex h-14 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-base text-gray-900 transition-all duration-200',
              'placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              icon && 'pl-11',
              iconRight && 'pr-11',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[12px] text-red-500 ml-1 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
Input.displayName = 'Input'

/** Floating-label pill variant — Refined version with improved vertical spacing */
export interface PillInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  iconRight?: React.ReactNode
}

const PillInput = React.forwardRef<HTMLInputElement, PillInputProps>(
  ({ label, error, iconRight, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2 w-full mb-5">
        <label
          htmlFor={inputId}
          className={cn(
            "ml-1 text-[13px] font-medium leading-none text-[#454745]",
            error && "text-red-500",
          )}
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            onFocus={(e) => {
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              props.onBlur?.(e)
            }}
            className={cn(
              'w-full h-14 bg-white border border-gray-300 rounded-full px-8 transition-all duration-200 text-gray-900 text-base outline-none',
              'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10',
              'placeholder:text-gray-400',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
              props.disabled && 'opacity-50 bg-gray-50',
              iconRight && 'pr-12',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[12px] text-red-500 ml-1 font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
PillInput.displayName = 'PillInput'

export { Input, PillInput }
