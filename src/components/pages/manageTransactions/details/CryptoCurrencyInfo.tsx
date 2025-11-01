import {Fragment} from "react";

interface CryptoCurrencyInfoProps {
  logoUrl: string;
  symbol: string;
  name: string;
}

const CryptoCurrencyInfo = ({ logoUrl, symbol, name }: CryptoCurrencyInfoProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cryptocurrency</h2>
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt={name} className="w-16 h-16" />
          
          <div>
            <p className="text-lg font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{symbol}</p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CryptoCurrencyInfo;
