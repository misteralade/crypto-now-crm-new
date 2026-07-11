import { Fragment, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../components/global/LoadingSpinner";
import SelectField from "../components/global/SelectField";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import { useCryptoQuery } from "../queries/crypto.querries";
import {
  useAdminCreatePlatformWalletMutation,
} from "../queries/crypto.querries";

const AddWalletPage = () => {
  const navigate = useNavigate();
  const { walletType: walletTypeParam } = useParams({ from: '/dashboard/admin-wallets/add/$walletType' });
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();

  const [formData, setFormData] = useState({
    cryptoId: "",
    network: "",
    walletAddress: "",
    walletLabel: "",
    blockchainEnvironment: "testnet" as "testnet" | "mainnet",
    isActive: true,
  });

  const [supportedNetworks, setSupportedNetworks] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createWalletMutation = useAdminCreatePlatformWalletMutation();

  const walletType = (walletTypeParam === "SENDING" || walletTypeParam === "RECEIVING")
    ? walletTypeParam
    : "SENDING";

  const heading = walletType === "SENDING"
    ? "Add Sending Wallet"
    : "Add Receiving Wallet";

  const description = walletType === "SENDING"
    ? "Funds used by the platform to pay out to users for Buy Orders."
    : "External target addresses where swept user deposits are transferred.";

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCryptoId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cryptoId: newCryptoId,
      network: "", // Reset network when crypto changes
    }));
    setErrors((prev) => ({ ...prev, cryptoId: "", network: "" }));

    // Update supported networks
    const selectedCrypto = (allSupportedCrypto ?? []).find((c) => c.id === newCryptoId);
    setSupportedNetworks(selectedCrypto?.networks || []);
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      network: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, network: "" }));
  };

  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      blockchainEnvironment: e.target.value as "testnet" | "mainnet",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cryptoId) {
      newErrors.cryptoId = "Cryptocurrency is required";
    }
    if (!formData.network) {
      newErrors.network = "Network is required";
    }
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address is required";
    }
    if (formData.walletAddress.trim().length < 20) {
      newErrors.walletAddress = "Wallet address looks too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    createWalletMutation.mutate(
      {
        cryptoId: formData.cryptoId,
        network: formData.network as any,
        walletAddress: formData.walletAddress,
        walletLabel: formData.walletLabel || undefined,
        blockchainEnvironment: formData.blockchainEnvironment,
        walletType,
        isActive: formData.isActive,
      },
      {
        onSuccess: () => {
          navigate({ to: "/dashboard/admin-wallets", search: { cryptoId: undefined } });
        },
      }
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto max-w-2xl">
        {loadingAllSupportedCrypto ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" message="Loading cryptocurrencies..." fullScreen={false} />
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
              <div>
                <h1 className="text-3xl font-bold text-[#03034D]">{heading}</h1>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white border border-[#E9E7E2] rounded-2xl p-6 mb-6 space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cryptocurrency Dropdown */}
                  <SelectField
                    id="crypto"
                    label="Cryptocurrency"
                    value={formData.cryptoId}
                    onChange={handleCryptoChange}
                    required
                    error={errors.cryptoId}
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
                    required
                    error={errors.network}
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

                  {/* Environment Dropdown */}
                  <SelectField
                    id="environment"
                    label="Blockchain Environment"
                    value={formData.blockchainEnvironment}
                    onChange={handleEnvironmentChange}
                  >
                    <option value="testnet">Testnet</option>
                    <option value="mainnet">Mainnet</option>
                  </SelectField>

                  {/* Wallet Type (Read-only) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
                      Wallet Type
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        {walletType === "SENDING" ? "Buy Payout" : "Sweep Target"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E9E7E2]" />

                {/* Wallet Address */}
                <div>
                  <label htmlFor="walletAddress" className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm ${
                      errors.walletAddress ? "border-red-500" : "border-[#E9E7E2]"
                    }`}
                    placeholder="Enter wallet address"
                  />
                  {errors.walletAddress && (
                    <p className="text-xs text-red-500 mt-1">{errors.walletAddress}</p>
                  )}
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
                    placeholder="e.g., Hot Wallet, Primary Payout"
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
            </div>

            {/* Action Buttons */}
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
                disabled={createWalletMutation.isPending}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
              >
                {createWalletMutation.isPending ? "Creating..." : "Save Wallet"}
              </button>
            </div>
          </Fragment>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default AddWalletPage;
