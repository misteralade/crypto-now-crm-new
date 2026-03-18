import { useState } from 'react';
import { CRYPTO_NETWORK_OPTIONS } from "../../../../util/constants.util.ts";
import type { CreateSupportedCryptoAndAdminWalletRequestType } from '../../../../schemas/crypto.schema'
import LabeledPillInput from "../../../global/LabeledPillInput";

const ACTIVE_NETWORKS = CRYPTO_NETWORK_OPTIONS.filter((opt) => opt.value !== undefined) as Array<{ value: string; label: string }>;

interface CoinDetailsProps {
  onChangeInputField: (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const CoinDetails = ({ onChangeInputField }: CoinDetailsProps) => {
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>({});
  const [isStableCoin, setIsStableCoin] = useState(false);

  const handleNetworkToggle = (networkValue: string) => {
    const updated = selectedNetworks.includes(networkValue)
      ? selectedNetworks.filter((n) => n !== networkValue)
      : [...selectedNetworks, networkValue];
    setSelectedNetworks(updated);
    onChangeInputField("networks", updated);
    // rebuild wallets array
    const updatedWallets = updated.map((n) => ({ network: n, walletAddress: walletAddresses[n] ?? '' }));
    onChangeInputField("wallets", updatedWallets);
  };

  const handleWalletAddressChange = (network: string, address: string) => {
    const updated = { ...walletAddresses, [network]: address };
    setWalletAddresses(updated);
    const wallets = selectedNetworks.map((n) => ({ network: n, walletAddress: updated[n] ?? '' }));
    onChangeInputField("wallets", wallets);
  };

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">Coin Details</h3>

      {/* First row: Coin Name and Symbol */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            label="Coin Name"
            placeholder="Bitcoin"
            valueClass="text-[18px]"
            id="name"
            onChange={(e) => onChangeInputField("name", e.target.value)}
          />
        </div>
        <div>
          <LabeledPillInput
            label="Symbol"
            valueClass="text-[18px]"
            placeholder="BTC"
            id="symbol"
            onChange={(e) => onChangeInputField("symbol", e.target.value)}
          />
        </div>
      </div>

      {/* Supported Networks + wallet address per network */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#454745] mb-3">
          Supported Networks
        </label>
        <div className="flex flex-col gap-4">
          {ACTIVE_NETWORKS.map((opt) => (
            <div key={opt.value}>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#03034D] focus:ring-[#03034D]"
                  checked={selectedNetworks.includes(opt.value)}
                  onChange={() => handleNetworkToggle(opt.value)}
                />
                <span className="text-[16px] text-[#454745] font-medium">{opt.value} — {opt.label}</span>
              </label>
              {selectedNetworks.includes(opt.value) && (
                <div className="ml-6">
                  <LabeledPillInput
                    label={`${opt.value} Deposit Wallet Address`}
                    placeholder={`Enter ${opt.value} wallet address`}
                    valueClass="text-[16px] text-[#4B5563]"
                    value={walletAddresses[opt.value] ?? ''}
                    onChange={(e) => handleWalletAddressChange(opt.value, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status and Stable Coin toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-x-8 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#454745] mb-3">Status</label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                type="checkbox"
                className="sr-only peer"
                onChange={(e) => onChangeInputField("isActive", e.target.checked)}
                defaultChecked
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
            </label>
            <span className="text-[16px] font-semibold text-[#454745]">Active</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#454745] mb-3">Stable Coin</label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isStableCoin"
                type="checkbox"
                className="sr-only peer"
                checked={isStableCoin}
                onChange={(e) => {
                  setIsStableCoin(e.target.checked);
                  onChangeInputField("isStableCoin", e.target.checked);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
            </label>
            <span className="text-[16px] font-semibold text-[#454745]">Stable Coin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoinDetails;
