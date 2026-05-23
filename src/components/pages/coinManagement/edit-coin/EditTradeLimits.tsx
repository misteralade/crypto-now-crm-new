import { useEffect, useState } from "react";
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
  const [buyRate, setBuyRate] = useState<string>(String(buyAt ?? ''));
  const [sellRate, setSellRate] = useState<string>(String(sellAt ?? ''));
  const [minTradeAmount, setMinTradeAmount] = useState<string>(String(minAmount ?? ''));
  const [maxTradeAmount, setMaxTradeAmount] = useState<string>(String(maxAmount ?? ''));
  const [minTradeAmountForAnonymous, setMinTradeAmountForAnonymous] = useState<string>(String(minAmountAnonymous ?? ''));
  const [maxTradeAmountForAnonymous, setMaxTradeAmountForAnonymous] = useState<string>(String(maxAmountAnonymous ?? ''));

  useEffect(() => {
    setBuyRate(String(buyAt ?? ''));
    setSellRate(String(sellAt ?? ''));
    setMinTradeAmount(String(minAmount ?? ''));
    setMaxTradeAmount(String(maxAmount ?? ''));
    setMinTradeAmountForAnonymous(String(minAmountAnonymous ?? ''));
    setMaxTradeAmountForAnonymous(String(maxAmountAnonymous ?? ''));
  }, [buyAt, sellAt, minAmount, maxAmount, minAmountAnonymous, maxAmountAnonymous]);

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Exchange Rate & Trade Limits ({symbol})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="buyRate"
          placeholder="e.g. 1500"
          value={buyRate}
          onChange={(e) => { setBuyRate(e.target.value); onChangeInputField("buyRate", e.target.value) }}
          label="Rate to Sell to User (USD) — Sell Rate"
          type="text"
          inputMode="decimal"
        />
        <PillInput
          id="sellRate"
          placeholder="e.g. 1400"
          value={sellRate}
          onChange={(e) => { setSellRate(e.target.value); onChangeInputField("sellRate", e.target.value) }}
          label="Rate to Buy from User (USD) — Buy Rate"
          type="text"
          inputMode="decimal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTradeAmount"
          placeholder="e.g. 100"
          value={minTradeAmount}
          onChange={(e) => { setMinTradeAmount(e.target.value); onChangeInputField("minTransactionLimit", e.target.value) }}
          label="Min trade amount"
          type="text"
          inputMode="decimal"
        />
        <PillInput
          id="maxTradeAmount"
          placeholder="e.g. 1000000"
          value={maxTradeAmount}
          onChange={(e) => { setMaxTradeAmount(e.target.value); onChangeInputField("maxTransactionLimit", e.target.value) }}
          label="Max trade amount"
          type="text"
          inputMode="decimal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTransactionAmountForAnonymousUsers"
          placeholder="e.g. 100"
          value={minTradeAmountForAnonymous}
          onChange={(e) => { setMinTradeAmountForAnonymous(e.target.value); onChangeInputField("minTradeAmountForAnonymous", e.target.value) }}
          label="Min Transaction Amount — Anonymous"
          type="text"
          inputMode="decimal"
          step="0.1"
        />
        <PillInput
          id="maxTransactionAmountForAnonymousUsers"
          placeholder="e.g. 1000000"
          value={maxTradeAmountForAnonymous}
          onChange={(e) => { setMaxTradeAmountForAnonymous(e.target.value); onChangeInputField("maxTradeAmountForAnonymous", e.target.value) }}
          label="Max Transaction Amount — Anonymous"
          type="text"
          inputMode="decimal"
        />
      </div>
    </div>
  )
}

export default EditTradeLimits;
