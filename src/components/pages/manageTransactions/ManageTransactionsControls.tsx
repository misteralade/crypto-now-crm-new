import { Download, Filter } from 'lucide-react'
import { SearchInput } from '../../ui/search-input'

interface ControlsProps {
  onOpenFilter: () => void
  searchValue: string
  onSearchChange: (value: string) => void;
  handleExportAll?: () => void;
}

const ManageTransactionsControls = ({ onOpenFilter, searchValue, onSearchChange, handleExportAll }: ControlsProps) => {
  return (
    <div className="mt-4 mb-5 flex w-full flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <SearchInput
          placeholder="Search transaction..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-full"
          className="w-full md:max-w-[420px]"
        />

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            onClick={onOpenFilter}
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ECECEC] bg-white px-5 shadow-sm transition-all hover:border-[#948EEE] hover:bg-[#F5F5FF] active:scale-95"
          >
            <Filter className="h-4 w-4 text-[#454745] opacity-70" />
            <span className="text-[14px] font-medium text-[#454745]">Filter</span>
          </button>

          {handleExportAll && (
            <button
              onClick={handleExportAll}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#03034D] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#050568] active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageTransactionsControls;
