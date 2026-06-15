import {Fragment} from "react";
import CopyDetails from "../../../global/CopyDetails.tsx";

interface PaymentAccountDetailsProps {
  type: 'BUY' | 'SELL';
  hasBankAccount: boolean | null;
  accountName: string | undefined;
  accountNumber: string | undefined;
  bankName: string | undefined;
  isDeleted?: boolean;
  hasCryptoWallet: boolean | null;
  walletAddress: string | undefined;
  network: string | undefined;
  cryptoName: string | undefined;
  cryptoSymbol: string | undefined;
}

const PaymentAccountDetails = ({ type, hasBankAccount, accountName, accountNumber, bankName, isDeleted, hasCryptoWallet, walletAddress, network, cryptoName, cryptoSymbol }: PaymentAccountDetailsProps) => {
  return (
    <Fragment>
      {type === 'SELL' && hasBankAccount ? (
        <div className={`bg-white rounded-lg shadow-sm p-6 ${isDeleted ? 'bg-red-50/50' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">User Bank Account</h2>
            {isDeleted && (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700 border border-red-200">
                Deleted
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1 sm:col-span-2">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className={`text-sm font-medium ${isDeleted ? 'text-red-900' : 'text-gray-900'}`}>{accountNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Account Name</p>
              <p className={`text-sm font-medium ${isDeleted ? 'text-red-900' : 'text-gray-900'}`}>{accountName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Bank Name</p>
              <p className="text-sm font-medium text-gray-900 truncate" title={bankName}>{bankName}</p>
            </div>
          </div>
        </div>
      ) : type === 'BUY' && hasCryptoWallet && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Crypto Wallet</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-1 sm:col-span-2">
              <p className="text-xs text-gray-500">Wallet Address</p>
              <div className="flex items-center gap-2">
                <CopyDetails text={walletAddress || ''} className="!max-w-[700px] text-sm" iconClassName="!w-6 !h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Network</p>
              <p className="text-sm font-medium text-gray-900">{network}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Coin</p>
              <p className="text-sm font-medium text-gray-900">
                {cryptoName} ({cryptoSymbol})
              </p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default PaymentAccountDetails;
