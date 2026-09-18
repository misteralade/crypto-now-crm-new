import { ArrowRight } from 'lucide-react';
import CopyDetails from '../../../global/CopyDetails';
import type { SearchTransactionsResponse } from '../../../../types/response.payload.types';

interface TransactionContextProps {
  transaction: SearchTransactionsResponse;
}

const TransactionContext = ({ transaction }: TransactionContextProps) => {
  if (transaction.type === 'BUY') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Transaction Flow</h2>

        <div className="space-y-4">
          {/* From: User's Bank */}
          {transaction.userBankAccount && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">From (User)</div>
              <div className="text-sm font-medium text-gray-900">
                {transaction.userBankAccount.bank?.name || 'Bank Account'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {transaction.userBankAccount.accountName}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
          </div>

          {/* To: Admin Bank (where user sent fiat) */}
          {transaction.adminBankAccount && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Fiat Received At (Admin)</div>
              <div className="text-sm font-medium text-gray-900">
                {transaction.adminBankAccount.bank?.name || 'Bank Account'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {transaction.adminBankAccount.accountHolderName}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
          </div>

          {/* To: User's Crypto Wallet */}
          {transaction.walletAddress && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Crypto Received At</div>
              <div className="text-sm font-medium text-gray-900">
                {transaction.walletNetwork}
              </div>
              <div className="text-xs text-gray-600 mt-2">Wallet Address</div>
              <div className="mt-2">
                <CopyDetails
                  text={transaction.walletAddress || ''}
                  wrap={true}
                  className="!max-w-full"
                  iconClassName="!w-6 !h-6"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (transaction.type === 'SELL') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Transaction Flow</h2>

        <div className="space-y-4">
          {/* From: User's Crypto Wallet */}
          {transaction.walletAddress && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">From (User Crypto)</div>
              <div className="text-sm font-medium text-gray-900">
                {transaction.walletNetwork}
              </div>
              <div className="text-xs text-gray-600 mt-2">Wallet Address</div>
              <div className="mt-2">
                <CopyDetails
                  text={transaction.walletAddress || ''}
                  wrap={true}
                  className="!max-w-full"
                  iconClassName="!w-6 !h-6"
                />
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
          </div>

          {/* To: User's Bank (where they receive fiat) */}
          {transaction.userBankAccount && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Fiat Paid To</div>
              <div className="text-sm font-medium text-gray-900">
                {transaction.userBankAccount.bank?.name || 'Bank Account'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {transaction.userBankAccount.accountName}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TransactionContext;
