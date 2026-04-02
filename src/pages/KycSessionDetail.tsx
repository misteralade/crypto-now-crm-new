import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Image,
  AlertTriangle,
  Loader2,
  Eye,
} from 'lucide-react'
import AuthenticatedLayout from '../layout/AuthenticatedLayout'
import PageHeader from '../components/global/pageHeader'
import { useKycSessionQuery } from '../queries/kyc-session.querries'
import {
  setEscalateSessionId,
  setEscalateNotes,
  clearEscalate,
  setRejectSessionId,
  setRejectReason,
  clearReject,
  setApproveSessionId,
  clearApprove,
} from '../redux/kyc-session.slice'
import type { RootState } from '../store'
import type { KycSessionStep } from '../types/kyc-session.types'
import { ROUTES } from '../util/constants.util'

const STEP_LABELS: Record<KycSessionStep, string> = {
  not_started: 'Not Started',
  id_type_selected: 'ID Selected',
  front_uploaded: 'Front Uploaded',
  back_uploaded: 'Back Uploaded',
  selfie_uploaded: 'Selfie Uploaded',
  submitted: 'Submitted',
  processing: 'Processing',
  verified: 'Verified',
  failed: 'Failed',
  archived: 'Archived',
}

const ID_TYPE_LABELS: Record<string, string> = {
  national_id: 'National ID',
  drivers_license: "Driver's Licence",
  passport: 'International Passport',
}

interface KycSessionDetailProps {
  sessionId: string
}

const KycSessionDetail = ({ sessionId }: KycSessionDetailProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { useAdminGetSessionDetail, useAdminGetSessionMedia, escalateMutation, approveMutation, rejectMutation } =
    useKycSessionQuery()

  const { data: session, isLoading } = useAdminGetSessionDetail(sessionId)

  const [showMedia, setShowMedia] = useState(false)
  const { data: media, isLoading: loadingMedia } = useAdminGetSessionMedia(sessionId, showMedia)

  const escalateState = useSelector((s: RootState) => s.kycSession.escalate)
  const rejectState = useSelector((s: RootState) => s.kycSession.reject)
  const approveState = useSelector((s: RootState) => s.kycSession.approve)

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <PageHeader title="KYC Session Detail" />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#03034D]" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!session) {
    return (
      <AuthenticatedLayout>
        <PageHeader title="KYC Session Detail" />
        <div className="p-6 text-center text-gray-500">Session not found.</div>
      </AuthenticatedLayout>
    )
  }

  const canApproveOrReject =
    session.currentStep === 'failed' ||
    session.currentStep === 'processing' ||
    session.currentStep === 'submitted'

  return (
    <AuthenticatedLayout>
      <PageHeader title="KYC Session Detail" subtitle={`Session ID: ${session.id}`} />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate({ to: ROUTES.KYC_SESSIONS })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#03034D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to KYC Sessions
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">User</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">
                  {session.user?.profile
                    ? `${session.user.profile.firstName} ${session.user.profile.lastName}`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 text-xs">{session.user?.email ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono text-xs text-gray-600 truncate max-w-[180px]">{session.userId}</span>
              </div>
            </div>
          </div>

          {/* Session status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Step</span>
                <span className="font-semibold text-gray-900">{STEP_LABELS[session.currentStep]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID Type</span>
                <span className="font-medium text-gray-900">
                  {session.selectedIdType ? ID_TYPE_LABELS[session.selectedIdType] : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Document Result</span>
                <span className={`font-medium capitalize ${
                  session.documentVerificationStatus === 'approved' ? 'text-green-600' :
                  session.documentVerificationStatus === 'rejected' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {session.documentVerificationStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Face Match Result</span>
                <span className={`font-medium capitalize ${
                  session.faceMatchStatus === 'approved' ? 'text-green-600' :
                  session.faceMatchStatus === 'rejected' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {session.faceMatchStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Retries</span>
                <span className="font-medium text-gray-900">{session.retryCount} / {session.maxRetries}</span>
              </div>
              {session.failureReason && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-500 text-xs">Failure Reason</p>
                  <p className="text-red-600 text-xs mt-1">{session.failureReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* NIN/BVN */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">NIN / BVN</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900 uppercase">{session.ninBvnType ?? 'None'}</span>
              </div>
              {session.ninBvnMasked && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Value (masked)</span>
                  <span className="font-mono text-gray-900">{session.ninBvnMasked}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{new Date(session.createdAt).toLocaleString()}</span>
              </div>
              {session.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="text-gray-900">{new Date(session.submittedAt).toLocaleString()}</span>
                </div>
              )}
              {session.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified</span>
                  <span className="text-green-600">{new Date(session.verifiedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media (signed URLs — analyst+ only) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">KYC Documents</h3>
            {!showMedia && (
              <button
                onClick={() => setShowMedia(true)}
                className="flex items-center gap-1.5 text-sm text-[#03034D] font-medium hover:underline"
              >
                <Eye className="w-4 h-4" />
                Load images
              </button>
            )}
          </div>

          {showMedia && loadingMedia && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading signed URLs…
            </div>
          )}

          {showMedia && media && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'documentFrontUrl', label: 'Front Document' },
                { key: 'documentBackUrl', label: 'Back Document' },
                { key: 'selfieUrl', label: 'Selfie' },
              ].map(({ key, label }) => {
                const url = media[key as keyof typeof media]
                return (
                  <div key={key} className="space-y-2">
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={url}
                          alt={label}
                          className="w-full h-36 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-36 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!showMedia && (
            <p className="text-xs text-gray-400">
              Click "Load images" to generate short-lived signed URLs. Access is logged for compliance.
            </p>
          )}
        </div>

        {/* Admin actions */}
        {canApproveOrReject && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Admin Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Approve */}
              <div className="space-y-2">
                {approveState.sessionId === session.id ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Confirm manual approval?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveMutation.mutate()}
                        disabled={approveMutation.isPending}
                        className="flex-1 py-2 px-3 text-xs bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {approveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Confirm'}
                      </button>
                      <button
                        onClick={() => dispatch(clearApprove())}
                        className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => dispatch(setApproveSessionId(session.id))}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
              </div>

              {/* Escalate */}
              <div className="space-y-2">
                {escalateState.sessionId === session.id ? (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Notes for escalation…"
                      value={escalateState.notes}
                      onChange={(e) => dispatch(setEscalateNotes(e.target.value))}
                      rows={2}
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#03034D]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => escalateMutation.mutate()}
                        disabled={escalateMutation.isPending || escalateState.notes.trim().length < 5}
                        className="flex-1 py-1.5 px-2 text-xs bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors"
                      >
                        {escalateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Escalate'}
                      </button>
                      <button
                        onClick={() => dispatch(clearEscalate())}
                        className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => dispatch(setEscalateSessionId(session.id))}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Escalate
                  </button>
                )}
              </div>

              {/* Reject */}
              <div className="space-y-2">
                {rejectState.sessionId === session.id ? (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Reason for rejection…"
                      value={rejectState.reason}
                      onChange={(e) => dispatch(setRejectReason(e.target.value))}
                      rows={2}
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectMutation.mutate()}
                        disabled={rejectMutation.isPending || rejectState.reason.trim().length < 5}
                        className="flex-1 py-1.5 px-2 text-xs bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {rejectMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Reject'}
                      </button>
                      <button
                        onClick={() => dispatch(clearReject())}
                        className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => dispatch(setRejectSessionId(session.id))}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default KycSessionDetail
