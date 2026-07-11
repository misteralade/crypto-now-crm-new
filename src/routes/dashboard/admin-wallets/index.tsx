import { createFileRoute } from '@tanstack/react-router'
import AdminWalletsPage from '../../../pages/AdminWalletsPage.tsx'

export const Route = createFileRoute('/dashboard/admin-wallets/')({
  component: AdminWalletsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      cryptoId: typeof search.cryptoId === 'string' ? search.cryptoId : undefined,
    }
  },
})
