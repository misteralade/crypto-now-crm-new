import { Fragment, useState } from "react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import {useTransactionDetailsPage} from "../hooks/pages/useTransactionDetailsPage.ts";
import PageHeader from "../components/global/pageHeader.tsx";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import TransactionOverview from "../components/pages/manageTransactions/details/TransactionOverview.tsx";
import CryptoCurrencyInfo from "../components/pages/manageTransactions/details/CryptoCurrencyInfo.tsx";
import PaymentAccountDetails from "../components/pages/manageTransactions/details/PaymentAccountDetails.tsx";
import AdminPaymentAccountDetails from "../components/pages/manageTransactions/details/AdminPaymentAccountDetails.tsx";
import TransactionHash from "../components/pages/manageTransactions/details/TransactionHash.tsx";
import type {CryptoNetworkType} from "../schemas/enum.schema.ts";
import TransactionReceipts from "../components/pages/manageTransactions/details/TransactionReceipts.tsx";
import CopyDetails from "../components/global/CopyDetails.tsx";
import TransactionDetailsUserProfile
  from "../components/pages/manageTransactions/details/TransactionDetailsUserProfile.tsx";
import TransactionDetailsPipeline from "../components/pages/manageTransactions/details/TransactionDetailsPipeline.tsx";
import { convertToMillify } from "../util/index.util.ts";
import { Download } from "lucide-react";
import LedgerEntriesSection from "../components/pages/manageTransactions/details/LedgerEntriesSection.tsx";
import ConfirmModal from "../components/global/ConfirmModal.tsx";

