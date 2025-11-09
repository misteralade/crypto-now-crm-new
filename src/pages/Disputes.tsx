import {useMemo, useState} from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Avatar from '../assets/img/avatar.webp'
import { disputes } from '../data/disputes.1'
import DisputesControls from "../components/pages/disputes/DisputesControls.tsx";
import {type DisputeRow} from "../components/pages/disputes/DisputeTable.tsx";
import DisputeDetailsDrawer from '../components/pages/disputes/DisputeDetailsDrawer.tsx';
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import {useDisputesPage} from "../hooks/pages/useDisputesPage.ts";
import {DisputeManagementColumn, DisputeManagementDataRow} from "../components/tables/DisputesTable.tsx";
import Table from "../components/table.tsx";

const Disputes = () => {
  const {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    showTransactionDrawer,
    
    // ⚙️ Functions
    handleViewDisputeDetails,
    handleShowTransactionDetails,
    handleNavigateToTransactionPage,
    toggleTransactionDetailsDrawer,
    handleSortByField,
  } = useDisputesPage();
  
  const columns = useMemo(() => DisputeManagementColumn(handleViewDisputeDetails, handleShowTransactionDetails, handleSortByField, handleNavigateToTransactionPage),
    [
      handleViewDisputeDetails,
      handleShowTransactionDetails,
      handleSortByField,
      handleNavigateToTransactionPage,
    ]
  );
  const data = useMemo(() => DisputeManagementDataRow(searchDispute?.disputes || []), [searchDispute, loadingSearchDispute]);
  
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<DisputeRow | undefined>(undefined)
  disputes.filter(
    (d) =>
      d.transactionId.toLowerCase().includes(query.toLowerCase()) ||
      d.user.toLowerCase().includes(query.toLowerCase()) ||
      d.id.includes(query),
  );
  
  const openNewDispute = () => {
    const now = new Date()
    setSelected({
      id: 'NEW',
      user: 'Taiwo Joel',
      transactionId: '—',
      amount: '#200,000',
      date: now.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Open',
    })
  }
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-gray-900">
            Dispute Quote
          </h2>
          
          <div className="flex items-center space-x-3">
            <span className="text-red-500 font-medium">Admin</span>
            <div className="rounded-full h-8 w-8 bg-green-400 flex items-center justify-center">
            <span className="text-white text-sm">
              <img src={Avatar} alt="" />
            </span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <DisputesControls
          onOpenFilter={() => {}}
          onCreateNewDispute={openNewDispute}
          searchValue={query}
          onSearchChange={setQuery}
        />
        
        <Table data={data} columns={columns} loading={loadingSearchDispute} />
        
        <DisputeDetailsDrawer
          isOpen={showTransactionDrawer}
          onClose={toggleTransactionDetailsDrawer}
          dispute={
            selected
              ? {
                id: selected.id,
                type: 'Buy',
                amount: selected.amount.replace('#', '$'),
                trade: '0.000327 BTC',
                status: selected.status,
                date: selected.date.replace(' – ', ', '),
                user: selected.user,
                message:
                  selected.id === 'NEW'
                    ? `I made payment to buy 0.000327 btc, but I’ve yet receive the
                deposit into my wallet, and the time for processing transaction
                has elapsed.`
                    : `Describe the dispute here...`,
                attachmentUrl:
                  selected.id === 'NEW' ? undefined : '/receipt-mock.png',
              }
              : undefined
          }
        />
      </div>
    </AuthenticatedLayout>
  )
}


export default Disputes;
