import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../components/global/LoadingSpinner";
import SelectField from "../components/global/SelectField";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import { useCryptoQuery } from "../queries/crypto.querries";
import {
  useAdminUpdatePlatformWalletMutation,
} from "../queries/crypto.querries";


const EditWalletPage = () => {
  const navigate = useNavigate();
  const { walletId } = useParams({ from: '/dashboard/admin-wallets/edit/$walletId' });
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();

  const [walletData, setWalletData] = useState<{
    id: string;
    cryptoId: string;
    cryptoSymbol: string;
    cryptoName: string;
    network: string;
    walletAddress: string;
    walletLabel?: string;
    blockchainEnvironment: "testnet" | "mainnet";
    walletType: "SENDING" | "RECEIVING" | "FUELING";
    isActive: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    cryptoId: "",
    network: "",
    walletType: "SENDING" as "SENDING" | "RECEIVING",
    walletAddress: "",
    walletLabel: "",
    isActive: true,
  });

  const [supportedNetworks, setSupportedNetworks] = useState<string[]>([]);

  const updateWalletMutation = useAdminUpdatePlatformWalletMutation();

  useEffect(() => {
    if (!allSupportedCrypto || loadingAllSupportedCrypto) return;

    const foundWallet = (allSupportedCrypto ?? []).reduce((acc, crypto) => {
      if (acc) return acc;
      const wallet = (crypto.adminCryptoWallets ?? []).find((w) => w.id === walletId);
      if (wallet) {
        return {
          id: wallet.id,
          cryptoId: crypto.id,
          cryptoSymbol: crypto.symbol,
          cryptoName: crypto.name,
          network: wallet.network,
          walletAddress: wallet.walletAddress,
          walletLabel: wallet.walletLabel,
          blockchainEnvironment: wallet.blockchainEnvironment,
          walletType: wallet.walletType,
          isActive: typeof wallet.isActive === "boolean" ? wallet.isActive : wallet.isActive === "true" || (wallet.isActive as any) === 1,
        };
      }
      return null;
    }, null as any);

    if (foundWallet) {
      setWalletData(foundWallet);
      setFormData({
        cryptoId: foundWallet.cryptoId,
        network: foundWallet.network,
        walletType: foundWallet.walletType as "SENDING" | "RECEIVING",
        walletAddress: foundWallet.walletAddress,
        walletLabel: foundWallet.walletLabel || "",
        isActive: foundWallet.isActive ?? true,
      });

      // Set supported networks for the selected crypto
      const selectedCrypto = (allSupportedCrypto ?? []).find((c) => c.id === foundWallet.cryptoId);
      if (selectedCrypto) {
        setSupportedNetworks(selectedCrypto.networks || []);
      }
    }
  }, [allSupportedCrypto, walletId, loadingAllSupportedCrypto]);

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCryptoId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cryptoId: newCryptoId,
      network: "", // Reset network when crypto changes
    }));

    // Update supported networks
    const selectedCrypto = (allSupportedCrypto ?? []).find((c) => c.id === newCryptoId);
    setSupportedNetworks(selectedCrypto?.networks || []);
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      network: e.target.value,
    }));
  };

  const handleWalletTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      walletType: e.target.value as "SENDING" | "RECEIVING",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSave = () => {
    if (!walletData || !formData.cryptoId || !formData.network) return;

    updateWalletMutation.mutate(
      {
        walletId: walletData.id,
        cryptoId: formData.cryptoId,
        network: formData.network,
        walletType: formData.walletType,
        walletAddress: formData.walletAddress,
        walletLabel: formData.walletLabel,
        isActive: formData.isActive,
      },
      {
        onSuccess: () => {
          navigate({ to: "/dashboard/admin-wallets", search: { cryptoId: undefined } });
        },
      }
    );
  };

  const isReadOnly = walletData?.walletType === "FUELING";
  const isModified =
    formData.cryptoId !== walletData?.cryptoId ||
    formData.network !== walletData?.network ||
    formData.walletType !== walletData?.walletType ||
    formData.walletAddress !== walletData?.walletAddress ||
    formData.walletLabel !== (walletData?.walletLabel || "") ||
    formData.isActive !== (walletData?.isActive ?? true);

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto max-w-2xl">
        {loadingAllSupportedCrypto || !walletData ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" message="Loading Wallet Details..." fullScreen={false} />
          </div>
        ) : (
          <Fragment>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/admin-wallets", search: { cryptoId: undefined } })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-[#03034D]">
                {isReadOnly ? "View" : "Edit"} Wallet
              </h1>
            </div>

            {/* Wallet Info Section */}
            <div className="bg-white border border-[#E9E7E2] rounded-2xl p-6 mb-6 space-y-6">
              {/* Configurable Fields */}
              {!isReadOnly ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Cryptocurrency Dropdown */}
                    <SelectField
                      id="crypto"
                      label="Cryptocurrency"
                      value={formData.cryptoId}
                      onChange={handleCryptoChange}
                    >
                      <option value="">Select a cryptocurrency</option>
                      {(allSupportedCrypto ?? []).map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.symbol} - {crypto.name}
                        </option>
                      ))}
                    </SelectField>

                    {/* Network Dropdown */}
                    <SelectField
                      id="network"
                      label="Network"
                      value={formData.network}
                      onChange={handleNetworkChange}
                      disabled={!formData.cryptoId || supportedNetworks.length === 0}
                    >
                      <option value="">
                        {!formData.cryptoId ? "Select cryptocurrency first" : "Select a network"}
                      </option>
                      {supportedNetworks.map((network) => (
                        <option key={network} value={network}>
                          {network}
                        </option>
                      ))}
                    </SelectField>

                    {/* Environment (Read-only) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Environment
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {walletData?.blockchainEnvironment}
                        </span>
                      </div>
                    </div>

                    {/* Wallet Type Dropdown */}
                    <SelectField
                      id="walletType"
                      label="Wallet Type"
                      value={formData.walletType}
                      onChange={handleWalletTypeChange}
                    >
                      <option value="SENDING">Buy Payout (Sending)</option>
                      <option value="RECEIVING">Sweep Target (Receiving)</option>
                    </SelectField>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E9E7E2]" />

                  {/* Wallet Address */}
                  <div>
                    <label htmlFor="walletAddress" className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E9E7E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      placeholder="Enter wallet address"
                    />
                  </div>

                  {/* Wallet Label */}
                  <div>
                    <label htmlFor="walletLabel" className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                      Wallet Label (Optional)
                    </label>
                    <input
                      type="text"
                      id="walletLabel"
                      name="walletLabel"
                      value={formData.walletLabel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-[#E9E7E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="e.g., Hot Wallet, Reserve Fund"
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E9E7E2]" />

                  {/* Active Status Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase">
                        Wallet Status
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.isActive ? "Active" : "Inactive"} - Sweep operations will {formData.isActive ? "include" : "skip"} this wallet
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleActive}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        formData.isActive ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ) : (
                /* Read-only Display for FUELING */
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Cryptocurrency
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-bold text-[#03034D]">{walletData?.cryptoSymbol}</span>
                        <span className="text-xs text-gray-500">{walletData?.cryptoName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Network
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-[#03034D]">{walletData?.network}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Environment
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {walletData?.blockchainEnvironment}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Wallet Type
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                          Gas Funding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E9E7E2] pt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                        Wallet Address
                      </label>
                      <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-600 break-all">
                        {walletData?.walletAddress}
                      </div>
                    </div>
                    {walletData?.walletLabel && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                          Wallet Label
                        </label>
                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                          {walletData.walletLabel}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            {!isReadOnly && (
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard/admin-wallets", search: { cryptoId: undefined } })}
                  className="px-6 py-2.5 border border-[#E9E7E2] rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isModified || updateWalletMutation.isPending}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
                >
                  {updateWalletMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {isReadOnly && (
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard/admin-wallets", search: { cryptoId: undefined } })}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Back to Wallets
                </button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default EditWalletPage;
