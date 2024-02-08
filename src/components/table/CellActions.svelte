<script lang="ts">
  import LoadingButton from "@/components/items/LoadingButton.svelte";
  import { View } from "carbon-icons-svelte";
  import { markNotificationThreadAsRead } from "@/api/notification";
  import type { AppNotification } from "@/domain/AppNotification";
  import { createEventDispatcher } from "svelte";

  export let notification: AppNotification;

  let loading = false;

  const dispatch = createEventDispatcher();
</script>

<LoadingButton
  kind="tertiary"
  icon={View}
  size="small"
  disabled={!notification.unread}
  {loading}
  on:click={() => {
    loading = true;
    markNotificationThreadAsRead(notification.id);
    dispatch("marked-as-read", notification);

    setTimeout(() => {
      loading = false;
    }, 100);
  }}
>
  Mark as read
</LoadingButton>
