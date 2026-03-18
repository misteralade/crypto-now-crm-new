import { useState } from 'react'
import { CRYPTO_NETWORK_OPTIONS } from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from '../../../../schemas/crypto.schema'
import LabeledPillInput from '../../../global/LabeledPillInput';
import type { AdminCryptoWalletResponsePayload } from '../../../../types/response.payload.types';

const ACTIVE_NETWORKS = CRYPTO_NETWORK_OPTIONS.filter((opt) => opt.value !== undefined) as Array<{ value: string; label: string }>;

interface EditCoinDetailsProps {
  name: string;
  symbol: string;
  networks?: string[];
  active: boolean;
  adminCryptoWallets?: AdminCryptoWalletResponsePayload[];
  onChangeInputField: (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const EditCoinDetails = ({
  name,
  symbol,
  networks = [],
  active,
  adminCryptoWallets = [],
  onChangeInputField,
}: EditCoinDetailsProps) => {
  const [isActive, setIsActive] = useState(active);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(networks);

  // Pre-fill wallet addresses from existing adminCryptoWallets
  const initialAddresses = adminCryptoWallets.reduce<Record<string, string>>((acc, w) => {
    if (w.network) acc[w.network] = w.walletAddress;
    return acc;
  }, {});
  const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>(initialAddresses);

  const handleNetworkToggle = (networkValue: string) => {
    const updated = selectedNetworks.includes(networkValue)
      ? selectedNetworks.filter((n) => n !== networkValue)
      : [...selectedNetworks, networkValue];
    setSelectedNetworks(updated);
    onChangeInputField('networks', updated);
    const wallets = updated.map((n) => ({ network: n, walletAddress: walletAddresses[n] ?? '' }));
    onChangeInputField('wallets', wallets);
  };

  const handleWalletAddressChange = (network: string, address: string) => {
    const updated = { ...walletAddresses, [network]: address };
    setWalletAddresses(updated);
    const wallets = selectedNetworks.map((n) => ({ network: n, walletAddress: updated[n] ?? '' }));
    onChangeInputField('wallets', wallets);
  };

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Coin Details
      </h3>

      {/* Coin Name and Symbol */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <LabeledPillInput
            label="Coin Name"
            placeholder="e.g. Bitcoin"
            value={name}
            valueClass="text-[18px]"
            id="name"
            onChange={(e) => onChangeInputField('name', e.target.value)}
          />
        </div>
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

      {/* Supported Networks + per-network wallet address */}
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

      {/* Status toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-x-8 gap-6 mb-6">
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
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
            </label>
            <span className="text-[16px] font-semibold text-[#454745]">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCoinDetails;
