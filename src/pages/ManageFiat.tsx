import PageHeader from '../components/global/pageHeader'
import { useManageFiatPage } from '../hooks/pages/useManageFiatPage'
import AccountCard from "../components/pages/manageFiat/AccountCard.tsx";
import BankDetailsModal from "../components/pages/manageFiat/BankDetailsModal.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

const ManageFiat = () => {
  const {
    // 🧩 Values
    platformBankAccounts,
    loadingPlatformBankAccounts,
    openBankModal,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,

    // ⚙️ Functions
    toggleBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
  } = useManageFiatPage()

  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen container max-w-7xl">
        <PageHeader title="ManageFiat" />
        
        <div className="mt-8 text-[24px] font-medium text-[#0E0F0C]">
          Account Numbers
        </div>
        
        {/* cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {!loadingPlatformBankAccounts &&
            platformBankAccounts &&
            platformBankAccounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                index={index}
                onMakeDefault={handleMakeDefault}
                onDelete={handleDeleteBank}
              />
            ))}
          
          <section
            className="rounded-2xl border border-[#ECECEC] bg-white shadow-sm flex items-center justify-center p-4 cursor-pointer hover:bg-[#FAFAFA]"
            onClick={toggleBankModal}
          >
            <div className="flex flex-col justify-center items-center h-full py-10 w-full">
              <div className="border border-[#ECECEC] rounded-full p-4 hover:bg-[#ECECEC]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12V0H16V12H28V16H16V28H12V16H0V12H12Z"
                    fill="#97A0B2"
                  />
                </svg>
              </div>
              <div className="text-[#03034D] mt-[18px] text-[16px] font-semibold">
                Add account
              </div>
            </div>
          </section>
        </section>
        
        {/* Modals */}
        <BankDetailsModal
          open={openBankModal}
          supportedBanks={
            !loadingPlatformSupportedBanks ? platformSupportedBanks : []
          }
          handleCreateBankField={handleCreateBankField}
          onClose={toggleBankModal}
          onConfirm={handleAdminCreateBank}
        />
      </div>
    </AuthenticatedLayout>
  )
}
export default ManageFiat
