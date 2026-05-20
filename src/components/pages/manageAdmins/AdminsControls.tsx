import { SearchInput } from '../../ui/search-input'
import CustomButton from '../../global/Button'

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
            className="inline-flex cursor-pointer hover:border-[#948EEE] hover:bg-[#F5F5FF] items-center justify-center gap-2 h-12 px-5 border border-[#ECECEC] rounded-full transition-all bg-white shadow-sm active:scale-95"
          >
            <img src="/icons/Filter.svg" alt="Filter" className="w-4 h-4 opacity-70" />
            <span className="text-[14px] font-medium text-[#454745]">Filter</span>
          </button>
        </div>

        <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <CustomButton
            onClick={onOpenCreate}
            className="w-full md:w-auto h-12"
            buttonText="Add new admin"
          />
          <CustomButton
            variant="button"
            onClick={onOpenCreateRole}
            className="bg-white !text-[#03034D] border border-[#ECECEC] hover:bg-[#F5F5FF] w-full md:w-auto h-12 shadow-sm"
            buttonText="Add New Role"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminsControls;
