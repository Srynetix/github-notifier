<script lang="ts">
  import { RadioButtonChecked } from "carbon-icons-svelte";

  export let visible: boolean;
</script>

<span>
  {#if visible === true}
    <span class="new">
      <RadioButtonChecked size={20} />
    </span>
  {/if}
</span>

<style>
  @keyframes newanim {
    from {
      color: green;
    }
    to {
      color: inherit;
    }
  }

  .new {
    display: flex;
    min-width: 20px;
    animation: 1s newanim alternate infinite;
  }
</style>
