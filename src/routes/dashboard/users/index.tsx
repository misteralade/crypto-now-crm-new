import { createFileRoute } from '@tanstack/react-router'
import Users from "../../../pages/Users.tsx";

export const Route = createFileRoute('/dashboard/users/')({
  component: Users,
})
