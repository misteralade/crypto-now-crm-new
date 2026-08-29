import {Fragment} from "react";
import CopyDetails from "../../../global/CopyDetails.tsx";
import type { TransactionStatus } from "../../../../schemas/enum.schema.ts";
import {getStatusColor, getStatusDot} from "../../../../util/transaction.util.ts";
import {formatNumber} from "../../../../util/index.util.ts";
import {formatCompact} from "../../../../util/asset-precision";

interface TransactionDisputeInfoProps {
  sessionId: string;
  transactionType: 'BUY' | 'SELL';
  status: TransactionStatus;
  cryptoAmount: string;
  cryptoCurrency: string;
  fiatAmount: string;
  fiatCurrency: string;
  /** Explicit rate e.g. "1 BTC = $ 100,000" */
  exchangeRateDisplay: string;
}

const TransactionDisputeInfo = ({sessionId, transactionType, status, cryptoAmount, cryptoCurrency, fiatCurrency, fiatAmount, exchangeRateDisplay }: TransactionDisputeInfoProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Details
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
            <CopyDetails text={sessionId} className="!max-w-[300px]"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900">
                {transactionType}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <div className="p-4">
                <span
                  className={`flex items-center w-fit gap-2 py-1 px-3 rounded-3xl text-xs ${getStatusColor(status)}`}
                >
                  <span className={`w-2 h-2 rounded-full ${getStatusDot(status)}`}></span>
                  <span className={`text-sm capitalize`}>{status.replaceAll("_", " ").toLocaleLowerCase()}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Crypto Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatNumber(cryptoAmount)} {cryptoCurrency}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fiat Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {fiatCurrency} {formatCompact(Number(fiatAmount || 0), fiatCurrency)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
            <p className="text-sm font-medium text-gray-900">
              {exchangeRateDisplay}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDisputeInfo;
