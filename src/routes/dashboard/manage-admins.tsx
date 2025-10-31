import { createFileRoute } from '@tanstack/react-router'
import ManageAdmins from "../../pages/ManageAdmins.tsx";

export const Route = createFileRoute('/dashboard/manage-admins')({
  component: ManageAdmins,
})
