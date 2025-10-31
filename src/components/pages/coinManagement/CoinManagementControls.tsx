import { Search } from 'lucide-react'

interface ControlsProps {
  onAddCoin: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const CoinManagementControls = ({ onAddCoin, searchValue, onSearchChange }: ControlsProps) => {
  return (
    <div className="bg-white py-4 lg:py-5 mb-6 mt-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: search */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search coin"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-[280px] pl-10 pr-4 h-11 border border-[#D9D9D9] rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Right: add coin button */}
        <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <button
            onClick={onAddCoin}
            className="px-4 py-2 text-sm bg-[#03034D] text-white rounded-full hover:opacity-90 cursor-pointer"
          >
            Add new coin
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoinManagementControls;
