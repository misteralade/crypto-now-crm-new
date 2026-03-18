import { useState } from 'react'
import { CRYPTO_NETWORK_OPTIONS } from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from '../../../../schemas/crypto.schema'
import type { AdminCryptoWalletResponsePayload } from '../../../../types/response.payload.types';
import { PillInput } from '../../../ui/input'
import { Switch } from '../../../ui/switch'
import { Checkbox } from '../../../ui/checkbox'

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
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">Coin Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <PillInput
          label="Coin Name"
          placeholder="e.g. Bitcoin"
          value={name}
          id="name"
          onChange={(e) => onChangeInputField('name', e.target.value)}
        />
        <PillInput
          label="Symbol"
          placeholder={symbol}
          value={symbol}
          disabled
          id="symbol"
        />
      </div>

      {/* Supported Networks */}
      <div className="mb-6">
        <label className="block text-[13px] font-medium text-[#454745] mb-3">Supported Networks</label>
        <div className="flex flex-col gap-4">
          {ACTIVE_NETWORKS.map((opt) => (
            <div key={opt.value} className="flex flex-col gap-3">
              <Checkbox
                id={`network-${opt.value}`}
                label={`${opt.value} — ${opt.label}`}
                checked={selectedNetworks.includes(opt.value)}
                onCheckedChange={() => handleNetworkToggle(opt.value)}
              />
              {selectedNetworks.includes(opt.value) && (
                <div className="ml-7">
                  <PillInput
                    label={`${opt.value} Deposit Wallet Address`}
                    placeholder={`Enter ${opt.value} wallet address`}
                    value={walletAddresses[opt.value] ?? ''}
                    onChange={(e) => handleWalletAddressChange(opt.value, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:gap-x-8 gap-6 mb-6">
        <div>
          <label className="block text-[13px] font-medium text-[#454745] mb-3">Status</label>
          <Switch
            id="isActive"
            label="Active"
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(checked)
              onChangeInputField('isActive', checked)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default EditCoinDetails;
