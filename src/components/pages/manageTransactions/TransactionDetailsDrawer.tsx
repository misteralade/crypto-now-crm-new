import { Fragment, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { convertToMillify } from "../../../util/index.util.ts";
import momentClient from "../../../util/moment";
import CopyDetails from "../../global/CopyDetails";
import { StatusBadge } from "../../global/StatusBadge";
import {
  ALLOWED_ADMIN_TRANSACTION_STATUS,
  transactionStatusStyles,
} from "../../../util/constants.util.ts";
import { setTransactionDetailUpdateField } from "../../../redux/transaction-management.slice";
import CustomerAccountDetails from "./CustomerAccountDetails.tsx";
import type { TransactionStatusType } from "../../../schemas/enum.schema";
import type { SearchTransactionsResponse } from "../../../types/response.payload.types";
import type { UpdateTransactionStatusRequestType } from "../../../schemas/transaction.schema";
import type { ChangeEvent } from "react";
import LabeledPillInput from "../../global/LabeledPillInput";
import type { RootState } from "../../../store";

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: (value?: string) => void;
  transaction?: SearchTransactionsResponse | undefined | null;
  handleTransactionUpdateField: (
    field: keyof UpdateTransactionStatusRequestType,
    value: any
  ) => void;
  handleTransactionUpdate: () => void;
  handleTransactionReceiptUpload: (file: File) => Promise<string>;
}

