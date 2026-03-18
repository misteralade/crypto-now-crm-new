import { SearchInput } from '../../ui/search-input'
import filterIcon from '../../../assets/icons/Filter.svg'

interface ControlsProps {
  onOpenFilter: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const DisputesControls = ({ onOpenFilter, searchValue, onSearchChange }: ControlsProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex w-full lg:w-auto items-center gap-2">
          <SearchInput
            placeholder="Search transaction"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            containerClassName="flex-1 lg:flex-none"
            className="md:w-[280px]"
          />
          <button
            onClick={onOpenFilter}
            className="inline-flex cursor-pointer hover:border-[#948EEE] hover:bg-[#F5F5FF] items-center justify-center gap-2 h-10 px-4 border border-[#ECECEC] rounded-full transition-colors bg-white"
          >
            <img src={filterIcon} alt="Filter" className="w-4 h-4 opacity-70" />
            <span className="text-[14px] font-medium text-[#454745]">Filter</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisputesControls;
