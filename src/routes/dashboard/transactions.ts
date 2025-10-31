import { createFileRoute } from '@tanstack/react-router'
import ManageTransactions from "../../pages/ManageTransactions.tsx";

export const Route = createFileRoute('/dashboard/transactions')({
  component: ManageTransactions,
})
