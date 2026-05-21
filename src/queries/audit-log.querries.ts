import { useQuery } from '@tanstack/react-query'
import {useMatchRoute} from "@tanstack/react-router";
import {useSelector} from "react-redux";
import {ROUTES} from "../util/constants.util.ts";
import { store} from "../store";
import {auditServiceApi} from "../api/audit.api";
import {QUERY_KEYS} from "./querries.keys";
import type {RootState} from "../store";

export const useAuditLogQuery = () => {
  const matchRoute = useMatchRoute();
  const search = useSelector((state: RootState) => state.auditLog.search);

  const { data: searchAuditLog, isLoading: loadingSearchAuditLog } = useQuery({
    queryKey: [QUERY_KEYS.AUDIT_LOG.SEARCH_AUDIT_LOG, search],
    queryFn: async () => {
      const rootState = store.getState() as RootState;

       
      if (!rootState.auditLog.search) {
        return;
      }

      const { data, success } = await auditServiceApi.adminSearchAuditLogs(rootState.auditLog.search);

      if (success) {
        return data;
      }

      return null;
    },
     
    enabled: !!search && !!matchRoute({ to: ROUTES.AUDIT_TRAILS }),
  });

  return {
    // 🧩 Values
    searchAuditLog,
    loadingSearchAuditLog,
  };
};