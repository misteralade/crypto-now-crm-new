import {NUMBERS} from "../../../../util/constants";
import type {
  CreateSupportedCryptoAndAdminWalletRequestType
} from "../../../../schemas/crypto.schema";
import LabeledPillInput from "../../../global/LabeledPillInput";

interface TradeLimitsProps {
  onChangeInputField: (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const TradeLimits = ({ onChangeInputField }: TradeLimitsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Exchange Rate & Trade Limits
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            id="buyRate"
            onChange={(e) => onChangeInputField("buyRate", Number(e.target.value))}
            label="Rate to Sell to User (USD) - Buy Rate"
            type="number"
            min={0.001}
            max={NUMBERS.ONE_BILLION}
            placeholder="1575"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Second Min trade amount field */}
        <div className="mb-6">
          <LabeledPillInput
            id="sellRate"
            onChange={(e) => onChangeInputField("sellRate", Number(e.target.value))}
            label="Rate to Buy from User (USD) - Sell Rate"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            placeholder="1545"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>

      {/* First row: Min trade amount and Transaction fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            id="minTradeAmount"
            onChange={(e) => onChangeInputField("minTransactionLimit", Number(e.target.value))}
            label="Min trade amount"
            type="number"
            min={0.001}
            max={NUMBERS.ONE_BILLION}
            defaultValue="0.001"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Second Min trade amount field */}
        <div className="mb-6">
          <LabeledPillInput
            id="maxTradeAmount"
            onChange={(e) => onChangeInputField("maxTransactionLimit", Number(e.target.value))}
            label="Min trade amount"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            defaultValue="100"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>

      {/* transaction fee & processing time */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6'>
        <div>
          <LabeledPillInput
            id="minTransactionAmountForAnonymousUsers"
            onChange={(e) => onChangeInputField("minTradeAmountForAnonymous", Number(e.target.value))}
            label="Min Transaction Amount - Anonymous Users"
            min={0.001}
            max={NUMBERS.ONE_BILLION}
            type="number"
            defaultValue="0.5"
            step="0.1"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Max transaction amount for anonymous users */}
        <div>
          <LabeledPillInput
            id="maxTransactionAmountForAnonymousUsers"
            onChange={(e) => onChangeInputField("maxTradeAmountForAnonymous", Number(e.target.value))}
            label="Max Transaction Amount - Anonymous Users"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            defaultValue="30"
            labelClass="text-[14px] text-[#454745] xl:whitespace-nowrap"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>
    </div>
  )
}

export default TradeLimits;
