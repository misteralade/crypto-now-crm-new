import {Fragment} from "react";
import momentClient from "../../util/moment";
import type {AuditLogResponsePayload} from "../../types/response.payload.types";
import type {TableColumn} from "../table";
import {AuditMessageUtil} from "../../util/audit-log-message-builder.util.ts";


export const SearchAuditLogDataColumn: Array<TableColumn> = [
  {
    key: 'loggedAt',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500 w-[150px]">
          <span className="flex items-center gap-2">TimeStamp</span>
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
    key: 'initiator',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500 w-[200px]">
          <span className="flex items-center gap-2">Initiator</span>
        </div>
      </Fragment>
    ),
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
        <div className="py-3 text-left text-sm font-medium text-gray-500 w-[300px]">
          <span className="flex items-center gap-2">Action</span>
        </div>
      </Fragment>
    ),
    render: (value) => (
      <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[500px]">
        {value}
      </div>
    ),
  },
]

export const SearchAuditLogDataRow = (data: Array<AuditLogResponsePayload>) => {
  const rowItems: Array<any> = [];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!data) {
    return rowItems;
  }

  data.map((item: AuditLogResponsePayload) => {
    rowItems.push({
      loggedAt: momentClient.formatToNormalisedDateAndTime(item.createdAt),
      initiator: (item.userType === 'ADMIN' && item.admin) ? item.admin.username : (item.userType === 'USER' && item.user) ? `${item.user.profile?.firstName} ${item.user.profile?.lastName}` : 'Anonymous user',
      action: AuditMessageUtil.withMessage(item).message
    });

    return;
  });

  return rowItems;
};