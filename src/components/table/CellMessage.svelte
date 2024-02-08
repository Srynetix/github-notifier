<script lang="ts">
  import type { AppNotification } from "@/domain/AppNotification";
  import ExternalLink from "@/components/items/ExternalLink.svelte";
  import FilterLink from "./FilterLink.svelte";

  export let notification: AppNotification;

  $: message = notification.message;
</script>

<span class="message">
  {#if message.kind == "PullRequest"}
    <FilterLink on:select value={message.kind}>Pull request</FilterLink>
    <ExternalLink href={notification.url}>#{message.number}</ExternalLink><br />
    <ExternalLink href={notification.url}>{message.title}</ExternalLink><br />
    by
    <i
      ><FilterLink on:select kind="author" value={message.author}
        >@{message.author}</FilterLink
      ></i
    >
  {:else if message.kind == "Commit"}
    <FilterLink on:select value={message.kind}>Commit</FilterLink>
    <ExternalLink href={notification.url}>{message.ref}</ExternalLink><br />
    <ExternalLink href={notification.url}>{message.title}</ExternalLink><br />
    by
    <i
      ><FilterLink on:select kind="author" value={message.author}
        >@{message.author}</FilterLink
      ></i
    >
  {:else if message.kind == "Workflow"}
    <FilterLink on:select value={message.kind}>Workflow</FilterLink>
    <ExternalLink href={notification.url}>{message.workflow}</ExternalLink>
    {#if message.attempt !== null}
      attempt #{message.attempt}
    {/if}
    <b>{message.state}</b><br />
    for branch <ExternalLink href={notification.url}
      >{message.branch}</ExternalLink
    >
  {:else if message.kind == "Release"}
    <FilterLink on:select value={message.kind}>New release</FilterLink>
    <br />
    <ExternalLink href={notification.url}>{message.title}</ExternalLink><br />
    by
    <i
      ><FilterLink on:select kind="author" value={message.author}
        >@{message.author}</FilterLink
      ></i
    >
  {:else if message.kind == "Issue"}
    <FilterLink on:select value={message.kind}>Issue</FilterLink>
    <ExternalLink href={notification.url}>#{message.number}</ExternalLink><br />
    <ExternalLink href={notification.url}>{message.title}</ExternalLink><br />
    by
    <i
      ><FilterLink on:select kind="author" value={message.author}
        >@{message.author}</FilterLink
      ></i
    >
  {:else if message.kind == "Discussion"}
    <FilterLink on:select value={message.kind}>Discussion</FilterLink>
    <br />
    <ExternalLink href={notification.url}>{message.title}</ExternalLink>
  {:else if message.kind == "RepositoryInvitation"}
    <FilterLink on:select value={message.kind}>
      Invitation on repository
    </FilterLink>
    <br />
    <ExternalLink href={notification.url}>{message.fullName}</ExternalLink>
  {:else if message.kind == "Unsupported"}
    <span class="unsupported">
      <FilterLink on:select value={message.kind}>
        Unsupported notification
      </FilterLink>
      <br />
      <pre>{message.subject}</pre>
    </span>
  {/if}
</span>

<style>
  i {
    font-style: italic;
  }

  b {
    font-weight: bold;
  }

  .unsupported pre {
    margin: var(--size-2) 0;
    padding: var(--size-2);
    overflow-x: auto;
  }
</style>
