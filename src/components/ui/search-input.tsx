import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative w-full', containerClassName)}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] h-5 w-5 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        className={cn(
          'w-full pl-12 pr-4 h-12 border border-[#ECECEC] rounded-full bg-white transition-all duration-200',
          'outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm',
          'text-base text-[#0E0F0C] placeholder:text-[#9A9A9A]',
          className,
        )}
        {...props}
      />
    </motion.div>
  ),
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
