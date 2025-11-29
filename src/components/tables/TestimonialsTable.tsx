import { Fragment } from "react";
import { StatusColumn } from "./global";
import type { TableColumn } from "../table";
import momentClient from "../../util/moment";
import type { TestimonialResponsePayload } from "../../types/response.payload.types";

export const TestimonialDataColumn = (
  handleEdit: (testimonial: TestimonialResponsePayload) => void,
  handleDelete: (id: string) => void,
  handleTogglePublish: (id: string) => void,
): Array<TableColumn> => [
  {
    key: 'id',
    header: 'ID',
    render: (value) => (
      <span className="overflow-hidden text-[#101828] text-sm whitespace-nowrap text-ellipsis">
        {String(value).substring(0, 8)}...
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (value) => (
      <span className="overflow-hidden text-[#101828] text-sm whitespace-nowrap text-ellipsis">
        {value || 'N/A'}
      </span>
    ),
  },
  {
    key: 'contentType',
    header: 'Content Type',
    render: (value) => (
      <span className="overflow-hidden text-ellipsis truncate block text-[#667085] text-sm font-medium whitespace-nowrap">
        {value}
      </span>
    ),
  },
  {
    key: 'contentLink',
    header: 'Content Link',
    render: (value) => (
      <a
        href={String(value)}
        target="_blank"
        rel="noopener noreferrer"
        className="overflow-hidden text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap text-ellipsis truncate block max-w-[200px]"
      >
        {value}
      </a>
    ),
  },
  {
    key: 'isPublished',
    header: 'Status',
    render: (value) => (
      <StatusColumn status={value === true ? 'true' : 'false'} />
    ),
  },
  {
    key: 'createdAt',
    header: 'Created At',
    render: (value) => (
      <span className="overflow-hidden text-ellipsis truncate text-sm font-medium leading-tight text-[#667085] whitespace-nowrap">
        {value}
      </span>
    ),
  },
  {
    key: 'action',
    header: (
      <Fragment>
        <div className="py-3 text-left text-sm font-medium text-gray-500">
          <span className="flex items-center gap-2"></span>
        </div>
      </Fragment>
    ),
    render: (_, row) => (
      <div className="flex items-center justify-start gap-2 lg:gap-x-[12px] whitespace-nowrap">
        <button
          className="px-3 py-1 font-medium text-[12px] bg-[#03034D] text-white rounded-full hover:opacity-70 cursor-pointer"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </button>
        
        <button
          className={`px-2.5 md:px-3 py-1 rounded-full text-[11px] cursor-pointer hover:opacity-80 md:text-xs font-medium ${
            row.isPublished 
              ? 'bg-[#FCE8E8] text-[#EB5757]' 
              : 'bg-[#E8F5E9] text-[#4CAF50]'
          }`}
          onClick={() => handleTogglePublish(row.id)}
        >
          {row.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        
        <button
          className="px-3 py-1 font-medium text-[12px] bg-[#EF4444] text-white rounded-full hover:opacity-70 cursor-pointer"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      </div>
    ),
  },
];

export const TestimonialDataRow = (
  data: Array<TestimonialResponsePayload> | undefined,
) => {
  const rowItems: Array<any> = [];

  if (!data) {
    return rowItems;
  }

  data.map((item: TestimonialResponsePayload) => {
    rowItems.push({
      id: item.id,
      name: item.name,
      contentType: item.contentType,
      contentLink: item.contentLink,
      description: item.description,
      isPublished: item.isPublished,
      createdAt: momentClient.formatToNormalisedDateAndTime(item.createdAt),
      original: item, // Pass the original object for edit
    });

    return;
  });

  return rowItems;
};

