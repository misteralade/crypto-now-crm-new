import {NUMBERS} from "../../../../util/constants.util.ts";
import type { CreateSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import LabeledPillInput from "../../../global/LabeledPillInput";

interface OptionalFieldsProps {
  onChangeInputField: (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const OptionalFields = ({ onChangeInputField }: OptionalFieldsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Optional Fields
      </h3>

      {/* First row: Min trade amount and Transaction fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        {/* Is Stable Coin?*/}
        <div>
          <label className="block text-sm font-medium text-[#454745] mb-3">
            Stable Coin
          </label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isStableCoin"
                type="checkbox"
                className="sr-only peer"
                onChange={(e) => onChangeInputField("isStableCoin", e.target.checked)}
                defaultChecked={false}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
            </label>
            <span className="text-[16px] font-semibold text-[#454745]">Is Stable Coin</span>
          </div>
        </div>


        <div>
          <LabeledPillInput
            id="whitepaperUrl"
            onChange={(e) => onChangeInputField("whitepaperUrl", e.target.value)}
            label="Whitepaper URL"
            type="text"
            min={0.001}
            max={NUMBERS.FIVE_HUNDRED}
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Second Min trade amount field */}
        <div className="mb-6">
          <LabeledPillInput
            id="websiteUrl"
            onChange={(e) => onChangeInputField("websiteUrl", e.target.value)}
            label="Website URL"
            max={NUMBERS.FIVE_HUNDRED}
            type="text"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        <div>
          <LabeledPillInput
            id="description"
            onChange={(e) => onChangeInputField("description", e.target.value)}
            label="Description"
            max={NUMBERS.FIVE_HUNDRED}
            type="text"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>
    </div>
  )
}

export default OptionalFields;
