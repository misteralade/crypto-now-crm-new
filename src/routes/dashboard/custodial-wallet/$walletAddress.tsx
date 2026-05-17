import { createFileRoute } from '@tanstack/react-router'
import WalletDetails from '../../../pages/WalletDetails.tsx'

export const Route = createFileRoute('/dashboard/custodial-wallet/$walletAddress')({
  component: WalletDetails,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromSweepId: typeof search.fromSweepId === 'string' ? search.fromSweepId : '',
    }
  },
})
