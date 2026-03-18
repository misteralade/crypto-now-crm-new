import { SearchInput } from '../../ui/search-input'

interface AdminsControlsProps {
  onOpenFilter: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onOpenCreateRole: () => void;
}

const AdminsControls = ({ onOpenFilter, searchValue, onSearchChange, onOpenCreate, onOpenCreateRole }: AdminsControlsProps) => {
  return (
    <div className="py-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex w-full lg:w-auto items-center gap-2">
          <SearchInput
            placeholder="Search admins"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            containerClassName="flex-1 lg:flex-none"
            className="md:w-[280px]"
          />
          <button
            onClick={onOpenFilter}
            className="inline-flex cursor-pointer hover:border-[#948EEE] hover:bg-[#F5F5FF] items-center justify-center gap-2 h-10 px-4 border border-[#ECECEC] rounded-full transition-colors bg-white"
          >
            <img src="/icons/Filter.svg" alt="Filter" className="w-4 h-4 opacity-70" />
            <span className="text-[14px] font-medium text-[#454745]">Filter</span>
          </button>
        </div>

        <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <button
            onClick={onOpenCreate}
            className="px-5 py-2.5 rounded-full bg-[#03034D] text-white text-[14px] font-medium hover:bg-[#050568] active:scale-[0.98] transition-all w-full md:w-auto cursor-pointer"
          >
            Add new admin
          </button>
          <button
            onClick={onOpenCreateRole}
            className="px-5 py-2.5 rounded-full bg-white border border-[#ECECEC] text-[#03034D] text-[14px] font-medium hover:bg-[#F5F5FF] transition-colors w-full md:w-auto cursor-pointer"
          >
            Add New Role
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminsControls;
