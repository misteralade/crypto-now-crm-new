import { createFileRoute } from '@tanstack/react-router'
import Disputes from "../../../pages/Disputes.tsx";

export const Route = createFileRoute('/dashboard/disputes/')({
  component: Disputes,
})
