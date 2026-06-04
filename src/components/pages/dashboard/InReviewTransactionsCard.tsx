import { Clock, ChevronRight } from 'lucide-react';

interface InReviewTransactionsCardProps {
  count: number;
  loading: boolean;
  onView: () => void;
}

const InReviewTransactionsCard = ({
  count,
  loading,
  onView,
}: InReviewTransactionsCardProps) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-[#ECECEC] group hover:border-[#F59E0B]/30 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br from-[#F59E0B]/5 to-transparent rounded-full blur-3xl group-hover:from-[#F59E0B]/10 transition-colors duration-500" />

      <div className="p-4 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold text-[#9A9A9A] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              In Review
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              count > 0
                ? "bg-[#FFFBEB] text-[#F59E0B] shadow-sm shadow-amber-100"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-[28px] font-black text-[#0E0F0C] leading-none tracking-tighter">
            {loading ? "..." : count}
          </p>
          <span className="text-[13px] font-medium text-[#9A9A9A]">Transactions</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onView}
            disabled={loading || count === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-bold transition-all duration-300 ${
              count > 0
                ? "bg-[#0E0F0C] text-white hover:bg-[#1A1B18] hover:shadow-lg active:scale-95 disabled:opacity-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            View All
          </button>

          <button
            onClick={onView}
            disabled={loading || count === 0}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#ECECEC] text-[#0E0F0C] hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            title="View In Review Transactions"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {count > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F59E0B]/10">
          <div
            className="h-full bg-[#F59E0B] transition-all duration-1000"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default InReviewTransactionsCard;
