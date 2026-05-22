import { useState } from 'react'
import { BLOCKCHAIN_ENVIRONMENT_OPTIONS, CRYPTO_NETWORK_OPTIONS } from "../../../../util/constants.util.ts";
import type { EditSupportedCryptoAndAdminWalletRequestType } from '../../../../schemas/crypto.schema'
import type { AdminCryptoWalletResponsePayload } from '../../../../types/response.payload.types';
import { PillInput } from '../../../ui/input'
import { Switch } from '../../../ui/switch'
import { Checkbox } from '../../../ui/checkbox'
import { LabeledSelect } from '../../../ui/select'

const ACTIVE_NETWORKS = CRYPTO_NETWORK_OPTIONS.filter((opt) => opt.value !== undefined) as Array<{ value: string; label: string }>;
type WalletEntryFormState = {
  walletAddress: string;
  blockchainEnvironment: "testnet" | "mainnet";
};

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

  const initialWalletEntries = adminCryptoWallets.reduce<Record<string, WalletEntryFormState>>((acc, w) => {
    if (w.network) {
      acc[w.network] = {
        walletAddress: w.walletAddress,
        blockchainEnvironment: w.blockchainEnvironment ?? "testnet",
      };
    }
    return acc;
  }, {});
  const [walletEntries, setWalletEntries] = useState<Record<string, WalletEntryFormState>>(initialWalletEntries);

  const handleNetworkToggle = (networkValue: string) => {
    const updated = selectedNetworks.includes(networkValue)
      ? selectedNetworks.filter((n) => n !== networkValue)
      : [...selectedNetworks, networkValue];
    setSelectedNetworks(updated);
    onChangeInputField('networks', updated);
    const wallets = updated.map((n) => ({
      network: n,
      walletAddress: walletEntries[n]?.walletAddress ?? '',
      blockchainEnvironment: walletEntries[n]?.blockchainEnvironment ?? "testnet",
    }));
    onChangeInputField('wallets', wallets);
  };

  const handleWalletAddressChange = (network: string, address: string) => {
    const updated = {
      ...walletEntries,
      [network]: {
        walletAddress: address,
        blockchainEnvironment: walletEntries[network]?.blockchainEnvironment ?? "testnet",
      },
    };
    setWalletEntries(updated);
    const wallets = selectedNetworks.map((n) => ({
      network: n,
      walletAddress: updated[n]?.walletAddress ?? '',
      blockchainEnvironment: updated[n]?.blockchainEnvironment ?? "testnet",
    }));
    onChangeInputField('wallets', wallets);
  };

  const handleWalletEnvironmentChange = (network: string, blockchainEnvironment: "testnet" | "mainnet") => {
    const updated = {
      ...walletEntries,
      [network]: {
        walletAddress: walletEntries[network]?.walletAddress ?? "",
        blockchainEnvironment,
      },
    };
    setWalletEntries(updated);
    const wallets = selectedNetworks.map((n) => ({
      network: n,
      walletAddress: updated[n]?.walletAddress ?? '',
      blockchainEnvironment: updated[n]?.blockchainEnvironment ?? "testnet",
    }));
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
                <div className="ml-7 grid gap-3">
                  <PillInput
                    label={`${opt.value} Deposit Wallet Address`}
                    placeholder={`Enter ${opt.value} wallet address`}
                    value={walletEntries[opt.value]?.walletAddress ?? ''}
                    onChange={(e) => handleWalletAddressChange(opt.value, e.target.value)}
                  />
                  <LabeledSelect
                    label="Blockchain Environment"
                    value={walletEntries[opt.value]?.blockchainEnvironment ?? "testnet"}
                    onValueChange={(value) => handleWalletEnvironmentChange(opt.value, value as "testnet" | "mainnet")}
                    options={BLOCKCHAIN_ENVIRONMENT_OPTIONS}
                    className="h-14"
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
