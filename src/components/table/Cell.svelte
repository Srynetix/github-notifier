<script lang="ts">
  import type { DataTableCell } from "carbon-components-svelte/src/DataTable/DataTable.svelte";
  import type { AppNotification } from "@/domain/AppNotification";

  import CellIndicator from "./CellIndicator.svelte";
  import CellMessage from "./CellMessage.svelte";
  import CellState from "./CellState.svelte";
  import CellLabels from "./CellLabels.svelte";
  import CellDateTime from "./CellDateTime.svelte";
  import CellRepository from "./CellRepository.svelte";
  import CellActions from "./CellActions.svelte";

  export let notification: AppNotification;
  export let cell: DataTableCell;
  export let showIndicator: boolean;

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<span
  class:read={!notification.unread}
  class:closed={notification.state == "Closed" ||
    notification.state == "Merged"}
>
  {#if cell.key === "new"}
    <CellIndicator visible={showIndicator} />
  {:else if cell.key === "updatedAt"}
    <CellDateTime updatedAt={notification.updatedAt} />
  {:else if cell.key === "repository"}
    <CellRepository
      on:select={() => dispatch("filter", `repo:${notification.repository}`)}
      {notification}
    />
  {:else if cell.key === "message"}
    <CellMessage
      on:select={(e) =>
        dispatch(
          "filter",
          e.detail.kind == "subject"
            ? `subject:${e.detail.value}`
            : `author:${e.detail.value}`,
        )}
      {notification}
    />
  {:else if cell.key === "state"}
    <CellState
      on:select={() =>
        dispatch("filter", `state:${notification.state.toLowerCase()}`)}
      state={notification.state}
    />
  {:else if cell.key === "labels"}
    <CellLabels
      on:select={(e) => dispatch("filter", `label:${e.detail.label}`)}
      labels={notification.labels}
    />
  {:else if cell.key === "actions"}
    <CellActions on:marked-as-read {notification} />
  {/if}
</span>

<style>
  :global(html[theme="g10"]) :global(td:has(> .closed)) {
    background-color: rgb(241, 228, 255);
  }

  :global(html[theme="g10"]) :global(tr:has(> td > .closed)):hover :global(td) {
    background-color: rgb(240, 211, 255);
  }

  :global(html[theme="g10"]) :global(td:has(> .read)) {
    color: #aaaaaa;
  }

  :global(html[theme="g100"]) :global(td:has(> .closed)) {
    background-color: rgb(56, 44, 68);
  }

  :global(html[theme="g100"])
    :global(tr:has(> td > .closed)):hover
    :global(td) {
    background-color: rgb(100, 80, 117);
  }

  :global(html[theme="g100"]) :global(td:has(> .read)) {
    color: #555555;
  }
</style>
