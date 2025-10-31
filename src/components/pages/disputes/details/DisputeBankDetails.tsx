interface DisputeBankDetailsProps {
  accountName?: string
  bankName?: string
  accountNumber?: string
}

export default function DisputeBankDetails({
  accountName,
  bankName,
  accountNumber,
}: DisputeBankDetailsProps) {
  return (
    <section className="my-8">
      <h3 className="text-[14px] font-semibold text-[#828282] mb-3">
        BANK DETAILS
      </h3>
      <div className="grid grid-cols-2 space-y-4 text-[14px] text-[#0E0F0C]">
        <div className="text-base text-[#828282]">Account name</div>
        <div className="font-medium text-[#0E0F0C]">
          {accountName || 'Akinkunmi Taiwo Joel'}
        </div>
        <div className="text-base text-[#828282]">Bank name</div>
        <div className="font-medium text-[#0E0F0C]">
          {bankName || 'United Bank of Africa'}
        </div>
        <div className="text-base text-[#828282]">Account number</div>
        <div className="font-medium text-[#0E0F0C]">
          {accountNumber || '0002233004'}
        </div>
      </div>
    </section>
  )
}
