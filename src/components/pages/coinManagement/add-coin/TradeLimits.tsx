import type { CreateSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from '../../../ui/input'

interface TradeLimitsProps {
  onChangeInputField: (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const TradeLimits = ({ onChangeInputField }: TradeLimitsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">Exchange Rate & Trade Limits</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="buyRate"
          onChange={(e) => onChangeInputField("buyRate", e.target.value)}
          label="Rate to Sell to User (NGN per USD) — Sell Rate"
          type="text"
          inputMode="decimal"
          placeholder="1575 NGN per USD"
        />
        <PillInput
          id="sellRate"
          onChange={(e) => onChangeInputField("sellRate", e.target.value)}
          label="Rate to Buy from User (NGN per USD) — Buy Rate"
          type="text"
          inputMode="decimal"
          placeholder="1545 NGN per USD"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTradeAmount"
          onChange={(e) => onChangeInputField("minTransactionLimit", e.target.value)}
          label="Min trade amount (token)"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 0.001"
        />
        <PillInput
          id="maxTradeAmount"
          onChange={(e) => onChangeInputField("maxTransactionLimit", e.target.value)}
          label="Max trade amount (token)"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTransactionAmountForAnonymousUsers"
          onChange={(e) => onChangeInputField("minTradeAmountForAnonymous", e.target.value)}
          label="Min Transaction Amount — Anonymous (token)"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 0.5"
          step="0.1"
        />
        <PillInput
          id="maxTransactionAmountForAnonymousUsers"
          onChange={(e) => onChangeInputField("maxTradeAmountForAnonymous", e.target.value)}
          label="Max Transaction Amount — Anonymous (token)"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 30"
        />
      </div>
    </div>
  )
}

export default TradeLimits;
