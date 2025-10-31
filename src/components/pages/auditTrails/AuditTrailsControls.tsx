interface AuditTrailsControlsProps {
  onOpenFilter: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const AuditTrailsControls = ({ onOpenFilter }: AuditTrailsControlsProps) => {
  return (
    <div className="bg-white p-2 mt-5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: search + filter */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            {/*<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />*/}
            {/*<input*/}
            {/*  type="text"*/}
            {/*  placeholder="Search Audit Trail"*/}
            {/*  value={searchValue}*/}
            {/*  onChange={(e) => onSearchChange(e.target.value)}*/}
            {/*  className="w-full md:w-[280px] pl-10 pr-4 h-[44px] border border-[#D9D9D9] rounded-[100px] focus:ring focus:ring-purple-500 focus:border-transparent outline-none"*/}
            {/*/>*/}
          </div>
          <button
            onClick={onOpenFilter}
            className="inline-flex cursor-pointer hover:border-[#03034D] items-center justify-center gap-2 h-10 px-4 border border-[#D9D9D9] rounded-full transition-colors"
          >
            <img src="/icons/Filter.svg" alt="Filter" className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#454745]">Filter</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditTrailsControls;
