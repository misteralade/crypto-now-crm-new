import { createFileRoute } from '@tanstack/react-router'
import VerifyTwoFactor from '../pages/VerifyTwoFactor'

export const Route = createFileRoute('/verify-2fa')({
  component: VerifyTwoFactor,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || '',
    }
  },
})
