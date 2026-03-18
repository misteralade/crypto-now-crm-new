import { DateInput } from '../../ui/date-input'

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[442px] p-6 border border-[#ECECEC]">
        <h3 className="text-[13px] font-semibold text-[#667085] mb-4">Date Range</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <DateInput value={fromDate} onChange={handleFromDate} placeholder="From" />
          <DateInput value={toDate} onChange={handleToDate} placeholder="To" />
        </div>

        <div className="flex justify-end items-center gap-4">
          <button className="text-[13px] font-medium text-[#03034D] cursor-pointer hover:underline" onClick={onReset}>
            Reset filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationFilterModal;
