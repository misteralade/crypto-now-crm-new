
interface PageHeaderProps {
  title: string
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-[#000000]">{title}</h2>
      <div className="flex items-center space-x-3">
        <span className="text-red-500 font-medium">Admin</span>
        <div className="rounded-full h-8 w-8 overflow-hidden">
          <img src="/images/avatar.png" alt="Admin avatar" className="h-8 w-8 object-cover" />
        </div>
      </div>
    </div>
  )
}

export default PageHeader
