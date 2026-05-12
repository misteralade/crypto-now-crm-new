import { Fragment } from 'react'
import { ArrowLeft, BadgeCheck, CalendarClock, Mail, ShieldUser, User } from 'lucide-react'
import AuthenticatedLayout from '../layout/AuthenticatedLayout'
import PageHeader from '../components/global/pageHeader'
import { LoadingSpinner } from '../components/global/LoadingSpinner'
import { useAdminDetailsPage } from '../hooks/pages/useAdminDetailsPage'
import momentClient from '../util/moment'

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) => (
  <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFF] p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#9A9A9A]">{label}</p>
    <p className="mt-2 break-words text-sm font-medium tabular-nums text-[#101828]">
      {value ?? 'N/A'}
    </p>
  </div>
)

const StatusPill = ({ active }: { active: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
      active ? 'bg-[#ECFDF3] text-[#037847]' : 'bg-[#F2F4F7] text-[#364254]'
    }`}
  >
    <span className={`h-2 w-2 rounded-full ${active ? 'bg-[#14BA6D]' : 'bg-[#6C778B]'}`} />
    {active ? 'Active' : 'Inactive'}
  </span>
)

const AdminDetails = () => {
  const {
    adminDetails,
    loadingAdminDetails,
    isCurrentAdmin,
    goBack,
  } = useAdminDetailsPage()

  const fullName = adminDetails
    ? `${adminDetails.firstName} ${adminDetails.lastName}`.trim()
    : 'Admin Details'

  return (
    <AuthenticatedLayout>
      <div className="p-6 mx-auto">
        <PageHeader title="Admin Details" subtitle={adminDetails ? `${fullName} - @${adminDetails.username}` : 'Review profile, role, and activity metadata'} />

        <div className="mt-5 mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back to admin management"
            className="inline-flex items-center justify-center size-10 rounded-xl bg-white border border-[#ECECEC] shadow-sm hover:bg-[#F5F5FF] transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-[#03034D]" style={{ width: 18, height: 18 }} />
          </button>

          <div className="min-w-0 text-sm text-[#858585]">
            <span className="font-medium text-[#03034D]">Admin Management</span>
            <span className="mx-2 text-[#C4C4C4]">/</span>
            <span className="truncate text-[#858585]">{adminDetails ? fullName : 'Admin Details'}</span>
          </div>
        </div>

        {loadingAdminDetails ? (
          <LoadingSpinner size="lg" fullScreen message="Loading admin details..." />
        ) : adminDetails ? (
          <Fragment>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
              <section className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F5F5FF] text-[#03034D]">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wide text-[#9A9A9A]">Admin Profile</p>
                      <h3 className="mt-1 text-2xl font-semibold text-[#101828]">{fullName}</h3>
                      <p className="mt-1 text-sm text-[#667085]">@{adminDetails.username}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isCurrentAdmin && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        <BadgeCheck className="h-4 w-4" />
                        You
                      </span>
                    )}
                    <StatusPill active={adminDetails.active} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DetailItem label="Admin ID" value={adminDetails.id} />
                  <DetailItem label="Username" value={adminDetails.username} />
                  <DetailItem label="First Name" value={adminDetails.firstName} />
                  <DetailItem label="Last Name" value={adminDetails.lastName} />
                  <DetailItem label="Email" value={adminDetails.email} />
                  <DetailItem label="Created At" value={momentClient.formatToNormalisedDateAndTime(adminDetails.createdAt)} />
                  <DetailItem label="Last Active" value={momentClient.formatToNormalisedDateAndTime(adminDetails.lastActive)} />
                  <DetailItem label="Role Count" value={adminDetails.adminRoles.length} />
                </div>
              </section>

              <aside className="space-y-6">
                <section className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F5F5FF] text-[#03034D]">
                      <ShieldUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#101828]">Roles</h4>
                      <p className="text-sm text-[#667085]">Assigned permissions groups for this admin</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {adminDetails.adminRoles.length > 0 ? (
                      adminDetails.adminRoles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center rounded-full bg-[#F5F5FF] px-3 py-1 text-sm font-medium text-[#03034D]"
                        >
                          {role.role.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-[#667085]">No roles assigned.</p>
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F5F5FF] text-[#03034D]">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#101828]">Activity</h4>
                      <p className="text-sm text-[#667085]">Lifecycle timestamps for this admin</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <DetailItem label="Created" value={momentClient.formatToNormalisedDateAndTime(adminDetails.createdAt)} />
                    <DetailItem label="Last Active" value={momentClient.formatToNormalisedDateAndTime(adminDetails.lastActive)} />
                  </div>
                </section>

                <section className="rounded-3xl border border-[#ECECEC] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F5F5FF] text-[#03034D]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#101828]">Contact</h4>
                      <p className="text-sm text-[#667085]">Primary login and contact identity</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <DetailItem label="Email" value={adminDetails.email} />
                    <DetailItem label="Username" value={`@${adminDetails.username}`} />
                    <DetailItem label="Admin ID" value={adminDetails.id} />
                  </div>
                </section>
              </aside>
            </div>
          </Fragment>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#D7D7E7] bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#101828]">Admin not found</p>
            <p className="mt-2 text-sm text-[#667085]">The selected admin may have been removed or the link is invalid.</p>
            <button
              type="button"
              onClick={goBack}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#03034D] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Management
            </button>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default AdminDetails
