import { Fragment } from 'react'
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
import CustodialWalletsSection from "../components/pages/users/details/CustodialWalletsSection.tsx";
import { useCryptoQuery } from "../queries/crypto.querries.ts";

const UserDetails = () => {
  const navigate = useNavigate();
  const { allSupportedCrypto } = useCryptoQuery();
  const {
    // 🧩 Values
    userId,
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
      <PageHeader 
        title="User Details" 
        subtitle={userProfile ? `${userProfile.profile?.firstName} ${userProfile.profile?.lastName}` : 'Review user profile and activity'}
        onBack={goBack} 
      />
      <div className="p-6 mx-auto">
        {(loadingUserProfile || loadingUserProfileSummary) ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <LoadingSpinner size="lg" message="Loading user details..." />
          </div>
        ) : (
          <Fragment>
            {/* User Information Section */}
            <UserInformationSection
              user={userProfile || userProfileSummary?.user || undefined}
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

            {/* Custodial Wallets Section */}
            <CustodialWalletsSection userId={userId} supportedCryptos={allSupportedCrypto} />

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
