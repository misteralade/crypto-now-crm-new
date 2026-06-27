import { Fragment, useState, useEffect } from "react";
import { Upload, X, ChevronDown, ChevronUp, Clock, Eye, Edit2, Play, RefreshCw, Activity } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { convertToMillify } from "../../../util/index.util.ts";
import momentClient from "../../../util/moment";
import CopyDetails from "../../global/CopyDetails";
import { StatusBadge } from "../../global/StatusBadge";
import { setTransactionDetailUpdateField } from "../../../redux/transaction-management.slice";
import TransactionStatusPicker from "./TransactionStatusPicker";
import type { TransactionStatusType } from "../../../schemas/enum.schema";
import type { SearchTransactionsResponse } from "../../../types/response.payload.types";
import type { UpdateTransactionStatusRequestType } from "../../../schemas/transaction.schema";
import type { ChangeEvent } from "react";
import LabeledPillInput from "../../global/LabeledPillInput";
import type { RootState } from "../../../store";
import { Skeleton } from "../../global/Skeleton";
import ConfirmModal from "../../global/ConfirmModal";
import TransactionDetailsUserProfile from "./details/TransactionDetailsUserProfile";
import PaymentAccountDetails from "./details/PaymentAccountDetails";
import AdminPaymentAccountDetails from "./details/AdminPaymentAccountDetails";
import LedgerEntriesSection from "./details/LedgerEntriesSection";

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: (value?: string) => void;
  transaction?: SearchTransactionsResponse | undefined | null;
  loading?: boolean;
  handleTransactionUpdateField: (
    field: keyof UpdateTransactionStatusRequestType,
    value: UpdateTransactionStatusRequestType[keyof UpdateTransactionStatusRequestType]
  ) => void;
  handleTransactionUpdate: () => void;
  handleTransactionReceiptUpload: (file: File) => Promise<string>;
  handleRetryDepositConfirmation: (sessionId?: string) => Promise<void>;
  handleForceTriggerPayout: (sessionId?: string) => Promise<void>;
  retryingConfirmation: boolean;
  forcingPayout: boolean;
}

