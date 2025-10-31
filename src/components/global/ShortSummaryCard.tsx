import {Fragment} from "react";

interface ShortSummaryCardProps {
  title: string;
  value: string;
  time: string;
}

const ShortSummaryCard = ({ title, value, time }: ShortSummaryCardProps) => {
  return (
    <Fragment>
      <div className="bg-[#eeeeee3c] rounded-[16px] hover:animate-pulse p-6 border border-[#ECECEC]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#9A9A9A] mb-1">
              {title}
            </p>
            <p className="text-[32px] font-semibold text-[#0E0F0C] mb-2">
              {value}
            </p>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-[#454745]">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ShortSummaryCard;
