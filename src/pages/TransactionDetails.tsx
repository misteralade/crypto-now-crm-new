import { Fragment } from "react";
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

const TransactionDetails = () => {
  const {
    // 🧩 Values
    transactionInfo: transaction,
    loadingTransactionInfo,
    
    
    // ⚙️ Functions
    goBack,
  } = useTransactionDetailsPage();
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Transaction Details" />
        
        <div className="bg-white py-4 lg:py-5 mb-6 mt-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left: Empty */}
            <div className="flex w-full lg:w-auto items-center gap-2"/>
            
            {/* Right: All Transactions */}
            <div className="flex w-full lg:w-auto items-center gap-2 lg:justify-end">
              <button
                onClick={goBack}
                className="px-4 py-2 text-sm bg-[#03034D] text-white rounded-full hover:opacity-90 cursor-pointer"
              >
                All Transactions
              </button>
            </div>
          </div>
        </div>
        
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
                  amountFiatNGN={Number(transaction.amountFiatNGN || 0)}
                  stableToFiatRate={Number(transaction.stableToFiatRate)}
                  status={transaction.status}
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
                <TransactionReceipts
                  receiptImageUrl={transaction.receiptImageUrl}
                  adminPaymentReceiptUrl={transaction.adminPaymentReceiptUrl}
                />
                
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Failure Information</h2>
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
                      <CopyDetails text={transaction.sessionId} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
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
                        <CopyDetails text={transaction.id} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">{transaction.userId ? 'User ID' : 'User Email'}</p>
                      <div className="flex items-center gap-1">
                        <CopyDetails text={transaction.userId ? transaction.userId : transaction.email || ''} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Exchange Rate ID</p>
                      <div className="flex items-center gap-1">
                        <CopyDetails text={transaction.exchangeRateId} className="!max-w-[300px]" iconClassName="!w-8 !h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          <p className="text-center text-[#858585] font-medium mt-10">No transaction details available.</p>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default TransactionDetails;