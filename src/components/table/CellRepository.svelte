<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AppNotification } from "@/domain/AppNotification";

  export let notification: AppNotification;

  const dispatch = createEventDispatcher();
</script>

<span
  class="repository"
  on:click={() => dispatch("select")}
  on:keypress={() => dispatch("select")}
  role="link"
  tabindex="0"
  title="Click to filter on this repository"
>
  {notification.repository}
</span>

<style>
  .repository {
    cursor: pointer;
    font-weight: bold;
  }

  .repository:hover {
    text-decoration: underline;
  }
</style>
