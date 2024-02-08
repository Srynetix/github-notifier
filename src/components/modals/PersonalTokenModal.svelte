<script lang="ts">
  import { Modal, TextInput } from "carbon-components-svelte";
  import { token } from "@/store/token";

  export let open: boolean = false;

  let currentPersonalAccessToken: string = "";
  $: currentPersonalAccessToken = $token;
</script>

<Modal
  bind:open
  modalHeading="Configure personal token"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  preventCloseOnClickOutside
  on:click:button--primary={() => {
    token.set(currentPersonalAccessToken);
    open = false;
  }}
  on:click:button--secondary={() => (open = false)}
>
  <p>
    Generate a <a
      href="https://github.com/settings/tokens/new?description=GitHub%20Notifier&scopes=repo,notifications"
      rel="noopener noreferrer"
      target="_blank">GitHub Personal Access Token</a
    > to let the application access to your notifications and repo/issues/pull requests
    details.
  </p>
  <br />
  <p>
    The token has an expiration date of <i>30 days</i> by default, you can set
    it to <i>No expiration</i> so you don't have to update it too often.
  </p>
  <br />
  <TextInput
    labelText="Personal Access Token"
    placeholder="Enter token..."
    bind:value={currentPersonalAccessToken}
  />
</Modal>

<style>
  i {
    font-style: italic;
  }
</style>
