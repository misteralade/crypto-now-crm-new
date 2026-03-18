import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] h-4 w-4 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        className={cn(
          'w-full pl-9 pr-4 h-10 border border-[#ECECEC] rounded-full bg-white',
          'outline-none transition-all duration-150',
          'focus:shadow-[0_0_0_3px_rgba(211,212,248,0.5)] focus:border-[#948EEE]',
          'text-[14px] text-[#0E0F0C] placeholder:text-[#9A9A9A]',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
