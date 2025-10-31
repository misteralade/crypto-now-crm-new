import type { AuditLogResponsePayload } from "../types/response.payload.types";

export class AuditMessageUtil {
  /**
   * Builds a human-readable message for an audit log entry.
   */
  static buildMessage(log: AuditLogResponsePayload): string {
    const { category, action, method, userType, admin, user } = log;

    const actor =
      admin?.username ||
      user?.profile?.firstName ||
      this.formatUserType(userType);

    const formattedCategory = this.formatCategory(category);
    const formattedAction = this.formatAction(action);
    const methodPart = method ? `${method.toUpperCase()} request` : "";

    return `${actor} performed ${formattedAction.toLowerCase()} under ${formattedCategory} (${methodPart})`;
  }

  /**
   * Builds a single audit log with its message included.
   */
  static withMessage(log: AuditLogResponsePayload): AuditLogResponsePayload & { message: string } {
    return {
      ...log,
      message: this.buildMessage(log),
    };
  }

  /**
   * Builds messages for a batch of audit logs.
   */
  static withMessages(logs: Array<AuditLogResponsePayload>): Array<AuditLogResponsePayload & { message: string }> {
    return logs.map((log) => this.withMessage(log));
  }

  // ========== Internal helpers ==========

  private static formatCategory(category: string): string {
    return this.toTitleCase(category.replace(/_/g, " "));
  }

  private static formatAction(action: string): string {
    return this.toTitleCase(action.replace(/_/g, " "));
  }

  private static formatUserType(type?: string): string {
    if (!type) return "A user";
    switch (type.toUpperCase()) {
      case "ADMIN":
        return "An admin";
      case "USER":
        return "A user";
      case "ANONYMOUS":
        return "An anonymous user";
      default:
        return this.toTitleCase(type);
    }
  }

  private static toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
