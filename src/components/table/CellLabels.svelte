<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AppLabel } from "@/domain/AppNotification";
  import Tag from "@/components/items/Tag.svelte";
  import { Tag as TagIcon } from "carbon-icons-svelte";

  export let labels: AppLabel[];

  const dispatch = createEventDispatcher();
</script>

<span class="labels">
  {#each labels as label}
    <Tag
      title={`${label.description}\nClick to filter on this label`}
      color={label.color}
      icon={TagIcon}
      on:select={() => dispatch("select", label)}
    >
      {label.label}
    </Tag>
  {/each}
</span>

<style>
  .labels {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--size-2);
  }

  .labels > :global(div) {
    display: flex;
    justify-content: flex-start;
    margin: 0;

    transition: all 0.1s;
  }
</style>
