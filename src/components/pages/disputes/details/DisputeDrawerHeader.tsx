import { X } from 'lucide-react'

interface DisputeDrawerHeaderProps {
  title: string
  onClose: () => void
}

export default function DisputeDrawerHeader({
  title,
  onClose,
}: DisputeDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-[#0E0F0C] font-semibold text-[18px]">
        {title}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="cursor-pointer hover:opacity-80"
      >
        <X size={20} />
      </button>
    </div>
  )
}
