import { Fragment } from 'react'
import CopyDetails from '../global/CopyDetails'
import momentClient from '../../util/moment'
import { UserStatusBadge } from '../table'
import type { AdminSearchUsersResponsePayload } from '../../types/response.payload.types'
import type {UserStatusVariant} from "../../types/global.types";
import type { TableColumn } from '../table'

// Start Admin View Users Table Columns
export const AdminSearchUserColumn = (
  handleNavigateToUserDetails: (userId: string) => void,
  handleNavigateToTransactionHistory: (userId: string) => void,
  handleUpdateUserStatus: (userId: string, status: UserStatusVariant) => void,
  handleResetUserPassword: (userId: string) => void,
): Array<TableColumn> => [
  {
    key: 'id',
    header: 'User ID',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <div className="text-[12px] text-[#667085]">
          <CopyDetails text={value} className="font-medium !text-[#667085] !w-[120px]" iconClassName="!h-8 !w-8" />
        </div>
      </Fragment>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (value, row) => (
      <Fragment>
        <div className="flex items-center gap-3">
          <img
            src={row.imgUrl}
            alt={value}
            className="w-8 h-8 rounded-full object-cover border border-[#ECECEC]"
          />
          <span className="font-medium text-[13px] text-[#101828]">
            {value}
          </span>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (value) => (
      <div className="text-[13px] text-[#667085]">{value}</div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => {
      return <UserStatusBadge status={value as UserStatusVariant} />
    },
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    render: (value) => (
      <div className="text-[12px] text-[#667085] whitespace-nowrap">
        {value ? momentClient.formatToShortDateAndTime(value) : <span className="text-[#9A9A9A]">Never</span>}
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    render: (_, row) => (
      <div className="flex items-center justify-start gap-2 whitespace-nowrap">
        <button
          className="px-3 py-1.5 rounded-full bg-[#F5F5FF] cursor-pointer hover:bg-[#E6E6FE] text-[#03034D] text-[12px] font-medium transition-colors"
          onClick={(e) => { e.stopPropagation(); handleNavigateToUserDetails(row.id) }}
        >
          View
        </button>
        <button
          className="px-3 py-1.5 rounded-full bg-[#EFF6FF] cursor-pointer hover:bg-[#DBEAFE] text-[#2563EB] text-[12px] font-medium transition-colors"
          onClick={(e) => { e.stopPropagation(); handleNavigateToTransactionHistory(row.id) }}
        >
          Transactions
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-[12px] cursor-pointer hover:opacity-80 font-medium transition-all ${row.status === 'Active' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'}`}
          onClick={(e) => { e.stopPropagation(); handleUpdateUserStatus(row.id, row.status.toLowerCase() === 'active' ? 'SUSPENDED' : 'ACTIVE') }}
        >
          {row.status.toLowerCase() === 'active' ? 'Suspend' : 'Activate'}
        </button>
        <button
          className="px-3 py-1.5 rounded-full bg-[#F5F5FF] cursor-pointer hover:bg-[#EAE9FC] text-[#948EEE] text-[12px] font-medium transition-colors"
          onClick={(e) => { e.stopPropagation(); handleResetUserPassword(row.id) }}
        >
          Reset Password
        </button>
      </div>
    ),
  },
]

export const AdminSearchUserDataRow = (
  data: Array<AdminSearchUsersResponsePayload> | undefined,
) => {
  const rowItems: Array<any> = []

  if (!data) {
    return rowItems
  }

  data.map((item: AdminSearchUsersResponsePayload) => {
    rowItems.push({
      id: item.user.id,
      name: `${item.profile.firstName} ${item.profile.lastName}`,
      imgUrl: item.profile.profileImg,
      email: item.user.email,
      status: item.user.status,
      // amount: Number(item.totalVolume),
      lastLogin: item.user.lastLogin,
    })

    return
  })

  return rowItems
}
// End Admin View Users Table Columns