import { createFileRoute } from '@tanstack/react-router'
import SecurityPage from "../../pages/Security.tsx";

export const Route = createFileRoute('/dashboard/security')({
  component: SecurityPage,
})
