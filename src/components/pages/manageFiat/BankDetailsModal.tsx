import {useEffect} from "react";
import { store } from '../../../store'
import MFLabeledPillInput from '../../global/LabeledPillInput'
import MFLabeledPillSelect from '../../global/LabeledPillSelect'
import type { RootState } from '../../../store'
import type { SupportedPlatformBankAccountResponse } from '../../../types/response.payload.types'
import type { CreateBankAccountRequestType } from '../../../schemas/bank.schema'

interface BankDetailsModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  supportedBanks: Array<SupportedPlatformBankAccountResponse> | null | undefined
  handleCreateBankField: (
    field: keyof CreateBankAccountRequestType,
    value: any,
  ) => void
}

export default function BankDetailsModal({
  open,
  onClose,
  onConfirm,
  supportedBanks,
  handleCreateBankField,
}: BankDetailsModalProps) {
  const payload = (store.getState() as RootState).fiat.bank.createBank
  if (!open) return null

  const bankOptions =
    supportedBanks && supportedBanks.length
      ? supportedBanks.map((bank) => ({
          value: bank.id,
          label: bank.name,
        }))
      : [{ value: '', label: 'No banks available' }]
  
  useEffect(() => {
    handleCreateBankField('bankId', bankOptions[0].value || '')
  }, [bankOptions]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/30 transition-opacity opacity-100"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="w-full max-w-[464px] bg-white rounded-2xl shadow-sm border border-[#ECECEC]">
          <div className="px-6 pt-6 pb-2 text-center text-2xl font-medium">
            Bank details
          </div>

          <div className="px-6 pb-4 space-y-8 mt-8">
            <MFLabeledPillSelect
              label="Select Bank"
              onChange={(e) => handleCreateBankField('bankId', e.target.value)}
              options={bankOptions}
            />

            <MFLabeledPillInput
              label="Account Name"
              placeholder="e.g John doe"
              onChange={(e) =>
                handleCreateBankField('accountHolderName', e.target.value)
              }
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />

            <MFLabeledPillInput
              label="Account Number"
              placeholder="0000000000"
              onChange={(e) =>
                handleCreateBankField('accountNumber', e.target.value)
              }
              inputMode="numeric"
              valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
            />
          </div>

          <div className="px-6 pb-6 flex mt-12 flex-col md:flex-row items-center justify-center gap-6">
            <button
              className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-12 py-4 text-lg font-semibold w-full md:w-fit cursor-pointer"
              onClick={onClose}
            >
              Go back
            </button>
            <button
              className="rounded-full bg-[#03034D] text-white px-12 py-4 text-lg font-semibold w/full hover:bg-[#FF8B5A] hover:cursor-pointer md:w-fit"
              disabled={
                !payload.bankId ||
                !payload.accountNumber ||
                !payload.accountHolderName
              }
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
