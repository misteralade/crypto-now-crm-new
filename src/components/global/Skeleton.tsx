interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  height?: string
  width?: string
  delay?: number
}

export const Skeleton = ({ className = '', rounded = 'md', height = 'h-4', width = 'w-full', delay = 0 }: SkeletonProps) => {
  const roundedClass = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F0F0FF] via-[#E8E8F8] to-[#F0F0FF] bg-[length:200%_100%] ${roundedClass} ${height} ${width} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  )
}

export const SummaryCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-[#ECECEC]">
    <div className="flex items-start justify-between mb-3">
      <Skeleton height="h-3" width="w-24" rounded="full" />
      <Skeleton height="h-9" width="w-9" rounded="lg" />
    </div>
    <Skeleton height="h-8" width="w-36" rounded="full" className="mb-2" />
    <Skeleton height="h-3" width="w-20" rounded="full" />
  </div>
)

export default Skeleton
