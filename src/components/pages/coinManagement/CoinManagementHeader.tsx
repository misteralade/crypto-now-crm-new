import { useNavigate, useRouterState } from '@tanstack/react-router'
import { ROUTES } from '../../../util/constants.util.ts'

// Assets
import AvatarIcon from '../../../assets/img/avatar.webp'

const CoinManagementHeader = () => {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="mb-8">
      {/* Top row: Title and Admin */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Coin Management</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#EB5757] font-medium">Admin</span>
          <div className="rounded-full h-8 w-8 overflow-hidden">
            <img
              src={AvatarIcon}
              alt="Admin avatar"
              className="h-8 w-8 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom row: Search and Manage button */}
      {!currentPath.includes('add-coin') && (
        <div className="space-y-3 md:space-y-0 flex flex-col md:flex-row justify-between items-center mt-6">
          {/* Search Input */}
          <div />

          {/* Manage All Coins Button */}
          <button
            onClick={() => navigate({ to: ROUTES.COIN_MANAGEMENT })}
            className="w-full md:w-auto px-4 py-3 bg-[#03034D] text-white rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-colors"
          >
            Manage all coins
          </button>
        </div>
      )}
    </div>
  )
}

export default CoinManagementHeader;
