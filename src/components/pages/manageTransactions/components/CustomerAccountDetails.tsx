// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CopyIcon from "../../../../assets/img/fluent_copy-16-regular.svg"

interface CustomerAccountDetailsProps {
  address: string
  coinType: string
  networkType: string
}

export default function CustomerAccountDetails({
  address,
  coinType,
  networkType,
}: CustomerAccountDetailsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
    } catch (e) {
      // fallback
    }
  }

  return (
    <div className="">
      <div className="space-y-4">
        <section className="flex items-center justify-between gap-x-12 md:gap-x-28">
          <div className="text-[#828282] text-[16px]">Address</div>
          <div className="flex items-center gap-2 break-all">
            <span className="font-medium text-sm text-[#0E0F0C]">
              {address}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:text-black/5 cursor-pointer"
              aria-label="Copy address"
              title="Copy address"
            >
              <img src={CopyIcon} alt={CopyIcon} width={15} height={18}/>
            </button>
          </div>
        </section>

        <section className="flex items-center justify-between gap-x-12 md:gap-x-28">
          <div className="text-[#828282] text-[16px]">Coin type</div>
          <div className="font-medium text-sm text-[#0E0F0C]">{coinType}</div>
        </section>

        <section className="flex items-center justify-between gap-x-12 md:gap-x-28">
          <div className="text-[#828282] text-[16px]">Network type</div>
          <div className="font-medium text-sm text-[#0E0F0C]">
            {networkType}
          </div>
        </section>
      </div>
    </div>
  )
}
