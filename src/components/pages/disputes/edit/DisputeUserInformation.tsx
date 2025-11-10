import {Fragment} from "react";
import TransactionDetailsUserProfile from "../../manageTransactions/details/TransactionDetailsUserProfile.tsx";
import TransactionDetailsPipeline from "../../manageTransactions/details/TransactionDetailsPipeline.tsx";

interface DisputeUserInformationProps {
  userId: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  profileImg: string | null;
  transactionCreatedAt: Date;
  transactionUpdatedAt: Date;
  transactionProcessedAt: Date | null;
  processorFirstName: string | null;
  processorLastName: string | null;
}

const DisputeUserInformation = ({ userId, firstName, lastName, email, phoneNumber, profileImg, transactionCreatedAt, transactionUpdatedAt, transactionProcessedAt, processorFirstName, processorLastName }: DisputeUserInformationProps) => {
  return (
    <Fragment>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Information
          </h2>
          
          {/* User Profile */}
          <div className="space-y-6">
            {userId && (
              <TransactionDetailsUserProfile
                userId={userId}
                firstName={firstName || ''}
                lastName={lastName || ''}
                email={email || ''}
                phone={phoneNumber || ''}
                profileImageUrl={profileImg || ''}
              />
            )}
            
            {/* Timeline */}
            <TransactionDetailsPipeline
              createdAt={transactionCreatedAt}
              updatedAt={transactionUpdatedAt}
              processedAt={transactionProcessedAt || undefined}
              processedByFirstName={processorFirstName || undefined}
              processedByLastName={processorLastName || undefined}
            />
            
            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-700 mb-3">
                Quick Actions
              </p>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  View All Transactions
                </button>
                <button className="w-full px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                  View All Disputes
                </button>
                <button className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default DisputeUserInformation;