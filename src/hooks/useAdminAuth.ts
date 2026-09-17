import { useOwnAdminProfileQuery } from "../queries/auth.query";

const ADMIN_PERMISSIONS = {
  VIEW: "VIEW_ADMIN",
  WRITE: "CREATE_AND_EDIT_ADMIN",
  DELETE: "DELETE_ADMIN",
};

export function useAdminAuth() {
  const { data: profile, isLoading } = useOwnAdminProfileQuery();

  const permissions = profile?.permissions || [];
  const hasPermission = (permission: string) => permissions.includes(permission);

  return {
    adminEmail: profile?.email || "",
    role: profile?.role || "",
    permissions,
    hasPermission,
    canManageAdmins: hasPermission(ADMIN_PERMISSIONS.VIEW),
    loading: isLoading,
  };
}
