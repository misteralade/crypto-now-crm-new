import {Fragment} from "react";
import {convertToMillify, formatNumber} from "../../../../util/index.util.ts";
import {StatusBadge} from "../../../global/StatusBadge.tsx";

interface TransactionOverviewProps {
  type: 'BUY' | 'SELL'
  amountCrypto: number;
  symbol: string;
  currency: string;
  amountFiat: number;
  amountFiatNGN: number;
  status: string;
  /** Explicit rate string e.g. "1 BTC = $ 100,000" or "1 BTC = ₦ 140M" */
  exchangeRateDisplay: string;
  confirmationCount?: number;
}

const TransactionOverview = ({ type: _type, amountCrypto, symbol, amountFiat: _amountFiat, amountFiatNGN, exchangeRateDisplay, status, confirmationCount }: TransactionOverviewProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Crypto Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(amountCrypto)}{" "}{symbol}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Fiat Amount (NGN)</p>
            <p className="text-2xl font-bold text-gray-900">
              ₦ {convertToMillify(amountFiatNGN, 3)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1 normal-case">Exchange Rate</p>
            <p className="text-lg font-bold text-gray-900">
              {exchangeRateDisplay}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1 normal-case">Transaction Status</p>
            <StatusBadge status={status} />
          </div>

          {_type === 'SELL' && (
            <div>
              <p className="text-sm text-gray-500 mb-1 normal-case">Blockchain Confirmations</p>
              <p className="text-lg font-bold text-gray-900">
                {confirmationCount !== undefined ? confirmationCount : 0}
              </p>
            </div>
          )}
          
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionOverview;