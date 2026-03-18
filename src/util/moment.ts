import moment from "moment";

class MomentClient {
  private static instance: MomentClient;

  private constructor() {}

  static getInstance(): MomentClient {
    if (!MomentClient.instance) {
      MomentClient.instance = new MomentClient();
    }
    return MomentClient.instance;
  }

  /**
   * Converts a Date object to an ISO 8601 string
   * @param value - The Date object to convert
   * @return string - The ISO 8601 string representation of the date
   * @example: "2023-10-05T14:48:00.000Z"
   */
  toISOStringFromDate(value: Date): string {
    return moment(value).toISOString();
  }

  /**
   * Formats a Date object to a normalised date and time string
   * @param: date - The Date object to format
   * @return: string - The formatted date and time string in "MMMM Do YYYY, h:mm:ss a" format
   * @example: "October 5th 2023, 2:48:00 pm"
   */
  formatToNormalisedDateAndTime(date: Date): string {
    return moment(date).format("MMMM Do YYYY, h:mm:ss A");
  }
  
  /**
   * Formats a Date object to a transaction initiation date string
   * @param: date - The Date object to format
   * @return: string - The formatted date string in "DD-MM-YYYY, h:mm A" format
   * @example: "05-10-2023, 2:48 PM"
   */
  formatToTransactionInitiationDate(date: Date): string {
    return moment(date).format("DD-MM-YYYY, h:mm A");
  }

  /**
   * Formats a Date object to a short date and time string
   * @param: date - The Date object to format
   * @return: string - The formatted date string in "MMM DD, YYYY h:mm A" format
   * @example: "Mar 18, 2026 3:55 PM"
   */
  formatToShortDateAndTime(date: Date): string {
    return moment(date).format("MMM DD, YYYY h:mm A");
  }

  /**
   * Converts a Date object to an ISO string with time set to the start or end of the day
   * @param value - The Date object to convert
   * @param startOfDay - If true, sets time to start of the day (00:00:00); if false, sets to end of the day (23:59:59)
   * @return string - The ISO 8601 string representation of the date with adjusted time
   * @example: toISOStringFromDateWithDayBoundary(new Date('2023-10-05'), true) returns "2023-10-05T00:00:00.000Z"
   *          toISOStringFromDateWithDayBoundary(new Date('2023-10-05'), false) returns "2023-10-05T23:59:59.999Z"
   */
  toISOStringFromDateWithDayBoundary(value: Date, startOfDay: boolean = true): string {
    return startOfDay ? moment(value).startOf('day').toISOString() : moment(value).endOf('day').toISOString();
  }
}

const momentClient = MomentClient.getInstance();
export default momentClient;
