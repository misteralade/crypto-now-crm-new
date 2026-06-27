import { Copy } from 'lucide-react'

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
              className="p-1 rounded text-purple-600 hover:bg-purple-50 active:scale-95 transition-all cursor-pointer"
              aria-label="Copy address"
              title="Copy address"
            >
              <Copy className="h-4 w-4" />
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
