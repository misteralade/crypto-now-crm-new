import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="flex items-center gap-2.5">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkId}
        className={cn(
          'peer h-5 w-5 shrink-0 rounded-md border border-[#E4E7EC] bg-white',
          'outline-none transition-all duration-150',
          'focus-visible:ring-2 focus-visible:ring-[#D3D4F8] focus-visible:border-[#948EEE]',
          'data-[state=checked]:bg-[#03034D] data-[state=checked]:border-[#03034D]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
          <Check className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={checkId}
          className="text-[14px] font-medium text-[#454745] cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
