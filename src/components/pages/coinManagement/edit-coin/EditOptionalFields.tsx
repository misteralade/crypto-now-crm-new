import { useState } from "react";
import type { EditSupportedCryptoAndAdminWalletRequestType } from "../../../../schemas/crypto.schema";
import LabeledPillInput from "../../../global/LabeledPillInput";

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
      <h3 className="text-[24px] font-medium text-[#0E0F0C] mb-6">
        Optional Fields
      </h3>

      {/* First row: Min trade amount and Transaction fee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 mb-6">
        {/* Whitepaper URL */}
        <div className="sm:col-span-2 w-full">
          <LabeledPillInput
            id="whitepaperUrl"
            value={whitePaperUrl}
            onChange={(e) => {
              setWhitePaperUrl(e.target.value)
              onChangeInputField('whitepaperUrl', e.target.value)
            }}
            label="Whitepaper URL"
            type="text"
            min={10}
            max={500}
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Website URL */}
        <div>
          <LabeledPillInput
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => {
              onChangeInputField('websiteUrl', e.target.value)
              setWebsiteUrl(e.target.value)
            }}
            label="Website URL"
            min={10}
            max={500}
            type="text"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>

        {/* Description */}
        <div>
          <LabeledPillInput
            id="description"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value)
              onChangeInputField('description', e.target.value)
            }}
            label="Description"
            min={100}
            max={500}
            type="text"
            labelClass="text-[14px] text-[#454745]"
            valueClass="text-[18px] text-[#4B5563]"
          />
        </div>
      </div>
    </div>
  )
}

export default EditOptionalFields;
