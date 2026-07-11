import { useEffect, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

const Modal = ({ open, onClose, title, description, children }: ModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      if (!shouldRender) setShouldRender(true)
      if (isClosing) setIsClosing(false)
      return
    }

    if (!shouldRender || isClosing) return

    setIsClosing(true)
    const timer = setTimeout(() => {
      setShouldRender(false)
      setIsClosing(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [open, shouldRender, isClosing])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}>
      <div className={`bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0E0F0C]">{title}</h2>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
