import {Fragment} from "react";
import {useEditCoinPage} from "../hooks/pages/useEditCoinPage";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import CoinManagementHeader from "../components/pages/coinManagement/CoinManagementHeader.tsx";
import UploadCoinIcon from "../components/pages/coinManagement/UploadCoinIcon.tsx";
import EditCoinDetails from "../components/pages/coinManagement/edit-coin/CoinDetails.tsx";
import EditTradeLimits from "../components/pages/coinManagement/edit-coin/EditTradeLimits.tsx";
import EditOptionalFields from "../components/pages/coinManagement/edit-coin/EditOptionalFields.tsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";

const EditCoin = () => {
  const {
    // 🧩 Values
    adminCryptoDetails,
    loadingAdminCryptoDetails,

    // ⚙️ Functions
    uploadCryptoLogoIconMutation,
    handleEditCoinInputChange,
    goBack,
    handleUpdateCrypto,
  } = useEditCoinPage();
  
  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        {loadingAdminCryptoDetails ? (
          <Fragment>
            <div className="flex items-center justify-center min-h-[80vh]">
              <LoadingSpinner size="lg" message="Loading Coin Details..." fullScreen={false}/>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {/* Header */}
            <CoinManagementHeader />

            <div>
              <h2 className="text-2xl lg:text-4xl font-medium text-[#0E0F0C] mb-8 mt-4">
                Edit {adminCryptoDetails?.name}
              </h2>

              <UploadCoinIcon
                oldImgUrl={adminCryptoDetails?.logoUrl}
                onChangeInputField={handleEditCoinInputChange}
                uploadCryptoLogoIcon={uploadCryptoLogoIconMutation}
              />

              <EditCoinDetails
                onChangeInputField={handleEditCoinInputChange}
                name={adminCryptoDetails?.name || ''}
                symbol={adminCryptoDetails?.symbol || ''}
                networks={adminCryptoDetails?.networks ?? []}
                active={adminCryptoDetails?.isActive || false}
                adminCryptoWallets={adminCryptoDetails?.adminCryptoWallets ?? []}
                blockchainEnvironment={adminCryptoDetails?.blockchainEnvironment as "testnet" | "mainnet"}
              />

              <EditTradeLimits
                cryptoId={adminCryptoDetails?.id || ''}
                symbol={adminCryptoDetails?.symbol || ''}
                buyAt={adminCryptoDetails?.buyRate}
                sellAt={adminCryptoDetails?.sellRate}
                minAmount={adminCryptoDetails?.minTransactionLimit}
                maxAmount={adminCryptoDetails?.maxTransactionLimit}
                minAmountAnonymous={adminCryptoDetails?.minTradeAmountForAnonymous}
                maxAmountAnonymous={adminCryptoDetails?.maxTradeAmountForAnonymous}
                onChangeInputField={handleEditCoinInputChange}
              />
              
              <EditOptionalFields
                description={adminCryptoDetails?.description || ''}
                website={adminCryptoDetails?.websiteUrl || ''}
                whitePaper={adminCryptoDetails?.whitepaperUrl || ''}
                onChangeInputField={handleEditCoinInputChange}
              />
            </div>
          </Fragment>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6">
          <button
            onClick={goBack}
            className="px-4 py-2 text-lg font-medium text-[#03034D] hover:opacity-70 transition-colors w-full sm:w-auto cursor-pointer"
          >
            Go back
          </button>
          <button
            onClick={handleUpdateCrypto}
            className="px-12 py-[16px] bg-[#03034D] text-lg font-medium text-white rounded-full hover:bg-[#FF8B5A] transition-colors w-full sm:w-auto cursor-pointer"
          >
            Update Coin
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default EditCoin;
