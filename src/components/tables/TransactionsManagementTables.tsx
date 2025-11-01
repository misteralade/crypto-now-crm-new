import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { convertToMillify } from '../../util'
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
export const UsersWithTopTransactionColumn: Array<TableColumn> = [
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
  onDownload?: (id: string) => void
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
        <CopyDetails text={value} className="!max-w-[200px]" iconClassName='!h-10 !w-10'/>
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
          <span className="flex items-center gap-2"></span>
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <Fragment>
        <div className="px-4 py-4 align-middle">
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
            <svg
              width="16"
              height="19"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.35714 0.642857C8.35714 0.472361 8.28941 0.308848 8.16885 0.188288C8.0483 0.0677293 7.88478 0 7.71429 0C7.54379 0 7.38028 0.0677293 7.25972 0.188288C7.13916 0.308848 7.07143 0.472361 7.07143 0.642857V13.2343L2.81143 8.97429C2.68956 8.86073 2.52838 8.79891 2.36184 8.80185C2.19529 8.80479 2.03639 8.87226 1.91861 8.99004C1.80083 9.10782 1.73336 9.26672 1.73042 9.43327C1.72748 9.59981 1.7893 9.76099 1.90286 9.88286L7.26 15.24C7.38054 15.3604 7.54393 15.428 7.71429 15.428C7.88464 15.428 8.04804 15.3604 8.16857 15.24L13.5257 9.88286C13.5889 9.824 13.6395 9.75303 13.6747 9.67418C13.7098 9.59532 13.7287 9.51019 13.7302 9.42388C13.7317 9.33756 13.7159 9.25182 13.6835 9.17177C13.6512 9.09173 13.6031 9.01901 13.542 8.95797C13.481 8.89692 13.4083 8.8488 13.3282 8.81647C13.2482 8.78413 13.1624 8.76826 13.0761 8.76978C12.9898 8.7713 12.9047 8.79019 12.8258 8.82533C12.747 8.86047 12.676 8.91113 12.6171 8.97429L8.35714 13.2343V0.642857ZM0.642857 17.5714C0.472361 17.5714 0.308848 17.6392 0.188288 17.7597C0.0677293 17.8803 0 18.0438 0 18.2143C0 18.3848 0.0677293 18.5483 0.188288 18.6689C0.308848 18.7894 0.472361 18.8571 0.642857 18.8571H14.7857C14.9562 18.8571 15.1197 18.7894 15.2403 18.6689C15.3608 18.5483 15.4286 18.3848 15.4286 18.2143C15.4286 18.0438 15.3608 17.8803 15.2403 17.7597C15.1197 17.6392 14.9562 17.5714 14.7857 17.5714H0.642857Z"
                fill={row.status === 'EXPIRED' ? '#98A2B3' : '#575AE5'}
              />
            </svg>
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
