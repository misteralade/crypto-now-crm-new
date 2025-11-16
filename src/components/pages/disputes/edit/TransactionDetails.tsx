import {Fragment} from "react";
import {StatusBadge} from "../../../global/StatusBadge.tsx";
import {convertToMillify, formatNumber} from "../../../../util/index.util.ts";

interface TransactionDetailsProps {
  sessionId: string;
  type: 'BUY' | 'SELL';
  status: string;
  cryptoAmount: string;
  cryptoSymbol: string;
  fiatAmount: string;
  currency: string;
  rate: string;
  walletAddress: string;
  walletNetwork: string;
  accountName: string;
  accountNumber?: string;
  bankName: string;
}

const TransactionDetails = ({ sessionId, type, status, cryptoAmount, cryptoSymbol, currency, fiatAmount, rate, walletAddress, walletNetwork, accountName, accountNumber, bankName }: TransactionDetailsProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Details
        </h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Session ID</p>
            <p className="text-sm font-mono text-gray-900 break-all text-ellipsis overflow-hidden">
              {sessionId}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-semibold text-gray-900">
                {type}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <StatusBadge status={status}/>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Crypto Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatNumber(cryptoAmount)} {cryptoSymbol}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Fiat Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {currency} {convertToMillify(Number(fiatAmount))}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
            <p className="text-sm font-medium text-gray-900">
              {formatNumber(rate)}
            </p>
          </div>
          
          {/* Wallet Details */}
          {walletAddress && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Crypto Wallet
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                  <p className="text-sm font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">
                    {walletAddress}
                  </p>
                </div>
                {walletNetwork && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Network</p>
                    <p className="text-sm text-gray-900">{walletNetwork}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Bank Details */}
          {accountNumber && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Bank Account
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Name</p>
                  <p className="text-sm text-gray-900">
                    {accountName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="text-sm font-mono text-gray-900">
                    {accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                  <p className="text-sm text-gray-900">{bankName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDetails;
