import { createFileRoute } from '@tanstack/react-router'
import AddCoin from "../../../pages/AddCoin.tsx";

export const Route = createFileRoute('/dashboard/coin-management/add-coin')({
  component: AddCoin,
})
