import { Fragment } from 'react'
import { convertToMillify } from '../../../../util/index.util'
import type { TransactionSummaryResponsePayload } from '../../../../types/response.payload.types'

interface TransactionSummarySectionProps {
  transactionSummary: Array<TransactionSummaryResponsePayload> | undefined
  loading?: boolean
}

const TransactionSummarySection = ({ transactionSummary, loading = false }: TransactionSummarySectionProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#0E0F0C] mb-6">Transaction Summary</h2>
        <div className="text-center py-8 text-[#667085]">Loading transaction summary...</div>
      </div>
    )
  }

  const totalBuys = transactionSummary 
    ? transactionSummary.reduce((acc, item) => acc + Number(item.fiatSpentOnBuying), 0) 
    : 0
  const totalSells = transactionSummary 
    ? transactionSummary.reduce((acc, item) => acc + Number(item.fiatReceivedFromSelling), 0) 
    : 0

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#0E0F0C] mb-6">Transaction Summary</h2>
      
      {!transactionSummary || transactionSummary.length === 0 ? (
        <div className="text-center py-8 text-[#667085]">
          No transaction summary available.
        </div>
      ) : (
        <Fragment>
          {/* Wallet Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#0E0F0C] mb-4">Wallet Details</h3>
            <div className="space-y-3">
              {transactionSummary.map((transaction) => (
                <div key={transaction.cryptoCurrencyId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {transaction.cryptoCurrencyImageUrl && (
                      <img
                        src={transaction.cryptoCurrencyImageUrl}
                        alt={transaction.cryptoCurrencySymbol}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-[#0E0F0C]">
                        {transaction.cryptoCurrencyName} ({transaction.cryptoCurrencySymbol})
                      </div>
                      <div className="text-sm text-[#667085]">
                        {Number(transaction.totalCryptoAmount).toFixed(8).replace(/\.?0+$/, "")} {transaction.cryptoCurrencySymbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#0E0F0C]">
                      ₦{convertToMillify(Number(transaction.totalFiatAmount), 3)}
                    </div>
                    <div className="text-sm text-[#667085]">
                      {transaction.transactionCount} transactions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Totals */}
          <div className="pt-6 border-t border-[#ECECEC]">
            <h3 className="text-lg font-medium text-[#0E0F0C] mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-sm text-[#667085] mb-1">Total Buys</div>
                <div className="text-xl font-semibold text-[#0E0F0C]">
                  ₦{convertToMillify(totalBuys, 3)}
                </div>
              </div>
              <div className="p-4 bg-[#F9FAFB] rounded-lg">
                <div className="text-sm text-[#667085] mb-1">Total Sells</div>
                <div className="text-xl font-semibold text-[#0E0F0C]">
                  ₦{convertToMillify(totalSells, 3)}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default TransactionSummarySection;
