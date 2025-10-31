import { useState } from 'react'
import DisputeDrawerHeader from './details/DisputeDrawerHeader'
import DisputeOrderDetails from './details/DisputeOrderDetails'
import DisputeBankDetails from './details/DisputeBankDetails'
import DisputeMessage from './details/DisputeMessage'
import DisputeChat from './chat/DisputeChat'
import UpdateStatus from './details/UpdateStatus'
import { ArrowDown } from 'lucide-react'

interface DisputeDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  dispute?: {
    id: string
    type: 'Buy' | 'Sell'
    amount: string
    trade: string
    status: 'Open' | 'Under review' | 'Inactive' | 'Resolved'
    date: string
    user: string
    message: string
    attachmentUrl?: string
    accountName?: string
    bankName?: string
    accountNumber?: string
  }
}

export default function DisputeDetailsDrawer({
  isOpen,
  onClose,
  dispute,
}: DisputeDetailsDrawerProps) {
  const [showChat, setShowChat] = useState(false)
  if (!isOpen || !dispute) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/5" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] lg:w-[570px] bg-white shadow-sm p-4 sm:p-6 lg:py-12 overflow-y-auto">
        <DisputeDrawerHeader title="Dispute details" onClose={onClose} />

        <div className="space-y-6 bg-[#F0F0FF] border border-[#ECECEC] p-6 rounded-[16px]">
          {showChat && (
            <button
              type="button"
              onClick={() => setShowChat(false)}
              className="inline-flex items-center cursor-pointer gap-x-2 text-[#03034D] hover:opacity-80"
            >
              <ArrowDown className="rotate-90" size={20} />
              <span className="text-lg">Go back</span>
            </button>
          )}
          <DisputeOrderDetails
            type={dispute.type}
            amount={dispute.amount}
            trade={dispute.trade}
            status={dispute.status}
            date={dispute.date}
          />

          {!showChat && (
            <DisputeBankDetails
              accountName={dispute.accountName}
              bankName={dispute.bankName}
              accountNumber={dispute.accountNumber}
            />
          )}

          {!showChat ? (
            <DisputeMessage
              message={dispute.message}
              attachmentUrl={dispute.attachmentUrl}
              onOpenChat={() => setShowChat(true)}
            />
          ) : (
            <DisputeChat user={dispute.user} />
          )}
        </div>

        <UpdateStatus />
      </aside>
    </div>
  )
}