const TransactionDetailsDrawer = ({
  isOpen,
  onClose,
  transaction,
  loading,
  handleTransactionUpdateField,
  handleTransactionUpdate,
  handleTransactionReceiptUpload,
  handleRetryDepositConfirmation,
  handleForceTriggerPayout,
  retryingConfirmation,
  forcingPayout,
}: TransactionDetailsDrawerProps) => {
  const dispatch = useDispatch();
  const updatePayload = useSelector(
    (state: RootState) => state.transactionManagement.details.update
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatusType | undefined
  >(undefined);
  const [showForcePayoutConfirmModal, setShowForcePayoutConfirmModal] =
    useState(false);
  const [isLogListExpanded, setIsLogListExpanded] = useState(false);
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});

  // Pre-fill update form from server when drawer opens so existing note is shown
  useEffect(() => {
    if (isOpen && transaction) {
      dispatch(
        setTransactionDetailUpdateField({
          field: "adminNotes",
          value: transaction.adminNotes ?? "",
        })
      );
    }
  }, [dispatch, isOpen, transaction]);

  // Reset transient drawer state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStatus(undefined);
      setUploadedFile(null);
      setPreviewUrl(undefined);
      setIsLogListExpanded(false);
      setExpandedLogIds({});
    }
  }, [isOpen]);

  const renderSkeletons = () => (
    <div className="space-y-6">
      <section className="rounded-lg bg-[#F0F0FF] px-4 py-6 space-y-4">
        <Skeleton height="h-4" width="w-32" rounded="full" className="mb-6" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton height="h-4" width="w-24" rounded="full" />
            <Skeleton height="h-4" width="w-40" rounded="full" />
          </div>
        ))}
      </section>
      <Skeleton height="h-12" width="w-48" rounded="full" />
      <section className="mt-4 space-y-4">
        <Skeleton height="h-6" width="w-48" rounded="full" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="h-10" width="w-32" rounded="full" />
          ))}
        </div>
      </section>
      <Skeleton height="h-32" width="w-full" rounded="lg" />
      <Skeleton height="h-14" width="w-full" rounded="full" />
    </div>
  );

  // Hide system-generated lock entries from the activity feed.
  const visibleTransactionActivities =
    transaction?.transactionActivities.filter(
      (activity) => activity.action !== "ADMIN_LOCK_TRANSACTION",
    ) ?? [];
  const userBankName =
    transaction?.userBankAccount?.bankName ??
    transaction?.userBankAccount?.bank?.name ??
    "—";
  const adminBankName =
    transaction?.adminBankAccount?.bankName ??
    transaction?.adminBankAccount?.bank?.name ??
    "—";

  // Explicit rate: 1 crypto = fiat (variable by transaction currency)
  const getExchangeRateDisplay = (): string => {
    if (!transaction) return "—";
    const symbol = transaction.cryptocurrency?.symbol ?? "";
    if (!symbol) return "—";
    const currency = transaction.currency;
    if (transaction.exchangeRate) {
      const rate = Number(transaction.exchangeRate.rate);
      const platformRate = Number(transaction.exchangeRate.platformRate);
      if (currency === "USD") {
        return `1 ${symbol} = $ ${convertToMillify(rate, 2)}`;
      }
      return `1 ${symbol} = ₦ ${convertToMillify(platformRate * rate, 2)}`;
    }
    const amountCrypto = Number(transaction.amountCrypto);
    if (amountCrypto <= 0) return "—";
    if (currency === "USD") {
      const val = Number(transaction.amountFiat) / amountCrypto;
      return `1 ${symbol} = $ ${convertToMillify(val, 2)}`;
    }
    const val = Number(transaction.amountFiatNGN || 0) / amountCrypto;
    return `1 ${symbol} = ₦ ${convertToMillify(val, 2)}`;
  };

  const canRetryConfirmation =
    transaction?.type === "SELL" &&
    ["DEPOSIT_DETECTED", "PENDING_CONFIRMATION"].includes(
      transaction?.status ?? ""
    );
  const canForcePayout =
    transaction?.type === "SELL" &&
    transaction?.status !== "COMPLETED" &&
    !!transaction?.userBankAccount;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload only PNG, JPG, JPEG, or PDF files");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const signedUrl = await handleTransactionReceiptUpload(file);
    setUploadedFile(file);
    setPreviewUrl(signedUrl);
  };

  const removeFile = () => {
    dispatch(
      setTransactionDetailUpdateField({
        field: "adminPaymentReceiptUrl",
        value: undefined,
      })
    );
    setUploadedFile(null);
    setPreviewUrl(undefined);
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/5" onClick={() => onClose()} />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[520px] lg:w-[570px] bg-white shadow-sm !p-8 sm:p-6 overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#0E0F0C] font-semibold hover:opacity-80 text-[18px]">
            Transaction Details
          </div>
          <button
            onClick={() => onClose()}
            aria-label="Close"
            className="cursor-pointer hover:text-gray-700"
          >
            <X size={17} />
          </button>
        </div>

        {loading || !transaction ? (
          renderSkeletons()
        ) : (
          <div className="space-y-6">
            {/* Order Details */}
            <section className="rounded-lg bg-[#F0F0FF] px-4 py-6">
              <h3 className="text-[14px] font-semibold text-[#828282] mb-4">
                ORDER DETAILS
              </h3>
              <div className="flex flex-col gap-x-2 gap-y-4 text-[14px] text-[#0E0F0C]">
                {/* Transaction ID */}
                <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4">
                  <div className="text-[#828282] text-[16px] shrink-0">
                    Transaction ID
                  </div>
                  <div className="text-[#0E0F0C] text-[14px] w-full sm:w-auto flex justify-end">
                    <CopyDetails
                      text={transaction.sessionId}
                      wrap={true}
                      className="!max-w-full sm:!max-w-[300px]"
                    />
                  </div>
                </section>

                {/* Type */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">Type</div>
                  <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                    {transaction.type}
                  </div>
                </section>

                {/* Amount */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">Amount</div>
                  <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                    {transaction.type === "BUY" ? (
                      <Fragment>
                        ₦ {Number(transaction.amountFiatNGN).toLocaleString()}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {transaction.amountCrypto}{" "}
                        {transaction.cryptocurrency
                          ? transaction.cryptocurrency.symbol
                          : ""}
                      </Fragment>
                    )}
                  </div>
                </section>



                {/* Initiation Date */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">Date</div>
                  <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                    {momentClient.formatToNormalisedDateAndTime(
                      transaction.createdAt
                    )}
                  </div>
                </section>

                {/* Exchange Rate */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">
                    Exchange Rate
                  </div>
                  <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                    {getExchangeRateDisplay()}
                  </div>
                </section>

                {/* User Amount to Receive */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">
                    User will receive
                  </div>
                  <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                    {transaction.type === "BUY" ? (
                      <Fragment>
                        {transaction.amountCrypto}{" "}
                        {transaction.cryptocurrency
                          ? transaction.cryptocurrency.symbol
                          : ""}{" "}
                        (₦{" "}
                        {convertToMillify(Number(transaction.amountFiatNGN))})
                      </Fragment>
                    ) : (
                      <Fragment>
                        ₦ {Number(transaction.amountFiatNGN).toLocaleString()} (
                        ${convertToMillify(Number(transaction.usdAmount))})
                      </Fragment>
                    )}
                  </div>
                </section>

                {/* Transaction Status */}
                <section className="flex justify-between items-center">
                  <div className="text-[#828282] text-[16px]">Status</div>

                  <StatusBadge status={transaction.status} />
                </section>

                {/* Confirmations if SELL order */}
                {transaction.type === "SELL" && (
                  <section className="flex justify-between items-center">
                    <div className="text-[#828282] text-[16px]">Confirmations</div>
                    <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                      {transaction.confirmationCount !== undefined ? transaction.confirmationCount : 0}
                    </div>
                  </section>
                )}

                {transaction.failureReason && (
                  <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="text-[#828282] text-[16px]">Reason</div>
                    <p className="mt-1 text-sm leading-relaxed text-rose-900">
                      {transaction.failureReason}
                    </p>
                  </section>
                )}

              </div>

              <section className="grid gap-4">
                <TransactionDetailsUserProfile
                  userId={transaction.user?.id ?? transaction.userId}
                  firstName={transaction.profile?.firstName ?? ""}
                  lastName={transaction.profile?.lastName ?? ""}
                  email={transaction.user?.email ?? transaction.email ?? ""}
                  phone={transaction.profile?.phoneNumber ?? undefined}
                  profileImageUrl={transaction.profile?.profileImg}
                />

                <PaymentAccountDetails
                  type={transaction.type}
                  hasBankAccount={!!transaction.userBankAccount}
                  accountName={transaction.userBankAccount?.accountName}
                  accountNumber={transaction.userBankAccount?.accountNumber}
                  bankName={userBankName}
                  isDeleted={transaction.userBankAccount?.isDeleted}
                  hasCryptoWallet={!!transaction.userCryptoWallet}
                  walletAddress={transaction.userCryptoWallet?.walletAddress}
                  network={transaction.userCryptoWallet?.network}
                  cryptoName={transaction.cryptocurrency?.name}
                  cryptoSymbol={transaction.cryptocurrency?.symbol}
                />

                <AdminPaymentAccountDetails
                  type={transaction.type}
                  hasBankAccount={!!transaction.adminBankAccount}
                  accountName={transaction.adminBankAccount?.accountHolderName}
                  accountNumber={transaction.adminBankAccount?.accountNumber}
                  bankName={adminBankName}
                  hasCryptoWallet={!!transaction.adminCryptoWallet}
                  walletAddress={transaction.adminCryptoWallet?.walletAddress}
                  network={transaction.adminCryptoWallet?.network}
                  cryptoName={transaction.cryptocurrency?.name}
                  cryptoSymbol={transaction.cryptocurrency?.symbol}
                />
              </section>

              {(transaction.type === "SELL" && transaction.depositAddress) ||
              (transaction.type === "BUY" && transaction.bankTransferReference) ? (
                <section className="grid gap-4">
                  {transaction.type === "SELL" && transaction.depositAddress && (
                    <div className="rounded-lg bg-white shadow-sm p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Custodial Deposit Address
                      </h2>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Send and monitor funds against this deposit address.
                        </p>
                        <CopyDetails
                          text={transaction.depositAddress}
                          className="!max-w-[700px]"
                          iconClassName="!w-8 !h-8"
                          wrap={true}
                        />
                      </div>
                    </div>
                  )}

                  {transaction.type === "BUY" &&
                    transaction.bankTransferReference && (
                      <div className="rounded-lg bg-white shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          Bank Transfer Reference
                        </h2>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">
                            Use this reference to match the customer payment.
                          </p>
                          <CopyDetails
                            text={transaction.bankTransferReference}
                            className="!max-w-[700px]"
                            iconClassName="!w-8 !h-8"
                            wrap={true}
                          />
                        </div>
                      </div>
                    )}
                </section>
              ) : null}

              {(canRetryConfirmation || canForcePayout) && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {canRetryConfirmation && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRetryDepositConfirmation(transaction.sessionId)
                        }
                        disabled={retryingConfirmation}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#F2994A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#D98234] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {retryingConfirmation
                          ? "Retrying..."
                          : "Retry confirmation"}
                      </button>
                    )}

                    {canForcePayout && (
                      <button
                        type="button"
                        onClick={() => setShowForcePayoutConfirmModal(true)}
                        disabled={forcingPayout}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#B42318] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {forcingPayout ? "Triggering..." : "Trigger payout"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt Url */}
              {transaction.type === "BUY" && transaction.receiptImageUrl && (
                <div className="mt-4 flex justify-between items-start">
                  <div className="text-[#828282] mb-1 text-[16px]">
                    Uploaded receipt
                  </div>
                  <img
                    src={transaction.receiptImageUrl}
                    alt="Uploaded receipt"
                    className="rounded-md border border-gray-200 w-48"
                  />
                </div>
              )}
            </section>

            {/* Activity Log */}
            {visibleTransactionActivities.length > 0 && (
              <Fragment>
                <div className="bg-[#F8F9FE] p-5 border border-[#E9EBF8] rounded-3xl space-y-4 mb-6 mt-6 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#EBF8FF] rounded-lg">
                        <Activity className="w-4 h-4 text-[#3182CE]" />
                      </div>
                      <h3 className="text-[15px] font-bold text-[#2D3748]">
                        Activity Log
                      </h3>
                    </div>
                    <span className="text-[12px] font-medium text-[#718096] bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                      {visibleTransactionActivities.length} {visibleTransactionActivities.length === 1 ? "activity" : "activities"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-y-3">
                    {(isLogListExpanded 
                      ? visibleTransactionActivities 
                      : visibleTransactionActivities.slice(0, 3)
                    ).map((activity) => {
                      const getMeta = (action: string) => {
                        switch (action) {
                          case "ADMIN_VIEW_TRANSACTION":
                            return {
                              icon: Eye,
                              borderLeft: "border-l-[#3182CE]",
                              bgIcon: "bg-[#EBF8FF] text-[#3182CE]",
                            };
                          case "UPDATE_TRANSACTION_STATUS":
                            return {
                              icon: Edit2,
                              borderLeft: "border-l-[#805AD5]",
                              bgIcon: "bg-[#FAF5FF] text-[#805AD5]",
                            };
                          case "FORCE_TRIGGER_PAYOUT":
                          case "ADMIN_RETRY_PENDING_PAYOUT":
                            return {
                              icon: Play,
                              borderLeft: "border-l-[#DD6B20]",
                              bgIcon: "bg-[#FFFAF0] text-[#DD6B20]",
                            };
                          case "RETRY_DEPOSIT_CONFIRMATION":
                            return {
                              icon: RefreshCw,
                              borderLeft: "border-l-[#4C51BF]",
                              bgIcon: "bg-[#EBF4FF] text-[#4C51BF]",
                            };
                          default:
                            return {
                              icon: Clock,
                              borderLeft: "border-l-[#718096]",
                              bgIcon: "bg-[#F7FAFC] text-[#718096]",
                            };
                        }
                      };

                      const meta = getMeta(activity.action);
                      const IconComponent = meta.icon;
                      const isMessageLong = activity.message.length > 90;
                      const isExpanded = !!expandedLogIds[activity.id];
                      const displayMessage = isMessageLong && !isExpanded
                        ? activity.message.slice(0, 90) + "..."
                        : activity.message;

                      return (
                        <div 
                          key={activity.id} 
                          className={`border border-[#E2E8F0] border-l-4 ${meta.borderLeft} rounded-xl p-3.5 bg-white shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${meta.bgIcon}`}>
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[13px] font-bold text-[#2D3748]">
                                {activity.action
                                  .replaceAll("_", " ")
                                  .toLowerCase()
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                            </div>
                            <span className="text-[11px] font-medium text-[#A0AEC0] whitespace-nowrap">
                              {momentClient.formatToNormalisedDateAndTime(activity.createdAt)}
                            </span>
                          </div>

                          <div className="mt-2 text-[13px] leading-relaxed text-[#4A5568] break-words">
                            {displayMessage}
                          </div>

                          {isMessageLong && (
                            <button
                              onClick={() => setExpandedLogIds(prev => ({ ...prev, [activity.id]: !prev[activity.id] }))}
                              className="text-[11px] font-semibold text-[#3182CE] hover:text-[#2B6CB0] mt-2 inline-flex items-center gap-1 focus:outline-none transition-colors duration-150"
                            >
                              {isExpanded ? (
                                <>
                                  Show Less <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  Show More <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {visibleTransactionActivities.length > 3 && (
                    <button
                      onClick={() => setIsLogListExpanded(!isLogListExpanded)}
                      className="w-full mt-3 py-2 px-4 bg-white border border-[#E2E8F0] text-[13px] font-semibold text-[#4A5568] hover:bg-[#F7FAFC] rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all duration-200"
                    >
                      {isLogListExpanded ? (
                        <>
                          Show Less Activities <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View All Activities ({visibleTransactionActivities.length}) <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Fragment>
            )}

            <LedgerEntriesSection ledgerEntries={transaction.ledgerEntries} />

            {(transaction.userNotes ||
              transaction.adminNotes ||
              transaction.internalNotes) && (
              <section className="rounded-lg bg-white shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Notes
                </h2>
                <div className="space-y-4">
                  {transaction.userNotes && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        User Notes
                      </p>
                      <p className="text-sm text-blue-800">
                        {transaction.userNotes}
                      </p>
                    </div>
                  )}
                  {transaction.adminNotes && (
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm font-medium text-purple-900 mb-1">
                        Admin Notes
                      </p>
                      <p className="text-sm text-purple-800">
                        {transaction.adminNotes}
                      </p>
                    </div>
                  )}
                  {transaction.internalNotes && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Internal Notes
                      </p>
                      <p className="text-sm text-gray-700">
                        {transaction.internalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Admin Upload transaction receipt */}
            <section>
              {transaction.type === "BUY" && (
                <section className="mt-4">
                  <div className="mt-6 bg-[#F0F0FF] p-4 border border-[#ECECEC] rounded-2xl">
                    <h3 className="text-[14px] font-semibold text-[#828282] mb-4">
                      Upload payment receipt
                    </h3>

                    <div className="space-y-4">
                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#03034D] rounded-lg cursor-pointer hover:bg-[#E8E8FF] transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-[#03034D]" />
                          <p className="text-sm text-[#03034D] font-medium">
                            Click to upload file
                          </p>
                          <p className="text-xs text-[#828282] mt-1">
                            PNG, JPG, JPEG or PDF (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          onChange={handleImageUpload}
                        />
                      </label>

                      {/* File Preview */}
                      {uploadedFile ? (
                        // Show uploaded file preview (takes priority)
                        <div className="relative group">
                          {previewUrl ? (
                            // Image preview
                            <div className="relative">
                              <img
                                src={previewUrl}
                                alt="Upload preview"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={removeFile}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {uploadedFile.name}
                              </div>
                            </div>
                          ) : (
                            // PDF preview
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                  <span className="text-red-600 font-semibold text-xs">
                                    PDF
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#0E0F0C]">
                                    {uploadedFile.name}
                                  </p>
                                  <p className="text-xs text-[#828282]">
                                    {(uploadedFile.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : transaction.adminPaymentReceiptUrl ? (
                        // Show admin transaction receipt when no file is uploaded
                        <div className="relative group">
                          {transaction.adminPaymentReceiptUrl
                            .toLowerCase()
                            .endsWith(".pdf") ? (
                            // PDF preview
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                  <span className="text-red-600 font-semibold text-xs">
                                    PDF
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#0E0F0C]">
                                    Admin Payment Receipt
                                  </p>
                                  <p className="text-xs text-[#828282]">
                                    <a
                                      href={transaction.adminPaymentReceiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#03034D] hover:underline"
                                    >
                                      View receipt
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Image preview
                            <div className="relative">
                              <img
                                src={transaction.adminPaymentReceiptUrl}
                                alt="Admin payment receipt"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                Admin Payment Receipt
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              )}

              <section className="mt-4">
                <div className="text-[16px] font-semibold text-[#454745] mb-2">
                  Update transaction status
                </div>

                <TransactionStatusPicker
                  transactionType={transaction.type}
                  currentStatus={transaction.status}
                  selectedStatus={selectedStatus}
                  onSelectStatus={(status) => {
                    handleTransactionUpdateField("status", status);
                    setSelectedStatus(status);
                  }}
                />
              </section>
            </section>

            {/* Notes */}
            <section>
              <LabeledPillInput
                label="Transaction note (Optional)"
                placeholder="Add a note"
                value={
                  updatePayload?.adminNotes ?? transaction?.adminNotes ?? ""
                }
                onChange={(e) =>
                  handleTransactionUpdateField("adminNotes", e.target.value)
                }
              />
            </section>

            <section>
              <button
                className={`w-full py-4 font-semibold text-white rounded-full transition-all duration-200 ${
                  !selectedStatus || selectedStatus === transaction.status
                    ? "bg-[#03034D]/50 cursor-not-allowed"
                    : "bg-[#03034D] cursor-pointer hover:bg-[#050568] shadow-lg hover:shadow-xl active:scale-[0.98]"
                }`}
                onClick={handleTransactionUpdate}
                disabled={!selectedStatus || selectedStatus === transaction.status}
              >
                Confirm status
              </button>
            </section>
          </div>
        )}
        <ConfirmModal
          open={showForcePayoutConfirmModal}
          actionType="proceed"
          onClose={() => setShowForcePayoutConfirmModal(false)}
          onConfirm={async () => {
            setShowForcePayoutConfirmModal(false);
            await handleForceTriggerPayout(transaction?.sessionId);
          }}
          message="This will force the payout pipeline to run even if the transaction is not in the normal payout state. Confirm only if you intend to proceed."
          confirmText={forcingPayout ? "Triggering..." : "Force payout"}
        />
      </aside>
    </div>
  );
};

export default TransactionDetailsDrawer;
