import {Fragment} from "react";
import {AlertCircle, CheckCircle, Clock, HelpCircle, Loader, X, Zap} from "lucide-react";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import PageHeader from "../components/global/pageHeader.tsx";
import {useDisputeDetailsPage} from "../hooks/pages/useDisputeDetailsPage.ts";
import DisputeInformation from "../components/pages/disputes/details/DisputeInformation.tsx";
import TransactionDisputeInfo from "../components/pages/disputes/details/TransactionDisputeInfo.tsx";
import {getDisputeStatusColor} from "../util/dispute.constants.util.ts";
import { formatCompact } from "../util/asset-precision";

const DisputeDetails = () => {
  const {
    // 🧩 Values
    disputeDetails,
    loadingDisputeDetails,
    
    // ⚙️ Functions
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
          <PageHeader
            title="Dispute Details"
            subtitle={`Dispute ID: ${disputeDetails.id}`}
            onBack={goBack}
            actions={
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm ${getDisputeStatusColor(disputeDetails.status)}`}
              >
                {getStatusIcon(disputeDetails.status)}
                {disputeDetails.status.replace("_", " ")}
              </div>
            }
          />
          <div className="p-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Transaction & Dispute Info */}
              <div className="lg:col-span-3 space-y-6">
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
                            ? `1 ${symbol} = $ ${formatCompact(rate, "USD", 2)}`
                            : `1 ${symbol} = ₦ ${formatCompact(rate * platformRate, "NGN", 2)}`;
                        }
                        const effective = currency === 'USD'
                          ? Number(tx.amountFiat) / amountCrypto
                          : Number(tx.amountFiatNGN || 0) / amountCrypto;
                        const fiatSym = currency === 'USD' ? '$' : '₦';
                        return `1 ${symbol} = ${fiatSym} ${formatCompact(effective, currency ?? "NGN", 2)}`;
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
                </div>
              </div>
        </Fragment>
      )}
    </AuthenticatedLayout>
  )
}

export default DisputeDetails;