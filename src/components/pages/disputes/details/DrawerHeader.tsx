import { X } from 'lucide-react'

interface DrawerHeaderProps {
  title: string
  onClose: () => void
}

export default function DrawerHeader({ title, onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-[#0E0F0C] font-semibold hover:opacity-80 text-[18px]">
        {title}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="cursor-pointer hover:text-gray-700"
      >
        <X size={17} />
      </button>
    </div>
  )
}
