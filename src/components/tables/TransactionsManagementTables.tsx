import {ArrowUpRight, ChevronDown, ChevronRight, Download} from 'lucide-react'
import { Fragment } from 'react'
import { convertToMillify } from '../../util/index.util.ts'
import { CustomCheckbox } from '../global/CheckBoxes'
import CopyDetails, {ClickableDetails} from '../global/CopyDetails'
import momentClient from '../../util/moment'
import {
  TableAmount,
  TableDate,
  TableStatus,
  mapTransactionStatus,
} from '../table'
import type { TableColumn } from '../table'
import type {
  SearchTransactionsResponse,
  UsersWithTopTransactionVolume,
} from '../../types/response.payload.types'

// Dashboard Tables Start
export const UsersWithTopTransactionColumn = (
  handleViewTransaction: (sessionId: string) => void,
): Array<TableColumn> => [
  {
    key: 'user',
    header: 'User',
    className: 'font-medium text-gray-900',
  },
  {
    key: 'transactionId',
    header: 'Transaction ID',
    render: (value) => (
      <button className="flex items-center max-w-[300px] space-x-1 underline text-gray-900 hover:text-purple-600 transition-colors font-medium">
        <span className="overflow-hidden whitespace-nowrap text-ellipsis">
          {value}
        </span>
        <ArrowUpRight size={14} className="text-gray-400" />
      </button>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (value) => <TableAmount amount={value} />,
  },
  {
    key: 'date',
    header: 'Date',
    render: (value) => <TableDate date={value} />,
  },
  {
    key: 'action',
    header: 'Action',
    render: (_, row) => (
      <div className="flex items-center justify-start gap-2 lg:gap-x-[16px] whitespace-nowrap">
        <button
          className="px-2.5 md:px-3 py-1 rounded-full bg-[#E6E6FE] cursor-pointer hover:opacity-80 text-[#03034D] text-xs md:text-xs font-medium"
          onClick={() => handleViewTransaction(row.transactionId)}
        >
          View
        </button>
      </div>
    ),
  },
]

export const UsersWithTopTransactionDataRow = (
  data: Array<UsersWithTopTransactionVolume> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }

  data.map((item: UsersWithTopTransactionVolume) => {
    rowItems.push({
      user: `${item.userFirstName} ${item.userLastName}`,
      transactionId: item.sessionId,
      amount: convertToMillify(Number(item.amountFiat)),
      date: item.createdAt,
      status: item.status,
    })

    return
  })

  return rowItems
}
// Dashboard Tables End

// Start Transactions Management Tables
export const TransactionsManagementColumn = (
  handleSelectTransactionId: (transactionId: string) => void,
  handleSelectAllTransactionIds: () => void,
  handleSortBy: (columnKey: string) => void,
  handleShowTransactionDetails: (sessionId: string) => void,
  handleViewTransactionDetails: (sessionId: string) => void,
  selectedTransactionIds: Array<string>, // Add this to track selected state
  selectedIdCount: number,
): Array<TableColumn> => [
  {
    key: 'index',
    header: (
      <Fragment>
        <div className="py-3">
          <CustomCheckbox
            checked={selectedTransactionIds.length === selectedIdCount}
            onChange={handleSelectAllTransactionIds}
          />
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <Fragment>
        <div className="py-3">
          <CustomCheckbox
            checked={selectedTransactionIds.includes(row.id)}
            onChange={() => handleSelectTransactionId(row.id)}
          />
        </div>
      </Fragment>
    ),
  },
  {
    key: 'id',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Transaction ID</span>
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828]">
        <ClickableDetails text={value} className="!max-w-[200px]" onClick={handleViewTransactionDetails}/>
      </div>
    ),
  },
  {
    key: 'type',
    header: (
      <div
        onClick={() => handleSortBy('type')}
        className="py-3 text-left text-sm font-medium text-gray-500 hover:cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>Type</span>
          <ChevronDown className="text-gray-400" />
        </span>
      </div>
    ),
    render: (value) => <span className="py-3 text-sm text-[#667085]">{value}</span>,
  },
  {
    key: 'amount',
    header: (
      <div className="py-3 text-left text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span>Amount</span>
        </span>
      </div>
    ),
    render: (value) => (
      <span className="py-3 text-sm text-[14px] text-[#667085]">{value}</span>
    ),
  },
  {
    key: 'date',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Date</span>
            <ChevronDown
              className="text-gray-400"
              onClick={() => handleSortBy('createdAt')}
            />
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <Fragment>
        <span className="py-3 text-sm text-[14px] text-[#667085]">{value}</span>
      </Fragment>
    ),
  },
  {
    key: 'status',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Status</span>
            <ChevronDown
              className="text-gray-400"
              onClick={() => handleSortBy('status')}
            />
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => {
      const { displayText, variant } = mapTransactionStatus(value)
      return <TableStatus status={displayText} variant={variant} />
    },
  },
  {
    key: 'action',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2"></span>
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <Fragment>
        <button
          className="text-[#03034D] hover:opacity-80 text-[12px] cursor-pointer font-medium inline-flex items-center gap-1"
          onClick={() => handleShowTransactionDetails(row.id)}
        >
          <span>View Order</span>
          <span aria-hidden><ChevronRight size={16} /></span>
        </button>
      </Fragment>
    ),
  },
]

