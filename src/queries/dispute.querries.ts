import { useQuery } from '@tanstack/react-query'
import {useMatchRoute} from "@tanstack/react-router";
import {useSelector} from "react-redux";
import { ROUTES } from '../util/constants.js'
import { QUERY_KEYS } from './querries.keys.js'
import type {RootState} from "../store";
import {disputeServiceApi} from "../api/dispute.api.ts";

export const useDisputeQuery = () => {
  const matchRoute = useMatchRoute();
  const search = useSelector((state: RootState) => state.dispute.manage.search);
  
  const { data: searchDispute, isLoading: loadingSearchDispute } = useQuery({
    queryKey: [QUERY_KEYS.DISPUTE.ADMIN_SEARCH_DISPUTES, search],
    queryFn: async () => {
      const { data, success } = await disputeServiceApi.adminSearchDisputes(search);
      
      if (success) {
        return data;
      }
      
      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.DISPUTES })) && !!search,
  });
  
  
  return {
    // 🧩 Values
    searchDispute,
    loadingSearchDispute,
    
    // Mutations
    
  };
};
