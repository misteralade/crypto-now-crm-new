import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  TransactionTypeByPercentage,
  WeeklyTransactionVolumeTrend,
} from '../../../types/response.payload.types'
import { Fragment } from 'react'
import {LoadingSpinner} from "../../global/LoadingSpinner.tsx";

const COLORS = ['#575AE5', '#FF4F64']

interface VolumeTrendProps {
  loading: boolean
  data: WeeklyTransactionVolumeTrend[]
}

export const VolumeTrend = ({ loading, data }: VolumeTrendProps) => {
  const lineData = data?.map((item) => ({
    date: item.dateLabel,
    value: parseFloat((Number(item.totalFiatVolume) / 1_000_000).toFixed(2)),
  }))

  return (
    <Fragment>
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#ECECEC] p-6 min-h-[280px] flex items-center justify-center">
          <LoadingSpinner size="md" message="Loading chart..."/>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ECECEC] p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-[16px] font-semibold text-[#0E0F0C]">Volume Trend</h2>
              <p className="text-[12px] text-[#9A9A9A] mt-0.5">Transaction volume in millions (₦)</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={lineData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#575AE5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#575AE5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9A9A9A', fontFamily: 'DM Sans' }}
                tickMargin={10}
                padding={{ left: 12, right: 8 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9A9A9A', fontFamily: 'DM Sans' }}
                ticks={[0, 1, 2, 3]}
                domain={[0, 3]}
                tickFormatter={(value) => `${value}M`}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#03034D',
                  border: 'none',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(3,3,77,0.3)',
                  padding: '8px 14px',
                  fontFamily: 'DM Sans',
                }}
                labelStyle={{ color: '#ffffff', fontSize: '11px', marginBottom: '2px' }}
                itemStyle={{ color: '#D3D4F8', fontSize: '13px', fontWeight: 600 }}
                formatter={(value: number | undefined) => [`₦${value != null ? value : 0}M`, 'Volume']}
                cursor={{ stroke: '#D3D4F8', strokeWidth: 1, strokeDasharray: '4 2' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#575AE5"
                strokeWidth={2}
                fill="url(#areaFill)"
                dot={false}
                activeDot={{ r: 5, fill: '#03034D', strokeWidth: 2, stroke: '#D3D4F8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Fragment>
  )
}

interface PieGraphProps {
  loading: boolean
  data: TransactionTypeByPercentage[]
}

export const PieGraph = ({ loading, data }: PieGraphProps) => {
  const pieData: { name: string; value: number }[] = (data ?? []).map(
    (item) => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: parseFloat(item.percentage),
    }),
  )

  return (
    <div className="bg-white rounded-2xl border border-[#ECECEC] p-5 h-full">
      <div className="mb-5">
        <h2 className="text-[16px] font-semibold text-[#0E0F0C]">Buy vs Sell</h2>
        <p className="text-[12px] text-[#9A9A9A] mt-0.5">Transaction type breakdown</p>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <Fragment>
          <div className="flex items-center gap-4">
            <div className="w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="85%"
                    paddingAngle={4}
                    cornerRadius={8}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    separator=""
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{
                      backgroundColor: '#03034D',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontFamily: 'DM Sans',
                    }}
                    labelStyle={{ color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#D3D4F8', fontSize: '13px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {pieData?.map((entry, index) => (
                <div key={entry.name} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-[12px] text-[#9A9A9A] font-medium">{entry.name}</span>
                  </div>
                  <span className="text-[20px] font-bold text-[#0E0F0C] ml-5 leading-tight">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}
