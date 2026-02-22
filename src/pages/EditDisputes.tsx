import {Fragment, useEffect} from "react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import {useEditDisputesPage} from "../hooks/pages/useEditDisputesPage.ts";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import {AlertCircle, CheckCircle, Clock, HelpCircle, Loader, X, Zap} from "lucide-react";
import { getDisputeStatusColor } from "../util/dispute.constants.util.ts";
import momentClient from "../util/moment.ts";
import DisputeAttachments from "../components/pages/disputes/edit/DisputeAttachments.tsx";
import DisputeAdminNotes from "../components/pages/disputes/edit/DisputeAdminNotes.tsx";
import TransactionDetails from "../components/pages/disputes/edit/TransactionDetails.tsx";
import DisputeUserInformation from "../components/pages/disputes/edit/DisputeUserInformation.tsx";
import DisputeStatusUpdateModal from "../components/pages/disputes/edit/modal/DisputeStatusUpdateModal.tsx";
import { convertToMillify } from "../util/index.util.ts";

const EditDisputes = () => {
  const {
    // 🧩 Values
    disputeDetails,
    loadingDisputeDetails,
    transactionDetails,
    loadingTransactionDetails,
    isEditingNotes,
    isUpdating,
    adminNotes,
    statusNotes,
    selectedDisputeStatus,
    showStatusUpdateModal,
    selectedResolution,
    
    // ⚙️ Functions
    goBack,
    toggleEditDisputeNotes,
    updateAdminNotes,
    updateStatusNotes,
    handleUpdateStatusNotes,
    dispatchDisputeTransactionId,
    handleOpenStatusUpdateModal,
    toggleShowStatusUpdateModal,
    handleUpdateStatus,
    handleSelectedResolution,
  } = useEditDisputesPage();
  
  useEffect(() => {
    dispatchDisputeTransactionId(disputeDetails?.transaction?.sessionId || '');
  }, [disputeDetails?.transaction]);
  
  const getStatusIcon = (status: | 'OPEN' | 'UNDER_REVIEW' | 'AWAITING_EVIDENCE' | 'AWAITING_USER_RESPONSE' | 'AWAITING_ADMIN_RESPONSE' | 'ESCALATED' | 'RESOLVED' | 'REJECTED' | 'CLOSED') => {
    switch (status) {
      case "OPEN":
        return <Clock className="w-4 h-4" />; // Pending action
      case "UNDER_REVIEW":
        return <Loader className="w-4 h-4 animate-spin" />; // In progress
      case "AWAITING_EVIDENCE":
        return <HelpCircle className="w-4 h-4" />; // Waiting for info
      case "AWAITING_USER_RESPONSE":
        return <Zap className="w-4 h-4" />; // Needs user action
      case "AWAITING_ADMIN_RESPONSE":
        return <AlertCircle className="w-4 h-4" />; // Needs admin review
      case "ESCALATED":
        return <X className="w-4 h-4 text-red-600" />; // Urgent/critical
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-green-600" />; // Success
      case "REJECTED":
        return <X className="w-4 h-4 text-gray-600" />; // Declined
      case "CLOSED":
        return <CheckCircle className="w-4 h-4 text-gray-500" />; // Closed
      default:
        return <Clock className="w-4 h-4" />; // Fallback
    }
  };
  
  return (
    <AuthenticatedLayout>
      {loadingDisputeDetails ? (
        <LoadingSpinner fullScreen={true} message="Loading dispute details..." />
      ) : disputeDetails && (
        <Fragment>
          <div className={`space-y-10 md:space-y-20 min-h-screen bg-gray-50`}>
            <div className="mx-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 hover:cursor-pointer"
                        onClick={goBack}
                      >
                        Go Back
                      </button>
                      
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Dispute</h1>
                        <p className="text-sm text-gray-500">Dispute ID: {disputeDetails.id}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm ${getDisputeStatusColor(disputeDetails.status)}`}
                    >
                      {getStatusIcon(disputeDetails.status)}
                      {disputeDetails.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Dispute Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Dispute Details
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenStatusUpdateModal("UNDER_REVIEW")}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
                          >
                            Review
                          </button>
                          
                          <button
                            onClick={() => handleOpenStatusUpdateModal("RESOLVED")}
                            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors hover:cursor-pointer"
                          >
                            Resolve
                          </button>
                          
                          <button
                            onClick={() => handleOpenStatusUpdateModal("REJECTED")}
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors hover:cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">User's Reason</p>
                          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {disputeDetails.disputeReason}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Created At</p>
                            <p className="text-sm text-gray-900">
                              {momentClient.formatToTransactionInitiationDate(disputeDetails.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                            <p className="text-sm text-gray-900">
                              {momentClient.formatToTransactionInitiationDate(disputeDetails.updatedAt)}
                            </p>
                          </div>
                        </div>
                        
                        {/* User Attachments */}
                        {disputeDetails.attachments && disputeDetails.attachments.length > 0 && (
                          <DisputeAttachments attachments={disputeDetails.attachments}/>
                        )}
                        
                        <DisputeAdminNotes
                          isEditingNotes={isEditingNotes}
                          isUpdating={isUpdating}
                          disputeNote={disputeDetails.internalNotes || ''}
                          note={adminNotes}
                          handleSaveAdminNotes={handleUpdateStatusNotes}
                          toggleEditNotes={toggleEditDisputeNotes}
                          updateAdminNotes={updateAdminNotes}
                        />
                        
                        {!loadingTransactionDetails && transactionDetails && (
                          <TransactionDetails
                            sessionId={transactionDetails.sessionId || ''}
                            type={transactionDetails.type || 'BUY'}
                            status={transactionDetails.status}
                            cryptoAmount={transactionDetails.amountCrypto}
                            cryptoSymbol={transactionDetails.cryptocurrency?.symbol || ''}
                            fiatAmount={transactionDetails.amountFiat}
                            currency={transactionDetails.currency}
                            exchangeRateDisplay={(() => {
                              const tx = transactionDetails;
                              if (!tx?.cryptocurrency?.symbol) return '—';
                              const symbol = tx.cryptocurrency.symbol;
                              const amountCrypto = Number(tx.amountCrypto);
                              const currency = tx.currency;
                              if (amountCrypto <= 0) return '—';
                              if (tx.exchangeRate) {
                                const rate = Number(tx.exchangeRate.rate);
                                const platformRate = Number(tx.exchangeRate.platformRate);
                                return currency === 'USD'
                                  ? `1 ${symbol} = $ ${convertToMillify(rate, 2)}`
                                  : `1 ${symbol} = ₦ ${convertToMillify(rate * platformRate, 2)}`;
                              }
                              const effective = currency === 'USD'
                                ? Number(tx.amountFiat) / amountCrypto
                                : Number(tx.amountFiatNGN || 0) / amountCrypto;
                              const fiatSym = currency === 'USD' ? '$' : '₦';
                              return `1 ${symbol} = ${fiatSym} ${convertToMillify(effective, 2)}`;
                            })()}
                            walletAddress={transactionDetails.userCryptoWallet?.walletAddress || ''}
                            walletNetwork={transactionDetails.userCryptoWallet?.network || ''}
                            accountName={transactionDetails.userBankAccount?.accountName || ''}
                            bankName={transactionDetails.userBankAccount?.bankName || ''}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - User Information */}
                  {!loadingTransactionDetails && transactionDetails && (
                    <DisputeUserInformation
                      disputeId={disputeDetails.id}
                      userId={transactionDetails.userId}
                      firstName={transactionDetails.profile?.firstName || ''}
                      lastName={transactionDetails.profile?.lastName || ''}
                      email={transactionDetails.user?.email || ''}
                      phoneNumber={transactionDetails?.profile?.phoneNumber || ''}
                      profileImg={transactionDetails.profile?.profileImg || ''}
                      transactionCreatedAt={transactionDetails.createdAt}
                      transactionUpdatedAt={transactionDetails.updatedAt}
                      transactionProcessedAt={transactionDetails.processedAt || undefined}
                      processorFirstName={transactionDetails.processor?.firstName || ''}
                      processorLastName={transactionDetails.processor?.lastName || ''}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {showStatusUpdateModal && (
            <DisputeStatusUpdateModal
              selectedStatus={selectedDisputeStatus}
              statusNotes={statusNotes}
              // isUpdating={false}
              onClose={toggleShowStatusUpdateModal}
              handleUpdateStatus={handleUpdateStatus}
              updateStatusNotes={updateStatusNotes}
              selectedResolution={selectedResolution}
              handleSelectedResolution={handleSelectedResolution}
            />
          )}
        </Fragment>
      )}
    </AuthenticatedLayout>
  )
}

export default EditDisputes;
