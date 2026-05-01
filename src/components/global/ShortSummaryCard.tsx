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
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
            {icon}
          </div>
        )}
      </div>
      <p className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight mb-2">
        {value}
      </p>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${trend.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
        <span className="text-[12px] text-gray-500">{time}</span>
      </div>
    </div>
  )
}

export default ShortSummaryCard;
