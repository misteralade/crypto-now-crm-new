import { createFileRoute } from '@tanstack/react-router'
import ManageFiat from "../../pages/ManageFiat.tsx";

export const Route = createFileRoute('/dashboard/manage-fiat')({
  component: ManageFiat,
})
