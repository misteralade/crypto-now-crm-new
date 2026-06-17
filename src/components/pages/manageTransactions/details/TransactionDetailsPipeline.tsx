import {Fragment} from "react";
import momentClient from "../../../../util/moment.ts";

interface TransactionDetailsPipelineProps {
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date | undefined;
  processedByFirstName?: string;
  processedByLastName?: string;
}

const TransactionDetailsPipeline = ({ createdAt, updatedAt, processedAt, processedByFirstName, processedByLastName }: TransactionDetailsPipelineProps) => {
  return (
    <Fragment>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-gray-900">Created</p>
              <p className="text-xs text-gray-500">{momentClient.formatToNormalisedDateAndTime(createdAt)}</p>
            </div>
          </div>
          
          {processedAt && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <div className="w-0.5 h-full bg-gray-200"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-gray-900">Processed</p>
                <p className="text-xs text-gray-500">{momentClient.formatToNormalisedDateAndTime(processedAt)}</p>
                {processedByFirstName || processedByLastName && (
                  <p className="text-xs text-gray-400 mt-1">By: {processedByFirstName} {processedByLastName}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-xs text-gray-500">{momentClient.formatToNormalisedDateAndTime(updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TransactionDetailsPipeline;