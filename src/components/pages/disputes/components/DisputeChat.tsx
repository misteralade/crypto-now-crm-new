import { useState } from 'react'
import { Send } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Dispute from '../../../assets/img/Dispute.png'

interface DisputeChatProps {
  user: string
  onBack: () => void
}

export default function DisputeChat({ user, onBack }: DisputeChatProps) {
  const [reply, setReply] = useState('')
  return (
    <section className="mt-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-2 text-[#575AE5] hover:opacity-80"
      >
        <span className="text-lg">←</span>
        <span className="font-medium">Go back</span>
      </button>
      <div className="rounded-[16px] bg-[#F0F0FF] border border-[#ECECEC] p-4">
        <div className="text-[#828282] font-semibold mb-3">DISPUTE CHATS</div>
        <div className="mb-4">
          <div className="text-sm text-[#828282] font-medium mb-1">{user}</div>
          <p className="text-[#0E0F0C] text-[14px] leading-6">
            I made payment to buy 0.000327 btc, but I’ve not yet receive the
            deposit into my wallet, and the time for processing transaction has
            elapsed.
          </p>
          <div className="mt-4">
            <div className="text-[#828282] font-medium mb-2">Attached file</div>
            <img src={Dispute} alt="dispute" width={200} height={232} />
          </div>
        </div>
        <div className="ml-auto max-w-[85%] bg-white/60 rounded-xl px-4 py-3">
          <div className="text-xs text-[#6B7280] mb-1">You – Admin</div>
          <p className="text-[#0E0F0C] text-[14px]">
            Please, we’ll get back to you in 3mins.
          </p>
        </div>
        <div className="mt-4">
          <div className="flex items-center bg-white/60 rounded-full pl-4 pr-2 py-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Add a response"
              className="flex-1 bg-transparent outline-none text-[14px] text-[#000] placeholder:text-[#9CA3AF]"
            />
            <button
              type="button"
              onClick={() => setReply('')}
              className="h-9 w-9 rounded-full bg-[#575AE5] text-white flex items-center justify-center cursor-pointer hover:opacity-90"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
