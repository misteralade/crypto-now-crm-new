import { createFileRoute } from '@tanstack/react-router'
import SweepDetail from "../../../pages/SweepDetail.tsx";

export const Route = createFileRoute('/dashboard/treasury/$sweepId')({
  component: SweepDetail,
})
