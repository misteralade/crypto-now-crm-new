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

// Sample data for pie chart
const COLORS = ['#575AE5', '#FF4F64']

interface VolumeTrendProps {
  loading: boolean
  data: WeeklyTransactionVolumeTrend[]
}

export const VolumeTrend = ({ loading, data }: VolumeTrendProps) => {
  console.log({
    loading
  })
  // const lineData = data?.map(item => ({ date: item.dateLabel, value: Number(item.totalFiatVolume) }));
  const lineData = data?.map((item) => ({
    date: item.dateLabel,
    value: parseFloat((Number(item.totalFiatVolume) / 1_000_000).toFixed(2)),
  }))

  return (
    <div className="w-full h-full border-[#ECECEC] bg-[#eeeeee3c] border rounded-lg p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] text-[#0E0F0C]">Volume trend</h2>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={lineData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickMargin={12}
            padding={{ left: 16, right: 8 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            ticks={[0, 1, 2, 3]}
            domain={[0, 3]}
            tickFormatter={(value) => `${value}M`}
            tickMargin={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [`${value}M`, 'Volume']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#areaFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
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
    <div className="w-full h-full border-[#ECECEC] bg-[#eeeeee3c] border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-[13px] font-semibold text-black mb-6">
          Buy vs Sell
        </h2>
      </div>

      <div className="flex items-center">
        {loading ? (
          <Fragment>
            <div className="h-40 w-full flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="w-64 h-64 relative">
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
                      backgroundColor: '#000000',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                      padding: '6px 16px',
                      fontSize: '0.875rem',
                    }}
                    labelStyle={{ color: '#fff', fontSize: '0.875rem' }}
                    itemStyle={{ color: '#fff', fontSize: '0.875rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-8 space-y-4">
              {pieData?.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-[5px]"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-[12px] text-gray-700 mr-4">
                    {entry.name}
                  </span>
                  <span className="text-[14px] font-medium text-gray-900">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}
