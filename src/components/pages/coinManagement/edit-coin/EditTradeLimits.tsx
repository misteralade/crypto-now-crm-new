import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from '../../../ui/input'
import { currencyServiceApi } from "../../../../api/currency.api";
import { rateServiceApi } from "../../../../api/rate.api";
import { QUERY_KEYS } from "../../../../queries/querries.keys";
import { formatForDisplay, formatForDisplayLocalized } from "../../../../util/asset-precision";

interface EditTradeLimitsProps {
  cryptoId: string;
  symbol: string;
  buyAt?: number | string;
  sellAt?: number | string;
  minAmount?: number | string;
  maxAmount?: number | string;
  minAmountAnonymous?: number | string;
  maxAmountAnonymous?: number | string;
  onChangeInputField: (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: unknown) => void
}

const TARGET_CRYPTO_UNITS = 2;

/** Strip the raw numeric(18,8) string's trailing zeros down to a plain, editable decimal. */
const toEditableNumberString = (value: number | string | undefined, symbolOrCode: string): string => {
  if (value === undefined || value === '') return '';
  const num = Number(value);
  return Number.isFinite(num) ? formatForDisplay(num, symbolOrCode) : String(value);
};

const EditTradeLimits = ({ cryptoId, symbol, buyAt, sellAt, minAmount, maxAmount, minAmountAnonymous, maxAmountAnonymous, onChangeInputField }: EditTradeLimitsProps) => {
  const [buyRate, setBuyRate] = useState<string>(toEditableNumberString(buyAt, 'NGN'));
  const [sellRate, setSellRate] = useState<string>(toEditableNumberString(sellAt, 'NGN'));
  const [minTradeAmount, setMinTradeAmount] = useState<string>(toEditableNumberString(minAmount, symbol));
  const [maxTradeAmount, setMaxTradeAmount] = useState<string>(toEditableNumberString(maxAmount, symbol));
  const [minTradeAmountForAnonymous, setMinTradeAmountForAnonymous] = useState<string>(toEditableNumberString(minAmountAnonymous, symbol));
  const [maxTradeAmountForAnonymous, setMaxTradeAmountForAnonymous] = useState<string>(toEditableNumberString(maxAmountAnonymous, symbol));
  const [previewCryptoUnits, setPreviewCryptoUnits] = useState<string>(String(TARGET_CRYPTO_UNITS));

  const { data: currencies } = useQuery({
    queryKey: [QUERY_KEYS.CURRENCY.GET_ALL_CURRENCIES],
    queryFn: async () => {
      const { data, success } = await currencyServiceApi.getAllCurrencies();
      return success ? data : [];
    },
  });

  const ngnCurrencyId = useMemo(
    () => currencies?.find((currency) => currency.code === "NGN")?.id ?? "",
    [currencies],
  );

  const {
    data: liveExchangeRate,
    isLoading: isLoadingLiveExchangeRate,
  } = useQuery({
    queryKey: [QUERY_KEYS.RATE.EDIT_COIN_RATE_PREVIEW, cryptoId, ngnCurrencyId],
    queryFn: async () => {
      const { data, success } = await rateServiceApi.getExchangeRate(
        cryptoId,
        ngnCurrencyId,
        "SELL",
      );
      return success ? data : null;
    },
    enabled: !!cryptoId && !!ngnCurrencyId,
  });

  useEffect(() => {
    setBuyRate(toEditableNumberString(buyAt, 'NGN'));
    setSellRate(toEditableNumberString(sellAt, 'NGN'));
    setMinTradeAmount(toEditableNumberString(minAmount, symbol));
    setMaxTradeAmount(toEditableNumberString(maxAmount, symbol));
    setMinTradeAmountForAnonymous(toEditableNumberString(minAmountAnonymous, symbol));
    setMaxTradeAmountForAnonymous(toEditableNumberString(maxAmountAnonymous, symbol));
  }, [buyAt, sellAt, minAmount, maxAmount, minAmountAnonymous, maxAmountAnonymous, symbol]);

  const coinGeckoRate = Number(liveExchangeRate?.coinGeckoRate ?? 0);
  const sellToUserRate = Number(buyRate ?? 0);
  const buyFromUserRate = Number(sellRate ?? 0);
  const editablePreviewCryptoUnits = Number(previewCryptoUnits ?? TARGET_CRYPTO_UNITS);
  const normalizedPreviewCryptoUnits =
    Number.isFinite(editablePreviewCryptoUnits) && editablePreviewCryptoUnits > 0
      ? editablePreviewCryptoUnits
      : TARGET_CRYPTO_UNITS;

  const sellToUserPreview = coinGeckoRate > 0 && sellToUserRate > 0
    ? normalizedPreviewCryptoUnits * coinGeckoRate * sellToUserRate
    : 0;

  const buyFromUserPreview = coinGeckoRate > 0 && buyFromUserRate > 0
    ? normalizedPreviewCryptoUnits * coinGeckoRate * buyFromUserRate
    : 0;

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Exchange Rate & Trade Limits ({symbol})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="buyRate"
          placeholder="e.g. 1500 NGN per USD"
          value={buyRate}
          onChange={(e) => { setBuyRate(e.target.value); onChangeInputField("buyRate", e.target.value) }}
          label="Rate to Sell to User (NGN per USD) — Sell Rate"
          type="text"
          inputMode="decimal"
        />
        <PillInput
          id="sellRate"
          placeholder="e.g. 1400 NGN per USD"
          value={sellRate}
          onChange={(e) => { setSellRate(e.target.value); onChangeInputField("sellRate", e.target.value) }}
          label="Rate to Buy from User (NGN per USD) — Buy Rate"
          type="text"
          inputMode="decimal"
        />
      </div>

      <div className="rounded-[28px] border border-[#D8D7F1] bg-white/80 p-5 mb-6 shadow-[0_12px_30px_rgba(3,3,77,0.04)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#03034D]">
              Live rate preview
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h4 className="text-xl font-medium text-[#0E0F0C]">
                {symbol} calculator
              </h4>
              <div className="flex items-center gap-2 rounded-full border border-[#D8D7F1] bg-white px-3 py-1.5">
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#4E4F6A]">
                  Crypto amount
                </span>
                <input
                  aria-label="Preview crypto amount"
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={previewCryptoUnits}
                  onChange={(e) => setPreviewCryptoUnits(e.target.value)}
                  className="w-20 bg-transparent text-sm font-semibold text-[#03034D] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoadingLiveExchangeRate ? (
          <div className="rounded-[20px] border border-dashed border-[#CAC8E8] bg-[#F7F7FE] px-4 py-5 text-sm text-[#4E4F6A]">
            Loading live CoinGecko rate for {symbol}...
          </div>
        ) : coinGeckoRate > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[22px] bg-[#F7F7FE] border border-[#E2E1F8] p-4">
              <p className="text-sm font-semibold text-[#03034D]">Rate to Sell to User</p>
              <p className="text-xs text-[#6A6B89] mt-1">Uses the Sell Rate field.</p>
              <div className="mt-4 space-y-2 text-sm text-[#0E0F0C]">
                <p>
                  {formatForDisplayLocalized(normalizedPreviewCryptoUnits, symbol)} {symbol} × ${formatForDisplayLocalized(coinGeckoRate, "USD")} USD × ₦{formatForDisplayLocalized(sellToUserRate, "NGN")}/USD
                </p>
                <p className="text-base font-semibold text-[#03034D]">
                  = ₦{formatForDisplayLocalized(sellToUserPreview, "NGN")}
                </p>
              </div>
            </div>

            <div className="rounded-[22px] bg-[#F7F7FE] border border-[#E2E1F8] p-4">
              <p className="text-sm font-semibold text-[#03034D]">Rate to Buy from User</p>
              <p className="text-xs text-[#6A6B89] mt-1">Uses the Buy Rate field.</p>
              <div className="mt-4 space-y-2 text-sm text-[#0E0F0C]">
                <p>
                  {formatForDisplayLocalized(normalizedPreviewCryptoUnits, symbol)} {symbol} × ${formatForDisplayLocalized(coinGeckoRate, "USD")} USD × ₦{formatForDisplayLocalized(buyFromUserRate, "NGN")}/USD
                </p>
                <p className="text-base font-semibold text-[#03034D]">
                  = ₦{formatForDisplayLocalized(buyFromUserPreview, "NGN")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#CAC8E8] bg-[#F7F7FE] px-4 py-5 text-sm text-[#4E4F6A]">
            Live CoinGecko pricing is unavailable for this coin right now.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          id="minTradeAmount"
          placeholder="e.g. 100"
          value={minTradeAmount}
          onChange={(e) => { setMinTradeAmount(e.target.value); onChangeInputField("minTransactionLimit", e.target.value) }}
          label="Min trade amount (token)"
          type="text"
          inputMode="decimal"
        />
        <PillInput
          id="maxTradeAmount"
          placeholder="e.g. 1000000"
          value={maxTradeAmount}
          onChange={(e) => { setMaxTradeAmount(e.target.value); onChangeInputField("maxTransactionLimit", e.target.value) }}
          label="Max trade amount (token)"
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
          label="Min Transaction Amount — Anonymous (token)"
          type="text"
          inputMode="decimal"
          step="0.1"
        />
        <PillInput
          id="maxTransactionAmountForAnonymousUsers"
          placeholder="e.g. 1000000"
          value={maxTradeAmountForAnonymous}
          onChange={(e) => { setMaxTradeAmountForAnonymous(e.target.value); onChangeInputField("maxTradeAmountForAnonymous", e.target.value) }}
          label="Max Transaction Amount — Anonymous (token)"
          type="text"
          inputMode="decimal"
        />
      </div>
    </div>
  )
}

export default EditTradeLimits;
