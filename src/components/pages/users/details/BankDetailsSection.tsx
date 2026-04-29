import { Fragment } from 'react'
import type { UserBankAccountResponsePayload } from '../../../../types/response.payload.types'

interface BankDetailsSectionProps {
  bankDetails: Array<UserBankAccountResponsePayload> | undefined
  loading?: boolean
}

const BankDetailsSection = ({ bankDetails, loading = false }: BankDetailsSectionProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#0E0F0C] mb-6">Bank Details</h2>
        <div className="text-center py-8 text-[#667085]">Loading bank details...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#0E0F0C] mb-6">Bank Details</h2>
      
      {!bankDetails || bankDetails.length === 0 ? (
        <div className="text-center py-8 text-[#667085]">
          No bank details available.
        </div>
      ) : (
        <div className="space-y-4">
          {bankDetails.map((bank, index) => (
            <Fragment key={`${bank.id}-${index}`}>
              <div className={`p-4 border rounded-lg relative ${index === 0 ? 'border-t' : ''} ${index === bankDetails.length - 1 ? 'border-y' : 'border-t'} ${bank.isDeleted ? 'bg-red-50/30 border-red-100' : ''}`}>
                <div className="flex justify-end gap-2 absolute top-4 right-4">
                  {bank.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      Default
                    </span>
                  )}
                  {bank.isDeleted && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700 border border-red-200">
                      Deleted
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#667085] mb-2">
                      Account Name
                    </label>
                    <div className={`font-medium ${bank.isDeleted ? 'text-red-900' : 'text-[#0E0F0C]'}`}>
                      {bank.accountName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#667085] mb-2">
                      Bank Name
                    </label>
                    <div className={`font-medium ${bank.isDeleted ? 'text-red-900' : 'text-[#0E0F0C]'}`}>
                      {bank.bankName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#667085] mb-2">
                      Account Number
                    </label>
                    <div className={`font-medium ${bank.isDeleted ? 'text-red-900' : 'text-[#0E0F0C]'}`}>
                      {bank.accountNumber}
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default BankDetailsSection;
