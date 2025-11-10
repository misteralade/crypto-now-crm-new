import { createFileRoute } from '@tanstack/react-router'
import Signin from "../pages/signin.tsx";

export const Route = createFileRoute('/')({
  component: Signin,
})