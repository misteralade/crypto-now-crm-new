import { useEffect, useRef } from 'react'
import { Calendar } from 'lucide-react'
import {userStatusOptions} from "../../../util/constants.util.ts";

export interface FilterModalProps {
  // 🧩 Values
  open: boolean;
  createdAtFrom: Date | undefined;
  createdAtTo: Date | undefined;

  // ⚙️ Functions
  onClose: () => void;
  onReset: () => void;
  handleChangeCreatedAtFrom: (date: Date) => void;
  handleChangeCreatedAtTo: (date: Date) => void;
  handleStatusFilterChange: (status: string) => void;
}

const UsersFilterModal = ({ open, createdAtFrom, createdAtTo, onClose, onReset, handleChangeCreatedAtFrom, handleChangeCreatedAtTo, handleStatusFilterChange }: FilterModalProps) => {
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50`} role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity opacity-100`}
        onClick={onClose}
      />

      <div
        className={`absolute inset-0 grid place-items-center transition-transform scale-100`}
      >
        <div className="py-4 px-6 w-full max-w-[442px] h-auto rounded-2xl bg-white shadow-sm border border-[#ECECEC] overflow-hidden">
          {/* hide native date placeholder text and calendar icon */}
          <style>
            {`
            .custom-date::-webkit-calendar-picker-indicator { display: none; }
            .custom-date::-webkit-datetime-edit { color: inherit; }
            .custom-date.empty::-webkit-datetime-edit { color: transparent; }
            .custom-date.empty { caret-color: transparent; }
            `}
          </style>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#667085]">
              Registration date
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[#101828] px-2 py-1 rounded hover:bg-[#F2F4F7]"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-[10px]">
            {/* From Date */}
            <div className="relative">
              {!createdAtFrom && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                From
              </span>
              )}
              <input
                ref={fromRef}
                type="date"
                value={createdAtFrom ? createdAtFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  handleChangeCreatedAtFrom(new Date(e.target.value))
                }}
                className={`custom-date ${!createdAtFrom ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
              />
              <button
                type="button"
                aria-label="Open from date picker"
                onClick={() => {
                  if (fromRef.current?.showPicker) fromRef.current.showPicker()
                  else fromRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>

            {/* To Date */}
            <div className="relative">
              {!createdAtTo && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                To
              </span>
              )}
              <input
                ref={toRef}
                type="date"
                value={createdAtTo ? createdAtTo.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  handleChangeCreatedAtTo(new Date(e.target.value))
                }}
                className={`custom-date ${!createdAtTo ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
              />
              <button
                type="button"
                aria-label="Open to date picker"
                onClick={() => {
                  if (toRef.current?.showPicker) toRef.current.showPicker()
                  else toRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-0">
            <div className="mt-6 text-sm font-semibold text-[#667085]">
              Filter by Account status
            </div>
            <div className="mt-2 flex items-center gap-[10px]">
              <select
                onChange={(e) => handleStatusFilterChange(e.target.value)
              }
                className="w-full border text-sm border-[#D9D9D9] rounded-full p-3 appearance-none"
              >
                {userStatusOptions.map((status, index) => (
                  <option
                    key={`${status.value}-${status.label}-${index}`}
                    value={status.value}
                    className="text-[#626262] text-center text-lg font-semibold"
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 text-sm font-semibold text-[#667085]">
              Filter by Dispute
            </div>
            <label className="mt-2 inline-flex items-center gap-3 rounded-full bg-[#EEF2F6] px-[20px] py-[10px]">
              <input
                type="checkbox"
                // checked={filters.hasDispute}
                // onChange={(e) =>
                //   setFilters((p) => ({ ...p, hasDispute: e.target.checked }))
                // }
              />
              <span className="text-[#364254] text-lg font-semibold">
                Has dispute
              </span>
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="text-[#03034D] font-semibold text-sm"
                onClick={() => {
                  onReset()
                  onClose()
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersFilterModal;
