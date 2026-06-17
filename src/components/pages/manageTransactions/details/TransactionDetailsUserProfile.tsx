import {Fragment} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from '../../../../assets/img/logo.svg';
import {ClickableDetails} from "../../../global/CopyDetails.tsx";
import {ROUTES} from "../../../../util/constants.util.ts";

interface TransactionDetailsUserProfileProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

const TransactionDetailsUserProfile = ({ userId, firstName, lastName, email, phone, profileImageUrl }: TransactionDetailsUserProfileProps) => {
  const openCallLine = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_blank');
  }
  
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Profile</h2>
          
          <a
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            href={`${ROUTES.USERS}/${userId}`}
          >
            Transactions
          </a>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={profileImageUrl && profileImageUrl.trim() ? profileImageUrl : Logo}
            alt="User avatar"
            className="w-14 h-14 rounded-full shrink-0 object-cover"
            onError={(e) => {
              // Fallback to logo if image fails to load
              const target = e.target as HTMLImageElement;
              if (target.src !== Logo) {
                target.src = Logo;
              }
            }}
          />
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(firstName || lastName) && (
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {firstName} {lastName}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate" title={email}>{email}</p>
            </div>
            {phone && (
              <div className="col-span-1 sm:col-span-2">
                <p className="text-xs text-gray-500">Phone</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-gray-900">{phone}</p>
                  <ClickableDetails text={phone} onClick={openCallLine}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDetailsUserProfile;
