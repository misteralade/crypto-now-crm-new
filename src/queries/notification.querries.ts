import {useQuery} from "@tanstack/react-query";
import {useMatchRoute} from "@tanstack/react-router";
import {useSelector} from "react-redux";
import {ROUTES, TIME_IN_MILLISECONDS} from "../util/constants.util.ts";
import {notificationServiceApi} from "../api/notification.api";
import {QUERY_KEYS} from "./querries.keys";
import type {RootState} from "../store";

export const useNotificationQuery = () => {
  const matchRoute = useMatchRoute();
  const search = useSelector((state: RootState) => state.notification.search.notifications);

  const { data: searchNotification, isLoading: loadingSearchNotification } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS.ADMIN_SEARCH_NOTIFICATION, search],
    queryFn: async () => {
      const { data, success } = await notificationServiceApi.adminSearchNotifications(search);

      if (success) {
        return data;
      }

      return null;
    },
    enabled: !!(matchRoute({ to: ROUTES.NOTIFICATIONS }), !!search),
    refetchInterval: TIME_IN_MILLISECONDS.ONE_MINUTE,
  });

  return {
    // 🧩 Values
    searchNotification,
    loadingSearchNotification

    // ⚙️ Functions
  }
}