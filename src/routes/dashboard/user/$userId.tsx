import { createFileRoute } from '@tanstack/react-router'
import UserDetails from '../../../pages/UserDetails.tsx'

export const Route = createFileRoute('/dashboard/user/$userId')({
  component: UserDetails,
})
