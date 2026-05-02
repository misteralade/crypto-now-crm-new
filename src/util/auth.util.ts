import { LOCAL_STORAGE_KEYS } from "./constants.util";

export function getLoggedInAdminId(): string | null {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.id || null;
  } catch {
    return null;
  }
}
