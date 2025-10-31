import { createFileRoute } from '@tanstack/react-router'
import EditCoin from "../../../pages/EditCoin.tsx";

export const Route = createFileRoute('/dashboard/coin-management/$coinId')({
  component: EditCoin,
})
