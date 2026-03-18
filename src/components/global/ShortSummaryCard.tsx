import { type ReactNode } from "react";

interface ShortSummaryCardProps {
  title: string;
  value: string;
  time: string;
  icon?: ReactNode;
  trend?: { value: number; up: boolean };
}

const ShortSummaryCard = ({ title, value, time, icon, trend }: ShortSummaryCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#ECECEC] hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[13px] font-medium text-[#9A9A9A] uppercase tracking-wide">{title}</p>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-[#F5F5FF] flex items-center justify-center text-[#03034D] group-hover:bg-[#D3D4F8] transition-colors">
            {icon}
          </div>
        )}
      </div>
      <p className="text-[28px] font-bold text-[#0E0F0C] leading-tight tracking-tight mb-1">
        {value}
      </p>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={`text-[12px] font-semibold px-1.5 py-0.5 rounded-md ${trend.up ? 'bg-[#ECFDF3] text-[#037847]' : 'bg-[#FEF2F2] text-[#EB5757]'}`}>
            {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
        <span className="text-[12px] text-[#9A9A9A]">{time}</span>
      </div>
    </div>
  )
}

export default ShortSummaryCard;
