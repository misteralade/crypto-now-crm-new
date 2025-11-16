import {Fragment} from "react";
import {Edit3, Save} from "lucide-react";

interface DisputeAttachmentsProps {
  isEditingNotes: boolean;
  isUpdating: boolean;
  disputeNote: string;
  note: string;
  
  handleSaveAdminNotes: () => void;
  toggleEditNotes: () => void;
  updateAdminNotes: (notes: string) => void;
}

const DisputeAdminNotes = ({ isEditingNotes, isUpdating, disputeNote, note, handleSaveAdminNotes, toggleEditNotes, updateAdminNotes }: DisputeAttachmentsProps) => {
  return (
    <Fragment>
      {/* Admin Notes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Admin Notes</p>
          {!isEditingNotes && (
            <button
              onClick={() => {
                updateAdminNotes(disputeNote || "");
                toggleEditNotes();
              }}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(e) => updateAdminNotes(e.target.value)}
              placeholder="Add internal notes about this dispute..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={toggleEditNotes}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdminNotes}
                disabled={isUpdating}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 hover:cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
            {note || "No admin notes yet"}
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default DisputeAdminNotes;