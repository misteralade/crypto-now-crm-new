import { useAddCoinPage } from '../hooks/pages/useAddCoinPage'
import AuthenticatedLayout from "../layout/AuthenticatedLayout.tsx";
import CoinManagementHeader from "../components/pages/coinManagement/CoinManagementHeader.tsx";
import UploadCoinIcon from "../components/pages/coinManagement/UploadCoinIcon.tsx";
import CoinDetails from "../components/pages/coinManagement/add-coin/CoinDetails.tsx";
import TradeLimits from "../components/pages/coinManagement/add-coin/TradeLimits.tsx";
import OptionalFields from "../components/pages/coinManagement/add-coin/OptionalFields.tsx";

const AddCoin = () => {
  const {
    // 🧩 Values

    // Mutation
    uploadCryptoLogoIconMutation,

    // ⚙️ Functions
    saveCoin,
    goBack,
    handleCreateCoinInputChange,
  } = useAddCoinPage()

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        {/* Header */}
        <CoinManagementHeader />
        
        <div>
          <h2 className="text-2xl lg:text-4xl font-medium text-[#0E0F0C] mb-8 mt-4">
            Add new coin
          </h2>
          
          <UploadCoinIcon
            onChangeInputField={handleCreateCoinInputChange}
            uploadCryptoLogoIcon={uploadCryptoLogoIconMutation}
          />
          
          <CoinDetails onChangeInputField={handleCreateCoinInputChange} />
          
          <TradeLimits onChangeInputField={handleCreateCoinInputChange} />
          
          <OptionalFields onChangeInputField={handleCreateCoinInputChange} />
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 pt-6">
          <button
            onClick={goBack}
            className="px-4 py-2 text-lg font-medium text-[#03034D] hover:opacity-70 transition-colors w-full sm:w-auto cursor-pointer"
          >
            Go back
          </button>
          <button
            onClick={saveCoin}
            className="px-12 py-[16px] bg-[#03034D] text-lg font-medium text-white rounded-full hover:bg-[#FF8B5A] transition-colors w-full sm:w-auto cursor-pointer"
          >
            Save Coin
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default AddCoin