const TransactionDetailsDrawer = ({
  isOpen,
  onClose,
  transaction,
  handleTransactionUpdateField,
  handleTransactionUpdate,
  handleTransactionReceiptUpload,
}: TransactionDetailsDrawerProps) => {
  const dispatch = useDispatch();
  const updatePayload = useSelector(
    (state: RootState) => state.transactionManagement.details.update
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatusType | undefined
  >(undefined);

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
  }, [dispatch, isOpen, transaction?.sessionId, transaction?.adminNotes]);

  // Reset showCustomerDetails when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowCustomerDetails(false);
      setSelectedStatus(undefined);
      setUploadedFile(null);
      setPreviewUrl(undefined);
    }
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  // Check if wallet/bank details are available
  const hasWalletDetails =
    transaction.type === "BUY"
      ? !!transaction.userCryptoWallet
      : !!transaction.userBankAccount;

  // Explicit rate: 1 crypto = fiat (variable by transaction currency)
  const getExchangeRateDisplay = (): string => {
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

  const getStatusColorObject = (status: string) => {
    return (
      transactionStatusStyles[status.toUpperCase()] ?? {
        text: status,
        bg: "bg-gray-50",
        dot: "bg-gray-400",
        textColor: "text-gray-700",
      }
    );
  };

  const getStatusDisplayText = (status: string) => {
    if (status === "AWAITING_CRYPTO") {
      return "Awaiting Bank Details";
    }
    if (status === "AWAITING_PAYMENT") {
      return "Awaiting Wallet Details";
    }
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const buyStatuses = [
    "AWAITING_PAYMENT",
    "PAYMENT_RECEIVED",
    "PAYMENT_CONFIRMED",
  ];
  const sellStatuses = [
    "AWAITING_CRYPTO",
    "CRYPTO_RECEIVED",
    "CRYPTO_CONFIRMED",
  ];
  const hideStatuses = transaction.type === "BUY" ? sellStatuses : buyStatuses;

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
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/5" onClick={() => onClose()} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] lg:w-[570px] bg-white shadow-sm !p-8 sm:p-6 overflow-y-auto">
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

        <div className="space-y-6">
          {/* Order Details */}
          <section className="rounded-lg bg-[#F0F0FF] px-4 py-6">
            <h3 className="text-[14px] font-semibold text-[#828282] mb-4">
              ORDER DETAILS
            </h3>
            <div className="flex flex-col gap-x-2 gap-y-4 text-[14px] text-[#0E0F0C]">
              {/* Transaction ID */}
              <section className="flex justify-between items-center">
                <div className="text-[#828282] text-[16px]">Transaction ID</div>
                <div className="text-[#0E0F0C] text-[14px]">
                  <CopyDetails
                    text={transaction.sessionId}
                    className="!max-w-[200px]"
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

              {/* Transaction Hash if Sell order */}
              {transaction.type === "SELL" && transaction.cryptoTxHash && (
                <Fragment>
                  <section className="flex justify-between items-center">
                    <div className="text-[#828282] text-[16px]">
                      Transaction Hash
                    </div>
                    <div className="text-[#0E0F0C] font-medium text-sm md:text-[16px]">
                      <CopyDetails
                        text={transaction.cryptoTxHash}
                        className="truncate"
                        iconClassName="h-3 w-3"
                      />
                    </div>
                  </section>
                </Fragment>
              )}

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
                <div className="text-[#828282] text-[16px]">Exchange Rate</div>
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
                      (₦ {convertToMillify(Number(transaction.amountFiatNGN))})
                    </Fragment>
                  ) : (
                    <Fragment>
                      ₦ {Number(transaction.amountFiatNGN).toLocaleString()} ($
                      {convertToMillify(Number(transaction.usdAmount))})
                    </Fragment>
                  )}
                </div>
              </section>

              {/* Transaction Status */}
              <section className="flex justify-between items-center">
                <div className="text-[#828282] text-[16px]">Status</div>

                <StatusBadge status={transaction.status} />
              </section>
            </div>

            {/* Receipt Url */}
            <div className="mt-4 flex justify-between items-start">
              <div className="text-[#828282] mb-1 text-[16px]">
                Uploaded receipt
              </div>
              <img
                src={transaction.receiptImageUrl}
                alt={transaction.sessionId}
                className="rounded-md border border-gray-200 w-48"
              />
            </div>
          </section>

          {/* Activity Log */}
          {transaction.transactionActivities.length > 0 && (
            <Fragment>
              <div className="bg-[#F0F0FF] p-4 border border-[#ECECEC] rounded-2xl space-y-4 mb-6 mt-6">
                <h3 className="text-[14px] font-semibold text-[#828282]">
                  Activity Log
                </h3>

                <div className="flex flex-col gap-y-4 max-h-[200px] overflow-y-auto">
                  {transaction.transactionActivities.map((activity) => (
                    <div key={activity.id}>
                      {activity.action
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
                      - {activity.message}{" "}
                      {momentClient.formatToNormalisedDateAndTime(
                        activity.createdAt
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          )}

          {/* Customer Account Details fetch + panel */}
          <section>
            {!showCustomerDetails && (
              <button
                className={`px-6 py-4 text-sm md:text-lg font-semibold border rounded-full ${
                  hasWalletDetails
                    ? "border-[#03034D] text-[#03034D] cursor-pointer hover:bg-[#F0F0FF]"
                    : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                }`}
                onClick={() => hasWalletDetails && setShowCustomerDetails(true)}
                disabled={!hasWalletDetails}
              >
                {transaction.type === "BUY"
                  ? hasWalletDetails
                    ? "View Wallet Details"
                    : "Wallet Details Not Available"
                  : hasWalletDetails
                  ? "View Bank Details"
                  : "Bank Details Not Available"}
              </button>
            )}

            {showCustomerDetails && (
              <Fragment>
                <div className="bg-[#F0F0FF] p-4 border border-[#ECECEC] rounded-2xl space-y-4 mb-6 mt-6">
                  <h3 className="text-[14px] font-semibold text-[#828282]">
                    {transaction.type === "BUY"
                      ? "WALLET DETAILS"
                      : "BANK DETAILS"}
                  </h3>
                  {transaction.type === "BUY" ? (
                    <Fragment>
                      <CustomerAccountDetails
                        address={
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          transaction.userCryptoWallet
                            ? transaction.userCryptoWallet.walletAddress
                            : "N/A"
                        }
                        coinType={
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          transaction.cryptocurrency
                            ? transaction.cryptocurrency.symbol
                            : "N/A"
                        }
                        networkType={
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          transaction.userCryptoWallet
                            ? transaction.userCryptoWallet.network
                            : "N/A"
                        }
                      />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="flex flex-col space-y-4 text-[14px] text-[#0E0F0C] gap-2">
                        <div className="flex justify-between items-center m-0">
                          <div className="text-base text-[#828282]">
                            Account name
                          </div>
                          <div className="font-medium text-[#0E0F0C]">
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {transaction.userBankAccount
                              ? transaction.userBankAccount.accountName
                              : "N/A"}
                          </div>
                        </div>

                        <div className="flex justify-between items-center m-0">
                          <div className="text-base text-[#828282]">
                            Bank name
                          </div>
                          <div className="font-medium text-[#0E0F0C]">
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {transaction.userBankAccount
                              ? transaction.userBankAccount.bankName
                              : "N/A"}
                          </div>
                        </div>

                        <div className="flex justify-between items-center m-0">
                          <div className="text-base text-[#828282]">
                            Account number
                          </div>
                          <div className="font-medium text-[#0E0F0C]">
                            <CopyDetails
                              text={
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                transaction.userBankAccount
                                  ? transaction.userBankAccount.accountNumber
                                  : "N/A"
                              }
                              className="!max-w-[200px] !h-[25px]"
                              iconClassName="!w-8 !h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            )}

            {/* Admin Upload transaction receipt */}
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

            <section className="mt-4">
              <div className="text-lg font-semibold text-[#454745] mb-4">
                Update transaction status
              </div>
              <div className="flex flex-wrap gap-6">
                {ALLOWED_ADMIN_TRANSACTION_STATUS.filter(
                  (s: string | undefined) => s !== undefined
                ).map((transactionStatus) => {
                  const hideStatus = hideStatuses.includes(transactionStatus);
                  const isCurrent = transaction.status === transactionStatus;

                  return (
                    <Fragment>
                      <button
                        key={transactionStatus}
                        className={`px-5 py-2 rounded-full normal-case ${
                          getStatusColorObject(transactionStatus).bg
                        } text-sm font-semibold ${
                          getStatusColorObject(transactionStatus).textColor
                        } hover:opacity-80 hover:cursor-pointer ${
                          hideStatus ? "hidden" : ""
                        } ${
                          isCurrent
                            ? "cursor-not-allowed opacity-60 hover:cursor-progress"
                            : ""
                        } ${
                          selectedStatus === transactionStatus
                            ? "ring-2 ring-offset-2 ring-[#03034D]"
                            : ""
                        }`}
                        type="button"
                        value={transactionStatus}
                        onClick={
                          !isCurrent
                            ? () => {
                                handleTransactionUpdateField(
                                  "status",
                                  transactionStatus
                                );
                                setSelectedStatus(transactionStatus);
                              }
                            : undefined
                        }
                        disabled={isCurrent}
                      >
                        {getStatusDisplayText(transactionStatus)}
                      </button>
                    </Fragment>
                  );
                })}
              </div>
            </section>
          </section>

          {/* Notes */}
          <section>
            <LabeledPillInput
              label="Transaction note (Optional)"
              placeholder="Add a note"
              value={updatePayload?.adminNotes ?? transaction?.adminNotes ?? ""}
              onChange={(e) =>
                handleTransactionUpdateField("adminNotes", e.target.value)
              }
            />
          </section>

          <section>
            <button
              className="w-full py-4 bg-[#03034D] font-semibold text-white rounded-full cursor-pointer hover:bg-[#FF8B5A]"
              onClick={handleTransactionUpdate}
            >
              Confirm status
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default TransactionDetailsDrawer;
