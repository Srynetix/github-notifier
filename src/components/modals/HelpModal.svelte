<script lang="ts">
  import { Modal } from "carbon-components-svelte";

  export let open: boolean = false;
</script>

<Modal
  bind:open
  modalHeading="How to use"
  primaryButtonText="Got it!"
  on:click:button--primary={() => {
    open = false;
  }}
>
  <p>
    Notifications will refresh automatically, and you will be notified when new
    notifications are available.
    <br />
    You can search notifications by using <i>selectors</i>.<br />
    You can directly type them, but you also have some quick actions.
  </p>
  <br />
  <h4>Filter by repository</h4>
  <p>
    <b>Syntax: </b><code>repo:my-name/my-repo</code><br />
    (you can also click on a repository name in the table)
    <br />
  </p>
  <br />
  <h4>Filter by subject</h4>
  <p>
    <b>Syntax: </b><code>subject:my-subject</code><br />
    (you can also click on a message subject in the table)
    <br />
    <br />
    <b>Subject types:</b>
    <br />
    &mdash; <b>Pull requests</b>: <code>subject:PullRequest</code><br />
    &mdash; <b>Releases:</b> <code>subject:Release</code><br />
    &mdash; <b>Issues:</b> <code>subject:Issue</code><br />
    &mdash; <b>Workflows:</b> <code>subject:Workflow</code><br />
    &mdash; <b>Commits:</b> <code>subject:Commit</code><br />
    &mdash; <b>Discussions:</b> <code>subject:Discussion</code><br />
    &mdash; <b>Repository invitations:</b>
    <code>subject:RepositoryInvitation</code><br />
  </p>
  <br />
  <h4>Filter by author</h4>
  <p>
    <b>Syntax: </b><code>author:some-dude</code><br />
    (you can also click on an author in the table)
    <br />
  </p>
  <br />
  <h4>Filter by state</h4>
  <p>
    <b>Syntax: </b><code>state:merged</code> (or <code>state:open</code>, or
    <code>state:closed</code>)<br />
    (you can also click on a state in the table)
    <br />
  </p>
  <br />
  <h4>Filter by label</h4>
  <p>
    <b>Syntax: </b><code>label:my-label</code><br />
    (you can also click on a label in the table)
  </p>
</Modal>

<style>
  b {
    font-weight: bold;
  }

  i {
    font-style: italic;
  }

  code {
    padding: 0 var(--size-1);
  }

  :global(html[theme="g100"]) code {
    background-color: rgb(61, 61, 61);
  }

  :global(html[theme="g10"]) code {
    background-color: rgb(231, 231, 231);
  }
</style>
