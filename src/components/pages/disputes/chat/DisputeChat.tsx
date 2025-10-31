import { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Dispute from '../../../../assets/img/Dispute.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Send from '../../../../assets/icons/send.svg'

interface DisputeChatProps {
  user: string
}

const DisputeChat = ({ user }: DisputeChatProps) => {
  const [reply, setReply] = useState('')
  return (
    <section className="mt-0">
      <div className="rounded-[16px] bg-[#F0F0FF] border border-[#ECECEC]">
        <div className="text-[#828282] font-semibold text-[14px] mb-3">DISPUTE CHATS</div>
        <div className="mb-4 max-w-[320px]">
          <div className="text-[16px] text-[#828282] font-medium mb-2">{user}</div>
          <p className="text-[#0E0F0C] text-lg leading-6">
            I made payment to buy 0.000327 btc, but I’ve not yet receive the
            deposit into my wallet, and the time for processing transaction has
            elapsed.
          </p>
          <div className="mt-4">
            <div className="text-[#828282] text-[16px] font-medium mb-2">Attached file</div>
            <img src={Dispute} alt="dispute" width={200} height={232} />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[16px] text-[#828282] font-medium mb-2">You – Admin</div>
          <p className="text-[#0E0F0C] text-lg">
            Please, we’ll get back to you in 3mins.
          </p>
        </div>
        <div className="mt-12">
          <div className="flex justify-between items-center bg-[#FAFAFA] py-4 px-4  rounded-full">
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
              className="w-12 h-12 rounded-full bg-[#575AE5] text-white flex items-center justify-center cursor-pointer hover:opacity-90"
              aria-label="Send"
            >
              {/* <Send size={21} /> */}
              <img src={Send} alt='send' className='' />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DisputeChat;
