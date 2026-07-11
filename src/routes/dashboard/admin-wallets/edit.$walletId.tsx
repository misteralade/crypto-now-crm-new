import { createFileRoute } from '@tanstack/react-router'
import EditWalletPage from '../../../pages/EditWalletPage.tsx'

export const Route = createFileRoute('/dashboard/admin-wallets/edit/$walletId')({
  component: EditWalletPage,
})
