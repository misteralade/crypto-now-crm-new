import {Fragment} from "react";
import CopyDetails from "../../../global/CopyDetails.tsx";

interface PaymentAccountDetailsProps {
  type: 'BUY' | 'SELL';
  hasBankAccount: boolean;
  accountName: string | undefined;
  accountNumber: string | undefined;
  bankName: string | undefined;
  hasCryptoWallet: boolean;
  walletAddress: string | undefined;
  network: string | undefined;
  cryptoName: string | undefined;
  cryptoSymbol: string | undefined;
}

const PaymentAccountDetails = ({ type, hasBankAccount, accountName, accountNumber, bankName, hasCryptoWallet, walletAddress, network, cryptoName, cryptoSymbol }: PaymentAccountDetailsProps) => {
  return (
    <Fragment>
      {type === 'SELL' && hasBankAccount ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Bank Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Account Name</p>
              <p className="text-base font-medium text-gray-900">{accountName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <CopyDetails text={accountNumber || ''} className="!max-w-[700px]" iconClassName="!w-8 !h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="text-base font-medium text-gray-900">{bankName}</p>
            </div>
          </div>
        </div>
      ) : type === 'BUY' && hasCryptoWallet && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Crypto Wallet</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Wallet Address</p>
              <div className="flex items-center gap-2">
                <CopyDetails text={walletAddress || ''} className="!max-w-[700px]" iconClassName="!w-8 !h-8" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Network</p>
              <p className="text-base font-medium text-gray-900">{network}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coin</p>
              <p className="text-base font-medium text-gray-900">
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
