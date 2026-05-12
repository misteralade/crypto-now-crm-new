import { Fragment } from "react"
import { Link } from '@tanstack/react-router'
import {StatusColumn} from "./global";
import type {TableColumn} from "../table";
import momentClient from "../../util/moment";
import type {SearchAdminResponsePayload} from "../../types/response.payload.types.ts";
import { ROUTES } from "../../util/constants.util.ts";

type SearchAdminTableRow = {
  id: string
  name: string
  username: string
  email: string
  role: string
  status: boolean
  date: string
}

export const SearchAdminDataColumn = (
  handleUpdateAdminStatus: (id: string, status: boolean) => void,
  handleDeleteUser: (id: string) => void,
  currentAdminId?: string | null,
): Array<TableColumn> => [
  {
    key: 'id',
    header: 'Admin ID',
    render: (value) => (
      <span className="overflow-hidden text-sm whitespace-nowrap text-ellipsis tabular-nums text-[#101828]">
        {value}
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (value, row) => (
      <div className="min-w-0">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-[#101828]">
          {value}{' '}
          {row.id === currentAdminId && <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">You</span>}
        </p>
        <Link
          to={ROUTES.ADMIN_DETAILS.replace('$adminId', row.id)}
          className="mt-1 block text-sm font-medium text-[#03034D] hover:underline"
          onClick={(event) => event.stopPropagation()}
          title={`View ${row.username} details`}
        >
          @{row.username}
        </Link>
      </div>
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
      <span className="overflow-hidden truncate whitespace-nowrap text-sm font-medium leading-tight tabular-nums text-[#667085]">
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
          onClick={(event) => {
            event.stopPropagation()
            handleUpdateAdminStatus(row.id, !row.status)
          }}
          disabled={row.id === currentAdminId}
          title={row.id === currentAdminId ? "You cannot suspend yourself" : ""}
        >
          {row.status === true ? 'Suspend' : 'Unsuspend'}
        </button>
        
        <button
          className="px-3 py-1 font-medium text-[12px] bg-[#EF4444] text-white rounded-full hover:opacity-70 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(event) => {
            event.stopPropagation()
            handleDeleteUser(row.id)
          }}
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
  const rowItems: Array<SearchAdminTableRow> = []

  if (!data) {
    return rowItems
  }

  data.map((item: SearchAdminResponsePayload) => {
    rowItems.push({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      username: item.username,
      email: item.email,
      role: item.adminRoles[0]?.role?.name || 'N/A',
      status: item.active,
      date: momentClient.formatToNormalisedDateAndTime(item.lastActive),
    })

    return
  })

  return rowItems
}
