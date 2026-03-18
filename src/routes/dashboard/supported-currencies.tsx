import { createFileRoute } from '@tanstack/react-router'
import SupportedCurrencies from '../../pages/SupportedCurrencies'

export const Route = createFileRoute('/dashboard/supported-currencies')({
  component: SupportedCurrencies,
})
