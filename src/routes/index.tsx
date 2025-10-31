import { createFileRoute } from '@tanstack/react-router'
import Signin from './signin'

export const Route = createFileRoute('/')({
  component: Signin,
})