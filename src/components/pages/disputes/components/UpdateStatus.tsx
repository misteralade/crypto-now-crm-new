interface UpdateStatusProps {
  onResolve?: () => void
  onExpire?: () => void
}

export default function UpdateStatus({
  onResolve,
  onExpire,
}: UpdateStatusProps) {
  return (
    <section className="mt-12">
      <div className="text-lg font-semibold text-[#454745] mb-3">
        Update Dispute status
      </div>
      <div className="flex gap-3">
        <button
          className="px-5 py-4 rounded-full font-semibold bg-[#ECFDF3] text-[#037847] hover:opacity-80 cursor-pointer"
          onClick={onResolve}
        >
          Mark as Resolved
        </button>
        <button
          className="px-5 py-4 font-semibold rounded-full bg-[#F2F4F7] text-[#364254] hover:opacity-80 cursor-pointer"
          onClick={onExpire}
        >
          Mark as Expired
        </button>
      </div>
    </section>
  )
}
