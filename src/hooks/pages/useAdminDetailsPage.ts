import { useMemo } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { adminServiceApi } from '../../api/admin.api'
import { ROUTES } from '../../util/constants.util'
import { QUERY_KEYS } from '../../queries/querries.keys'
import { getLoggedInAdminId } from '../../util/auth.util'

export const useAdminDetailsPage = () => {
  const navigate = useNavigate()
  const { adminId } = useParams({ from: '/dashboard/manage-admins/$adminId' })
  const currentAdminId = useMemo(() => getLoggedInAdminId(), [])

  const { data: adminDetails, isLoading: loadingAdminDetails } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN.GET_ADMIN_DETAILS, adminId],
    queryFn: async () => {
      const { data, success } = await adminServiceApi.searchAdmin({
        id: adminId,
        includeRole: true,
        page: 1,
        size: 1,
      })

      if (success) {
        return data?.admins?.[0] ?? null
      }

      return null
    },
    enabled: !!adminId,
  })

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    navigate({ to: ROUTES.MANAGE_ADMINS })
  }

  return {
    adminId,
    currentAdminId,
    adminDetails,
    loadingAdminDetails,
    isCurrentAdmin: adminDetails?.id === currentAdminId,
    goBack,
  }
}
