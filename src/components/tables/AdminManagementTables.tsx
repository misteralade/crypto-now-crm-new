import {Fragment} from "react";
import {StatusColumn} from "./global";
import type {TableColumn} from "../table";
import momentClient from "../../util/moment";
import type {SearchAdminResponsePayload} from "../../types/response.payload.types.ts";

export const SearchAdminDataColumn = (
  handleUpdateAdminStatus: (id: string, status: boolean) => void,
  handleDeleteUser: (id: string) => void,
  currentAdminId?: string | null,
): Array<TableColumn> => [
  {
    key: 'id',
    header: 'Admin ID',
    render: (value) => (
      <span className="overflow-hidden text-[#101828] text-sm whitespace-nowrap text-ellipsis">
        {value}
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (value, row) => (
      <span className="overflow-hidden text-[#101828] text-sm whitespace-nowrap text-ellipsis">
        {value} {row.id === currentAdminId && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full ml-1 font-bold uppercase tracking-wider">You</span>}
      </span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (value) => (
      <span className="overflow-hidden text-[#101828] text-sm whitespace-nowrap text-ellipsis truncate block">
        {value}
      </span>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (value) => (
      <span className="overflow-hidden text-ellipsis truncate block text-[#667085] text-sm font-medium whitespace-nowrap">
        {value}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <StatusColumn status={String(value)} />
    ),
  },
  {
    key: 'date',
    header: 'Last Active',
    render: (value) => (
      <span className="overflow-hidden text-ellipsis truncate text-sm font-medium leading-tight text-[#667085] whitespace-nowrap">
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
      <div className="flex items-center justify-start gap-2 lg:gap-x-[16px] whitespace-nowrap">
        <button
          className={`px-2.5 md:px-3 py-1 rounded-full text-[11px] cursor-pointer hover:opacity-80 md:text-xs font-medium ${row.status === true ? 'bg-[#FCE8E8] text-[#EB5757]' : 'bg-[#FDF2E7] text-[#F2994A]'} disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => handleUpdateAdminStatus(row.id, !row.status)}
          disabled={row.id === currentAdminId}
          title={row.id === currentAdminId ? "You cannot suspend yourself" : ""}
        >
          {row.status === true ? 'Suspend' : 'Unsuspend'}
        </button>
        
        <button
          className="px-3 py-1 font-medium text-[12px] bg-[#EF4444] text-white rounded-full hover:opacity-70 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleDeleteUser(row.id)}
          disabled={row.id === currentAdminId}
          title={row.id === currentAdminId ? "You cannot delete yourself" : ""}
        >
          Delete
        </button>
      </div>
    ),
  },
]

export const SearchAdminDataRow = (
  data: Array<SearchAdminResponsePayload> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }

  data.map((item: SearchAdminResponsePayload) => {
    rowItems.push({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      email: item.email,
      role: item.adminRoles[0].role.name,
      status: item.active,
      date: momentClient.formatToNormalisedDateAndTime(item.lastActive),
    })

    return
  })

  return rowItems
}