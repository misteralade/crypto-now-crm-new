import { useMemo } from 'react'
import { useCoinManagementPage } from '../hooks/pages/useCoinManagementPage'
import {
  SearchSupportedCryptoColumn,
  SearchSupportedCryptoDataRow,
} from '../components/tables/CoinManagementTables'
import Table from '../components/table'
import TableFooter from "../components/tables/TableFooter";
import PageHeader from "../components/global/pageHeader.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import CoinManagementControls from "../components/pages/coinManagement/CoinManagementControls.tsx";

const CoinManagement = () => {
  const {
    // 🧩 Values
    query,
    supportedCrypto,
    loadingSupportedCrypto,
    pageSize,


    // ⚙️ Functions
    openAddCoin,
    handleCoinSearchChange,
    handlePageSizeChange,
    handlePageChange,
    handleViewCoinDetails,
    handleDisableCoin,
  } = useCoinManagementPage()

  const columns = useMemo(() => SearchSupportedCryptoColumn(
    handleViewCoinDetails,
    handleDisableCoin,
  ), [])
  
  const data = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    () => SearchSupportedCryptoDataRow(supportedCrypto?.supportedCryptos) ?? [],
    [supportedCrypto?.supportedCryptos, loadingSupportedCrypto],
  )

  return (
    <AuthenticatedLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader title="Coin Management" />
        
        {/* Controls */}
        <CoinManagementControls
          onAddCoin={openAddCoin}
          searchValue={query}
          onSearchChange={handleCoinSearchChange}
        />
        
        <div className="mt-6">
          <div className="space-y-4">
            <Table data={data} columns={columns} loading={loadingSupportedCrypto} />
            
            <TableFooter
              currentPage={supportedCrypto?.page || 1}
              totalPages={supportedCrypto?.totalPages || 1}
              pageSize={pageSize}
              totalItems={supportedCrypto?.count || 100}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default CoinManagement
