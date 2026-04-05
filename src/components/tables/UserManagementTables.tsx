import { Fragment, useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import CopyDetails from "../global/CopyDetails";
import { UserStatusBadge } from "../table";
import type { AdminSearchUsersResponsePayload } from "../../types/response.payload.types";
import type { UserStatusVariant } from "../../types/global.types";
import type { TableColumn } from "../table";

const ActionsMenu = ({
  row,
  handleNavigateToTransactionHistory,
  handleUpdateUserStatus,
  handleResetUserPassword,
}: {
  row: any;
  handleNavigateToTransactionHistory: (userId: string) => void;
  handleUpdateUserStatus: (userId: string, status: UserStatusVariant) => void;
  handleResetUserPassword: (userId: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = row.status?.toLowerCase() === "active";

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-[#667085]" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 bg-white rounded-2xl shadow-lg border border-[#ECECEC] py-1 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToTransactionHistory(row.id);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#0066CC] hover:bg-[#E6F5FF] transition-colors"
          >
            View Transactions
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateUserStatus(row.id, isActive ? "SUSPENDED" : "ACTIVE");
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-[13px] font-medium ${
              isActive
                ? "text-[#EB5757] hover:bg-[#FEE2E2]"
                : "text-[#F2994A] hover:bg-[#FEF3C7]"
            } transition-colors`}
          >
            {isActive ? "Suspend User" : "Activate User"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetUserPassword(row.id);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#948EEE] hover:bg-[#F5F5FF] transition-colors"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

// Start Admin View Users Table Columns
export const AdminSearchUserColumn = (
  handleNavigateToTransactionHistory: (userId: string) => void,
  handleUpdateUserStatus: (userId: string, status: UserStatusVariant) => void,
  handleResetUserPassword: (userId: string) => void
): Array<TableColumn> => [
  {
    key: "id",
    header: "User ID",
    className: "font-medium text-gray-900",
    render: (value) => (
      <Fragment>
        <div className="text-[13px] text-[#101828]">
          <CopyDetails
            text={value}
            className="font-medium !w-[110px]"
            iconClassName="!h-7 !w-7"
          />
        </div>
      </Fragment>
    ),
  },
  {
    key: "name",
    header: "Name",
    render: (value, row) => (
      <Fragment>
        <div className="flex items-center gap-3">
          <img
            src={row.imgUrl}
            alt={value}
            className="w-8 h-8 rounded-full object-cover border border-[#ECECEC]"
          />
          <span className="font-medium text-[13px] text-[#101828]">
            {value}
          </span>
        </div>
      </Fragment>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (value) => (
      <div className="text-[13px] text-[#667085]">{value}</div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      return <UserStatusBadge status={value as UserStatusVariant} />;
    },
  },
  {
    key: "lastLogin",
    header: "Last Login",
    render: (value) => (
      <div className="text-[13px] text-[#667085]">
        {value ? (
          <div className="flex flex-col">
            <span className="font-medium text-[#101828]">
              {new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[11px] text-[#9A9A9A]">
              {new Date(value).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        ) : (
          <span className="text-[#9A9A9A]">Never</span>
        )}
      </div>
    ),
  },
  {
    key: "action",
    header: "Actions",
    render: (_, row) => (
      <ActionsMenu
        row={row}
        handleNavigateToTransactionHistory={handleNavigateToTransactionHistory}
        handleUpdateUserStatus={handleUpdateUserStatus}
        handleResetUserPassword={handleResetUserPassword}
      />
    ),
  },
];

export const AdminSearchUserDataRow = (
  data: Array<AdminSearchUsersResponsePayload> | undefined
) => {
  const rowItems: Array<any> = [];

  if (!data) {
    return rowItems;
  }

  data.map((item: AdminSearchUsersResponsePayload) => {
    rowItems.push({
      id: item.user.id,
      name: `${item.profile.firstName} ${item.profile.lastName}`,
      imgUrl: item.profile.profileImg,
      email: item.user.email,
      status: item.user.status,
      // amount: Number(item.totalVolume),
      lastLogin: item.user.lastLogin,
    });

    return;
  });

  return rowItems;
};
// End Admin View Users Table Columns
