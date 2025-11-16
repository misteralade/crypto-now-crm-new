import { useState } from 'react'
import {CRYPTO_NETWORK_OPTIONS} from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from '../../../../schemas/crypto.schema'
import LabeledPillInput from '../../../global/LabeledPillInput';
import LabeledPillSelect from '../../../global/LabeledPillSelect';

interface EditCoinDetailsProps {
  name: string;
  symbol: string;
  network: string;
  active: boolean;
  walletAddress: string;
  onChangeInputField: (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const EditCoinDetails = ({ name, symbol, network, active, walletAddress, onChangeInputField }: EditCoinDetailsProps) => {
  const [isActive, setIsActive] = useState(active);

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Coin Details
      </h3>

      {/* First row: Coin Name and Symbol */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        {/* Coin Name*/}
        <div>
          <LabeledPillInput
            label="Coin Name"
            placeholder={name}
            valueClass="text-[18px]"
            id="name"
            onChange={(e) => onChangeInputField('name', e.target.value)}
          />
        </div>

        {/* Symbol*/}
        <div>
          <LabeledPillInput
            label="Symbol"
            valueClass="text-[18px]"
            placeholder={symbol}
            value={symbol}
            disabled
            id="symbol"
          />
        </div>
      </div>

      {/* Second row: Network and Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-x-8 gap-6 mb-6">
        {/* Network*/}
        <div>
          <LabeledPillSelect
            id="network"
            label="Network"
            valueClass="text-[18px]"
            value={network}
            // @ts-ignore
            options={CRYPTO_NETWORK_OPTIONS}
            disabled
          />
        </div>

        {/* Is Active*/}
        <div>
          <label className="block text-sm font-medium text-[#454745] mb-3">
            Status
          </label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                type="checkbox"
                className="sr-only peer"
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked)
                  onChangeInputField('isActive', e.target.checked)
                }}
                // defaultChecked={isActive}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
            </label>
            <span className="text-[16px] font-semibold text-[#454745]">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Deposit wallet address */}
      <div>
        <LabeledPillInput
          label="Deposit wallet address"
          placeholder="Enter deposit wallet address"
          valueClass="text-[18px] text-[#9A9A9A]"
          id="walletAddress"
          disabled
          value={walletAddress}
        />
      </div>
    </div>
  )
}

export default EditCoinDetails;
