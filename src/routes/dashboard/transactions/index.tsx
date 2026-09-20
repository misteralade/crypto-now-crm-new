import { createFileRoute } from '@tanstack/react-router'
import ManageTransactions from "../../../pages/ManageTransactions.tsx";

export const Route = createFileRoute('/dashboard/transactions/')({
  component: ManageTransactions,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      userId: typeof search.userId === 'string' ? search.userId : undefined,
    }
  },
})
