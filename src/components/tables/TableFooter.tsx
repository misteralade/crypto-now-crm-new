import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  maxVisible?: number;
}

const TableFooter = ({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange, maxVisible = 10 }: TableFooterProps) => {
  const getVisiblePages = () => {
    const pages = []

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageSizeChange = (value: string) => {
    const newSize = value === 'all' ? totalItems : Number(value)
    onPageSizeChange(newSize)
    onPageChange(1)
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-wrap items-center justify-between w-full mt-4 gap-3 px-1">
      {/* Left side - Items per page + count */}
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] text-[#9A9A9A]">Show</span>
        <Select value={pageSize === totalItems ? 'all' : String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-[72px] rounded-full border-[#ECECEC] text-[13px] text-[#454745] px-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[13px] text-[#9A9A9A]">
          Showing {startItem}–{endItem} of <span className="font-semibold text-[#454745]">{totalItems}</span>
        </span>
      </div>

      {/* Right side - Pagination */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
            currentPage === 1
              ? 'text-[#D1D5DB] cursor-not-allowed'
              : 'text-[#454745] hover:bg-[#F5F5FF] cursor-pointer'
          }`}
        >
          ← Prev
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`${index}-ellipsis`} className="px-1 text-[#9A9A9A] text-[13px]">···</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#03034D] text-white shadow-sm'
                    : 'text-[#9A9A9A] hover:bg-[#F5F5FF] hover:text-[#03034D]'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
            currentPage === totalPages
              ? 'text-[#D1D5DB] cursor-not-allowed'
              : 'text-[#454745] hover:bg-[#F5F5FF] cursor-pointer'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default TableFooter;