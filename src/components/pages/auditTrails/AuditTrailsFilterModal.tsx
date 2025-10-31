import { useRef } from 'react'
import { Calendar } from 'lucide-react'

// 🔧 Reusable select dropdown
function SelectInput<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { label: string; value: T }[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#667085] mb-2">{label}</h4>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full border text-sm border-[#D9D9D9] rounded-full p-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

interface AuditTrailsFilterModalProps {
  isOpen: boolean;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  selectedStatus: 'ALL' | 'SUCCESS' | 'FAILED';
  selectedDeviceType: 'ALL' | 'WEB' | 'MOBILE';
  selectedUserType: 'ALL' | 'ADMIN' | 'USER' | 'ANONYMOUS';
  onClose: () => void;
  onReset: () => void;
  handleFromDate: (date: Date) => void;
  handleToDate: (date: Date) => void;
  handleSelectedSuccess: (value: 'ALL' | 'SUCCESS' | 'FAILED') => void;
  handleSelectedUserType: (value: 'ALL' | 'ADMIN' | 'USER' | 'ANONYMOUS') => void;
  handleSelectedDeviceType: (value: 'ALL' | 'WEB' | 'MOBILE') => void;
}

export default function AuditTrailsFilterModal({
  isOpen,
  fromDate,
  toDate,
  selectedStatus,
  selectedDeviceType,
  selectedUserType,
  onClose,
  onReset,
  handleFromDate,
  handleToDate,
  handleSelectedSuccess,
  handleSelectedUserType,
  handleSelectedDeviceType,
}: AuditTrailsFilterModalProps) {
  if (!isOpen) return null

  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[440px] p-6">
        <style>{`
          .custom-date::-webkit-calendar-picker-indicator { display: none; }
          .custom-date::-webkit-datetime-edit { color: inherit; }
          .custom-date.empty::-webkit-datetime-edit { color: transparent; }
          .custom-date.empty { caret-color: transparent; }
        `}</style>

        {/* Date Range */}
        <h3 className="text-sm font-semibold text-[#667085] mb-4">
          Date Range
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* From Date */}
          <div className="relative">
            {!fromDate && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                From
              </span>
            )}
            <input
              ref={fromRef}
              type="date"
              value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                handleFromDate(new Date(e.target.value))
              }}
              className={`custom-date ${!fromDate ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
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
            {!toDate && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                To
              </span>
            )}
            <input
              ref={toRef}
              type="date"
              value={toDate ? toDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                handleToDate(new Date(e.target.value))
              }}
              className={`custom-date ${!toDate ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
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

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            label="Response Status"
            value={selectedStatus}
            options={[
              { label: 'All', value: "ALL" },
              { label: 'Success', value: "SUCCESS" },
              { label: 'Failed', value: "FAILED" },
            ]}
            onChange={handleSelectedSuccess}
          />

          <SelectInput
            label="Device Type"
            value={selectedDeviceType}
            options={[
              { label: 'All', value: "ALL" },
              { label: 'Web', value: 'WEB' },
              { label: 'Mobile', value: 'MOBILE' },
            ]}
            onChange={handleSelectedDeviceType}
          />

          <div className="col-span-2">
            <SelectInput
              label="User Type"
              value={selectedUserType}
              options={[
                { label: 'All', value: "ALL" },
                { label: 'Admin', value: 'ADMIN' },
                { label: 'User', value: 'USER' },
                { label: 'Anonymous', value: 'ANONYMOUS' },
              ]}
              onChange={handleSelectedUserType}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center mt-8 gap-4">
          <button
            onClick={onReset}
            className="text-sm font-semibold text-[#03034D] cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
