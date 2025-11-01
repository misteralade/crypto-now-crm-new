import { Fragment } from "react";
import { Download } from "lucide-react";

interface TransactionReceiptsProps {
  receiptImageUrl?: string;
  adminPaymentReceiptUrl?: string;
}

const TransactionReceipts = ({ receiptImageUrl, adminPaymentReceiptUrl }: TransactionReceiptsProps) => {
  
  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${url}-receipt.jpg`; // You can set a default file name here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
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
                    src={receiptImageUrl as string}
                    alt="User receipt"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/0 group-hover:bg-white/20 backdrop-blur-[0px] transition-all">
                    <Download
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer hover:scale-110"
                      onClick={() => handleDownloadImage(receiptImageUrl!)}
                    />
                  </div>
                </div>
              </div>
            )}
            {adminPaymentReceiptUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Admin Receipt</p>
                <div className="relative group">
                  <img
                    src={adminPaymentReceiptUrl as string}
                    alt="User receipt"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/0 group-hover:bg-white/20 backdrop-blur-[0px] transition-all">
                    <Download
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:cursor-pointer hover:scale-110"
                      onClick={() => handleDownloadImage(adminPaymentReceiptUrl!)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default TransactionReceipts;
