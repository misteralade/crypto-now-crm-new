import PageHeader from '../components/global/pageHeader'
import { useManageFiatPage } from '../hooks/pages/useManageFiatPage'
import AccountCard from "../components/pages/manageFiat/AccountCard.tsx";
import BankDetailsModal from "../components/pages/manageFiat/BankDetailsModal.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import { SearchInput } from '../components/ui/search-input'
import { Input } from '../components/ui/input'

const ManageFiat = () => {
  const {
    // 🧩 Values
    openBankModal,
    platformSupportedBanks,
    loadingPlatformSupportedBanks,
    searchQuery,
    searchedSupportedBanks,
    loadingSearchedSupportedBanks,
    payoutAutoApprovalLimitQuery,
    payoutAutoApprovalLimitInput,
    savingPayoutAutoApprovalLimit,

    // ⚙️ Functions
    handleOpenBankModal,
    handleCloseBankModal,
    handleMakeDefault,
    handleDeleteBank,
    handleCreateBankField,
    handleAdminCreateBank,
    handleSearchChange,
    handlePayoutAutoApprovalLimitChange,
    handleSavePayoutAutoApprovalLimit,
  } = useManageFiatPage();

  const currentPayoutLimit =
    payoutAutoApprovalLimitQuery.data?.thresholdNgn ?? 1_000_000;
  const isFallbackLimit =
    payoutAutoApprovalLimitQuery.data?.isFallback === true;
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 min-h-screen container">
        <PageHeader title="ManageFiat" />

        <section className="mt-6 rounded-3xl border border-[#E9E7E2] bg-gradient-to-br from-[#FFF8EC] via-white to-[#F7FAFF] p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8A5A00]">
                Payout controls
              </div>
              <h2 className="mt-2 text-[24px] font-semibold text-[#0E0F0C]">
                Automated sell payouts stop above the configured NGN limit
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#5C6370]">
                Payouts above this ceiling move into manual review instead of calling Nomba automatically. Admins can update the limit here without a schema change.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ECECEC] bg-white px-4 py-3 text-sm text-[#3D4451] shadow-sm">
              <div className="font-medium text-[#0E0F0C]">Current limit</div>
              <div className="mt-1 text-[20px] font-semibold text-[#0E0F0C]">
                ₦ {Number(currentPayoutLimit).toLocaleString()}
              </div>
              <div className="mt-1 text-[12px] text-[#5C6370]">
                {isFallbackLimit
                  ? "Using the documented fallback until the setting is saved."
                  : "Loaded from the settings table."}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Input
              label="Auto-approval ceiling (NGN)"
              type="text"
              inputMode="decimal"
              value={payoutAutoApprovalLimitInput}
              onChange={(e) =>
                handlePayoutAutoApprovalLimitChange(e.target.value)
              }
              placeholder="1000000"
            />
            <button
              type="button"
              onClick={handleSavePayoutAutoApprovalLimit}
              disabled={savingPayoutAutoApprovalLimit}
              className="h-14 rounded-full bg-[#0E0F0C] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1A1C17] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPayoutAutoApprovalLimit ? "Saving..." : "Save limit"}
            </button>
          </div>
        </section>
        
        <div className="flex w-full items-center gap-2 justify-between lg:w-auto">
          <div className="mt-8 text-[24px] font-medium text-[#0E0F0C]">
            Account Numbers
          </div>
          
          <SearchInput
            placeholder="Search Bank"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            containerClassName="flex-1 lg:flex-none"
            className="md:w-[280px]"
          />
        </div>
        
        {/* cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {!loadingSearchedSupportedBanks &&
            searchedSupportedBanks?.banks &&
            searchedSupportedBanks?.banks?.map((account, index) => (
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
            onClick={handleOpenBankModal}
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
          onClose={handleCloseBankModal}
          onConfirm={handleAdminCreateBank}
        />
      </div>
    </AuthenticatedLayout>
  )
}
export default ManageFiat
