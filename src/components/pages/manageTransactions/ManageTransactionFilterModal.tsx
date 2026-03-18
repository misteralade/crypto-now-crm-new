import { Fragment, useEffect, useState } from 'react'
import { TRANSACTION_STATUS_OPTIONS } from '../../../util/constants.util.ts'
import type { SearchSupportedCryptoData } from '../../../types/response.payload.types'
import type { TransactionStatus } from '../../../schemas/enum.schema'
import { DateInput } from '../../ui/date-input'
import { Input } from '../../ui/input'
import { LabeledSelect } from '../../ui/select'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  fromDate: Date | undefined
  toDate: Date | undefined
  minAmountRange: number | undefined
  maxAmountRange: number | undefined
  handleFromDate: (date: Date) => void
  handleToDate: (date: Date) => void
  handleMinAmountRange: (amount: number) => void
  handleMaxAmountRange: (amount: number) => void
  supportedCryptos: Array<SearchSupportedCryptoData> | null | undefined
  selectedCryptoId: string | undefined
  handleSelectedCryptoId: (selectedCryptoId: string) => void
  selectedStatus: TransactionStatus | undefined | 'ALL'
  handleSelectedStatus: (status: TransactionStatus | 'ALL') => void
}

const ManageTransactionFilterModal = ({
  isOpen,
  onClose,
  onReset,
  fromDate,
  toDate,
  minAmountRange,
  maxAmountRange,
  handleFromDate,
  handleToDate,
  handleMinAmountRange,
  handleMaxAmountRange,
  supportedCryptos,
  selectedCryptoId,
  handleSelectedCryptoId,
  selectedStatus,
  handleSelectedStatus,
}: FilterModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender])

  if (!shouldRender) return null

  const cryptoOptions = [
    { value: '', label: 'All cryptocurrencies' },
    ...(supportedCryptos?.map((c) => ({ value: c.id, label: `${c.name} (${c.symbol.toUpperCase()})` })) ?? []),
  ]

  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className={`absolute inset-0 bg-black/40 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`} onClick={onClose} />
        <div className={`relative bg-white rounded-2xl shadow-xl w-[442px] p-6 border border-[#ECECEC] ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
          <h3 className="text-[13px] font-semibold text-[#667085] mb-4">Date Range</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <DateInput value={fromDate} onChange={handleFromDate} placeholder="From" />
            <DateInput value={toDate} onChange={handleToDate} placeholder="To" />
          </div>

          <h3 className="text-[13px] font-semibold text-[#667085] mb-4">Amount Range</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Input
              placeholder="Min"
              type="number"
              value={minAmountRange !== undefined ? minAmountRange : ''}
              onChange={(e) => handleMinAmountRange(Number(e.target.value))}
            />
            <Input
              placeholder="Max"
              type="number"
              value={maxAmountRange !== undefined ? maxAmountRange : ''}
              onChange={(e) => handleMaxAmountRange(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <LabeledSelect
              label="Cryptocurrency"
              value={selectedCryptoId ?? ''}
              onValueChange={(v) => handleSelectedCryptoId(v === '__empty__' ? '' : v)}
              options={cryptoOptions}
            />
            <LabeledSelect
              label="Status"
              value={selectedStatus ?? 'ALL'}
              onValueChange={(v) => handleSelectedStatus(v as TransactionStatus | 'ALL')}
              options={TRANSACTION_STATUS_OPTIONS.map((s) => ({ value: s.value || 'ALL', label: s.label }))}
            />
          </div>

          <div className="flex justify-end items-center gap-4">
            <button className="text-[13px] font-medium text-[#03034D] cursor-pointer hover:underline" onClick={onReset}>
              Reset filters
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ManageTransactionFilterModal
