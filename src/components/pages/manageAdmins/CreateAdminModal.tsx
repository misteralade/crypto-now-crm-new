import { X } from 'lucide-react'
import { PillInput } from '../../ui/input'
import { LabeledSelect } from '../../ui/select'
import { Switch } from '../../ui/switch'
import type { RolesResponsePayload } from "../../../types/response.payload.types";
import type { CreateNewAdminRequestType } from "../../../schemas/admin.schema";
import { motion, AnimatePresence } from 'framer-motion'
import CustomButton from '../../global/Button'

interface CreateAdminModalProps {
  open: boolean;
  roles: Array<RolesResponsePayload>;
  onClose: () => void;
  onCreate: () => void;
  handleCreateAdminFieldChange: (field: (keyof CreateNewAdminRequestType), value: any) => void;
}

const CreateAdminModal = ({ open, roles, onClose, onCreate, handleCreateAdminFieldChange }: CreateAdminModalProps) => {
  const rolesOptions = [
    { value: '', label: 'Select role' },
    ...roles.map((role: RolesResponsePayload) => ({ value: role.id, label: role.name })),
  ]

  return (
    <AnimatePresence>
      {open && (
        <section className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
            onClick={onClose} 
          />

          <div className="absolute inset-0 grid place-items-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-[#ECECEC] max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-[#F2F4F7]">
                <h2 className="text-[22px] font-bold text-[#0E0F0C]">Create Admin</h2>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[#9A9A9A] hover:text-[#03034D]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-8 py-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
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
                <div className="flex items-center h-full pt-2">
                  <Switch
                    id="isActive"
                    label="Enable Admin"
                    defaultChecked
                    onCheckedChange={(checked) => handleCreateAdminFieldChange("active", checked)}
                  />
                </div>
              </div>

              <div className="px-8 pb-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-[#F2F4F7] pt-6">
                <CustomButton
                  variant="button"
                  className="bg-white !text-[#03034D] border border-[#ECECEC] hover:bg-gray-50 w-full sm:w-auto px-8"
                  onClick={onClose}
                  buttonText="Cancel"
                />
                <CustomButton
                  className="w-full sm:w-auto px-10"
                  onClick={onCreate}
                  buttonText="Create Admin"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </AnimatePresence>
  )
}

export default CreateAdminModal;
