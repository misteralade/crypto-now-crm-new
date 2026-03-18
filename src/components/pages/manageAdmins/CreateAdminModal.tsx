import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PillInput } from '../../ui/input'
import { LabeledSelect } from '../../ui/select'
import { Switch } from '../../ui/switch'
import type { RolesResponsePayload } from "../../../types/response.payload.types";
import type { CreateNewAdminRequestType } from "../../../schemas/admin.schema";

interface CreateAdminModalProps {
  open: boolean;
  roles: Array<RolesResponsePayload>;
  onClose: () => void;
  onCreate: () => void;
  handleCreateAdminFieldChange: (field: (keyof CreateNewAdminRequestType), value: any) => void;
}

const CreateAdminModal = ({ open, roles, onClose, onCreate, handleCreateAdminFieldChange }: CreateAdminModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  const rolesOptions = [
    { value: '', label: 'Select role' },
    ...roles.map((role: RolesResponsePayload) => ({ value: role.id, label: role.name })),
  ]

  return (
    <section className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className={`absolute inset-0 bg-black/30 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`} onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#ECECEC] max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#ECECEC]">
            <h2 className="text-[18px] font-semibold text-[#0E0F0C]">Create Admin</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5FF] transition-colors text-[#9A9A9A]">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <PillInput
              label="First Name"
              placeholder="e.g John"
              onChange={(e) => handleCreateAdminFieldChange("firstName", e.target.value)}
            />
            <PillInput
              label="Last Name"
              placeholder="e.g Doe"
              onChange={(e) => handleCreateAdminFieldChange("lastName", e.target.value)}
            />
            <PillInput
              label="Email"
              type="email"
              placeholder="example@email.com"
              onChange={(e) => handleCreateAdminFieldChange("email", e.target.value)}
            />
            <PillInput
              label="Username"
              type="text"
              placeholder="john_doe"
              onChange={(e) => handleCreateAdminFieldChange("username", e.target.value)}
            />
            <LabeledSelect
              label="Role"
              options={rolesOptions}
              onValueChange={(v) => handleCreateAdminFieldChange("roleId", v === '__empty__' ? '' : v)}
            />
            <div className="flex items-center">
              <Switch
                id="isActive"
                label="Enable Admin"
                defaultChecked
                onCheckedChange={(checked) => handleCreateAdminFieldChange("active", checked)}
              />
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#ECECEC] pt-4">
            <button
              className="text-[#03034D] font-medium text-[14px] px-6 py-2.5 rounded-full border border-[#ECECEC] hover:bg-[#F5F5FF] transition-colors w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-[#03034D] hover:bg-[#050568] active:scale-[0.98] text-white px-6 py-2.5 text-[14px] font-medium w-full sm:w-auto transition-all"
              onClick={onCreate}
            >
              Create Admin
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateAdminModal;
