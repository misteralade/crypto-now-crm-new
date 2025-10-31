import { createFileRoute } from '@tanstack/react-router'
import AuditTrails from "../../pages/AuditTrails.tsx";

export const Route = createFileRoute('/dashboard/audit-trails')({
  component: AuditTrails,
})
