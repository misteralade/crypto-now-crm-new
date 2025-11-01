import {Download, X} from "lucide-react";
import {Fragment, useState} from "react";

interface TransactionReceiptsProps {
  receiptImageUrl?: string;
  adminPaymentReceiptUrl?: string;
}

const TransactionReceipts = ({ receiptImageUrl, adminPaymentReceiptUrl }: TransactionReceiptsProps) => {
  const [imageModal, setImageModal] = useState<string | null>(null)
  
  return (
    <Fragment>
      {(receiptImageUrl || adminPaymentReceiptUrl) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Receipts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receiptImageUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">User Receipt</p>
                <div className="relative group">
                  <img
                    src={receiptImageUrl}
                    alt="User receipt"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                    onClick={() => setImageModal(receiptImageUrl!)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                    <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
            {adminPaymentReceiptUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Admin Receipt</p>
                <div className="relative group">
                  <img
                    src={adminPaymentReceiptUrl}
                    alt="Admin receipt"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                    onClick={() => setImageModal(adminPaymentReceiptUrl!)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                    <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {imageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={imageModal}
              alt="Receipt"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <a
              href={imageModal}
              download
              className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default TransactionReceipts;
