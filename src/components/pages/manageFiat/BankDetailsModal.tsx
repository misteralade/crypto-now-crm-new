import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { PillInput } from "../../ui/input";
import { MFLabeledPillSearchSelect } from "../../global/LabeledPillSelect";
import type { RootState } from "../../../store";
import type { SupportedPlatformBankAccountResponse } from "../../../types/response.payload.types";
import type { CreateBankAccountRequestType } from "../../../schemas/bank.schema";
import { bankServiceApi } from "../../../api/bank.api";
import { Loader2 } from "lucide-react";

interface BankDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supportedBanks:
    | Array<SupportedPlatformBankAccountResponse>
    | null
    | undefined;
  handleCreateBankField: (
    field: keyof CreateBankAccountRequestType,
    value: any
  ) => void;
}

const BankDetailsModal = ({
  open,
  onClose,
  onConfirm,
  supportedBanks,
  handleCreateBankField,
}: BankDetailsModalProps) => {
  const payload = useSelector((state: RootState) => state.fiat.bank.createBank);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const bankOptions = useMemo(() => {
    return supportedBanks && supportedBanks.length
      ? supportedBanks.map((bank) => ({
          value: bank.id,
          label: bank.name,
          logoUrl: bank.logoUrl,
        }))
      : [{ value: "", label: "No banks available" }];
  }, [supportedBanks]);

  const handleLookup = useCallback(async (accountNumber: string, bankId: string) => {
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const { data, success, message } = await bankServiceApi.lookupAccountName(accountNumber, bankId);
      if (success && data.accountName) {
        handleCreateBankField("accountHolderName", data.accountName);
      } else {
        setLookupError(message || "Could not verify account details.");
        handleCreateBankField("accountHolderName", "");
      }
    } catch (e) {
      setLookupError("Verification failed. Please try again.");
      handleCreateBankField("accountHolderName", "");
    } finally {
      setIsLookingUp(false);
    }
  }, [handleCreateBankField]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        setLookupError(null);
        setIsLookingUp(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

  // Trigger lookup when account number is 10 digits and bank is selected
  useEffect(() => {
    if (payload.accountNumber?.length === 10 && payload.bankId) {
      handleLookup(payload.accountNumber, payload.bankId);
    }
  }, [payload.accountNumber, payload.bankId, handleLookup]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${
          isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
        }`}
        onClick={onClose}
      />

      <div className={`relative w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl border border-[#ECECEC] overflow-hidden ${
            isClosing ? "animate-modal-content-out" : "animate-modal-content-in"
          }`}>
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-[#0E0F0C] text-center">
            Bank Details
          </h2>
          <p className="text-[#667085] text-center text-sm mt-1">
            Fill in the platform bank account information
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          <MFLabeledPillSearchSelect
            label="Select Bank"
            value={payload.bankId || ""}
            onChange={(value) => handleCreateBankField("bankId", value)}
            options={bankOptions as any}
          />

          <div className="space-y-1">
            <PillInput
              label="Account Number"
              placeholder="0000000000"
              value={payload.accountNumber || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleCreateBankField("accountNumber", val);
              }}
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1">
            <div className={`relative rounded-xl border-[1.5px] px-4 py-3 transition-all duration-150 ${payload.accountHolderName ? 'bg-green-50/30 border-green-200' : 'bg-gray-50/50 border-[#E4E7EC]'}`}>
              <legend className="px-2 text-[13px] font-medium text-[#454745] leading-none">Account Holder</legend>
              <div className="flex items-center justify-between min-h-[24px]">
                {isLookingUp ? (
                  <div className="flex items-center gap-2 text-sm text-[#948EEE]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying details...</span>
                  </div>
                ) : (
                  <span className={`text-[16px] font-medium ${payload.accountHolderName ? 'text-[#101828]' : 'text-[#9A9A9A] italic'}`}>
                    {payload.accountHolderName || "Account name will appear here"}
                  </span>
                )}
              </div>
            </div>
            {lookupError && (
              <p className="text-[12px] text-red-500 ml-2">{lookupError}</p>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            className="flex-1 h-14 rounded-2xl text-[#6B6E6B] font-semibold text-base bg-white border border-[#E4E7EC] hover:bg-gray-50 transition-colors w-full md:w-auto"
            onClick={onClose}
          >
            Go back
          </button>
          <button
            className="flex-1 h-14 rounded-2xl bg-[#03034D] text-white font-semibold text-base hover:bg-[#03034D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto shadow-lg shadow-[#03034D]/20"
            disabled={
              !payload.bankId ||
              !payload.accountNumber ||
              !payload.accountHolderName ||
              isLookingUp
            }
            onClick={onConfirm}
          >
            Confirm Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
