import { Search } from 'lucide-react'

interface AdminsControlsProps {
  onOpenFilter: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onOpenCreateRole: () => void;
}

const AdminsControls = ({ onOpenFilter, searchValue, onSearchChange, onOpenCreate, onOpenCreateRole }: AdminsControlsProps) => {
  return (
    <div className="bg-white py-4 lg:py-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: search + filter */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] h-5 w-5" />
            <input
              type="text"
              placeholder="Search admins"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-[280px] pl-10 pr-4 h-10 border text-[#0E0F0C] placeholder:text-[#9A9A9A] border-[#D9D9D9] rounded-full focus:ring-2 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onOpenFilter}
            className="inline-flex cursor-pointer hover:border-[#03034D] items-center justify-center gap-2 h-10 px-4 border border-[#D9D9D9] rounded-full transition-colors"
          >
            <img src="/icons/Filter.svg" alt="Filter" className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#454745]">Filter</span>
          </button>
        </div>

        {/* Right: Create new dispute button */}
        <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-full bg-[#03034D] text-white text-sm hover:opacity-90 w-full md:w-auto cursor-pointer"
          >
            Add new admin
          </button>

          <button
            onClick={onOpenCreateRole}
            className="px-4 py-2 rounded-full bg-[#03034D] text-white text-sm hover:opacity-90 w-full md:w-auto cursor-pointer"
          >
            Add New Role
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminsControls;
