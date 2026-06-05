import { Download, Filter, RefreshCcw, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SearchInput } from '../../ui/search-input'
import { cn } from '../../../lib/utils'

interface ControlsProps {
  onOpenFilter: () => void
  searchValue: string
  onSearchChange: (value: string) => void;
  handleExportAll?: () => void;
  handleRefreshTransactions?: () => void;
  isFetchingTransactions?: boolean;
}

const ManageTransactionsControls = ({
  onOpenFilter,
  searchValue,
  onSearchChange,
  handleExportAll,
  handleRefreshTransactions,
  isFetchingTransactions,
}: ControlsProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    if (searchValue) {
      setIsMobileSearchOpen(true)
    }
  }, [searchValue])

  return (
    <div className="mt-4 mb-4 flex w-full items-center gap-2 sm:gap-3">
      <div className="hidden min-w-0 flex-1 sm:block">
        <SearchInput
          placeholder="Search transaction..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-full max-w-[420px]"
          className="w-full"
        />
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen((current) => !current)
          }}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ECECEC] bg-white text-[#454745] shadow-sm transition-all active:scale-95",
            isMobileSearchOpen && "border-[#948EEE] bg-[#F5F5FF] text-[#03034D]",
          )}
          aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
        >
          {isMobileSearchOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>

        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden transition-all duration-200 ease-out",
            isMobileSearchOpen
              ? "max-w-[220px] opacity-100"
              : "max-w-0 opacity-0 pointer-events-none",
          )}
        >
          <SearchInput
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            containerClassName="w-full"
            className="h-10 w-full text-[14px]"
          />
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          onClick={onOpenFilter}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white px-3 text-[13px] font-medium text-[#454745] shadow-sm transition-all hover:border-[#948EEE] hover:bg-[#F5F5FF] active:scale-95 sm:px-4 sm:text-[14px]"
        >
          <Filter className="h-4 w-4 text-[#454745] opacity-70" />
          <span>Filter</span>
        </button>

        {handleExportAll && (
          <button
            onClick={handleExportAll}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#03034D] px-3 text-[13px] font-medium text-white transition-colors hover:bg-[#050568] active:scale-95 sm:px-4 sm:text-[14px]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}

        {handleRefreshTransactions && (
          <button
            onClick={handleRefreshTransactions}
            disabled={!!isFetchingTransactions}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white px-3 text-[13px] font-medium text-[#03034D] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:text-[14px]"
            title="Refresh Transactions"
          >
            <RefreshCcw
              className={cn("h-4 w-4", isFetchingTransactions && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageTransactionsControls
