import { createFileRoute } from '@tanstack/react-router'
import AdminDetails from '../../../pages/AdminDetails.tsx'

export const Route = createFileRoute('/dashboard/manage-admins/$adminId')({
  component: AdminDetails,
})
