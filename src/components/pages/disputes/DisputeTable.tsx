export interface DisputeRow {
  id: string
  user: string
  transactionId: string
  amount: string
  date: string
  status: 'Open' | 'Under review' | 'Inactive' | 'Resolved'
}
