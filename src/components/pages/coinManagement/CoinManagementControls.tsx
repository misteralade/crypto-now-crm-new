import { SearchInput } from '../../ui/search-input'

interface ControlsProps {
  onAddCoin: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const CoinManagementControls = ({ onAddCoin, searchValue, onSearchChange }: ControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 mt-4 mb-2">
      {/* Left: search */}
      <SearchInput
        placeholder="Search coin..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        containerClassName="flex-1 sm:max-w-[280px]"
      />

      {/* Right: add coin button */}
      <button
        onClick={onAddCoin}
        className="px-5 py-2.5 text-[14px] font-medium bg-[#03034D] text-white rounded-full hover:bg-[#050568] active:scale-[0.98] transition-all cursor-pointer shadow-sm whitespace-nowrap"
      >
        + Add New Coin
      </button>
    </div>
  )
}

export default CoinManagementControls;
