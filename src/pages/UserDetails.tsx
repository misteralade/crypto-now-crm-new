import { Fragment } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useUserDetailsPage } from "../hooks/pages/useUserDetailsPage";
import { LoadingSpinner } from "../components/global/LoadingSpinner";
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../util/constants.util.ts";
import EditUserModal from "../components/pages/users/EditUserModal.tsx";
import UserInformationSection from "../components/pages/users/details/UserInformationSection.tsx";
import BankDetailsSection from "../components/pages/users/details/BankDetailsSection.tsx";
import TransactionSummarySection from "../components/pages/users/details/TransactionSummarySection.tsx";

const UserDetails = () => {
  const navigate = useNavigate();
  const {
    // 🧩 Values
    userProfile,
    loadingUserProfile,
    userProfileSummary,
    loadingUserProfileSummary,

    // ⚙️ Functions
    handleNavigateToTransactionHistory,
    handleUpdateUserStatus,
    handleResetUserPassword,
    openEditModal,
    closeEditModal,
    handleUpdateUserProfile,
    isEditModalOpen,
    isUpdatingProfile,
    editModalInitialValues,
  } = useUserDetailsPage();

  const goBack = () => {
    navigate({ to: ROUTES.USERS })
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="User Details" />
        
        {(loadingUserProfile || loadingUserProfileSummary) ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <LoadingSpinner size="lg" message="Loading user details..." />
          </div>
        ) : (
          <Fragment>
            <div className="flex items-center justify-between w-full mt-10">
              <div className="text-lg text-[#858585] font-medium flex items-center gap-2">
                All Users / {userProfileSummary?.user?.profile?.firstName || userProfile?.profile?.firstName}{' '}
                {userProfileSummary?.user?.profile?.lastName || userProfile?.profile?.lastName}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-[#03034D] hover:opacity-80 hover:cursor-pointer"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">Back to Users</span>
                </button>
              </div>
            </div>

            {/* User Information Section */}
            <UserInformationSection
              user={userProfileSummary?.user || userProfile || undefined}
              onNavigateToTransactionHistory={handleNavigateToTransactionHistory}
              onUpdateUserStatus={handleUpdateUserStatus}
              onEditUser={openEditModal}
              onResetPassword={handleResetUserPassword}
            />

            {/* Bank Details Section */}
            <BankDetailsSection
              bankDetails={userProfileSummary?.bankDetails}
              loading={loadingUserProfileSummary}
            />

            {/* Transaction Summary Section */}
            <TransactionSummarySection
              transactionSummary={userProfileSummary?.transactionSummary}
              loading={loadingUserProfileSummary}
            />

            {/* Edit User Modal */}
            <EditUserModal
              open={isEditModalOpen}
              onClose={closeEditModal}
              onSubmit={handleUpdateUserProfile}
              initialValues={editModalInitialValues}
              loading={isUpdatingProfile}
            />
          </Fragment>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default UserDetails;
