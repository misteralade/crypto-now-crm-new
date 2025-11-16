import { Fragment } from 'react'
import {convertToMillify} from "../../util/index.util.ts";
import momentClient from "../../util/moment";
import {StatusColumn} from "./global";
import type { SearchSupportedCryptoData } from "../../types/response.payload.types";
import type { TableColumn } from '../table'

export const IsStableCoinColumn = ({ status }: { status: string }) => {
  const isActive = status.toLowerCase() === 'true'

  return (
    <Fragment>
      <div
        className={`inline-flex items-center gap-2 ${
          isActive ? 'bg-[#ECFDF3]' : 'bg-[#F2F4F7]'
        } rounded-[16px] py-[4px] px-[6px]`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? 'bg-[#14BA6D]' : 'bg-[#6C778B]'
          }`}
        />
        <span
          className={`text-[12px] font-medium ${
            isActive ? 'text-[#037847]' : 'text-[#364254]'
          }`}
        >
        {isActive ? 'Yes' : 'No'}
      </span>
      </div>
    </Fragment>
  )
}

export const SearchSupportedCryptoColumn = (
  onEditClick: (id: string) => void,
  handleDeleteCryptoCurrency: (id: string) => void,
  onDisableCoin: (id: string, status: boolean) => void,
): Array<TableColumn> => [
  {
    key: 'coin',
    header: 'Coin',
    className: 'font-medium text-gray-900',
    render: (value, row) => (
      <Fragment>
        <div className="w-full flex items-center justify-between space-x-3">
          {/*Coin Logo*/}
          <div>
            <img
              src={row.logoUrl}
              alt={row.symbol}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>

          {/*Coin Symbol*/}
          <div className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
            <span className="flex items-center gap-2">
              <span className="font-medium text-[12px] text-[#667085]">
                {value}
              </span>
            </span>
          </div>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <StatusColumn status={String(value)} />
      </Fragment>
    ),
  },
  {
    key: 'isStableCoin',
    header: 'Stable Coin',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <IsStableCoinColumn status={String(value)} />
      </Fragment>
    ),
  },
  {
    key: 'tradeLimit',
    header: 'Trade limit (min - max)',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <div className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
            <span className="font-medium text-[12px] text-[#667085] flex items-center gap-2">
              <span>{value}</span>
            </span>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'tradeLimitAnonymous',
    header: 'Trade limit (min - max) - Anonymous',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <div className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
            <span className="font-medium text-[12px] text-[#667085] flex items-center gap-2">
              <span>{value}</span>
            </span>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'createdAt',
    header: 'Supported From',
    className: 'font-medium text-gray-900',
    render: (value) => (
      <Fragment>
        <div className="px-4 py-3 text-left text-sm font-medium text-gray-500 bg-[#FCFCFD]">
          <span className="font-medium text-[12px] text-[#667085] flex items-center gap-2">
            <span>{value}</span>
          </span>
        </div>
      </Fragment>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (_value, row) => (
      <Fragment>
        <div className="px-4 py-5">
          <div className="flex gap-2">
            <button
              onClick={() => onEditClick(row.id)}
              className="px-3 py-1 font-medium text-[12px] bg-[#03034D] text-white rounded-full hover:bg-opacity-70 cursor-pointer hover:cursor-pointer"
            >
              Edit
            </button>
            
            <button
              onClick={() => onDisableCoin(row.id, row.status)}
              className="px-3 py-1 font-medium text-[12px] bg-[#FBBF24] text-white rounded-full hover:opacity-70 cursor-pointerhover:cursor-pointer"
            >
              {row.status ? 'Deactivate' : 'Activate'}
            </button>
            
            <button
              onClick={() => handleDeleteCryptoCurrency(row.id)}
              className="px-3 py-1 font-medium text-[12px] bg-[#EF4444] text-white rounded-full hover:opacity-70 cursor-pointer hover:cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Fragment>
    ),
  },
]

export const SearchSupportedCryptoDataRow = (data: Array<SearchSupportedCryptoData> | undefined) => {
  const rowItems: Array<any> = [];

  if (!data) {
    return rowItems;
  }

  data.map((item: SearchSupportedCryptoData) => {
    rowItems.push({
      id: item.id,
      coin: item.symbol,
      isStableCoin: item.isStableCoin,
      tradeLimit: `$${convertToMillify(Number(item.minTransactionLimit))} - $${convertToMillify(Number(item.maxTransactionLimit))}`,
      tradeLimitAnonymous: `$${convertToMillify(Number(item.minTradeAmountForAnonymous))} - $${convertToMillify(Number(item.maxTradeAmountForAnonymous))}`,
      logoUrl: item.logoUrl,
      status: item.isActive,
      createdAt: momentClient.formatToNormalisedDateAndTime(item.createdAt),
    });

    return;
  });

  return rowItems;
};