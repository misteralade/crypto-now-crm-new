import {Fragment} from "react";
import momentClient from "../../util/moment";
import type {AdminSearchNotifications,} from "../../types/response.payload.types";
import type { TableColumn} from "../table";

export const NotificationsDataColumn = (
  viewTransactionDetails: (id: string) => void
): Array<TableColumn> => [
  {
    key: 'type',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500 w-[100px]">
          <span className="flex items-center gap-2">Performed By</span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <span className="overflow-hidden whitespace-nowrap text-ellipsis">
        {value}
      </span>
    ),
  },
  {
    key: 'message',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500 w-[300px]">
          <span className="flex items-center gap-2">Message</span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[500px]">
        {value}
      </div>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (value) => (
      <span className="overflow-hidden whitespace-nowrap">
        {value}
      </span>
    ),
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
            aria-label="View Transaction"
            className={`p-1 rounded cursor-pointer hover:bg-black/5`}
            onClick={() => viewTransactionDetails(row.sessionId)}
          >
            View Transaction
          </button>
        </div>
      </Fragment>
    ),
  },
]

export const NotificationsDataRow = (
  data: Array<AdminSearchNotifications> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }
  
  data.map((item: AdminSearchNotifications) => {
    rowItems.push({
      transactionId: item.transactionId,
      sessionId: item.transaction?.sessionId,
      type: item.adminUserId ? 'ADMIN' : item.userId ? 'USER' : 'ANONYMOUS',
      message: item.message,
      date: momentClient.formatToNormalisedDateAndTime(item.createdAt),
    })

    return
  })

  return rowItems
}