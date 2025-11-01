import { Fragment } from 'react'
import { convertToMillify } from '../../util/index.util.ts'
import CopyDetails from '../global/CopyDetails'
import momentClient from '../../util/moment'
import { UserStatusBadge } from '../table'
import type { AdminSearchUsersResponsePayload } from '../../types/response.payload.types'
import type {UserStatusVariant} from "../../types/global.types";
import type { TableColumn } from '../table'

// Start Admin View Users Table Columns
export const AdminSearchUserColumn = (
  handleViewUserDetails: (userId: string) => void,
  handleUpdateUserStatus: (userId: string, status: UserStatusVariant) => void,
  handleResetUserPassword: (userId: string) => void,
): Array<TableColumn> => [
  {
    key: 'id',
    header: 'User ID',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <div className="px-4 py-5 text-sm text-[14px] text-[#101828]">
          <CopyDetails text={value} className="font-medium text-gray-900 !w-[120px]" iconClassName="!h-8 !w-8" />
        </div>
      </Fragment>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (value, row) => (
      <Fragment>
        <div className="flex items-center justify-between space-x-3 w-[200px]">
          <div>
            <img
              src={row.imgUrl}
              alt={row.imgUrl}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>

          <div className="px-4 py-2 text-left text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#667085]">
                {value}
              </span>
            </span>
          </div>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'email',
    header: (
      <div className="py-3 text-left text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span>Email</span>
        </span>
      </div>
    ),
    render: (value) => (
      <div className="py-3 text-sm text-[14px] text-[#667085]">{value}</div>
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
    key: 'amount',
    header: 'Amount',
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828] w-[120px]">
        <span>₦ {convertToMillify(value, 3)}</span>
      </div>
    ),
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    render: (value) => (
      <div className="px-4 py-5 text-sm text-[14px] text-[#101828] w-[200px]">
        <span>{value ? momentClient.formatToNormalisedDateAndTime(value) : 'Not login'}</span>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    render: (_, row) => (
      <div className="flex items-center justify-start gap-2 lg:gap-x-[16px] whitespace-nowrap">
        <button
          className="px-2.5 md:px-3 py-1 rounded-full bg-[#E6E6FE] cursor-pointer hover:opacity-80 text-[#03034D] text-xs md:text-xs font-medium"
          onClick={() => handleViewUserDetails(row.id)}
        >
          View
        </button>
        <button
          className={`px-2.5 md:px-3 py-1 rounded-full text-[11px] cursor-pointer hover:opacity-80 md:text-xs font-medium ${row.status === 'Active' ? 'bg-[#FCE8E8] text-[#EB5757]' : 'bg-[#FDF2E7] text-[#F2994A]'}`}
          onClick={() => handleUpdateUserStatus(row.id, row.status.toLowerCase() === 'active' ? 'SUSPENDED' : 'ACTIVE')}
        >
          {row.status.toLowerCase() === 'active' ? 'Suspend' : 'Unsuspend'}
        </button>
        <button
          className="px-2.5 md:px-3 py-1 rounded-full bg-[#EAE9FC] cursor-pointer hover:opacity-80 text-[#948EEE] text-[11px] md:text-xs font-medium"
          onClick={() => handleResetUserPassword(row.id)}
        >
          Reset password
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
      amount: Number(item.totalVolume),
      lastLogin: item.user.lastLogin,
    })

    return
  })

  return rowItems
}
// End Admin View Users Table Columns