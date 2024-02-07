<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import {
    NotificationFilled,
    NotificationOffFilled,
  } from "carbon-icons-svelte";
  import { onMount } from "svelte";

  let hasNotificationPermission = true;

  function updatePermissionStatus() {
    if (Notification.permission === "granted") {
      hasNotificationPermission = true;
    } else {
      hasNotificationPermission = false;
    }
  }

  onMount(() => {
    // "Synchronize" permission status with the component using a
    // 1 second polling function.
    let interval = setInterval(() => {
      updatePermissionStatus();
    }, 1_000);

    updatePermissionStatus();

    return () => {
      clearInterval(interval);
    };
  });
</script>

<Button
  kind={hasNotificationPermission ? "tertiary" : "danger-tertiary"}
  disabled={hasNotificationPermission}
  icon={hasNotificationPermission ? NotificationFilled : NotificationOffFilled}
  title={!hasNotificationPermission ? "Click to enable notifications" : ""}
  on:click={() => Notification.requestPermission()}
>
  {#if hasNotificationPermission}
    User notifications enabled
  {:else}
    User notifications disabled
  {/if}
</Button>
