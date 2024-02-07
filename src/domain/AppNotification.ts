import type { AppMessage } from "./AppMessage";

export interface AppLabel {
  label: string;
  color: string;
  description: string;
}

export type AppState = "Open" | "Closed" | "Merged" | "Unknown";

export interface AppNotification {
  id: string;
  unread: boolean;
  updatedAt: Date;
  reason: string;
  repository: string;
  message: AppMessage;
  state: AppState;
  labels: AppLabel[];
  url: string;
}

export function appNotificationIsClosed(
  notification: AppNotification,
): boolean {
  return notification.state == "Closed" || notification.state == "Merged";
}
