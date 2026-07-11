import { useSearch } from "@tanstack/react-router";
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";
import WalletCardSection from "../components/pages/adminWallets/WalletCardSection.tsx";
import FuelingWalletsSection from "../components/pages/adminWallets/FuelingWalletsSection.tsx";
import { useCryptoQuery } from "../queries/crypto.querries";

const AdminWalletsPage = () => {
  const search = useSearch({ from: "/dashboard/admin-wallets/" });
  const { allSupportedCrypto, loadingAllSupportedCrypto } = useCryptoQuery();

  const cryptos = allSupportedCrypto ?? [];

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Admin Wallets" subtitle="Manage sending, receiving, and fueling wallets across all supported coins." />

        {loadingAllSupportedCrypto ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="lg" message="Loading admin wallets..." fullScreen={false} />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <WalletCardSection walletType="SENDING" cryptos={cryptos} defaultCryptoId={search.cryptoId} />
            <WalletCardSection walletType="RECEIVING" cryptos={cryptos} defaultCryptoId={search.cryptoId} />
            <FuelingWalletsSection cryptos={cryptos} />
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminWalletsPage;
