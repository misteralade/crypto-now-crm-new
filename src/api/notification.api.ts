import { axiosPostRequestHandler } from "./index";
import type { SearchNotificationRequestType } from "../schemas/notification.schema";
import type {AdminSearchNotificationsAPIResponse} from "../types/response.payload.types";

class NotificationServiceApi {
  private static instance: NotificationServiceApi;

  private constructor() {
  }

  public static getInstance(): NotificationServiceApi {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!NotificationServiceApi.instance) {
      NotificationServiceApi.instance = new NotificationServiceApi();
    }
    return NotificationServiceApi.instance;
  }

  async adminSearchNotifications(payload: SearchNotificationRequestType) {
    return await axiosPostRequestHandler(`/notification/admin/search`, payload) as AdminSearchNotificationsAPIResponse;
  }
}

export const notificationServiceApi = NotificationServiceApi.getInstance();
