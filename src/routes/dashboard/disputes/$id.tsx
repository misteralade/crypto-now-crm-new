import { createFileRoute } from '@tanstack/react-router'
import DisputeDetails from '../../../pages/DisputeDetails.tsx'

export const Route = createFileRoute('/dashboard/disputes/$id')({
  component: DisputeDetails,
})
