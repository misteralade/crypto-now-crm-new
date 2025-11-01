import {Fragment, useEffect, useState} from "react";
import {ExternalLink} from "lucide-react";
import CopyDetails from "../../../global/CopyDetails.tsx";
import type {CryptoNetworkType} from "../../../../schemas/enum.schema.ts";
import {getExplorerLinks} from "../../../../util/blockchain.util.ts";

interface TransactionHashProps {
  cryptoTxHash: string;
  network: CryptoNetworkType;
  walletAddress: string;
}

const TransactionHash = ({ cryptoTxHash, network, walletAddress }: TransactionHashProps) => {
  const [chainUrl, setChainUrl] = useState('')
  
  useEffect(() => {
    const { txUrl } = getExplorerLinks(cryptoTxHash, network, walletAddress)
    setChainUrl(txUrl || '')
  }, [cryptoTxHash, network, walletAddress]);
  
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Transaction</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2 w-full">
              <CopyDetails text={cryptoTxHash} className="!max-w-[700px]" iconClassName="!w-8 !h-8" />
              <a
                href={chainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionHash;
