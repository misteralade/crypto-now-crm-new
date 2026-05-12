import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '../../lib/utils.ts'

type BackButtonProps = {
  label?: string
  to?: string
  onClick?: () => void
  className?: string
}

const baseClassName =
  'inline-flex items-center gap-2 rounded-full border border-[#DDE0FF] bg-white px-4 py-2 text-sm font-semibold text-[#03034D] shadow-sm transition-colors hover:bg-[#F8F8FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#575AE5]/40'

export default function BackButton({
  label = 'Back',
  to,
  onClick,
  className,
}: BackButtonProps) {
  const content = (
    <>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </>
  )

  const finalClassName = cn(baseClassName, className)

  if (to) {
    return (
      <Link to={to} className={finalClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={finalClassName}>
      {content}
    </button>
  )
}
