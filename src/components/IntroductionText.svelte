<script lang="ts">
  import { Button, UnorderedList, ListItem } from "carbon-components-svelte";
  import { Password } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<main>
  <h2>GitHub Notifier</h2>

  <p>
    Welcome to the <i>GitHub Notifier</i> app!
  </p>

  <br />

  <p>Use this app to easily manage your GitHub notifications:</p>

  <br />

  <UnorderedList>
    <ListItem>filter closed issues and merged pull requests,</ListItem>
    <ListItem>mark them as read,</ListItem>
    <ListItem
      >sort and filter your notifications by date, repository, status, author or
      labels</ListItem
    >
    <ListItem>see linked information, like the issue labels.</ListItem>
  </UnorderedList>

  <br />

  <p>
    Notifications will be automatically fetched every <i>60 seconds</i> (most of
    the time, it's a limit dynamically given by GitHub at each call).
  </p>

  <br />

  <p>
    Configure a <i>Personal Access Token</i> using the top-right settings menu, or
    by clicking on the following button.
  </p>

  <br />

  <Button icon={Password} on:click={() => dispatch("configurePersonalToken")}
    >Configure personal token</Button
  >
</main>

<style>
  i {
    font-style: italic;
  }
</style>
