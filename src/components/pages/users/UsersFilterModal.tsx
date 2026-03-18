import { useEffect } from 'react'
import { X } from 'lucide-react'
import { userStatusOptions } from "../../../util/constants.util.ts"
import { DateInput } from '../../ui/date-input'
import { LabeledSelect } from '../../ui/select'
import { Checkbox } from '../../ui/checkbox'

export interface FilterModalProps {
  open: boolean
  createdAtFrom: Date | undefined
  createdAtTo: Date | undefined
  onClose: () => void
  onReset: () => void
  handleChangeCreatedAtFrom: (date: Date) => void
  handleChangeCreatedAtTo: (date: Date) => void
  handleStatusFilterChange: (status: string) => void
}

const UsersFilterModal = ({ open, createdAtFrom, createdAtTo, onClose, onReset, handleChangeCreatedAtFrom, handleChangeCreatedAtTo, handleStatusFilterChange }: FilterModalProps) => {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30 transition-opacity" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center">
        <div className="py-5 px-6 w-full max-w-[442px] rounded-2xl bg-white shadow-xl border border-[#ECECEC]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-semibold text-[#0E0F0C]">Filter Users</span>
            <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-[#F5F5FF] transition-colors text-[#9A9A9A]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-[#667085] mb-2.5 uppercase tracking-wide">Registration Date</p>
              <div className="grid grid-cols-2 gap-3">
                <DateInput value={createdAtFrom} onChange={handleChangeCreatedAtFrom} placeholder="From" />
                <DateInput value={createdAtTo} onChange={handleChangeCreatedAtTo} placeholder="To" />
              </div>
            </div>

            <LabeledSelect
              label="Account Status"
              options={userStatusOptions.map((s) => ({ value: s.value || '__empty__', label: s.label }))}
              onValueChange={(v) => handleStatusFilterChange(v === '__empty__' ? '' : v)}
            />

            <div>
              <p className="text-[12px] font-semibold text-[#667085] mb-2.5 uppercase tracking-wide">Disputes</p>
              <div className="flex items-center gap-3 rounded-xl bg-[#F5F5FF] px-4 py-3">
                <Checkbox id="has-dispute" label="Has active dispute" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="text-[13px] font-medium text-[#03034D] cursor-pointer hover:underline" onClick={() => { onReset(); onClose() }}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersFilterModal
