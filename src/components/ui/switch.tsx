import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../../lib/utils'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, id, ...props }, ref) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        id={switchId}
        ref={ref}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3D4F8] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=unchecked]:bg-gray-200',
          'data-[state=checked]:bg-[#03034D]',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm',
            'ring-0 transition-transform duration-200',
            'data-[state=unchecked]:translate-x-0',
            'data-[state=checked]:translate-x-5',
          )}
        />
      </SwitchPrimitive.Root>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={switchId}
              className="text-[15px] font-semibold text-[#454745] cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-[12px] text-[#9A9A9A]">{description}</span>
          )}
        </div>
      )}
    </div>
  )
})
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
