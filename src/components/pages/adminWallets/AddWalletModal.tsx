import { useState } from "react";
import Modal from "../../ui/modal";
import { PillInput } from "../../ui/input";
import { PillSelect } from "../../ui/select";
import { CRYPTO_NETWORK_OPTIONS } from "../../../util/constants.util.ts";
import type { SearchSupportedCryptoData } from "../../../types/response.payload.types";

const ACTIVE_NETWORKS = CRYPTO_NETWORK_OPTIONS.filter(
  (opt) => opt.value !== undefined,
) as Array<{ value: string; label: string }>;

interface AddWalletModalProps {
  open: boolean;
  onClose: () => void;
  walletType: "SENDING" | "RECEIVING";
  cryptos: SearchSupportedCryptoData[];
  defaultCryptoId?: string;
  onSubmit: (payload: {
    cryptoId: string;
    network: string;
    walletAddress: string;
    walletLabel?: string;
    blockchainEnvironment: "testnet" | "mainnet";
  }) => void;
  isSubmitting?: boolean;
}

const AddWalletModal = ({
  open,
  onClose,
  walletType,
  cryptos,
  defaultCryptoId,
  onSubmit,
  isSubmitting,
}: AddWalletModalProps) => {
  const [cryptoId, setCryptoId] = useState(defaultCryptoId ?? "");
  const [network, setNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLabel, setWalletLabel] = useState("");
  const [blockchainEnvironment, setBlockchainEnvironment] = useState<"testnet" | "mainnet">("mainnet");

  const cryptoOptions = cryptos.map((c) => ({ value: c.id, label: `${c.symbol} — ${c.name}` }));
  const environmentOptions = [
    { value: "mainnet", label: "Mainnet" },
    { value: "testnet", label: "Testnet" },
  ];

  const isValid = cryptoId.length > 0 && network.length > 0 && walletAddress.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      cryptoId,
      network,
      walletAddress: walletAddress.trim(),
      walletLabel: walletLabel.trim() || undefined,
      blockchainEnvironment,
    });
  };

  const title = walletType === "SENDING" ? "Add Sending Wallet" : "Add Receiving Wallet";
  const description = walletType === "SENDING"
    ? "Used by the platform to pay out funds for user Buy Orders."
    : "External target address where swept user deposits are sent (e.g. cold storage or multisig).";

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="space-y-1">
        <PillSelect
          label="Cryptocurrency"
          value={cryptoId}
          onValueChange={setCryptoId}
          options={cryptoOptions}
          placeholder="Select a coin"
        />
        <PillSelect
          label="Network"
          value={network}
          onValueChange={setNetwork}
          options={ACTIVE_NETWORKS}
          placeholder="Select network"
        />
        <PillInput
          label={walletType === "SENDING" ? "Wallet Address" : "External Address"}
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <PillInput
          label="Label (optional)"
          placeholder="e.g. Primary Buy Payout Wallet"
          value={walletLabel}
          onChange={(e) => setWalletLabel(e.target.value)}
        />
        <PillSelect
          label="Blockchain Environment"
          value={blockchainEnvironment}
          onValueChange={(v) => setBlockchainEnvironment(v as "testnet" | "mainnet")}
          options={environmentOptions}
        />
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-full text-sm font-medium border border-[#ECECEC] text-[#454745] hover:bg-[#F5F5FF] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#03034D] text-white hover:bg-[#050568] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Wallet"}
        </button>
      </div>
    </Modal>
  );
};

export default AddWalletModal;
