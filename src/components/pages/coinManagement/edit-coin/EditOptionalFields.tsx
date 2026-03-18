import { useState } from "react";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import { PillInput } from '../../../ui/input'

interface OptionalFieldsProps {
  whitePaper: string;
  website: string;
  description: string;
  onChangeInputField: (field: keyof EditSupportedCryptoAndAdminWalletRequestType, value: any) => void
}

const EditOptionalFields = ({ whitePaper, website, description, onChangeInputField }: OptionalFieldsProps) => {
  const [whitePaperUrl, setWhitePaperUrl] = useState<string>(whitePaper);
  const [websiteUrl, setWebsiteUrl] = useState<string>(website);
  const [desc, setDesc] = useState<string>(description);

  return (
    <div className="mb-8">
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">Optional Fields</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        <div className="sm:col-span-2">
          <PillInput
            id="whitepaperUrl"
            value={whitePaperUrl}
            onChange={(e) => { setWhitePaperUrl(e.target.value); onChangeInputField('whitepaperUrl', e.target.value) }}
            label="Whitepaper URL"
            type="text"
          />
        </div>

        <PillInput
          id="websiteUrl"
          value={websiteUrl}
          onChange={(e) => { setWebsiteUrl(e.target.value); onChangeInputField('websiteUrl', e.target.value) }}
          label="Website URL"
          type="text"
        />

        <PillInput
          id="description"
          value={desc}
          onChange={(e) => { setDesc(e.target.value); onChangeInputField('description', e.target.value) }}
          label="Description"
          type="text"
        />
      </div>
    </div>
  )
}

export default EditOptionalFields;
