import { createFileRoute, useParams } from '@tanstack/react-router'
import KycSessionDetail from '../../../pages/KycSessionDetail'

function KycSessionDetailRoute() {
  const { id } = useParams({ from: '/dashboard/kyc-session/$id' })
  return <KycSessionDetail sessionId={id} />
}

export const Route = createFileRoute('/dashboard/kyc-session/$id')({
  component: KycSessionDetailRoute,
})
