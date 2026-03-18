import { Fragment, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import MFLabeledPillInput from '../../global/LabeledPillInput'
import type {AdminPermissionResponsePayload} from "../../../types/response.payload.types";
import MFLabeledPillTextarea from "../../global/LabeledPillTextarea";

interface CreateAdminModalProps {
  open: boolean;
  permissions: Array<AdminPermissionResponsePayload>;
  selectedPermissions: Array<string>;
  onClose: () => void;
  onCreate: () => void;
  handleSelectPermission: (id: string) => void;
  handleRoleName: (value: string) => void;
  handleRoleDescription: (value: string) => void;
}

const CreateNewPermissionsModal = ({ open, permissions, selectedPermissions, onClose, onCreate, handleSelectPermission, handleRoleName, handleRoleDescription }: CreateAdminModalProps) => {
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

  const cleanUpPermission = (permission: string) => {
    return permission.toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  const permissionIsSelected = (permission: string): boolean => {
    return selectedPermissions.includes(permission);
  }

  return (
    <Fragment>
      <section
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`absolute py-[53px] inset-0 bg-black/20 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
          onClick={onClose}
        />

        <div className="absolute inset-0 grid place-items-center">
          <div className={`w-4xl bg-white rounded-2xl shadow-sm border px-4 py-4 border-[#ECECEC] max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
            <div className="px-6 pt-6 pb-2 flex items-start justify-between">
              <div className="flex-1 text-center text-[24px] leading-7 font-bold">
                Create Role
              </div>
              <button
                onClick={onClose}
                className="-mt-6 -mr-1 px-2 py-1 text-[#0E0F0C] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 space-y-[32px] mt-4">
              <MFLabeledPillInput
                label="Name"
                placeholder="Transaction Manager"
                onChange={(e) => handleRoleName(e.target.value)}
                valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
              />

              <MFLabeledPillTextarea
                label="Description"
                placeholder="Transaction Manager"
                rows={5}
                onChange={(e) => handleRoleDescription(e.target.value)}
                valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
              />

              <div className="pt-2">
                <div className="text-[#0E0F0C] md:text-lg font-semibold mb-8">
                  Assign Permission
                </div>
                <div className="mt-2 space-y-4 grid grid-cols-2 gap-x-8 gap-y-4 max-h-96 overflow-y-auto">
                  {permissions.map((permission: AdminPermissionResponsePayload, index: number) => (
                    <div key={`${permission.id}-${index}`} className="flex items-center justify-between">
                      <span className="text-[#0E0F0C] font-semibold md:text-md">{cleanUpPermission(permission.code)}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectPermission(permission.id)}
                        className={
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ' +
                          (permissionIsSelected(permission.id) ? 'bg-[#03034d6a]' : 'bg-[#556ff11e]')
                        }
                      >
                      <span
                        className={
                          'inline-block h-5 w-5 transform rounded-full transition-transform ' +
                          (permissionIsSelected(permission.id)
                            ? 'bg-[#03034D] translate-x-5'
                            : 'bg-[#BBC5CB] translate-x-1')
                        }
                      />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex mt-6 md:mt-[50px] flex-col md:flex-row items-center justify-center gap-6">
              <button
                className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-[#03034D] hover:bg-[#FF8B5A] text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
                onClick={onCreate}
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}


export default CreateNewPermissionsModal;