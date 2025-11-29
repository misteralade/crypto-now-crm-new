import { createFileRoute } from '@tanstack/react-router'
import Testimonials from '../../pages/Testimonials'

export const Route = createFileRoute('/dashboard/testimonials')({
  component: Testimonials,
})
