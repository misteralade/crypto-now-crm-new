import { UserStatusBadge } from '../../../table'
import momentClient from '../../../../util/moment'
import type { UserResponsePayload } from '../../../../types/response.payload.types'
import type { UserStatusVariant } from '../../../../types/global.types'

interface UserInformationSectionProps {
  user: UserResponsePayload | undefined
  onNavigateToTransactionHistory: () => void
  onUpdateUserStatus: (status: UserStatusVariant) => void
  onEditUser: () => void
  onResetPassword: () => void
}

const UserInformationSection = ({
  user,
  onNavigateToTransactionHistory,
  onUpdateUserStatus,
  onEditUser,
  onResetPassword,
}: UserInformationSectionProps) => {
console.log({
  user,
})

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#0E0F0C]">User Information</h2>
        <button
          onClick={onNavigateToTransactionHistory}
          className="px-4 py-2 rounded-full bg-[#03034D] text-white text-sm hover:opacity-90 cursor-pointer"
        >
          View Transaction History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div className="md:col-span-2 flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src={user?.profile?.profileImg || '/icons/default-avatar.svg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#0E0F0C]">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </h3>
            <p className="text-sm text-[#667085]">{user?.email}</p>
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            First Name
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.profile?.firstName || '—'}
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Last Name
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.profile?.lastName || '—'}
          </div>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Status
          </label>
          <div className="py-2">
            {user?.status ? (
              <UserStatusBadge status={user.status as UserStatusVariant} />
            ) : (
              <span className="text-sm text-[#667085]">—</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Email
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.email || '—'}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Phone Number
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.profile?.phoneNumber || '—'}
          </div>
        </div>

        {/* Is Verified */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Verified
          </label>
          <div className="py-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user?.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user?.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>

        {/* Last Login */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Last Login
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.lastLogin 
              ? momentClient.formatToNormalisedDateAndTime(user.lastLogin)
              : 'Never'}
          </div>
        </div>

        {/* Created At */}
        <div>
          <label className="block text-sm font-medium text-[#667085] mb-2">
            Created At
          </label>
          <div className="px-4 py-3 bg-[#F9FAFB] rounded-lg border border-[#D9D9D9] text-[#0E0F0C]">
            {user?.createdAt 
              ? momentClient.formatToNormalisedDateAndTime(user.createdAt)
              : '—'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 pt-6 border-t border-[#ECECEC]">
        <button
          onClick={() => onUpdateUserStatus(
            user?.status?.toLowerCase() === 'active' ? 'SUSPENDED' : 'ACTIVE'
          )}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 ${
            user?.status?.toLowerCase() === 'active' 
              ? 'bg-[#FCE8E8] text-[#EB5757]' 
              : 'bg-[#FDF2E7] text-[#F2994A]'
          }`}
        >
          {user?.status?.toLowerCase() === 'active' ? 'Suspend User' : 'Unsuspend User'}
        </button>
        <button
          onClick={onEditUser}
          className="px-4 py-2 rounded-full bg-[#E6F5FF] text-[#0066CC] text-sm font-medium cursor-pointer hover:opacity-80"
        >
          Edit User
        </button>
        <button
          onClick={onResetPassword}
          className="px-4 py-2 rounded-full bg-[#EAE9FC] text-[#948EEE] text-sm font-medium cursor-pointer hover:opacity-80"
        >
          Reset Password
        </button>
      </div>
    </div>
  )
}

export default UserInformationSection;
