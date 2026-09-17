// Mirrors backend's ROLE_PERMISSION codes (crypto-now-backend-new/src/util/constants.ts).
// Keep in sync manually - the CRM and backend are separate deployables with no shared package.
export const PERMISSIONS = {
  BANK_ACCOUNT: {
    VIEW: "VIEW_BANK_ACCOUNT",
    WRITE: "CREATE_AND_EDIT_BANK_ACCOUNT",
    DELETE: "DELETE_BANK_ACCOUNT",
  },
  CURRENCY: {
    VIEW: "VIEW_CURRENCY",
    WRITE: "CREATE_AND_EDIT_CURRENCY",
    DELETE: "DELETE_CURRENCY",
  },
  CRYPTO_WALLETS: {
    VIEW: "VIEW_CRYPTO_WALLET",
    WRITE: "CREATE_AND_EDIT_CRYPTO_WALLET",
    DELETE: "DELETE_CRYPTO_WALLET",
  },
  DISPUTES: {
    VIEW: "VIEW_DISPUTE",
    WRITE: "CREATE_AND_EDIT_DISPUTE",
    DELETE: "DELETE_DISPUTE",
  },
  USER: {
    VIEW: "VIEW_USER",
    WRITE: "CREATE_AND_EDIT_USER",
    DELETE: "DELETE_USER",
  },
  ADMIN: {
    VIEW: "VIEW_ADMIN",
    WRITE: "CREATE_AND_EDIT_ADMIN",
    DELETE: "DELETE_ADMIN",
  },
  TRANSACTION: {
    VIEW: "VIEW_TRANSACTION",
    WRITE: "CREATE_AND_EDIT_TRANSACTION",
    DELETE: "DELETE_TRANSACTION",
  },
  AUDIT_LOG: {
    VIEW: "VIEW_AUDIT_LOG",
    WRITE: "CREATE_AND_EDIT_AUDIT_LOG",
    DELETE: "DELETE_AUDIT_LOG",
  },
  NOTIFICATION: {
    VIEW: "VIEW_NOTIFICATION",
    WRITE: "CREATE_AND_EDIT_NOTIFICATION",
    DELETE: "DELETE_NOTIFICATION",
  },
  TESTIMONIAL: {
    VIEW: "VIEW_TESTIMONIAL",
    WRITE: "CREATE_AND_EDIT_TESTIMONIAL",
    DELETE: "DELETE_TESTIMONIAL",
  },
  TREASURY: {
    SWEEP: "TREASURY_SWEEP",
  },
};

// Top-level nav item -> permission(s) required to see it in the sidebar.
// A path not listed here (e.g. Dashboard, Security) is always visible to any
// authenticated admin. "kyc-tier-limits" is deliberately excluded: its backend
// endpoints don't exist yet, so it isn't wired into the permission system.
export const NAV_ITEM_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/transactions": [PERMISSIONS.TRANSACTION.VIEW],
  "/dashboard/coin-management": [PERMISSIONS.CRYPTO_WALLETS.VIEW],
  "/dashboard/admin-wallets": [PERMISSIONS.CRYPTO_WALLETS.VIEW],
  "/dashboard/manage-fiat": [PERMISSIONS.BANK_ACCOUNT.VIEW],
  "/dashboard/treasury": [PERMISSIONS.CRYPTO_WALLETS.VIEW],
  "/dashboard/kyc-sessions": [PERMISSIONS.USER.VIEW],
  "/dashboard/supported-currencies": [PERMISSIONS.CURRENCY.VIEW],
  "/dashboard/testimonials": [PERMISSIONS.TESTIMONIAL.VIEW],
  "/dashboard/disputes": [PERMISSIONS.DISPUTES.VIEW],
  "/dashboard/notifications": [PERMISSIONS.NOTIFICATION.VIEW],
  "/dashboard/audit-trails": [PERMISSIONS.AUDIT_LOG.VIEW],
  "/dashboard/users": [PERMISSIONS.USER.VIEW],
  "/dashboard/manage-admins": [PERMISSIONS.ADMIN.VIEW],
};

// Path-prefix rules used to guard direct URL access (list pages AND their nested
// detail/edit pages, which don't always share a string prefix with the list page -
// e.g. "/dashboard/transaction/$id" vs "/dashboard/transactions"). Checked in order;
// first match wins. A path matching no rule is ungated (Dashboard, Security).
export const ROUTE_ACCESS_RULES: Array<{ prefix: string; permissions: string[] }> = [
  { prefix: "/dashboard/transactions", permissions: [PERMISSIONS.TRANSACTION.VIEW] },
  { prefix: "/dashboard/transaction/", permissions: [PERMISSIONS.TRANSACTION.VIEW] },
  { prefix: "/dashboard/disputes", permissions: [PERMISSIONS.DISPUTES.VIEW] },
  { prefix: "/dashboard/dispute/", permissions: [PERMISSIONS.DISPUTES.VIEW] },
  { prefix: "/dashboard/coin-management", permissions: [PERMISSIONS.CRYPTO_WALLETS.VIEW] },
  { prefix: "/dashboard/admin-wallets", permissions: [PERMISSIONS.CRYPTO_WALLETS.VIEW] },
  { prefix: "/dashboard/custodial-wallet", permissions: [PERMISSIONS.CRYPTO_WALLETS.VIEW] },
  { prefix: "/dashboard/manage-fiat", permissions: [PERMISSIONS.BANK_ACCOUNT.VIEW] },
  { prefix: "/dashboard/treasury", permissions: [PERMISSIONS.CRYPTO_WALLETS.VIEW] },
  { prefix: "/dashboard/kyc-sessions", permissions: [PERMISSIONS.USER.VIEW] },
  { prefix: "/dashboard/kyc-session/", permissions: [PERMISSIONS.USER.VIEW] },
  { prefix: "/dashboard/supported-currencies", permissions: [PERMISSIONS.CURRENCY.VIEW] },
  { prefix: "/dashboard/testimonials", permissions: [PERMISSIONS.TESTIMONIAL.VIEW] },
  { prefix: "/dashboard/notifications", permissions: [PERMISSIONS.NOTIFICATION.VIEW] },
  { prefix: "/dashboard/audit-trails", permissions: [PERMISSIONS.AUDIT_LOG.VIEW] },
  { prefix: "/dashboard/users", permissions: [PERMISSIONS.USER.VIEW] },
  { prefix: "/dashboard/user/", permissions: [PERMISSIONS.USER.VIEW] },
  { prefix: "/dashboard/manage-admins", permissions: [PERMISSIONS.ADMIN.VIEW] },
];

export function getRequiredPermissionsForPath(pathname: string): string[] | undefined {
  const rule = ROUTE_ACCESS_RULES.find((r) => pathname.startsWith(r.prefix));
  return rule?.permissions;
}
