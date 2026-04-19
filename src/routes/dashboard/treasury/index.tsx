import { createFileRoute } from '@tanstack/react-router'
import Treasury from "../../../pages/Treasury.tsx";

// @ts-ignore
export const Route = createFileRoute('/dashboard/treasury/')({
  component: Treasury,
})
