import { createFileRoute } from '@tanstack/react-router'
import TreasuryWalletsPage from '../../../pages/TreasuryWalletsPage.tsx'

export const Route = createFileRoute('/dashboard/treasury/wallets')({
  component: TreasuryWalletsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cryptocurrencyId: typeof search.cryptocurrencyId === 'string' ? search.cryptocurrencyId : '',
      network: typeof search.network === 'string' ? search.network : '',
      symbol: typeof search.symbol === 'string' ? search.symbol : '',
      name: typeof search.name === 'string' ? search.name : '',
    }
  },
})
