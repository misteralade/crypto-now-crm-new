import * as React from 'react'
import { cn } from '../../lib/utils'

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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900',
              'placeholder:text-gray-400',
              'outline-none transition-all duration-150',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              icon && 'pl-9',
              iconRight && 'pr-9',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="text-[12px] text-red-500 ml-1">{error}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

/** Floating-label pill variant — replaces MFLabeledPillInput */
export interface PillInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  iconRight?: React.ReactNode
}

const PillInput = React.forwardRef<HTMLInputElement, PillInputProps>(
  ({ label, error, iconRight, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <fieldset
          className={cn(
            'rounded-xl border border-gray-200 px-4 py-3 transition-all duration-150 bg-white',
            'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
            error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
            props.disabled && 'opacity-50 bg-gray-50',
          )}
        >
          <legend className="px-2 text-[13px] font-medium text-gray-600 leading-none">
            {label}
          </legend>
          <div className="relative">
            <input
              id={inputId}
              ref={ref}
              className={cn(
                'w-full bg-transparent outline-none text-gray-900 text-base',
                'placeholder:text-gray-400',
                iconRight && 'pr-7',
                className,
              )}
              {...props}
            />
            {iconRight && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
                {iconRight}
              </span>
            )}
          </div>
        </fieldset>
        {error && (
          <p className="text-[12px] text-red-500 ml-2">{error}</p>
        )}
      </div>
    )
  },
)
PillInput.displayName = 'PillInput'

export { Input, PillInput }
