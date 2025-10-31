import { useRef } from 'react'
import { Calendar } from 'lucide-react'

interface NotificationFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  fromDate: Date | undefined
  toDate: Date | undefined
  handleFromDate: (date: Date) => void
  handleToDate: (date: Date) => void
}

const NotificationFilterModal = ({
  isOpen,
  onClose,
  onReset,
  fromDate,
  toDate,
  handleFromDate,
  handleToDate,
}: NotificationFilterModalProps) => {
  if (!isOpen) return null

  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[442px] p-6">
        <style>
          {`
            .custom-date::-webkit-calendar-picker-indicator { display: none; }
            .custom-date::-webkit-datetime-edit { color: inherit; }
            .custom-date.empty::-webkit-datetime-edit { color: transparent; }
            .custom-date.empty { caret-color: transparent; }
          `}
        </style>

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

        <div className="flex justify-end items-center gap-4">
          <button
            className="text-sm text-[#03034D] cursor-pointer hover:text-[#03034D]"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationFilterModal;
