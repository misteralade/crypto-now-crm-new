import { useState } from "react";
import { NUMBERS } from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from '../../../ui/input'

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="buyRate"
          placeholder="e.g. 1500"
          value={buyRate || ''}
          onChange={(e) => { setBuyRate(Number(e.target.value)); onChangeInputField("buyRate", Number(e.target.value)) }}
          label="Rate to Sell to User (USD) — Sell Rate"
          type="number"
          min={1}
          max={NUMBERS.ONE_BILLION}
        />
        <PillInput
          id="sellRate"
          placeholder="e.g. 1400"
          value={sellRate || ''}
          onChange={(e) => { setSellRate(Number(e.target.value)); onChangeInputField("sellRate", Number(e.target.value)) }}
          label="Rate to Buy from User (USD) — Buy Rate"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTradeAmount"
          placeholder="e.g. 100"
          value={minTradeAmount || ''}
          onChange={(e) => { setMinTradeAmount(Number(e.target.value)); onChangeInputField("minTransactionLimit", Number(e.target.value)) }}
          label="Min trade amount"
          type="number"
          min={0.001}
          max={NUMBERS.ONE_BILLION}
        />
        <PillInput
          id="maxTradeAmount"
          placeholder="e.g. 1000000"
          value={maxTradeAmount || ''}
          onChange={(e) => { setMaxTradeAmount(Number(e.target.value)); onChangeInputField("maxTransactionLimit", Number(e.target.value)) }}
          label="Max trade amount"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTransactionAmountForAnonymousUsers"
          placeholder="e.g. 100"
          value={minTradeAmountForAnonymous || ''}
          onChange={(e) => { setMinTradeAmountForAnonymous(Number(e.target.value)); onChangeInputField("minTradeAmountForAnonymous", Number(e.target.value)) }}
          label="Min Transaction Amount — Anonymous"
          min={0.001}
          max={NUMBERS.ONE_BILLION}
          type="number"
          step="0.1"
        />
        <PillInput
          id="maxTransactionAmountForAnonymousUsers"
          placeholder="e.g. 1000000"
          value={maxTradeAmountForAnonymous || ''}
          onChange={(e) => { setMaxTradeAmountForAnonymous(Number(e.target.value)); onChangeInputField("maxTradeAmountForAnonymous", Number(e.target.value)) }}
          label="Max Transaction Amount — Anonymous"
          min={500}
          max={NUMBERS.ONE_BILLION}
          type="number"
        />
      </div>
    </div>
  )
}

export default EditTradeLimits;
