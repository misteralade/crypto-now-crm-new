import { Fragment } from "react";
import CopyDetails from "../../../global/CopyDetails";
import { formatNumber } from "../../../../util/index.util";
import type { LedgerEntryResponsePayload } from "../../../../types/response.payload.types";

interface LedgerEntriesSectionProps {
  ledgerEntries: LedgerEntryResponsePayload[] | undefined;
}

const LedgerEntriesSection = ({
  ledgerEntries,
}: LedgerEntriesSectionProps) => {
  const hasEntries = !!ledgerEntries && ledgerEntries.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ledger Entries</h2>
          <p className="mt-1 text-sm text-gray-500">
            Immutable accounting rows attached to this transaction. Reversal rows appear when a payout is finalized as failed.
          </p>
        </div>
      </div>

      {!hasEntries ? (
        <div className="rounded-lg border border-dashed border-[#ECECEC] bg-[#F9FAFB] px-4 py-8 text-center text-sm text-gray-500">
          No ledger entries have been recorded for this transaction yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="border-b border-[#ECECEC] px-4 py-3">Created</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Account</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Entry</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Amount</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Currency</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Description</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Reference Type</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Reference</th>
                <th className="border-b border-[#ECECEC] px-4 py-3">Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="align-top">
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {entry.accountType.replaceAll("_", " ")}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        entry.entryType === "CREDIT"
                          ? "bg-[#ECFDF3] text-[#027A48]"
                          : "bg-[#FEF3F2] text-[#B42318]"
                      }`}
                    >
                      {entry.entryType}
                    </span>
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {formatNumber(entry.amount)}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {entry.currency}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm text-gray-700 min-w-[220px]">
                    <Fragment>{entry.description}</Fragment>
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm whitespace-nowrap">
                    {entry.referenceType ? (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          entry.referenceType === "PAYOUT_REVERSAL"
                            ? "bg-[#FEE4E2] text-[#B42318]"
                            : "bg-[#F2F4F7] text-[#344054]"
                        }`}
                      >
                        {entry.referenceType.replaceAll("_", " ")}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm text-gray-700 min-w-[180px]">
                    {entry.referenceId ? (
                      <CopyDetails
                        text={entry.referenceId}
                        className="!max-w-[180px]"
                        iconClassName="!w-7 !h-7"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border-b border-[#F3F4F6] px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {entry.runningBalance ? formatNumber(entry.runningBalance) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LedgerEntriesSection;
