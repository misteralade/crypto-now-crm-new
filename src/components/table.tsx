import { useState, type ChangeEvent, type FC, type ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import {LoadingSpinner} from "./global/LoadingSpinner";
import type {UserStatusVariant} from "../types/global.types.ts";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface TableColumn<T = any> {
  key: string
  header: any
  render?: (value: any, row: T) => ReactNode
  className?: string
  headerClassName?: string
}

export interface TableProps<T = any> {
  data: Array<T>
  columns: Array<TableColumn<T>>
  className?: string
  tableClassName?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelectionChange?: (selectedRowIndexes: Array<number>) => void
  renderCheckbox?: (opts: {
    checked: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    index?: number
  }) => ReactNode
  emptyIllustrationSrc?: string
  emptyTitle?: string
  emptySubtitle?: string
  theadClassName?: string
  headerRowClassName?: string
  headerCellClassName?: string
  bodyClassName?: string
  rowClassName?: string
  loading?: boolean;
  cellClassNameResolver?: (args: {
    columnKey: string
    row: T
    index: number
  }) => string
}

type StatusVariant =
  | 'completed'
  | 'pending'
  | 'error'
  | 'processing'
  | 'expired'
  | 'failed'

// ============================================================================
// Utility Functions
// ============================================================================

export const mapTransactionStatus = (
  status: string,
): { displayText: string; variant: StatusVariant } => {
  const statusMap: Record<
    string,
    { displayText: string; variant: StatusVariant }
  > = {
    PAYMENT_ACCOUNT_CONFIRMED: {
      displayText: 'Processing',
      variant: 'processing',
    },
    AWAITING_PAYMENT: { displayText: 'Pending', variant: 'pending' },
    COMPLETED: { displayText: 'Completed', variant: 'completed' },
    INITIATED: { displayText: 'Pending', variant: 'pending' },
    FAILED: { displayText: 'Failed', variant: 'failed' },
    EXPIRED: { displayText: 'Expired', variant: 'expired' },
    ERROR: { displayText: 'Error', variant: 'error' },
  }

  return statusMap[status] || { displayText: status, variant: 'pending' }
}

// ============================================================================
// Main Table Component
// ============================================================================

export default function Table<T = any>({
  data,
  columns,
  className = '',
  tableClassName = '',
  emptyMessage = 'No data available',
  onRowClick,
  selectable = false,
  onSelectionChange,
  renderCheckbox,
  emptyIllustrationSrc,
  emptyTitle,
  emptySubtitle,
  loading,
  theadClassName = 'bg-gray-50 border-b border-gray-200',
  headerRowClassName = '',
  headerCellClassName = '',
  bodyClassName = 'divide-y divide-gray-200',
  rowClassName = '',
  cellClassNameResolver,
}: TableProps<T>) {
  const [selectedIndexes, setSelectedIndexes] = useState<Array<number>>([])

  const toggleAll = () => {
    const all: Array<number> =
      selectedIndexes.length === data.length ? [] : data.map((_, i) => i)
    setSelectedIndexes(all)
    onSelectionChange?.(all)
  }

  const toggleOne = (index: number) => {
    setSelectedIndexes((prev) => {
      const exists = prev.includes(index)
      const next = exists ? prev.filter((i) => i !== index) : [...prev, index]
      onSelectionChange?.(next)
      return next
    })
  }

  // ========================================================================
  // Render Loading Spinner - Show the table headers
  // ========================================================================
  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 min-h-[40vh] flex items-center justify-center`}
      >
        <LoadingSpinner size="lg" message="Loading Table Data..." />
      </div>
    )
  }

  // ========================================================================
  // Render Empty State
  // ========================================================================

  if (data.length === 0) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      >
        <div className="p-12 text-center">
          {emptyIllustrationSrc ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={emptyIllustrationSrc}
                alt="Empty state"
                className="w-48 h-48 object-contain"
              />
              {emptyTitle && (
                <p className="text-gray-900 text-lg font-medium">
                  {emptyTitle}
                </p>
              )}
              {emptySubtitle ? (
                <p className="text-gray-500 text-sm">{emptySubtitle}</p>
              ) : (
                <p className="text-gray-500 text-sm">{emptyMessage}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    )
  }



  // ========================================================================
  // Render Table
  // ========================================================================

  return (
    <div className={`bg-white ${className}`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${tableClassName}`}>
          <thead className={theadClassName}>
            <tr className={headerRowClassName}>
              {selectable ? (
                <th className="px-6 py-4">
                  {renderCheckbox ? (
                    renderCheckbox({
                      checked:
                        selectedIndexes.length === data.length &&
                        data.length > 0,
                      onChange: toggleAll,
                    })
                  ) : (
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={
                        selectedIndexes.length === data.length &&
                        data.length > 0
                      }
                      onChange={toggleAll}
                    />
                  )}
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-500 ${headerCellClassName} ${column.headerClassName || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName}`}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    {renderCheckbox ? (
                      renderCheckbox({
                        checked: selectedIndexes.includes(index),
                        index,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          e.stopPropagation()
                          toggleOne(index)
                        },
                      })
                    ) : (
                      <input
                        type="checkbox"
                        aria-label={`Select row ${index + 1}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedIndexes.includes(index)}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleOne(index)
                        }}
                      />
                    )}
                  </td>
                )}
                {columns.map((column) => {
                  const value = (row as any)[column.key]
                  const defaultTextClass = column.className
                    ? column.className
                    : ['type', 'amount', 'date'].includes(column.key)
                      ? '!text-[#667085]'
                      : ''
                  const resolvedCellClass = cellClassNameResolver
                    ? cellClassNameResolver({
                        columnKey: column.key,
                        row,
                        index,
                      })
                    : ''
                  return (
                    <td
                      key={column.key}
                      className={`px-4 py-5 text-sm ${defaultTextClass} ${resolvedCellClass}`}
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

export const TableLink: FC<{
  href?: string
  children: ReactNode
  onClick?: () => void
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-1 text-gray-900 transition-colors font-medium"
  >
    <span>{children}</span>
    <ExternalLink size={14} className="text-gray-400" />
  </button>
)

export const TableAmount: FC<{
  amount: string | number
  currency?: string
}> = ({ amount, currency = '₦' }) => (
  <span className="font-medium text-[#667085]">
    {currency}
    {typeof amount === 'number' ? amount.toLocaleString() : amount}
  </span>
)

export const TableDate: FC<{
  date: string | Date
}> = ({ date }) => {
  const formatDate = (input: string | Date) => {
    const d = new Date(input)
    return d
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', ' -')
  }

  return <span className="text-[#667085]">{formatDate(date)}</span>
}

export const TableStatus: FC<{
  status: string
  variant?: StatusVariant
}> = ({ status, variant = 'pending' }) => {
  const variants: Record<StatusVariant, string> = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-[#FDF2E7] text-[#F2994A]',
    error: 'bg-red-100 text-red-700',
    processing: 'bg-[#E3EEFD] text-[#2F80ED]',
    expired: 'bg-[#F2F4F7] text-[#364254]',
    failed: 'bg-[#FDF1F1] text-[#EB5757]',
  }

  const dotColors: Record<StatusVariant, string> = {
    completed: 'bg-green-500',
    pending: 'bg-[#F2994A]',
    error: 'bg-red-500',
    processing: 'bg-[#2F80ED]',
    expired: 'bg-[#364254]',
    failed: 'bg-[#EB5757]',
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColors[variant]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export const UserStatusBadge: FC<{
  status: UserStatusVariant
}> = ({ status }) => {
  const variants: Record<UserStatusVariant, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-[#FDF2E7] text-[#F2994A]',
    SUSPENDED: 'bg-[#FEF3C7] text-[#B45309]', // yellowish orange tone
    BANNED: 'bg-red-100 text-red-700',
    DELETED: 'bg-gray-100 text-gray-600',
  }

  const dotColors: Record<UserStatusVariant, string> = {
    ACTIVE: 'bg-green-500',
    PENDING: 'bg-[#F2994A]',
    SUSPENDED: 'bg-yellow-500',
    BANNED: 'bg-red-500',
    DELETED: 'bg-gray-400',
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full ${variants[status]}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColors[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}
