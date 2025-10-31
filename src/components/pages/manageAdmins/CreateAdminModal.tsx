import { X } from 'lucide-react'
import MFLabeledPillInput from '../../global/LabeledPillInput'
import MFLabeledPillSelect from '../../global/LabeledPillSelect'
import type {RolesResponsePayload} from "../../../types/response.payload.types";
import type {CreateNewAdminRequestType} from "../../../schemas/admin.schema";

interface CreateAdminModalProps {
  open: boolean;
  roles: Array<RolesResponsePayload>;
  onClose: () => void;
  onCreate: () => void;
  handleCreateAdminFieldChange: (field: (keyof CreateNewAdminRequestType), value: any) => void;
}

const CreateAdminModal = ({ open, roles, onClose, onCreate, handleCreateAdminFieldChange }: CreateAdminModalProps) => {
  if (!open) return null

  // Set the first item to be select roles
  const rolesOptions = [{
    value: '',
    label: 'Select role',
  }, ...roles.map((role: RolesResponsePayload) => ({
    value: role.id,
    label: role.name,
  }))]

  return (
    <section
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute py-[53px] inset-0 bg-black/20"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="w-4xl bg-white rounded-2xl shadow-sm border px-4 py-4 border-[#ECECEC] max-h-[90vh] overflow-y-auto">
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div className="flex-1 text-center text-[24px] leading-7 font-medium">
              Create admin
            </div>
            <button
              onClick={onClose}
              className="-mt-6 -mr-1 px-2 py-1 text-[#0E0F0C] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 space-y-[32px] mt-4 grid grid-cols-2 gap-x-8">
            <MFLabeledPillInput
              label="First Name"
              placeholder="e.g John"
              onChange={(e) => handleCreateAdminFieldChange("firstName", e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillInput
              label="Last Name"
              placeholder="e.g Doe"
              onChange={(e) => handleCreateAdminFieldChange("lastName", e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillInput
              label="Email"
              type="email"
              placeholder="example@email.com"
              onChange={(e) => handleCreateAdminFieldChange("email", e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillInput
              label="Username"
              type="text"
              placeholder="john_doe"
              onChange={(e) => handleCreateAdminFieldChange("username", e.target.value)}
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillSelect
              label="Role"
              onChange={(e) => handleCreateAdminFieldChange("roleId", e.target.value)}
              options={rolesOptions}
            />

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="isActive"
                  type="checkbox"
                  className="sr-only peer"
                  onChange={(e) => handleCreateAdminFieldChange("active", e.target.checked)}
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
              </label>
              <span className="text-[16px] font-semibold text-[#454745]">Enable Admin</span>
            </div>
          </div>

          <div className="px-6 pb-6 flex mt-6 md:mt-[50px] flex-col md:flex-row items-center justify-center gap-6">
            <button
              className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
              onClick={onClose}
            >
              Go back
            </button>
            <button
              className="rounded-full bg-[#03034D] hover:bg-[#FF8B5A] text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
              onClick={onCreate}
            >
              Create admin
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}


export default CreateAdminModal;