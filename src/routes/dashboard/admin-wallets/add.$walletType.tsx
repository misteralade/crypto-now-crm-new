import { createFileRoute } from '@tanstack/react-router'
import AddWalletPage from '../../../pages/AddWalletPage.tsx'

export const Route = createFileRoute('/dashboard/admin-wallets/add/$walletType')({
  component: AddWalletPage,
})
