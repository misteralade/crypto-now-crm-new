import { useMemo } from 'react'
// import DisputesControls from "../components/pages/disputes/DisputesControls.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import {useDisputesPage} from "../hooks/pages/useDisputesPage.ts";
import {DisputeManagementColumn, DisputeManagementDataRow} from "../components/tables/DisputesTable.tsx";
import Table from "../components/table.tsx";
import TableFooter from "../components/tables/TableFooter.tsx";
import PageHeader from "../components/global/pageHeader.tsx";

const Disputes = () => {
  const {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    pageSize,
    // searchQuery,
    
    // ⚙️ Functions
    handleViewDisputeDetails,
    handleNavigateToTransactionPage,
    handleSortByField,
    handleNavigateToEditDisputePage,
    handlePageSizeChange,
    handlePageChange,
    // handleSearchChange,
  } = useDisputesPage();
  
  const columns = useMemo(() => DisputeManagementColumn(handleViewDisputeDetails, handleSortByField, handleNavigateToTransactionPage, handleNavigateToEditDisputePage),
    [
      handleViewDisputeDetails,
      handleSortByField,
      handleNavigateToTransactionPage,
      handleNavigateToEditDisputePage,
    ]
  );
  const data = useMemo(() => DisputeManagementDataRow(searchDispute?.disputes || []), [searchDispute, loadingSearchDispute]);
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Dispute Quote" />
        
        {/*/!* Controls *!/*/}
        {/*<DisputesControls*/}
        {/*  onOpenFilter={() => {}}*/}
        {/*  searchValue={searchQuery}*/}
        {/*  onSearchChange={handleSearchChange}*/}
        {/*/>*/}
        
        <div className="mt-10">
          <Table data={data} columns={columns} loading={loadingSearchDispute} />
          
          <TableFooter
            currentPage={searchDispute?.page || 1}
            totalPages={searchDispute?.totalPages || 1}
            pageSize={pageSize}
            totalItems={searchDispute?.count || 100}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}


export default Disputes;
