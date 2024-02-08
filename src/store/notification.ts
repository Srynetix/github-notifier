import type { AppNotification } from "@/domain/AppNotification";
import { makeUpdatedAppNotification } from "@/domain/extract";

const NOTIFICATION_CACHE_NAME = "ghn-notification-cache";

const CACHE_VERSION = "1.0.0";

interface NotificationCacheStructure {
  version: string;
  notifications: Record<string, AppNotification>;
}

function loadNotificationsFromCacheRaw(): NotificationCacheStructure {
  const value = localStorage.getItem(NOTIFICATION_CACHE_NAME);
  if (value == null) {
    return {
      version: CACHE_VERSION,
      notifications: {},
    };
  } else {
    const data = JSON.parse(value) as NotificationCacheStructure;
    if (data.version != CACHE_VERSION) {
      clearNotificationsFromCache();
      return {
        version: CACHE_VERSION,
        notifications: {},
      };
    } else {
      // Adapt dates
      for (const value of Object.values(data.notifications)) {
        value.updatedAt = new Date(value.updatedAt);
      }

      return {
        version: data.version,
        notifications: data.notifications,
      };
    }
  }
}

export function loadNotificationsFromCache(): AppNotification[] {
  const data = loadNotificationsFromCacheRaw();
  const values = Object.values(data.notifications);
  values.sort((a, b) => +b.updatedAt - +a.updatedAt);
  return values;
}

function storeNotificationsInCacheRaw(
  structure: NotificationCacheStructure,
): void {
  localStorage.setItem(NOTIFICATION_CACHE_NAME, JSON.stringify(structure));
}

export function storeNotificationsInCache(
  notifications: AppNotification[],
): void {
  const structure: NotificationCacheStructure = {
    version: CACHE_VERSION,
    notifications: Object.fromEntries(notifications.map((n) => [n.id, n])),
  };

  storeNotificationsInCacheRaw(structure);
}

export function updateNotificationInCache(notification: AppNotification): void {
  const structure = loadNotificationsFromCacheRaw();
  structure.notifications[notification.id] = notification;
  storeNotificationsInCacheRaw(structure);
}

export function clearNotificationsFromCache(): void {
  localStorage.removeItem(NOTIFICATION_CACHE_NAME);
}

export interface NotificationMergeResult {
  notifications: AppNotification[];
  newNotificationIds: string[];
  newUpstreamNotificationIds: string[];
}

export async function mergeUpstreamNotificationsWithCache(
  cachedNotifications: AppNotification[],
  upstreamNotifications: AppNotification[],
  previousNewNotificationIds: string[],
): Promise<NotificationMergeResult> {
  const output: Record<string, AppNotification> = {};
  const newNotificationIds = [];
  const upstreamNotificationIds = upstreamNotifications.map((n) => n.id);

  for (const cache of cachedNotifications) {
    // If cached notification is not in upstream, it has been seen
    if (!upstreamNotificationIds.includes(cache.id)) {
      const updated = await makeUpdatedAppNotification(cache);
      updated.unread = false;

      output[updated.id] = updated;
    } else {
      output[cache.id] = cache;
    }
  }

  for (const upstream of upstreamNotifications) {
    if (
      !(upstream.id in output) ||
      output[upstream.id].updatedAt < upstream.updatedAt
    ) {
      newNotificationIds.push(upstream.id);
    }

    if (upstream.id in output) {
      output[upstream.id] = updateCachedNotification(
        output[upstream.id],
        upstream,
      );
    } else {
      output[upstream.id] = upstream;
    }
  }

  const newUpstreamNotificationIds = [...newNotificationIds];
  for (const notificationId of previousNewNotificationIds) {
    // Previous new notification was newly updated
    if (newNotificationIds.includes(notificationId)) {
      continue;
    }

    // Previous new notification does not exist anymore
    if (!(notificationId in output)) {
      continue;
    }

    // Previous new notification is still unread
    if (output[notificationId].unread) {
      newNotificationIds.push(notificationId);
    }
  }

  const structure: NotificationCacheStructure = {
    version: CACHE_VERSION,
    notifications: output,
  };
  storeNotificationsInCacheRaw(structure);

  const notifications = Object.values(output);
  notifications.sort((a, b) => +b.updatedAt - +a.updatedAt);

  return {
    newNotificationIds,
    newUpstreamNotificationIds,
    notifications,
  };
}

function updateCachedNotification(
  cachedNotification: AppNotification,
  upstreamNotification: AppNotification,
): AppNotification {
  if (upstreamNotification.updatedAt <= cachedNotification.updatedAt) {
    return {
      ...upstreamNotification,
      unread: cachedNotification.unread,
    };
  } else {
    return upstreamNotification;
  }
}
