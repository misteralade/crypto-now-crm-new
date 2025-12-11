import { X } from 'lucide-react'
import MFLabeledPillInput from '../../global/LabeledPillInput'

interface EditUserModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  firstName: string
  lastName: string
  handleFieldChange: (field: 'firstName' | 'lastName', value: string) => void
  loading?: boolean
}

const EditUserModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  firstName, 
  lastName, 
  handleFieldChange,
  loading = false
}: EditUserModalProps) => {
  if (!open) return null

  const isDisabled = !firstName.trim() || !lastName.trim() || loading

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/30 transition-opacity opacity-100"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="w-full max-w-[464px] bg-white rounded-2xl shadow-sm border border-[#ECECEC]">
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div className="flex-1 text-center text-2xl font-medium">
              Edit User
            </div>
            <button
              onClick={onClose}
              className="-mt-6 -mr-1 px-2 py-1 text-[#0E0F0C] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-4 space-y-8 mt-8">
            <MFLabeledPillInput
              label="First Name"
              placeholder="e.g John"
              value={firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillInput
              label="Last Name"
              placeholder="e.g Doe"
              value={lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />
          </div>

          <div className="px-6 pb-6 flex mt-12 flex-col md:flex-row items-center justify-center gap-6">
            <button
              className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-12 py-4 text-lg font-semibold w-full md:w-fit cursor-pointer transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-[#03034D] text-white px-12 py-4 text-lg font-semibold w-full hover:bg-[#FF8B5A] hover:cursor-pointer md:w-fit transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
              onClick={onConfirm}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal;
