import {Fragment} from "react";
import {AlertCircle, CheckCircle, Clock, HelpCircle, Loader, X, Zap} from "lucide-react";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import {useDisputeDetailsPage} from "../hooks/pages/useDisputeDetailsPage.ts";
import DisputeInformation from "../components/pages/disputes/details/DisputeInformation.tsx";
import TransactionDisputeInfo from "../components/pages/disputes/details/TransactionDisputeInfo.tsx";
import DisputeMessage from "../components/pages/disputes/details/DisputeMessage.tsx";
import {getDisputeStatusColor} from "../util/dispute.constants.util.ts";
import { convertToMillify } from "../util/index.util.ts";

const DisputeDetails = () => {
  const {
    // 🧩 Values
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    
    // ⚙️ Functions
    adminSendDisputeMutation,
    goBack,
  } = useDisputeDetailsPage();
  
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
                        <h1 className="text-2xl font-bold text-gray-900">Dispute Details</h1>
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
                  {/* Left Column - Transaction & Dispute Info */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Transaction Details */}
                    <TransactionDisputeInfo
                      sessionId={disputeDetails.transaction?.sessionId || ''}
                      transactionType={disputeDetails.transaction?.type || 'BUY'}
                      status={"INITIATED"}
                      cryptoAmount={disputeDetails.transaction?.amountCrypto || ''}
                      cryptoCurrency={disputeDetails.transaction?.cryptocurrency?.symbol || ''}
                      fiatAmount={disputeDetails.transaction?.amountFiat || ''}
                      fiatCurrency={disputeDetails.transaction?.currency || ''}
                      exchangeRateDisplay={(() => {
                        const tx = disputeDetails.transaction;
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
                    />
                    
                    <DisputeInformation
                      reason={disputeDetails.disputeReason || ''}
                      createdAt={disputeDetails.createdAt}
                      updatedAt={disputeDetails.updatedAt}
                      attachments={disputeDetails.attachments}
                      adminNotes={disputeDetails?.resolutionNotes || ''}
                    />
                  </div>
                  
                  {/* Right Column - Dispute Messages */}
                  <div className="lg:col-span-2">
                    <DisputeMessage
                      loading={loadingDisputeMessages}
                      messages={disputeMessages || []}
                      sendMessageMutation={adminSendDisputeMutation}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </AuthenticatedLayout>
  )
}

export default DisputeDetails;