const TransactionDetails = () => {
  const {
    // 🧩 Values
    transactionInfo: transaction,
    loadingTransactionInfo,
    ledgerEntries,
    exportingLedgerCsv,
    retryingConfirmation,
    forcingPayout,
    
    
    // ⚙️ Functions
    goBack,
    handleExportLedgerCsv,
    handleRetryDepositConfirmation,
    handleForceTriggerPayout,
  } = useTransactionDetailsPage();

  const [showForcePayoutConfirmModal, setShowForcePayoutConfirmModal] = useState(false);
  const canRetryConfirmation =
    transaction?.type === "SELL" &&
    ["DEPOSIT_DETECTED", "PENDING_CONFIRMATION"].includes(
      transaction?.status ?? ""
    );
  const canForcePayout =
    transaction?.type === "SELL" &&
    transaction?.status !== "COMPLETED" &&
    !!transaction?.userBankAccount;
  
  return (
    <AuthenticatedLayout>
      <PageHeader
        title="Transaction Details"
        onBack={goBack}
        actions={
          <div className="flex items-center gap-3">
            {canRetryConfirmation && (
              <button
                type="button"
                onClick={() => handleRetryDepositConfirmation(transaction?.sessionId)}
                disabled={retryingConfirmation}
                className="inline-flex items-center gap-2 rounded-full bg-[#F2994A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#D98234] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {retryingConfirmation ? "Retrying..." : "Retry confirmation"}
              </button>
            )}
            {canForcePayout && (
              <button
                type="button"
                onClick={() => setShowForcePayoutConfirmModal(true)}
                disabled={forcingPayout}
                className="inline-flex items-center gap-2 rounded-full bg-[#B42318] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {forcingPayout ? "Triggering..." : "Trigger payout"}
              </button>
            )}
            <button
              type="button"
              onClick={handleExportLedgerCsv}
              disabled={exportingLedgerCsv}
              className="inline-flex items-center gap-2 rounded-full bg-[#03034D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#050568] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {exportingLedgerCsv ? "Exporting..." : "Export Ledger CSV"}
            </button>
          </div>
        }
      />
      <div className="p-6 mx-auto">
        {loadingTransactionInfo ? (
          <LoadingSpinner size={"lg"} fullScreen={true} message={"Loading transaction details..."} />
        ) : transaction ? (
          <Fragment>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Transaction Overview */}
                <TransactionOverview
                  type={transaction.type}
                  amountCrypto={Number(transaction.amountCrypto)}
                  symbol={transaction.cryptocurrency?.symbol || 'CRYPTO'}
                  currency={transaction.currency}
                  amountFiat={Number(transaction.amountFiat || 0)}
                  amountFiatNGN={Number(transaction.amountFiatNGN || 0)}
                  exchangeRateDisplay={
                    transaction.exchangeRate && Number(transaction.amountCrypto) > 0
                      ? transaction.currency === 'USD'
                        ? `1 ${transaction.cryptocurrency?.symbol || 'CRYPTO'} = $ ${convertToMillify(Number(transaction.exchangeRate.rate), 2)}`
                        : `1 ${transaction.cryptocurrency?.symbol || 'CRYPTO'} = ₦ ${convertToMillify(Number(transaction.exchangeRate.rate) * Number(transaction.exchangeRate.platformRate), 2)}`
                      : Number(transaction.amountCrypto) > 0
                        ? transaction.currency === 'USD'
                          ? `1 ${transaction.cryptocurrency?.symbol || 'CRYPTO'} = $ ${convertToMillify(Number(transaction.amountFiat) / Number(transaction.amountCrypto), 2)}`
                          : `1 ${transaction.cryptocurrency?.symbol || 'CRYPTO'} = ₦ ${convertToMillify(Number(transaction.amountFiatNGN || 0) / Number(transaction.amountCrypto), 2)}`
                        : '—'
                  }
                  status={transaction.status}
                  confirmationCount={transaction.confirmationCount}
                />
                
                {/* Cryptocurrency Info */}
                {transaction.cryptocurrency && (
                  <CryptoCurrencyInfo
                    logoUrl={transaction.cryptocurrency.logoUrl || ''}
                    symbol={transaction.cryptocurrency.symbol}
                    name={transaction.cryptocurrency.name}
                  />
                )}
                
                {/* User Bank Account And/Or Crypto Wallet Details */}
                <PaymentAccountDetails
                  type={transaction.type}
                  hasBankAccount={transaction.userBankAccount ? true : false}
                  accountName={transaction.userBankAccount?.accountName}
                  accountNumber={transaction.userBankAccount?.accountNumber}
                  bankName={transaction.userBankAccount?.bankName}
                  isDeleted={transaction.userBankAccount?.isDeleted}
                  hasCryptoWallet={transaction?.userCryptoWallet ? true : false}
                  walletAddress={transaction.userCryptoWallet?.walletAddress}
                  network={transaction.userCryptoWallet?.network}
                  cryptoName={transaction.cryptocurrency?.name}
                  cryptoSymbol={transaction.cryptocurrency?.symbol}
                />
                
                {/* Admin Bank Account And/Or Crypto Wallet Details */}
                <AdminPaymentAccountDetails
                  type={transaction.type}
                  hasBankAccount={transaction?.adminBankAccount ? true : false}
                  accountName={transaction.adminBankAccount?.accountHolderName}
                  accountNumber={transaction.adminBankAccount?.accountNumber}
                  bankName={transaction.adminBankAccount?.bankName}
                  hasCryptoWallet={transaction?.adminCryptoWallet ? true : false}
                  walletAddress={transaction.adminCryptoWallet?.walletAddress}
                  network={transaction.adminCryptoWallet?.network}
                  cryptoName={transaction.cryptocurrency?.name}
                  cryptoSymbol={transaction.cryptocurrency?.symbol}
                />
                
                {/* Transaction Hash */}
                {transaction.cryptoTxHash && (
                  <TransactionHash
                    cryptoTxHash={transaction.cryptoTxHash}
                    network={transaction.adminCryptoWallet?.network as CryptoNetworkType}
                    walletAddress={transaction?.adminCryptoWallet?.walletAddress || ''}
                  />
                )}

                {/* Custodial Deposit Address (Sell) */}
                {transaction.type === "SELL" && transaction.depositAddress ? (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Deposit Address</h2>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">User deposit address (custodial)</p>
                      <div className="flex items-center gap-2">
                        <CopyDetails
                          text={transaction.depositAddress}
                          className="!max-w-[700px]"
                          iconClassName="!w-8 !h-8"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                
                {/* Bank Transfer Reference */}
                {transaction.bankTransferReference && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Transfer</h2>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Transfer Reference</p>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium text-gray-900">{transaction.bankTransferReference}</p>
                        <CopyDetails text={transaction.bankTransferReference} className="!max-w-[400px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Receipts */}
                {transaction.type === "BUY" && (
                  <TransactionReceipts
                    receiptImageUrl={transaction.receiptImageUrl}
                    adminPaymentReceiptUrl={transaction.adminPaymentReceiptUrl}
                  />
                )}
                
                {/* Notes */}
                {(transaction.userNotes || transaction.adminNotes || transaction.internalNotes) && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                    <div className="space-y-4">
                      {transaction.userNotes && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">User Notes</p>
                          <p className="text-sm text-blue-800">{transaction.userNotes}</p>
                        </div>
                      )}
                      {transaction.adminNotes && (
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-purple-900 mb-1">Admin Notes</p>
                          <p className="text-sm text-purple-800">{transaction.adminNotes}</p>
                        </div>
                      )}
                      {transaction.internalNotes && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">Internal Notes</p>
                          <p className="text-sm text-gray-700">{transaction.internalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Failure Reason */}
                {transaction.failureReason && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Reason</h2>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-900 mb-1">Reason</p>
                      <p className="text-sm text-red-800">{transaction.failureReason}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {/* User Profile */}
                {transaction.user && (
                  <TransactionDetailsUserProfile
                    userId={transaction.userId}
                    firstName={transaction.profile?.firstName || ''}
                    lastName={transaction.profile?.lastName || ''}
                    email={transaction.user?.email || ''}
                    phone={transaction?.profile?.phoneNumber || ''}
                    profileImageUrl={transaction.profile?.profileImg || ''}
                  />
                )}
                
                {/* Timeline */}
                <TransactionDetailsPipeline
                  createdAt={transaction.createdAt}
                  updatedAt={transaction.updatedAt}
                  processedAt={transaction.processedAt || undefined}
                  processedByFirstName={transaction.processor?.firstName || undefined}
                  processedByLastName={transaction.processor?.lastName || undefined}
                />
                
                {/* Session Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Info</h2>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Session ID</p>
                    <div className="flex items-center gap-2">
                      <CopyDetails text={transaction.sessionId} wrap={true} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                    </div>
                  </div>
                </div>
                
                {/* IDs Reference */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Reference IDs</h2>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Transaction ID</p>
                      <div className="flex items-center gap-1">
                        <CopyDetails text={transaction.id} wrap={true} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">{transaction.userId ? 'User ID' : 'User Email'}</p>
                      <div className="flex items-center gap-1">
                        <CopyDetails text={transaction.userId ? transaction.userId : transaction.email || ''} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Rate Snapshot</p>
                      <div className="flex items-center gap-1">
                        <CopyDetails text={transaction.rateSnapshot ? JSON.stringify(transaction.rateSnapshot) : '—'} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <LedgerEntriesSection ledgerEntries={ledgerEntries} />
            </div>
          </Fragment>
        ) : (
          <p className="text-center text-[#858585] font-medium mt-10">No transaction details available.</p>
        )}
      </div>
      <ConfirmModal
        open={showForcePayoutConfirmModal}
        actionType="proceed"
        onClose={() => setShowForcePayoutConfirmModal(false)}
        onConfirm={async () => {
          setShowForcePayoutConfirmModal(false);
          await handleForceTriggerPayout(transaction?.sessionId);
        }}
        message="This will force the payout pipeline to run even if the transaction is not in the normal payout state. Confirm only if you intend to proceed."
        confirmText={forcingPayout ? "Triggering..." : "Force payout"}
      />
    </AuthenticatedLayout>
  )
}

export default TransactionDetails;
