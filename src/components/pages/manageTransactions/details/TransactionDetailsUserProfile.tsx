import {Fragment} from "react";
import AvatarImage from '../../../../assets/img/avatar.webp';
import {ClickableDetails} from "../../../global/CopyDetails.tsx";

interface TransactionDetailsUserProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

const TransactionDetailsUserProfile = ({ firstName, lastName, email, phone, profileImageUrl }: TransactionDetailsUserProfileProps) => {
  const openCallLine = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_blank');
  }
  
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Profile</h2>
        <div className="space-y-4">
          <img
            src={profileImageUrl || AvatarImage}
            alt="User avatar"
            className="w-20 h-20 rounded-full mx-auto"
          />
          
          <div className="space-y-3">
            {(firstName || lastName) && (
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium text-gray-900">
                  {firstName} {lastName}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900 break-all">{email}</p>
            </div>
            {phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <ClickableDetails text={phone} onClick={openCallLine}/>
                <p className="text-base font-medium text-gray-900">{phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDetailsUserProfile;
