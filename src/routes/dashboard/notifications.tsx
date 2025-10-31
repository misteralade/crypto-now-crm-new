import { createFileRoute } from '@tanstack/react-router'
import NotificationsPage from "../../pages/Notifications.tsx";

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPage,
})
