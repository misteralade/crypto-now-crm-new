import { createFileRoute } from '@tanstack/react-router'
import CoinManagement from "../../pages/CoinManagement.tsx";

export const Route = createFileRoute('/dashboard/coin-management')({
  component: CoinManagement,
})
