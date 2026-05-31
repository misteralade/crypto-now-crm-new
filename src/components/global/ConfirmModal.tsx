import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ConfirmModalProps {
  open: boolean;
  actionType: 'delete' | 'proceed' | 'confirm';
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  confirmText?: string;
}

const ConfirmModal = ({ open, actionType, onClose, onConfirm, message = "Are you sure you want to proceed?", confirmText = "Confirm" }: ConfirmModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      if (!shouldRender) {
        setShouldRender(true)
      }
      if (isClosing) {
        setIsClosing(false)
      }
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

  if (!shouldRender) return null;

  const config = {
    delete: {
      icon: <Trash2 className="w-6 h-6 text-[#EB5757]" />,
      iconBg: 'bg-[#FEF2F2]',
      title: 'Confirm Delete',
      btnClass: 'bg-[#EB5757] hover:bg-red-600 text-white',
    },
    proceed: {
      icon: <AlertTriangle className="w-6 h-6 text-[#F2994A]" />,
      iconBg: 'bg-[#FFF7ED]',
      title: 'Confirm Action',
      btnClass: 'bg-[#03034D] hover:bg-[#050568] text-white',
    },
    confirm: {
      icon: <CheckCircle className="w-6 h-6 text-[#037847]" />,
      iconBg: 'bg-[#ECFDF3]',
      title: 'Confirm',
      btnClass: 'bg-[#037847] hover:bg-green-700 text-white',
    },
  }[actionType];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}>
      <div className={`bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
        <div className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}>
          {config.icon}
        </div>

        <h2 className="text-[18px] font-semibold text-[#0E0F0C] mb-2">{config.title}</h2>
        <p className="text-[14px] text-[#9A9A9A] mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 rounded-full text-[14px] font-medium border border-[#ECECEC] text-[#454745] hover:bg-[#F5F5FF] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors cursor-pointer ${config.btnClass}`}
          >
            {confirmText || 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
