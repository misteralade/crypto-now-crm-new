import type { RolesResponsePayload } from '../../../types/response.payload.types'
import { DateInput } from '../../ui/date-input'
import { LabeledSelect } from '../../ui/select'

interface ManageAdminFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  fromDate: Date | undefined
  toDate: Date | undefined
  handleFromDate: (date: Date) => void
  handleToDate: (date: Date) => void
  roles: Array<RolesResponsePayload> | undefined | null;
  selectedRoleId: string;
  handleSelectedRole: (id: string) => void
}

const ManageAdminFilterModal = ({
  isOpen,
  onClose,
  onReset,
  fromDate,
  toDate,
  handleFromDate,
  handleToDate,
  roles,
  selectedRoleId,
  handleSelectedRole,
}: ManageAdminFilterModalProps) => {
  if (!isOpen) return null

  const roleOptions = [
    { value: '', label: 'All roles' },
    ...(roles?.map((r) => ({ value: r.id, label: r.name })) ?? []),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[442px] p-6 border border-[#ECECEC]">
        <h3 className="text-[13px] font-semibold text-[#667085] mb-4">Date Range</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <DateInput value={fromDate} onChange={handleFromDate} placeholder="From" />
          <DateInput value={toDate} onChange={handleToDate} placeholder="To" />
        </div>

        <LabeledSelect
          label="Role"
          value={selectedRoleId || ''}
          onValueChange={(v) => handleSelectedRole(v === '__empty__' ? '' : v)}
          options={roleOptions}
        />

        <div className="flex justify-end items-center gap-4 mt-6">
          <button className="text-[13px] font-medium text-[#03034D] cursor-pointer hover:underline" onClick={onReset}>
            Reset filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageAdminFilterModal;
