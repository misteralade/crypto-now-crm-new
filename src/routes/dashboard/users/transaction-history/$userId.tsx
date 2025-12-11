import { createFileRoute } from '@tanstack/react-router'
import UserTransactionHistory from "../../../../pages/UserTransactionHistory.tsx";

export const Route = createFileRoute('/dashboard/users/transaction-history/$userId')({
  component: UserTransactionHistory,
})
