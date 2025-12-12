import { X } from 'lucide-react'
import {Fragment} from "react";
import {useNavigate} from "@tanstack/react-router";
import {ROUTES} from "../../../util/constants.util.ts";
import type {
  SummarisedUserProfileResponsePayload,
  UserBankAccountResponsePayload
} from "../../../types/response.payload.types.ts";
import { convertToMillify } from '../../../util/index.util.ts';

interface UserTransactionDetailsDrawerProps {
  open: boolean
  data: SummarisedUserProfileResponsePayload | null | undefined;
  loading: boolean;
  onClose: () => void
}

const UserTransactionDetailsDrawer = ({ open, onClose, loading, data }: UserTransactionDetailsDrawerProps) => {
  const navigate = useNavigate();

  // Get the sum of every crypto - convert to Array<{ crypto: value, sumTotal: value }>
  const cryptToBalances:Array<{crypto: string, sumTotal: string }> = !loading && data?.transactionSummary && data.transactionSummary.length > 0 ? data.transactionSummary.map((transaction) => ({
    crypto: transaction.cryptoCurrencySymbol,
    sumTotal: Number(transaction.totalCryptoAmount).toFixed(8)
  })) : [];

  const totalBuys = !loading && data?.transactionSummary ? data.transactionSummary.reduce((acc, item) => acc + Number(item.fiatSpentOnBuying), 0) : 0;
  const totalSells = !loading && data?.transactionSummary ? data.transactionSummary.reduce((acc, item) => acc + Number(item.fiatReceivedFromSelling), 0) : 0;

  const navigateToTransactionHistory = () => {
    if (data?.user.id) {
      navigate({ to: `${ROUTES.USER_TRANSACTIONS.replace('$userId', data.user.id)}` })
    }
  }

  return (
    <Fragment>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
          aria-hidden={!open}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
          />

          {/* Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-[570px] bg-white shadow-xl transition-transform duration-300 ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-6 pt-8 pb-4">
              <h3 className="text-lg font-semibold text-[#0E0F0C]">
                Transaction details
              </h3>
              <button onClick={onClose} className="">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-8 overflow-y-auto h-[calc(100%-72px)]">
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
                            className={`mt-4 gap-y-1 text-[14px] border-dotted ${index === 0 ? 'border-t' : ''} ${index === data.bankDetails.length - 1 ? 'border-y' : 'border-t'} py-4`}
                          >
                            <div className="my-0.5 flex items-center justify-between text-[16px]">
                              <div className="text-[#667085]">Account name</div>
                              <div className="text-[#101828] font-medium w-fit">
                                {bankDetail.accountName}
                              </div>
                            </div>

                            <div className="my-0.5 flex items-center justify-between text-[16px]">
                              <div className="text-[#667085]">Bank name</div>
                              <div className="text-[#101828] font-medium w-fit">
                                {bankDetail.bankName}
                              </div>
                            </div>

                            <div className="my-0.5 flex items-center justify-between text-[16px]">
                              <div className="text-[#667085]">Account name</div>
                              <div className="text-[#101828] font-medium w-fit">
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
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default UserTransactionDetailsDrawer;
