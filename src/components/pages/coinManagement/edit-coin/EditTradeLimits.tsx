import { useState } from "react";
import { NUMBERS } from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import LabeledPillInput from "../../../global/LabeledPillInput";
import {formatNumber} from "../../../../util/index.util.ts";

interface EditTradeLimitsProps {
  symbol: string;
  buyAt: number;
  sellAt: number;
  minAmount: number;
  maxAmount: number;
  minAmountAnonymous: number;
  maxAmountAnonymous: number;
  onChangeInputField: (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const EditTradeLimits = ({ symbol, buyAt, sellAt, minAmount, maxAmount, minAmountAnonymous, maxAmountAnonymous, onChangeInputField }: EditTradeLimitsProps) => {
  const [buyRate, setBuyRate] = useState<number>(buyAt);
  const [sellRate, setSellRate] = useState<number>(sellAt);
  const [minTradeAmount, setMinTradeAmount] = useState<number>(minAmount);
  const [maxTradeAmount, setMaxTradeAmount] = useState<number>(maxAmount);
  const [minTradeAmountForAnonymous, setMinTradeAmountForAnonymous] = useState<number>(minAmountAnonymous);
  const [maxTradeAmountForAnonymous, setMaxTradeAmountForAnonymous] = useState<number>(maxAmountAnonymous);

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Exchange Rate & Trade Limits ({symbol})
      </h3>

      {/* First row: Min trade amount and Transaction fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            id="buyRate"
            placeholder="e.g. 1500"
            value={buyRate || ''}
            onChange={(e) => {
              setBuyRate(Number(e.target.value))
              onChangeInputField("buyRate", Number(e.target.value))
            }}
            label="Rate to Sell to User (USD) - Sell Rate"
            type="number"
            min={1}
            max={NUMBERS.ONE_BILLION}
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Second Min trade amount field */}
        <div className="mb-6">
          <LabeledPillInput
            id="sellRate"
            placeholder="e.g. 1400"
            value={sellRate || ''}
            onChange={(e) => {
              setSellRate(Number(e.target.value))
              onChangeInputField("sellRate", Number(e.target.value))
            }}
            label="Rate to Buy from User (USD) - Buy Rate"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>

      {/* Second row: Min  and Max trade amount for authenticated users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            id="minTradeAmount"
            placeholder="e.g. 100"
            value={minTradeAmount || ''}
            onChange={(e) => {
              setMinTradeAmount(Number(e.target.value))
              onChangeInputField("minTransactionLimit", Number(e.target.value))
            }}
            label="Min trade amount"
            type="number"
            min={0.001}
            max={NUMBERS.ONE_BILLION}
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Second Min trade amount field */}
        <div className="mb-6">
          <LabeledPillInput
            id="maxTradeAmount"
            placeholder="e.g. 1000000"
            value={maxTradeAmount || ''}
            onChange={(e) => {
              setMaxTradeAmount(Number(e.target.value))
              onChangeInputField("maxTransactionLimit", Number(e.target.value))
            }}
            label="Max trade amount"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>

      {/* Third Row: Min and Max amount for anonymous users */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6'>
        <div>
          <LabeledPillInput
            id="minTransactionAmountForAnonymousUsers"
            placeholder="e.g. 100"
            value={minTradeAmountForAnonymous || ''}
            onChange={(e) => {
              setMinTradeAmountForAnonymous(Number(e.target.value))
              onChangeInputField("minTradeAmountForAnonymous", Number(e.target.value))
            }}
            label="Min Transaction Amount - Anonymous Users"
            min={0.001}
            max={NUMBERS.ONE_BILLION}
            type="number"
            step="0.1"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Max transaction amount for anonymous users */}
        <div>
          <LabeledPillInput
            id="maxTransactionAmountForAnonymousUsers"
            placeholder="e.g. 1000000"
            value={maxTradeAmountForAnonymous || ''}
            onChange={(e) => {
              setMaxTradeAmountForAnonymous(Number(e.target.value))
              onChangeInputField("maxTradeAmountForAnonymous", Number(e.target.value))
            }}
            label="Max Transaction Amount - Anonymous Users"
            min={500}
            max={NUMBERS.ONE_BILLION}
            type="number"
            labelClass="text-[14px] text-[#454745] xl:whitespace-nowrap"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>
    </div>
  )
}

export default EditTradeLimits;
