import type { GhNotification } from "@/domain/GhNotification";

import { makeAuthenticatedGitHubCall } from "./base";

const MAX_PAGES = 2;

export interface LoadNotificationsOptions {
  page?: number;
}

export async function markNotificationThreadAsRead(
  threadId: string,
): Promise<void> {
  await makeAuthenticatedGitHubCall(`/notifications/threads/${threadId}`, {
    method: "PATCH",
  });
}

export async function fetchNotifications(
  options?: LoadNotificationsOptions,
): Promise<GhNotification[]> {
  const page = options?.page ?? 1;
  const query = `?page=${page}`;

  const response = await makeAuthenticatedGitHubCall(`/notifications${query}`, {
    cache: "no-store",
  });
  if (response.status == 304) {
    return [];
  }

  const data = (await response.json()) as GhNotification[];
  if (page < MAX_PAGES && data.length == 50) {
    const notifications = [
      ...data,
      ...(await fetchNotifications({ ...options, page: page + 1 })),
    ];
    notifications.sort(
      (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
    );
    return notifications;
  } else {
    return data;
  }
}

export async function fetchNotification(
  threadId: string,
): Promise<GhNotification> {
  const response = await makeAuthenticatedGitHubCall(
    `/notifications/threads/${threadId}`,
  );
  return (await response.json()) as GhNotification;
}
