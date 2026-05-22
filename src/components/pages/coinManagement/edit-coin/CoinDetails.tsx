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
  network: string;
  walletAddress: string;
  blockchainEnvironment: "testnet" | "mainnet";
};

const walletKey = (network: string, blockchainEnvironment: "testnet" | "mainnet") =>
  `${network}:${blockchainEnvironment}`;

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

  const initialWalletEntries = adminCryptoWallets.reduce<Record<string, WalletEntryFormState>>(
    (acc, w) => {
      if (w.network) {
        const blockchainEnvironment = w.blockchainEnvironment ?? "testnet";
        acc[walletKey(w.network, blockchainEnvironment)] = {
          network: w.network,
          walletAddress: w.walletAddress,
          blockchainEnvironment,
        };
      }
      return acc;
    },
    {},
  );
  const [walletEntries, setWalletEntries] = useState<Record<string, WalletEntryFormState>>(initialWalletEntries);

  const walletEntriesForNetwork = (network: string) =>
    Object.entries(walletEntries)
      .filter(([, entry]) => entry.network === network)
      .map(([key, entry]) => ({ key, ...entry }));

  const emitWallets = (entries: Record<string, WalletEntryFormState>, networksToUse: string[]) => {
    const wallets = Object.values(entries)
      .filter((entry) => networksToUse.includes(entry.network))
      .map((entry) => ({
        network: entry.network,
        walletAddress: entry.walletAddress,
        blockchainEnvironment: entry.blockchainEnvironment,
      }));
    onChangeInputField('wallets', wallets);
  };

  const handleNetworkToggle = (networkValue: string) => {
    const updated = selectedNetworks.includes(networkValue)
      ? selectedNetworks.filter((n) => n !== networkValue)
      : [...selectedNetworks, networkValue];
    setSelectedNetworks(updated);
    onChangeInputField('networks', updated);

    const nextEntries: Record<string, WalletEntryFormState> = selectedNetworks.includes(networkValue)
      ? Object.fromEntries(
          Object.entries(walletEntries).filter(([, entry]) => entry.network !== networkValue),
        ) as Record<string, WalletEntryFormState>
      : walletEntriesForNetwork(networkValue).length > 0
        ? walletEntries
        : {
            ...walletEntries,
            [walletKey(networkValue, "testnet")]: {
              network: networkValue,
              walletAddress: "",
              blockchainEnvironment: "testnet",
            },
          };

    setWalletEntries(nextEntries);
    emitWallets(nextEntries, updated);
  };

  const handleWalletAddressChange = (
    network: string,
    blockchainEnvironment: "testnet" | "mainnet",
    address: string,
  ) => {
    const key = walletKey(network, blockchainEnvironment);
    const updated: Record<string, WalletEntryFormState> = {
      ...walletEntries,
      [key]: {
        network,
        walletAddress: address,
        blockchainEnvironment,
      },
    };
    setWalletEntries(updated);
    emitWallets(updated, selectedNetworks);
  };

  const handleWalletEnvironmentChange = (
    network: string,
    currentEnvironment: "testnet" | "mainnet",
    blockchainEnvironment: "testnet" | "mainnet",
  ) => {
    const currentKey = walletKey(network, currentEnvironment);
    const nextKey = walletKey(network, blockchainEnvironment);
    if (currentKey === nextKey) return;

    const currentEntry = walletEntries[currentKey];
    if (!currentEntry) return;

    const updated: Record<string, WalletEntryFormState> = {
      ...Object.fromEntries(
        Object.entries(walletEntries).filter(([key]) => key !== currentKey),
      ) as Record<string, WalletEntryFormState>,
      [nextKey]: {
        network,
        walletAddress: currentEntry.walletAddress,
        blockchainEnvironment,
      },
    };
    setWalletEntries(updated);
    emitWallets(updated, selectedNetworks);
  };

  const handleAddWalletEntry = (network: string) => {
    const existingEnvironments = new Set(
      walletEntriesForNetwork(network).map((entry) => entry.blockchainEnvironment),
    );
    const nextEnvironment =
      existingEnvironments.has("testnet") && !existingEnvironments.has("mainnet")
        ? "mainnet"
        : !existingEnvironments.has("testnet")
          ? "testnet"
          : null;

    if (!nextEnvironment) {
      return;
    }

    const updated: Record<string, WalletEntryFormState> = {
      ...walletEntries,
      [walletKey(network, nextEnvironment)]: {
        network,
        walletAddress: "",
        blockchainEnvironment: nextEnvironment,
      },
    };
    setWalletEntries(updated);
    emitWallets(updated, selectedNetworks);
  };

  const handleRemoveWalletEntry = (
    network: string,
    blockchainEnvironment: "testnet" | "mainnet",
  ) => {
    const key = walletKey(network, blockchainEnvironment);
    const updatedEntries = Object.fromEntries(
      Object.entries(walletEntries).filter(([entryKey]) => entryKey !== key),
    ) as Record<string, WalletEntryFormState>;

    const stillHasWalletsForNetwork = Object.values(updatedEntries).some(
      (entry) => entry.network === network,
    );
    const updatedNetworks = stillHasWalletsForNetwork
      ? selectedNetworks
      : selectedNetworks.filter((item) => item !== network);

    setWalletEntries(updatedEntries);
    setSelectedNetworks(updatedNetworks);
    onChangeInputField('networks', updatedNetworks);
    emitWallets(updatedEntries, updatedNetworks);
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
                  {walletEntriesForNetwork(opt.value).map((entry) => (
                    <div key={`${opt.value}-${entry.blockchainEnvironment}`} className="grid gap-3 rounded-2xl border border-[#ECECEC] bg-[#FCFCFE] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#03034D]">
                          {entry.blockchainEnvironment}
                        </span>
                        <button
                          type="button"
                          className="text-[11px] font-medium text-[#D03C3C] hover:opacity-70"
                          onClick={() => handleRemoveWalletEntry(opt.value, entry.blockchainEnvironment)}
                        >
                          Remove
                        </button>
                      </div>
                      <PillInput
                        label={`${opt.value} Deposit Wallet Address`}
                        placeholder={`Enter ${opt.value} wallet address`}
                        value={entry.walletAddress}
                        onChange={(e) => handleWalletAddressChange(opt.value, entry.blockchainEnvironment, e.target.value)}
                      />
                      <LabeledSelect
                        label="Blockchain Environment"
                        value={entry.blockchainEnvironment}
                        onValueChange={(value) => handleWalletEnvironmentChange(opt.value, entry.blockchainEnvironment, value as "testnet" | "mainnet")}
                        options={BLOCKCHAIN_ENVIRONMENT_OPTIONS}
                        className="h-14"
                      />
                    </div>
                  ))}
                  {walletEntriesForNetwork(opt.value).length < 2 && (
                    <button
                      type="button"
                      className="self-start text-[12px] font-medium text-[#03034D] hover:opacity-70"
                      onClick={() => handleAddWalletEntry(opt.value)}
                    >
                      Add {walletEntriesForNetwork(opt.value).length === 0 ? "testnet" : "mainnet"} wallet
                    </button>
                  )}
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
