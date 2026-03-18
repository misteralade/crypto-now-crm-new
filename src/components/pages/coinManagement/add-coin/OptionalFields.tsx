import type { CreateSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from '../../../ui/input'
import { Switch } from '../../../ui/switch'

interface OptionalFieldsProps {
  onChangeInputField: (field: keyof CreateSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const OptionalFields = ({ onChangeInputField }: OptionalFieldsProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">Optional Fields</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div>
          <label className="block text-[13px] font-medium text-[#454745] mb-3">Stable Coin</label>
          <Switch
            id="isStableCoin"
            label="Is Stable Coin"
            defaultChecked={false}
            onCheckedChange={(checked) => onChangeInputField("isStableCoin", checked)}
          />
        </div>

        <PillInput
          id="whitepaperUrl"
          onChange={(e) => onChangeInputField("whitepaperUrl", e.target.value)}
          label="Whitepaper URL"
          type="text"
        />

        <PillInput
          id="websiteUrl"
          onChange={(e) => onChangeInputField("websiteUrl", e.target.value)}
          label="Website URL"
          type="text"
        />

        <PillInput
          id="description"
          onChange={(e) => onChangeInputField("description", e.target.value)}
          label="Description"
          type="text"
        />
      </div>
    </div>
  )
}

export default OptionalFields;
