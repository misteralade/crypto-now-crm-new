// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Dispute from '../../../../assets/img/Dispute.png'

interface DisputeMessageProps {
  message: string
  attachmentUrl?: string
  onOpenChat: () => void
}

export default function DisputeMessage({
  message,
  attachmentUrl,
  onOpenChat,
}: DisputeMessageProps) {
  return (
    <>
      <div className="text-[#828282] font-medium mb-2">Message</div>
      <p className="text-lg text-[#0E0F0C]">{message}</p>
      {attachmentUrl ? (
        <div className="mt-3">
          <img
            src={attachmentUrl}
            alt="Attachment"
            className="rounded-md border border-gray-200"
          />
        </div>
      ) : null}

      <div className="my-4">
        <div className="text-[#828282] font-medium mb-4">Attached file</div>
        <img src={Dispute} alt="dispute" width={200} height={232} />
      </div>

      <div className="mt-4">
        <button
          onClick={onOpenChat}
          className="cursor-pointer hover:opacity-70 px-6 py-4 border border-[#03034D] text-lg rounded-full text-[#03034D] font-semibold hover:bg-[#F0F0FF]"
        >
          Open chat interface
        </button>
      </div>
    </>
  )
}
