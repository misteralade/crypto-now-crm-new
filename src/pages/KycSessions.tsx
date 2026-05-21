import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import PageHeader from "../components/global/pageHeader";
import { useKycSessionQuery } from "../queries/kyc-session.querries";
import {
  setKycSessionPage,
  setKycSessionStatusFilter,
  setKycSessionUserIdFilter,
} from "../redux/kyc-session.slice";
import type { RootState } from "../store";
import type { KycSessionStep } from "../types/kyc-session.types";
import { ROUTES } from "../util/constants.util";

const STEP_LABELS: Record<KycSessionStep, string> = {
  "Not Started": "Not Started",
  submitted: "Submitted",
  "In Progress": "In Progress",
  "In Review": "In Review",
  Resubmitted: "Resubmitted",
  Approved: "Approved",
  Declined: "Declined",
  Expired: "Expired",
  Abandoned: "Abandoned",
  archived: "Archived",
};

const STEP_STYLES: Record<
  KycSessionStep,
  { bg: string; dot: string; textColor: string }
> = {
  "Not Started": {
    bg: "bg-gray-100",
    dot: "bg-gray-400",
    textColor: "text-gray-600",
  },
  submitted: {
    bg: "bg-yellow-50",
    dot: "bg-yellow-400",
    textColor: "text-yellow-600",
  },
  "In Progress": {
    bg: "bg-yellow-50",
    dot: "bg-yellow-500",
    textColor: "text-yellow-600",
  },
  "In Review": {
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    textColor: "text-blue-600",
  },
  Resubmitted: {
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    textColor: "text-blue-600",
  },
  Approved: {
    bg: "bg-green-50",
    dot: "bg-green-500",
    textColor: "text-green-600",
  },
  Declined: { bg: "bg-red-50", dot: "bg-red-400", textColor: "text-red-600" },
  Expired: {
    bg: "bg-gray-100",
    dot: "bg-gray-400",
    textColor: "text-gray-500",
  },
  Abandoned: {
    bg: "bg-gray-100",
    dot: "bg-gray-400",
    textColor: "text-gray-500",
  },
  archived: {
    bg: "bg-gray-100",
    dot: "bg-gray-400",
    textColor: "text-gray-500",
  },
};

const STATUS_FILTER_OPTIONS: {
  value: KycSessionStep | undefined;
  label: string;
}[] = [
  { value: undefined, label: "All Statuses" },
  { value: "In Progress", label: "In Progress" },
  { value: "Declined", label: "Declined" },
  { value: "Approved", label: "Approved" },
  { value: "submitted", label: "Submitted" },
  { value: "Not Started", label: "Not Started" },
  { value: "archived", label: "Archived" },
];

function KycStepBadge({ step }: { step: KycSessionStep }) {
  const style = STEP_STYLES[step] ?? STEP_STYLES["Not Started"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {STEP_LABELS[step]}
    </span>
  );
}

import { PillSelect } from "../components/ui/select";
import { SearchInput } from "../components/ui/search-input";

const KycSessions = () => {
  const dispatch = useDispatch();
  const { page, limit, statusFilter, userIdFilter } = useSelector(
    (s: RootState) => s.kycSession.list
  );
  const [searchInput, setSearchInput] = useState(userIdFilter);

  const { useAdminGetSessions } = useKycSessionQuery();
  const { data, isLoading } = useAdminGetSessions({
    page,
    limit,
    status: statusFilter,
    userId: userIdFilter || undefined,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    dispatch(setKycSessionUserIdFilter(searchInput.trim()));
  }

  const statusOptions = STATUS_FILTER_OPTIONS.map(opt => ({
    label: opt.label,
    value: opt.value || '__empty__'
  }));

  return (
    <AuthenticatedLayout>
      <PageHeader
        title="KYC Sessions"
        subtitle="Review and manage user identity verification sessions"
      />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <SearchInput
              placeholder="Search by User ID…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#03034D] text-white text-sm font-medium rounded-full hover:bg-[#03034D]/90 transition-colors shadow-sm active:scale-95"
            >
              Search
            </button>
          </form>

          <div className="sm:w-[200px]">
            <PillSelect
              label="Status"
              value={statusFilter ?? '__empty__'}
              onValueChange={(v) =>
                dispatch(
                  setKycSessionStatusFilter(
                    (v === '__empty__' ? undefined : v as KycSessionStep)
                  )
                )
              }
              options={statusOptions}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Doc Result
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Face Result
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Retries
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  (!data?.sessions || data.sessions.length === 0) && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <ShieldCheck className="w-8 h-8 text-gray-300" />
                          <p>No KYC sessions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                {data?.sessions?.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">
                          {session.user?.profile
                            ? `${session.user.profile.firstName} ${session.user.profile.lastName}`
                            : "—"}
                        </p>
                        <p className="text-gray-400 text-xs truncate max-w-[160px]">
                          {session.user?.email ?? session.userId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <KycStepBadge step={session.currentStep} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium capitalize ${
                          session.documentVerificationStatus === "approved"
                            ? "text-green-600"
                            : session.documentVerificationStatus === "rejected"
                            ? "text-red-600"
                            : session.documentVerificationStatus === "error"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      >
                        {session.documentVerificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium capitalize ${
                          session.faceMatchStatus === "approved"
                            ? "text-green-600"
                            : session.faceMatchStatus === "rejected"
                            ? "text-red-600"
                            : session.faceMatchStatus === "error"
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      >
                        {session.faceMatchStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {session.identityVerificationAttempts} (left{" "}
                      {session.identityVerificationAttemptsRemaining})
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={ROUTES.KYC_SESSION_DETAIL.replace(
                          "$id",
                          session.id
                        )}
                        className="text-xs font-medium text-[#03034D] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Page {data.page} of {data.totalPages} · {data.count} sessions
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => dispatch(setKycSessionPage(page - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => dispatch(setKycSessionPage(page + 1))}
                  disabled={page >= data.totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default KycSessions;