export const TransactionsManagementDataRow = (
  data: Array<SearchTransactionsResponse> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }

  data.map((item: SearchTransactionsResponse) => {
    rowItems.push({
      id: item.sessionId,
      type: `${item.type} ${item.cryptocurrency ? `- ${item.cryptocurrency.symbol}` : ''}`,
      amount: `$${convertToMillify(Number(item.usdAmount))}`,
      date: momentClient.formatToNormalisedDateAndTime(item.createdAt),
      status: item.status,
    })

    return
  })

  return rowItems
}
// End Transactions Management Tables

// Start User Details Transactions History Table
export const UserTransactionsManagementColumn = (
  handleViewTransaction: (sessionId: string) => void,
  onDownload: (id: string) => void,
): Array<TableColumn> => [
  {
    key: 'id',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Transaction ID</span>
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828]">
        <CopyDetails text={value} className="!max-w-[200px]" iconClassName='!h-8 !w-8'/>
      </div>
    ),
  },
  {
    key: 'date',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Date</span>
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <Fragment>
        <span className="py-3 text-sm text-[14px] text-[#667085]">{value}</span>
      </Fragment>
    ),
  },
  {
    key: 'type',
    header: (
      <div
        className="py-3 text-left text-sm font-medium text-gray-500 hover:cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>Type</span>
        </span>
      </div>
    ),
    render: (value) => <span className="py-3 text-sm text-[#667085]">{value}</span>,
  },
  {
    key: 'amount',
    header: (
      <div className="py-3 text-left text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span>Amount</span>
        </span>
      </div>
    ),
    render: (value) => (
      <span className="py-3 text-sm text-[14px] text-[#667085]">{value}</span>
    ),
  },
  {
    key: 'rate',
    header: (
      <div className="py-3 text-left text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span>Rate</span>
        </span>
      </div>
    ),
    render: (value) => (
      <span className="py-3 text-sm text-[14px] text-[#667085]">{value}</span>
    ),
  },
  {
    key: 'status',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Status</span>
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => {
      const { displayText, variant } = mapTransactionStatus(value)
      return <TableStatus status={displayText} variant={variant} />
    },
  },
  {
    key: 'action',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">Actions</span>
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <Fragment>
        <div className="px-4 justify-between min-w-[100px] items-center align-middle">
          <button
            aria-label="Download"
            className={`p-1 rounded cursor-pointer ${
              row.status === 'EXPIRED'
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-black/5'
            }`}
            disabled={row.status === 'EXPIRED'}
            onClick={() => onDownload?.(row.id)}
          >
            <Download size={20} fill={row.status === 'EXPIRED' ? '#98A2B3' : '#575AE5'}/>
          </button>
          
          <button
            className="ml-4 px-2.5 md:px-3 py-1 rounded-full bg-[#E6E6FE] cursor-pointer hover:opacity-80 text-[#03034D] text-xs md:text-xs font-medium"
            onClick={() => handleViewTransaction(row.id)}
          >
            View
          </button>
        </div>
      </Fragment>
    ),
  },
]

export const UserTransactionsManagementDataRow = (
  data: Array<SearchTransactionsResponse> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }

  data.map((item: SearchTransactionsResponse) => {
    rowItems.push({
      id: item.sessionId,
      date: momentClient.formatToNormalisedDateAndTime(item.createdAt),
      type: `${item.type} ${item.cryptocurrency ? `- ${item.cryptocurrency.symbol}` : ''}`,
      amount: `$${convertToMillify(Number(item.usdAmount))}`,
      rate: `${item.stableToFiatRate}`,
      status: item.status,
    })

    return
  })

  return rowItems
}
// End User Details Transactions History Table
