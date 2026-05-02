import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../util/constants.util';

export function useAdminAuth() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      try {
        const base64 = token.split('.')[1];
        if (base64) {
          const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
          // The backend sets roleName or similar in JWT if configured, 
          // or we check role from a ping/profile call.
          // For immediate UI hiding, we'll check the JWT payload.
          setAdminEmail(payload.email || '');
          
          // Assuming the backend includes role info in JWT
          // or we can deduce it from other fields.
          // If not in JWT, we'll need to fetch it.
          const role = payload.role?.toLowerCase() || '';
          setIsSuperAdmin(role === 'super admin');
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
    setLoading(false);
  }, []);

  return { isSuperAdmin, adminEmail, loading };
}
