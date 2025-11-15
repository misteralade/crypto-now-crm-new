import { Fragment } from "react";
import {AlertCircle, CheckCircle, Clock, HelpCircle, Loader, X, Zap } from "lucide-react";
import type {DisputeResolution, DisputeStatus} from "../../../../../types/dispute.types";
import {DISPUTE_RESOLUTIONS, getDisputeStatusColor, getStatusMessage} from "../../../../../util/dispute.constants.util.ts";

interface DisputeStatusUpdateModalProps {
  selectedStatus: DisputeStatus | undefined;
  statusNotes: string;
  // isUpdating: boolean;
  selectedResolution: DisputeResolution | undefined;
  
  onClose: () => void;
  handleUpdateStatus: () => void;
  updateStatusNotes: (notes: string) => void;
  handleSelectedResolution: (value: DisputeResolution) => void;
}

const DisputeStatusUpdateModal = ({ selectedStatus, statusNotes, selectedResolution, onClose, handleUpdateStatus, updateStatusNotes, handleSelectedResolution }: DisputeStatusUpdateModalProps) => {
  const getStatusIcon = (status: | 'OPEN' | 'UNDER_REVIEW' | 'AWAITING_EVIDENCE' | 'AWAITING_USER_RESPONSE' | 'AWAITING_ADMIN_RESPONSE' | 'ESCALATED' | 'RESOLVED' | 'REJECTED' | 'CLOSED') => {
    switch (status) {
      case "OPEN":
        return <Clock className="w-4 h-4" />; // Pending action
      case "UNDER_REVIEW":
        return <Loader className="w-4 h-4 animate-spin" />; // In progress
      case "AWAITING_EVIDENCE":
        return <HelpCircle className="w-4 h-4" />; // Waiting for info
      case "AWAITING_USER_RESPONSE":
        return <Zap className="w-4 h-4" />; // Needs user action
      case "AWAITING_ADMIN_RESPONSE":
        return <AlertCircle className="w-4 h-4" />; // Needs admin review
      case "ESCALATED":
        return <X className="w-4 h-4 text-red-600" />; // Urgent/critical
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-green-600" />; // Success
      case "REJECTED":
        return <X className="w-4 h-4 text-gray-600" />; // Declined
      case "CLOSED":
        return <CheckCircle className="w-4 h-4 text-gray-500" />; // Closed
      default:
        return <Clock className="w-4 h-4" />; // Fallback
    }
  };
  
  const isResolutionRequired = (status: DisputeStatus): boolean => {
    return ['RESOLVED', 'REJECTED', 'CLOSED'].includes(status);
  };
  
  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getDisputeStatusColor(
                  selectedStatus || "OPEN"
                )}`}
              >
                {getStatusIcon(selectedStatus || "OPEN")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Update Dispute Status</h2>
                <p className="text-sm text-gray-500">
                  Change status to {(selectedStatus || "OPEN").replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              // disabled={isUpdating}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 hover:cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Alert */}
              <div
                className={`p-4 rounded-lg border ${getDisputeStatusColor(selectedStatus || 'OPEN')}`}
              >
                <p className="text-sm">{getStatusMessage(selectedStatus || 'OPEN')}</p>
              </div>
              
              {/* Resolution Type - For final statuses */}
              {isResolutionRequired(selectedStatus || 'OPEN') && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Resolution Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={selectedResolution || ""}
                    onChange={(e) =>
                      handleSelectedResolution(e.target.value as DisputeResolution)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // disabled={isUpdating}
                  >
                    <option value="">Select resolution type...</option>
                    {DISPUTE_RESOLUTIONS.map((resolution) => (
                      <option key={resolution} value={resolution}>
                        {resolution.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Status Notes */}
              {(isResolutionRequired(selectedStatus || 'OPEN') || selectedStatus === 'ESCALATED') && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {isResolutionRequired(selectedStatus || 'OPEN') ? "Resolution" : ""} Notes{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => updateStatusNotes(e.target.value)}
                    placeholder={
                      selectedStatus === "RESOLVED"
                        ? "Explain how the dispute was resolved..."
                        : selectedStatus === "REJECTED"
                          ? "Explain why the dispute was rejected..."
                          : selectedStatus === "ESCALATED"
                            ? "Explain why this needs escalation..."
                            : "Provide closing notes..."
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={5}
                    maxLength={1000}
                    // disabled={isUpdating}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      {isResolutionRequired(selectedStatus || 'OPEN')
                        ? "This will be visible to the user"
                        : "Internal notes"}
                    </p>
                    <p className="text-xs text-gray-500">{statusNotes.length}/1000</p>
                  </div>
                </div>
              )}
              
              {/* Optional Notes for other statuses */}
              {!isResolutionRequired(selectedStatus || 'OPEN') && selectedStatus !== 'ESCALATED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Additional Notes <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => updateStatusNotes(e.target.value)}
                    placeholder="Add any additional notes or context..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={500}
                    // disabled={isUpdating}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    {statusNotes.length}/500
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                // disabled={isUpdating}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                // disabled={isUpdating}
                className={`px-6 py-2.5 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white hover:cursor-pointer ${
                  selectedStatus === 'RESOLVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : selectedStatus === 'REJECTED' || selectedStatus === 'CLOSED'
                      ? 'bg-red-600 hover:bg-red-700'
                      : selectedStatus === 'ESCALATED'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {getStatusIcon(selectedStatus || 'OPEN')}
                Update Status
                {/*{isUpdating ? (*/}
                {/*  <>*/}
                {/*    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />*/}
                {/*    Updating...*/}
                {/*  </>*/}
                {/*) : (*/}
                {/*  <>*/}
                {/*    */}
                {/*  </>*/}
                {/*)}*/}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default DisputeStatusUpdateModal;