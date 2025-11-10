import {Fragment} from "react";
import {ATTACHMENT_TYPE} from "../../../../util/constants.util.ts";
import {Download, FileText} from "lucide-react";
import {formatFileSize} from "../../../../util/index.util.ts";
import type {MessageAttachment} from "../../../../types/response.payload.types.ts";

interface DisputeAttachmentsProps {
  attachments: MessageAttachment[];
}

const DisputeAttachments = ({ attachments }: DisputeAttachmentsProps) => {
  return(
    <Fragment>
      <p className="text-xs text-gray-500 mb-2">
        User Attachments ({attachments.length})
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            {attachment.type === ATTACHMENT_TYPE.IMAGE ? (
              <img
                src={attachment.url}
                alt={attachment.filename}
                className="w-full h-24 object-cover rounded"
              />
            ) : (
              <div className="w-full h-24 bg-white rounded flex items-center justify-center border border-gray-200">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="w-full">
              <p className="text-xs font-medium text-gray-900 truncate">
                {attachment.filename}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(attachment.size)}
              </p>
            </div>
            <Download className="w-4 h-4 text-gray-400" />
          </a>
        ))}
      </div>
    </Fragment>
  )
}

export default DisputeAttachments;