<script lang="ts">
  import { theme } from "@/store/theme";
  import { token } from "@/store/token";
  import {
    lastModified,
    clearNotificationsFromCache,
  } from "@/store/notification";
  import { Modal } from "carbon-components-svelte";

  export let open = false;
</script>

<Modal
  danger
  bind:open
  modalHeading="Clear data"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  preventCloseOnClickOutside
  on:click:button--primary={() => {
    token.reset();
    lastModified.reset();
    theme.reset();
    clearNotificationsFromCache();
    open = false;
  }}
  on:click:button--secondary={() => (open = false)}
>
  <p>Are you sure you want to clear all local data?</p>
  <br />
  <p>You will lose all the cache and your stored Personal Access Token.</p>
</Modal>
