import { createFileRoute } from '@tanstack/react-router'
import EditDisputes from "../../../../pages/EditDisputes.tsx";

export const Route = createFileRoute('/dashboard/disputes/edit/$id')({
  component: EditDisputes,
})
