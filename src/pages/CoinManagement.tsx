import { useMemo } from 'react'
import { useCoinManagementPage } from '../hooks/pages/useCoinManagementPage'
import {
  SearchSupportedCryptoColumn,
  SearchSupportedCryptoDataRow,
} from '../components/tables/CoinManagementTables'
import Table from '../components/table'
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import CoinManagementControls from "../components/pages/coinManagement/CoinManagementControls.tsx";
import ConfirmModal from "../components/global/ConfirmModal.tsx";
import CoinDetailsModal from "../components/pages/coinManagement/CoinDetailsModal.tsx";

const CoinManagement = () => {
  const {
    // 🧩 Values
    query,
    supportedCrypto,
    loadingSupportedCrypto,
    deleteCoinModal,
    selectedCoin,

    // ⚙️ Functions
    openAddCoin,
    handleCoinSearchChange,
    handleViewCoinDetails,
    handleOpenCoinDetails,
    handleCloseCoinDetails,
    handleDisableCoin,
    handleDeleteCryptoCurrency,
    toggleDeleteCoinModal,
    handleConfirmDeleteCryptoCurrency,
  } = useCoinManagementPage()

  const columns = useMemo(() => SearchSupportedCryptoColumn(
    handleViewCoinDetails,
    handleDeleteCryptoCurrency,
    handleDisableCoin,
  ), [])
  
  const data = useMemo(
     
    () => SearchSupportedCryptoDataRow(supportedCrypto?.supportedCryptos) ?? [],
    [supportedCrypto?.supportedCryptos, loadingSupportedCrypto],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Coin/Wallet Management" />
        
        {/* Controls */}
        <CoinManagementControls
          onAddCoin={openAddCoin}
          searchValue={query}
          onSearchChange={handleCoinSearchChange}
        />
        
        <div className="mt-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
            <Table
              data={data}
              columns={columns}
              loading={loadingSupportedCrypto}
              onRowClick={(row) => handleOpenCoinDetails(row.id)}
            />
          </div>
        </div>
      </div>
      
      <ConfirmModal
        open={deleteCoinModal}
        actionType="delete"
        onClose={toggleDeleteCoinModal}
        onConfirm={handleConfirmDeleteCryptoCurrency}
        message="Are you sure you want to delete this coin?"
        confirmText="Delete Coin"
      />

      <CoinDetailsModal
        coin={selectedCoin}
        open={selectedCoin !== null}
        onClose={handleCloseCoinDetails}
      />
    </AuthenticatedLayout>
  )
}

export default CoinManagement
