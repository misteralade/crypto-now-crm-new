interface OrderDetailsProps {
  type: string
  amount: string
  trade: string
  status: string
  date: string
}

export default function OrderDetails({
  type,
  amount,
  trade,
  status,
  date,
}: OrderDetailsProps) {
  return (
    <section className="">
      <div className="flex items-center flex-wrap gap-2 lg:gap-x-6 text-[14px] text-[#0E0F0C]">
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#828282] text-[16px]">Type</div>
          <div className="text-[18px] text-[#0E0F0C]">{type}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#828282] text-[16px]">Amount</div>
          <div className="text-[18px] text-[#0E0F0C]">{amount}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#828282] text-[16px]">Trade</div>
          <div className="text-[18px] text-[#0E0F0C]">{trade}</div>
        </div>
        <div className="flex flex-col items-start gap-y-2">
          <div className="text-[#828282] text-[16px]">Status</div>
          <div className="text-[12px] bg-[#FCE8E8] py-1 px-2 rounded-full text-[#EB5757] font-medium">
            {status}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-start gap-y-2">
        <div className="text-[#828282] text-[16px]">Date</div>
        <div className="text-[#0E0F0C] text-lg font-medium">{date}</div>
      </div>
    </section>
  )
}
