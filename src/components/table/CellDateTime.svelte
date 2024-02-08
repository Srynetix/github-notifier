<script lang="ts">
  import { isSameDay, format, formatDistanceToNowStrict } from "date-fns";
  import { fr } from "date-fns/locale";

  export let updatedAt: Date;
</script>

<span title={format(updatedAt, "PPPP", { locale: fr })}>
  {#if !isSameDay(updatedAt, new Date())}
    {formatDistanceToNowStrict(updatedAt, { unit: "day" })} ago<br />
  {/if}
  {format(updatedAt, "p", { locale: fr })}
</span>
