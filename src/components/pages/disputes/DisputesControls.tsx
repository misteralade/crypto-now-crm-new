import { Search } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import filterIcon from '../../../assets/icons/Filter.svg'

interface ControlsProps {
  onOpenFilter: () => void
  onCreateNewDispute: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const DisputesControls = ({ onOpenFilter, onCreateNewDispute, searchValue, onSearchChange }: ControlsProps) => {
  return (
    <div className="bg-white p-4 lg:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: search + filter */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search transaction"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-[280px] pl-10 pr-4 h-10 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={onOpenFilter}
            className="inline-flex cursor-pointer hover:border-[#03034D] items-center justify-center gap-2 h-10 px-4 border border-[#D9D9D9] rounded-full transition-colors"
          >
            <img src={filterIcon} alt="Filter" className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#454745]">Filter</span>
          </button>
        </div>

        {/* Right: Create new dispute button */}
        <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <button
            onClick={onCreateNewDispute}
            className="px-4 py-2 rounded-full bg-[#03034D] text-white text-sm hover:opacity-90 w-full md:w-auto"
          >
            Create new dispute
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisputesControls;
