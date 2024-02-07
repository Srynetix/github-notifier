<script lang="ts">
  import type { AppState } from "@/domain/AppNotification";
  import Tag from "@/components/items/Tag.svelte";

  export let state: AppState;

  let tagColor = "#aaaaaa";
  if (state == "Open") {
    tagColor = "#43B04F";
  } else if (state == "Merged") {
    tagColor = "#ff00ff";
  } else if (state == "Closed") {
    tagColor = "#ff0000";
  }
</script>

<Tag color={tagColor} title="Click to filter on this state" on:select>
  {state}
</Tag>
