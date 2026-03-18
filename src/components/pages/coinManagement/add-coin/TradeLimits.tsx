import { NUMBERS } from "../../../../util/constants.util.ts";
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
          onChange={(e) => onChangeInputField("buyRate", Number(e.target.value))}
          label="Rate to Sell to User (USD) — Sell Rate"
          type="number"
          min={0.001}
          max={NUMBERS.ONE_BILLION}
          placeholder="1575"
        />
        <PillInput
          id="sellRate"
          onChange={(e) => onChangeInputField("sellRate", Number(e.target.value))}
          label="Rate to Buy from User (USD) — Buy Rate"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
          placeholder="1545"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTradeAmount"
          onChange={(e) => onChangeInputField("minTransactionLimit", Number(e.target.value))}
          label="Min trade amount"
          type="number"
          min={0.001}
          max={NUMBERS.ONE_BILLION}
          placeholder="0.001"
        />
        <PillInput
          id="maxTradeAmount"
          onChange={(e) => onChangeInputField("maxTransactionLimit", Number(e.target.value))}
          label="Max trade amount"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
          placeholder="100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTransactionAmountForAnonymousUsers"
          onChange={(e) => onChangeInputField("minTradeAmountForAnonymous", Number(e.target.value))}
          label="Min Transaction Amount — Anonymous"
          min={0.001}
          max={NUMBERS.ONE_BILLION}
          type="number"
          placeholder="0.5"
          step="0.1"
        />
        <PillInput
          id="maxTransactionAmountForAnonymousUsers"
          onChange={(e) => onChangeInputField("maxTradeAmountForAnonymous", Number(e.target.value))}
          label="Max Transaction Amount — Anonymous"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
          placeholder="30"
        />
      </div>
    </div>
  )
}

export default TradeLimits;
