import { X } from 'lucide-react'
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import type {
  SummarisedUserProfileResponsePayload,
  UserBankAccountResponsePayload
} from "../../../types/response.payload.types.ts";
import { convertToMillify } from '../../../util/index.util.ts';
import { Skeleton } from '../../global/Skeleton.tsx';

interface UserTransactionDetailsDrawerProps {
  open: boolean
  data: SummarisedUserProfileResponsePayload | null | undefined;
  loading: boolean;
  onClose: () => void
}

const UserTransactionDetailsDrawer = ({ open, onClose, loading, data }: UserTransactionDetailsDrawerProps) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  // Get the sum of every crypto - convert to Array<{ crypto: value, sumTotal: value }>
  const cryptToBalances: Array<{ crypto: string, sumTotal: string }> = !loading && data?.transactionSummary && data.transactionSummary.length > 0 ? data.transactionSummary.map((transaction) => ({
    crypto: transaction.cryptoCurrencySymbol,
    sumTotal: Number(transaction.totalCryptoAmount).toFixed(8).replace(/\.?0+$/, "")
  })) : [];

  const totalBuys = !loading && data?.transactionSummary ? data.transactionSummary.reduce((acc, item) => acc + Number(item.fiatSpentOnBuying), 0) : 0;
  const totalSells = !loading && data?.transactionSummary ? data.transactionSummary.reduce((acc, item) => acc + Number(item.fiatReceivedFromSelling), 0) : 0;

  const navigateToTransactionHistory = () => {
    if (data?.user.id) {
      navigate({ to: `${ROUTES.USER_TRANSACTIONS.replace('$userId', data.user.id)}` })
    }
  }

  const renderSkeletons = () => (
    <div className="space-y-6">
      <section className="rounded-[16px] bg-[#F0F0FF] px-6 py-6 space-y-6">
        <Skeleton height="h-4" width="w-32" rounded="full" className="mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton height="h-4" width="w-24" rounded="full" />
            <Skeleton height="h-4" width="w-40" rounded="full" />
          </div>
        ))}

        <Skeleton height="h-4" width="w-32" rounded="full" className="mt-8 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton height="h-4" width="w-24" rounded="full" />
            <Skeleton height="h-4" width="w-40" rounded="full" />
          </div>
        ))}
      </section>
    </div>
  );

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[570px] bg-white shadow-xl ${isClosing ? 'animate-modal-slide-out' : 'animate-modal-slide-in'}`}
      >
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <h3 className="text-lg font-semibold text-[#0E0F0C]">
            User Transaction Profile
          </h3>
          <button onClick={onClose} className="cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-8 overflow-y-auto h-[calc(100%-72px)]">
          {loading || !data ? (
            renderSkeletons()
          ) : (
            <div className="bg-[#F0F0FF] border border-[#ECECEC] rounded-[16px] p-6">
              {/* ORDER DETAILS */}
              <div className="text-sm font-semibold text-[#828282] tracking-wide">
                ORDER DETAILS
              </div>

              <div className="mt-4 flex items-center justify-between text-[16px]">
                <div className="text-[#828282]">Name</div>
                <div className="text-[#0E0F0C] text-sm">
                  {data?.user.profile?.firstName || '—'}{' '}
                  {data?.user.profile?.lastName || '-'}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[16px]">
                <div className="text-[#667085]">Email</div>
                <div className="text-[#0E0F0C] text-base">
                  {data?.user.email ?? '—'}
                </div>
              </div>

              {/* BANK DETAILS */}
              <div className="mt-8 text-sm font-semibold text-[#828282] tracking-wide">
                BANK DETAILS
              </div>
              {data?.bankDetails && data.bankDetails.length > 0 ? (
                <Fragment>
                  {data.bankDetails.map(
                    (
                      bankDetail: UserBankAccountResponsePayload,
                      index: number,
                    ) => (
                      <Fragment key={`${bankDetail.accountNumber}-${index}`}>
                        <div
                          className={`mt-4 gap-y-1 text-[14px] border-dotted ${index === 0 ? 'border-t' : ''} ${index === data.bankDetails.length - 1 ? 'border-y' : 'border-t'} py-4 relative`}
                        >
                          <div className="flex justify-end gap-1 mb-2">
                            {bankDetail.isDefault && (
                              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                Default
                              </span>
                            )}
                            {bankDetail.isDeleted && (
                              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full bg-red-100 text-red-700 border border-red-200">
                                Deleted
                              </span>
                            )}
                          </div>
                          <div className="my-0.5 flex items-center justify-between text-[16px]">
                            <div className="text-[#667085]">Account name</div>
                            <div className={`font-medium w-fit ${bankDetail.isDeleted ? 'text-red-700' : 'text-[#101828]'}`}>
                              {bankDetail.accountName}
                            </div>
                          </div>

                          <div className="my-0.5 flex items-center justify-between text-[16px]">
                            <div className="text-[#667085]">Bank name</div>
                            <div className={`font-medium w-fit ${bankDetail.isDeleted ? 'text-red-700' : 'text-[#101828]'}`}>
                              {bankDetail.bankName}
                            </div>
                          </div>

                          <div className="my-0.5 flex items-center justify-between text-[16px]">
                            <div className="text-[#667085]">Account number</div>
                            <div className={`font-medium w-fit ${bankDetail.isDeleted ? 'text-red-700' : 'text-[#101828]'}`}>
                              {bankDetail.accountNumber}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ),
                  )}
                </Fragment>
              ) : (
                <div className="mt-4 text-[#667085] text-base">
                  No bank details available.
                </div>
              )}

              {/* WALLET DETAILS */}
              <div className="mt-8 text-sm font-semibold text-[#828282] tracking-wide">
                WALLET DETAILS
              </div>

              <div className="mt-3">
                {cryptToBalances.length > 0 ? (
                  cryptToBalances.map(({ crypto, sumTotal }) => (
                    <div className="mt-4 flex items-center justify-between text-[16px]" key={`${crypto}-${sumTotal}`}>
                      <div className="text-[#667085]">Total {crypto}</div>
                      <div className="text-[#101828] font-medium">
                        {Number(sumTotal)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-4 text-[#667085] text-base">
                    No wallet details available.
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-[16px]">
                  <div className="text-[#667085]">Total Buys</div>
                  <div className="text-[#101828] font-medium">
                    <div className="text-[#101828] font-medium">₦{convertToMillify(totalBuys)}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[16px]">
                  <div className="text-[#667085]">Total Sells</div>
                  <div className="text-[#101828] font-medium">
                    <div className="text-[#101828] font-medium">₦{convertToMillify(totalSells)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={navigateToTransactionHistory}
                  className="w-fit px-6 py-4 rounded-full border border-[#03034D] text-[#03034D] font-semibold hover:bg-[#FF8B5A] hover:border-white hover:text-white transition-colors hover:cursor-pointer"
                >
                  View Transaction history
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserTransactionDetailsDrawer;
