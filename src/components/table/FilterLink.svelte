<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string;
  export let kind: string = "subject";

  const dispatch = createEventDispatcher();
</script>

<span
  class="subject"
  on:click={() => dispatch("select", { value, kind })}
  on:keypress={() => dispatch("select", { value, kind })}
  title="Click to filter on this {kind}"
  role="link"
  tabindex="0"
>
  <slot />
</span>

<style>
  .subject:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
