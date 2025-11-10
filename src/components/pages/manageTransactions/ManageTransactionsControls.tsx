import { Search } from 'lucide-react'
import {useMatchRoute} from "@tanstack/react-router";
import {ROUTES} from "../../../util/constants.util.ts";

interface ControlsProps {
  onOpenFilter: () => void
  onApplyAction: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

const ManageTransactionsControls = ({ onOpenFilter, onApplyAction, searchValue, onSearchChange }: ControlsProps) => {
  const matchRoute = useMatchRoute()

  return (
    <div className="bg-white p-2 mt-5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: search + filter */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search transaction"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:w-[280px] pl-10 pr-4 h-[44px] border border-[#D9D9D9] rounded-[100px] focus:ring focus:ring-purple-500 focus:border-transparent outline-none"
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

        {/* Right: bulk action + apply */}
        {matchRoute({ to: ROUTES.TRANSACTIONS }) && (
          <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
          <span className="hidden md:inline text-sm text-gray-500">
            Bulk action:
          </span>
            <select className="h-10 border border-gray-200 rounded-full px-3 text-sm w-full md:w-auto">
              <option>Select option</option>
              <option>Export</option>
              <option>Delete</option>
            </select>
            <button
              onClick={onApplyAction}
              className="px-4 py-[10px] whitespace-nowrap bg-[#03034D] cursor-pointer text-white text-sm rounded-full hover:opacity-80 transition-colors w-full md:w-auto"
            >
              Apply action
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTransactionsControls;
