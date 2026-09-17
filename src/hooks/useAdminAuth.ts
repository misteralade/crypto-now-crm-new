import { useOwnAdminProfileQuery } from "../queries/auth.query";
import { PERMISSIONS } from "../util/permissions.util";

export function useAdminAuth() {
  const { data: profile, isLoading } = useOwnAdminProfileQuery();

  const permissions = profile?.permissions || [];
  const hasPermission = (permission: string) => permissions.includes(permission);
  const hasAnyPermission = (required?: string[]) =>
    !required || required.length === 0 || required.some((permission) => permissions.includes(permission));

  return {
    adminEmail: profile?.email || "",
    role: profile?.role || "",
    permissions,
    hasPermission,
    hasAnyPermission,
    canManageAdmins: hasPermission(PERMISSIONS.ADMIN.VIEW),
    loading: isLoading,
  };
}
