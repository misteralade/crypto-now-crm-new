import { createFileRoute } from '@tanstack/react-router'
import KycTierLimits from '../../pages/KycTierLimits'

export const Route = createFileRoute('/dashboard/kyc-tier-limits')({
  component: KycTierLimits,
})
