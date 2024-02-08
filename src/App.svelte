<script lang="ts">
  import { Content, Theme } from "carbon-components-svelte";
  import { onDestroy, onMount } from "svelte";

  import { fetchNotifications } from "./api/notification";
  import NotificationTable from "./components/table/NotificationTable.svelte";
  import PersonalTokenModal from "./components/modals/PersonalTokenModal.svelte";
  import ClearDataModal from "./components/modals/ClearDataModal.svelte";
  import AppHeader from "./components/AppHeader.svelte";
  import Footer from "./components/Footer.svelte";
  import IntroductionText from "./components/IntroductionText.svelte";
  import { extractAppNotification } from "./domain/extract";
  import type { AppNotification } from "./domain/AppNotification";
  import type { GhNotification } from "./domain/GhNotification";
  import {
    clearNotificationsFromCache,
    loadNotificationsFromCache,
    mergeUpstreamNotificationsWithCache,
  } from "./store/notification";
  import { token } from "./store/token";
  import { theme } from "./store/theme";
  import { showNotification } from "./domain/UserNotifications";
  import { appMessageToString } from "./domain/AppMessage";
  import { CLEAN_NOTIFICATIONS_AT_STARTUP } from "./env";

  let loadedNotifications: AppNotification[] = [];
  let newNotificationIds: string[] = [];
  let showConfigureTokenModal = false;
  let showClearDataModal = false;
  let refreshInterval: number | null = null;
  let refreshing: boolean = false;

  // Reset refresh on token changes
  token.subscribe((value) => {
    if (value != "") {
      setupRefreshInterval();
    }
  });

  /**
   * Fetch and update local notifications.
   */
  function refreshNotifications() {
    refreshing = true;

    fetchNotifications()
      .then((notifications) =>
        Promise.all(
          notifications.map(
            async (n) => await extractAppNotification(n as GhNotification),
          ),
        ),
      )
      .then(async (notifications) => {
        const cachedNotifications = loadNotificationsFromCache();

        const result = await mergeUpstreamNotificationsWithCache(
          cachedNotifications,
          notifications,
          newNotificationIds,
        );

        loadedNotifications = result.notifications;
        newNotificationIds = result.newNotificationIds;

        /// Show notifications if something was already in cache
        if (cachedNotifications.length > 0) {
          showNewNotifications(result.newUpstreamNotificationIds);
        }

        refreshing = false;
      });
  }

  /**
   * Rebuild local notifications.
   */
  function rebuildNotifications() {
    loadedNotifications = loadNotificationsFromCache();
  }

  function showNewNotifications(notificationIds: string[]) {
    const filtered = loadedNotifications.filter((n) =>
      notificationIds.includes(n.id),
    );
    for (const notification of filtered) {
      showNotification(
        "You got a new GitHub notification!",
        appMessageToString(notification.message),
      );
    }
  }

  /**
   * Setup auto-refresh system.
   *
   * Will not try to refresh if token is empty.
   */
  function setupRefreshInterval() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(() => {
      if ($token != "") {
        refreshNotifications();
      }
    }, 60_000) as unknown as number;

    refreshNotifications();
  }

  onMount(() => {
    if (CLEAN_NOTIFICATIONS_AT_STARTUP) {
      clearNotificationsFromCache();
    }
  });

  // Remove interval on destroy.
  onDestroy(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
</script>

<!-- Used to automatically update styles on theme change -->
<Theme bind:theme={$theme} />

<ClearDataModal bind:open={showClearDataModal} />

<PersonalTokenModal bind:open={showConfigureTokenModal} />

<AppHeader bind:showClearDataModal bind:showConfigureTokenModal />

<Content>
  {#if $token != ""}
    <NotificationTable
      {refreshing}
      on:refresh={() => setupRefreshInterval()}
      on:rebuild={() => rebuildNotifications()}
      notifications={loadedNotifications}
      {newNotificationIds}
    />
  {:else}
    <IntroductionText
      on:configurePersonalToken={() => (showConfigureTokenModal = true)}
    />
  {/if}

  <div class="glue"></div>
  <Footer />
</Content>

<style>
  :global(#main-content) {
    display: flex;
    flex-direction: column;
  }

  .glue {
    flex: 1;
  }
</style>
