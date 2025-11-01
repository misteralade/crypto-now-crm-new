import { createFileRoute } from '@tanstack/react-router'
import TransactionDetails from "../../../pages/TransactionDetails.tsx";

export const Route = createFileRoute('/dashboard/transactions/$id')({
  component: TransactionDetails,
})
