interface DisputeOrderDetailsProps {
  type: string
  amount: string
  trade: string
  status: string
  date: string
}

export default function DisputeOrderDetails({
  type,
  amount,
  trade,
  status,
  date,
}: DisputeOrderDetailsProps) {
  return (
    <section className="">
      <h3 className="text-[14px] font-semibold text-[#828282] mb-4">
        ORDER DETAILS
      </h3>
      <div className="flex items-center flex-wrap gap-2 lg:gap-x-6 text-[14px] text-[#0E0F0C]">
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#828282] text-[16px]">Type</div>
          <div className="text-[18px] text-[#0E0F0C] font-medium">{type}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#6B7280]">Amount</div>
          <div className="text-[18px] text-[#0E0F0C] font-medium">{amount}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#6B7280]">Trade</div>
          <div className="text-[18px] text-[#0E0F0C] font-medium">{trade}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#6B7280]">Status</div>
          <div className="text-[12px] bg-[#FCE8E8] py-1 px-2 rounded-full text-[#EB5757] font-medium">
            {status}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[#828282] text-[16px]">Date</div>
        <div className="text-[#0E0F0C] text-lg font-medium">{date}</div>
      </div>
    </section>
  )
}
