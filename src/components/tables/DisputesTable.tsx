import {Fragment} from "react";
import CopyDetails, {ClickableDetails} from "../global/CopyDetails.tsx";
import { ChevronDown } from "lucide-react";
import {DisputeStatusBadge} from "../global/StatusBadge.tsx";
import type { TableColumn } from "../table.tsx";
import type {AdminSearchDisputes} from "../../types/response.payload.types.ts";
import {formatCompact} from "../../util/asset-precision";
import momentClient from "../../util/moment.ts";

export const DisputeManagementColumn = (
  handleViewDisputeDetails: (disputeId: string) => void,
  handleSortBy: (columnKey: string) => void,
  handleNavigateToTransactionPage: (sessionId: string) => void,
  handleNavigateToEditDisputePage: (disputeId: string) => void,
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
        <CopyDetails text={value} className="!max-w-[200px]" iconClassName="h-6 w-6"/>
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
        <ClickableDetails text={value} className="!max-w-[150px]" onClick={handleNavigateToTransactionPage}/>
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
        <div className="py-3 text-left text-sm font-medium !min-w-[150px] text-gray-500">
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
        <span className="py-3 text-sm text-[14px] text-[#667085] !min-w-[150px]">{value}</span>
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
          <span className="flex items-center gap-2">Action</span>
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <Fragment>
        <div className="flex items-center justify-start gap-2 lg:gap-x-[16px] whitespace-nowrap">
          <button
            className="px-2.5 md:px-3 py-1 rounded-full bg-[#E6E6FE] cursor-pointer hover:opacity-80 text-[#03034D] text-xs md:text-xs font-medium"
            onClick={() => handleViewDisputeDetails(row.id)}
          >
            View
          </button>
          
          <button
            className="px-2.5 md:px-3 py-1 rounded-full bg-[#03034D] cursor-pointer hover:opacity-80 text-white text-xs md:text-xs font-medium"
            onClick={() => handleNavigateToEditDisputePage(row.id)}
          >
            Edit
          </button>
        </div>
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
      amount: formatCompact(Number(item.transaction.amountFiatNGN), "NGN"),
      date: momentClient.formatToTransactionInitiationDate(item.createdAt),
      status: item.status,
    })
    
    return
  })
  
  return rowItems
}