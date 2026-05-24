import { useEffect, useState } from 'react'
import { TRANSACTION_STATUS_OPTIONS } from '../../../util/constants.util.ts'
import type { SearchSupportedCryptoData } from '../../../types/response.payload.types'
import type { TransactionStatus } from '../../../schemas/enum.schema'
import { DateInput } from '../../ui/date-input'
import { Input } from '../../ui/input'
import { LabeledSelect } from '../../ui/select'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setShouldRender(true)
  }, [isOpen])

  if (!shouldRender) return null

  const cryptoOptions = [
    { value: '', label: 'All cryptocurrencies' },
    ...(supportedCryptos?.map((c) => ({ value: c.id, label: `${c.name} (${c.symbol.toUpperCase()})` })) ?? []),
  ]

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[480px] mx-4 p-8 border border-[#ECECEC]"
          >
            <div className="mb-8">
                <h2 className="text-[20px] font-bold text-[#03034D]">Filter Transactions</h2>
                <p className="text-sm text-gray-500 mt-1">Refine the transaction list by date, amount, or status.</p>
            </div>

            <div className="space-y-6">
                {/* Date Range */}
                <div>
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Date Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DateInput value={fromDate} onChange={handleFromDate} placeholder="From" />
                        <DateInput value={toDate} onChange={handleToDate} placeholder="To" />
                    </div>
                </div>

                {/* Amount Range */}
                <div>
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Amount Range (Fiat)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Min"
                            type="number"
                            value={minAmountRange !== undefined ? minAmountRange : ''}
                            onChange={(e) => handleMinAmountRange(Number(e.target.value))}
                            className="mb-0"
                        />
                        <Input
                            placeholder="Max"
                            type="number"
                            value={maxAmountRange !== undefined ? maxAmountRange : ''}
                            onChange={(e) => handleMaxAmountRange(Number(e.target.value))}
                            className="mb-0"
                        />
                    </div>
                </div>

                {/* Crypto & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LabeledSelect
                        label="Cryptocurrency"
                        value={selectedCryptoId ?? ''}
                        onValueChange={(v) => handleSelectedCryptoId(v === '__empty__' ? '' : v)}
                        options={cryptoOptions}
                        className="mb-0"
                    />
                    <LabeledSelect
                        label="Status"
                        value={selectedStatus ?? 'ALL'}
                        onValueChange={(v) => handleSelectedStatus(v as TransactionStatus | 'ALL')}
                        options={TRANSACTION_STATUS_OPTIONS.map((s) => ({ value: s.value || 'ALL', label: s.label }))}
                        className="mb-0"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#F2F4F7]">
                <button 
                    className="text-sm font-bold text-gray-400 hover:text-[#03034D] transition-colors cursor-pointer" 
                    onClick={onReset}
                >
                    Reset filters
                </button>
                <button 
                    className="px-8 py-3 bg-[#03034D] text-white text-sm font-bold rounded-full hover:bg-[#03034D]/90 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                    onClick={onClose}
                >
                    Apply Filters
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ManageTransactionFilterModal
