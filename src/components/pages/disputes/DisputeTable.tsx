import React from 'react'
import {ChevronDown} from "lucide-react";

export interface DisputeRow {
  id: string
  user: string
  transactionId: string
  amount: string
  date: string
  status: 'Open' | 'Under review' | 'Inactive' | 'Resolved'
}

interface Props {
  data: Array<DisputeRow>
  onRowClick?: (row: DisputeRow) => void
  onView?: (row: DisputeRow) => void
}

const StatusColumn: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open':
        return {
          bg: 'bg-[#FCE8E8]',
          dot: 'bg-[#EB5757]',
          text: 'text-[#EB5757]',
        }
      case 'Under review':
        return {
          bg: 'bg-[#FDF2E7]',
          dot: 'bg-[#F2994A]',
          text: 'text-[#F2994A]',
        }
      case 'Inactive':
        return {
          bg: 'bg-[#F2F4F7]',
          dot: 'bg-[#364254]',
          text: 'text-[#364254]',
        }
      case 'Resolved':
        return {
          bg: 'bg-[#ECFDF3]',
          dot: 'bg-[#037847]',
          text: 'text-[#037847]',
        }
      default:
        return {
          bg: 'bg-[#FEF3C7]',
          dot: 'bg-[#F59E0B]',
          text: 'text-[#92400E]',
        }
    }
  }

  const styles = getStatusStyles(status)

  return (
    <div
      className={`inline-flex items-center gap-2 ${styles.bg} rounded-full py-1 px-3`}
    >
      <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
      <span className={`text-xs font-medium ${styles.text}`}>{status}</span>
    </div>
  )
}

export default function DisputeTable({ data, onRowClick, onView }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-12 text-center">
          <p className="text-gray-500">No disputes available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Dispute ID
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    User(initiator)
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Transaction ID
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Amount
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Date
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Status
                  </span>
                  <ChevronDown className="text-gray-400" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-[12px] text-[#667085]">
                    Actions
                  </span>
                  <ChevronDown className="text-gray-400" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {data.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors ${onRowClick ? 'hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-4 py-5 text-[#101828] text-[14px]">
                  {row.id}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#101828]">
                  {row.user}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-2 justify-center xl:justify-start cursor-pointer">
                    <span className="text-[14px] text-[#101828] underline">
                      {row.transactionId}
                    </span>
                    <ChevronDown className="text-[#101828] -rotate-[130deg]" />
                  </div>
                </td>
                <td className="px-4 py-5 text-[14px] text-[#667085]">
                  {row.amount}
                </td>
                <td className="px-4 py-5 text-[14px] text-[#667085]">
                  {row.date}
                </td>
                <td className="px-4 py-5">
                  <StatusColumn status={row.status} />
                </td>
                <td className="px-4 py-5">
                  <button
                    className="text-[12px] bg-[#E6E6FE] px-[8px] cursor-pointer py-[2px] rounded-full text-[#03034D] font-medium hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView?.(row)
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
