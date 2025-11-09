import {Fragment} from "react";
import {ClickableDetails} from "../global/CopyDetails.tsx";
import {ChevronDown, ChevronRight} from "lucide-react";
import {DisputeStatusBadge} from "../global/StatusBadge.tsx";
import type { TableColumn } from "../table.tsx";
import type {AdminSearchDisputes} from "../../types/response.payload.types.ts";
import {convertToMillify} from "../../util/index.util.ts";
import momentClient from "../../util/moment.ts";

export const DisputeManagementColumn = (
  handleViewDisputeDetails: (disputeId: string) => void,
  handleShowTransactionDetails: (sessionId: string) => void,
  handleSortBy: (columnKey: string) => void,
  handleNavigateToTransactionPage: (sessionId: string) => void,
): Array<TableColumn> => [
  {
    key: 'id',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2">
            <span>Dispute ID</span>
          </span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828]">
        <ClickableDetails text={value} className="!max-w-[200px]" onClick={handleViewDisputeDetails}/>
      </div>
    ),
  },
  {
    key: 'initiator',
    header: (
      <div
        className="py-3 text-left text-sm font-medium text-gray-500 hover:cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>User(Initiator)</span>
        </span>
      </div>
    ),
    render: (value) => <span className="py-3 text-sm text-[#667085]">{value}</span>,
  },
  {
    key: 'transactionId',
    header: (
      <div className="py-3 text-left text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span>Transaction ID</span>
        </span>
      </div>
    ),
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828]">
        <ClickableDetails text={value} className="!max-w-[200px]" onClick={handleNavigateToTransactionPage}/>
      </div>
    ),
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
      <span className="py-3 text-sm text-[14px] text-[#667085]">₦ {value}</span>
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
      return <DisputeStatusBadge status={value}/>
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
          onClick={() => handleShowTransactionDetails(row.transactionId)}
        >
          <span>View Order</span>
          <span aria-hidden><ChevronRight size={16} /></span>
        </button>
      </Fragment>
    ),
  },
]

export const DisputeManagementDataRow = (
  data: Array<AdminSearchDisputes> | undefined,
) => {
  const rowItems: Array<any> = []
  
  if (!data) {
    return rowItems
  }
  
  data.map((item: AdminSearchDisputes) => {
    rowItems.push({
      id: item.id,
      initiator: item?.creator ? `${item.creator.profile?.firstName} ${item.creator.profile?.lastName}` : 'Anonymous',
      transactionId: item.transaction.sessionId,
      amount: convertToMillify(Number(item.transaction.amountFiat)),
      date: momentClient.formatToNormalisedDateAndTime(item.createdAt),
      status: item.status,
    })
    
    return
  })
  
  return rowItems
}