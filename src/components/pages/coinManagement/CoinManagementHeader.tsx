import { useNavigate, useRouterState } from '@tanstack/react-router'
import PageHeader from '../../global/pageHeader'
import { ROUTES } from '../../../util/constants.util.ts'

const CoinManagementHeader = () => {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="mb-8">
      <PageHeader title="Coin Management" />

      {!currentPath.includes('add-coin') && (
        <div className="mt-6 flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
          <div />
          <button
            onClick={() => navigate({ to: ROUTES.COIN_MANAGEMENT })}
            className="w-full cursor-pointer rounded-full bg-[#03034D] px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-80 md:w-auto"
          >
            Manage all coins
          </button>
        </div>
      )}
    </div>
  )
}

export default CoinManagementHeader;
