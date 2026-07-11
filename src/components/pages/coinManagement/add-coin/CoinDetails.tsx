import { useState } from "react";
import { CRYPTO_NETWORK_OPTIONS } from "../../../../util/constants.util.ts";
import type { CreateSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from "../../../ui/input";
import { Switch } from "../../../ui/switch";
import { Checkbox } from "../../../ui/checkbox";

const ACTIVE_NETWORKS = CRYPTO_NETWORK_OPTIONS.filter(
  (opt) => opt.value !== undefined,
) as Array<{ value: string; label: string }>;

interface CoinDetailsProps {
  onChangeInputField: (
    field: keyof CreateSupportedCryptoAndAdminWalletRequestType,
    value: unknown,
  ) => void;
}

const CoinDetails = ({ onChangeInputField }: CoinDetailsProps) => {
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isStableCoin, setIsStableCoin] = useState(false);

  const handleNetworkToggle = (networkValue: string) => {
    const updated = selectedNetworks.includes(networkValue)
      ? selectedNetworks.filter((n) => n !== networkValue)
      : [...selectedNetworks, networkValue];
    setSelectedNetworks(updated);
    onChangeInputField("networks", updated);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: SUPPORTED CRYPTO */}
      <div className="bg-white border border-[#E9E7E2] rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#0E0F0C]">Supported Crypto</h3>
          <p className="text-xs text-gray-500 mt-1">Configure basic metadata and active networks for the new cryptocurrency.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8">
          <PillInput
            label="Coin Name"
            placeholder="e.g. Bitcoin"
            id="name"
            onChange={(e) => onChangeInputField("name", e.target.value)}
          />
          <PillInput
            label="Symbol"
            placeholder="e.g. BTC"
            id="symbol"
            onChange={(e) => onChangeInputField("symbol", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-[13px] font-medium text-[#454745]">
            Supported Networks
          </label>
          <div className="flex flex-wrap gap-4">
            {ACTIVE_NETWORKS.map((opt) => (
              <Checkbox
                key={opt.value}
                id={`network-${opt.value}`}
                label={`${opt.value} — ${opt.label}`}
                checked={selectedNetworks.includes(opt.value)}
                onCheckedChange={() => handleNetworkToggle(opt.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedNetworks.length > 0 && (
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6 text-sm text-indigo-900">
          Wallets for this coin (sending, receiving, and fueling) are configured separately after
          creation. Once this coin is saved, go to{" "}
          <span className="font-semibold">Admin Wallets</span> in the sidebar to add and manage
          its wallets.
        </div>
      )}

      {/* SECTION 2: COIN METADATA & STATUS */}
      <div className="bg-white border border-[#E9E7E2] rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-semibold text-[#454745] mb-3">
            Active Status
          </label>
          <Switch
            id="isActive"
            label="Active"
            defaultChecked
            onCheckedChange={(checked) => onChangeInputField("isActive", checked)}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#454745] mb-3">
            Stable Coin
          </label>
          <Switch
            id="isStableCoin"
            label="Stable Coin"
            checked={isStableCoin}
            onCheckedChange={(checked) => {
              setIsStableCoin(checked);
              onChangeInputField("isStableCoin", checked);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
