import { Fragment} from "react";

export const StatusColumn = ({ status }: { status: string }) => {
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
        {isActive ? 'Active' : 'Inactive'}
      </span>
      </div>
    </Fragment>
  )
}
