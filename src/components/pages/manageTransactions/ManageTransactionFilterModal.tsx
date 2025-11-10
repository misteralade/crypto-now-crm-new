import { Fragment, useRef } from 'react'
import { Calendar } from 'lucide-react'
import { TRANSACTION_STATUS_OPTIONS } from '../../../util/constants.util.ts'
import type { SearchSupportedCryptoData } from '../../../types/response.payload.types'
import type { TransactionStatus } from '../../../schemas/enum.schema'

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
  if (!isOpen) return null

  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[442px] p-6">
        <style>
          {`
            .custom-date::-webkit-calendar-picker-indicator { display: none; }
            .custom-date::-webkit-datetime-edit { color: inherit; }
            .custom-date.empty::-webkit-datetime-edit { color: transparent; }
            .custom-date.empty { caret-color: transparent; }
          `}
        </style>
        <h3 className="text-sm font-semibold text-[#667085] mb-4">
          Date Range
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* From Date */}
          <div className="relative">
            {!fromDate && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                From
              </span>
            )}
            <input
              ref={fromRef}
              type="date"
              value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                handleFromDate(new Date(e.target.value))
              }}
              className={`custom-date ${!fromDate ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
            />
            <button
              type="button"
              aria-label="Open from date picker"
              onClick={() => {
                if (fromRef.current?.showPicker) fromRef.current.showPicker()
                else fromRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          {/* To Date */}
          <div className="relative">
            {!toDate && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                To
              </span>
            )}
            <input
              ref={toRef}
              type="date"
              value={toDate ? toDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                handleToDate(new Date(e.target.value))
              }}
              className={`custom-date ${!toDate ? 'empty' : ''} w-full border text-sm text-gray-700 border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-transparent`}
            />
            <button
              type="button"
              aria-label="Open to date picker"
              onClick={() => {
                if (toRef.current?.showPicker) toRef.current.showPicker()
                else toRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[#667085] mb-4">
          Amount Range
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            className="w-full border text-sm text-[#626262] border-[#D9D9D9] rounded-full p-3"
            placeholder="Min"
            type="number"
            value={minAmountRange !== undefined ? minAmountRange : ''}
            onChange={(e) => handleMinAmountRange(Number(e.target.value))}
          />
          <input
            className="w-full border text-sm text-[#626262] border-[#D9D9D9] rounded-full p-3"
            placeholder="Max"
            type="number"
            value={maxAmountRange !== undefined ? maxAmountRange : ''}
            onChange={(e) => handleMaxAmountRange(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Select Cryptocurrency*/}
          <div>
            <h4 className="text-sm font-semibold text-[#667085] mb-2">
              Cryptocurrency
            </h4>
            <div className="relative">
              <select
                value={selectedCryptoId}
                onChange={(e) => handleSelectedCryptoId(e.target.value)}
                className="w-full border text-sm text-[#626262] border-[#D9D9D9] rounded-full p-3 appearance-none"
              >
                <option className="text-sm !text-[#626262]">
                  Select option
                </option>
                {supportedCryptos?.length !== 0 && (
                  <Fragment>
                    {supportedCryptos?.map((crypto) => (
                      <option
                        key={crypto.id}
                        value={crypto.id}
                        className="text-sm !text-[#626262] flex justify-between"
                      >
                        <img
                          src={crypto.logoUrl}
                          alt={crypto.symbol}
                          className="w-8 h-8 rounded-full object-cover"
                        />

                        <p>
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </p>
                      </option>
                    ))}
                  </Fragment>
                )}
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Select Status*/}
          <div>
            <h4 className="text-sm font-semibold text-[#667085] mb-2">
              Status
            </h4>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  handleSelectedStatus(
                    e.target.value as TransactionStatus | 'ALL',
                  )
                }
                className="w-full border text-sm border-[#D9D9D9] rounded-full p-3 appearance-none"
              >
                {TRANSACTION_STATUS_OPTIONS.map((status, index) => (
                  <option
                    key={`${status.value}-${status.label}-${index}`}
                    value={status.value}
                    className="text-sm !text-[#626262]"
                  >
                    {status.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          <button
            className="text-sm text-[#03034D] cursor-pointer hover:text-[#03034D]"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageTransactionFilterModal;
