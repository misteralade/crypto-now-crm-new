interface ConfirmModalProps {
  open: boolean;
  actionType: 'delete' | 'proceed' | 'confirm';
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  confirmText?: string;
}

const ConfirmModal = ({ open, actionType, onClose, onConfirm, message = "Are you sure you want to proceed?", confirmText = "Confirm" }: ConfirmModalProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 text-center">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Confirm Action</h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-8">{message || 'Are you sure you want to proceed?'}</p>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-3 rounded-full font-medium border border-gray-300 text-gray-800 transition hover:bg-gray-100 hover:cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className={`w-full md:w-auto px-6 py-3 rounded-full font-semibold text-white transition ${actionType === 'delete' ? 'bg-[#EF4444]' : actionType === 'proceed' ? 'bg-[#3B82F6]' : 'bg-[#10B981]'} hover:bg-delete-dark hover:cursor-pointer`}
          >
            {confirmText || 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
