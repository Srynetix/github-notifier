<script lang="ts">
  import { Button, InlineLoading } from "carbon-components-svelte";
  import { type SvelteComponent } from "svelte";

  export let disabled = false;
  export let loading = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let icon: typeof SvelteComponent<any> | undefined;
</script>

<Button
  icon={(loading && InlineLoading) || icon}
  disabled={loading || disabled}
  {...$$restProps}
>
  <slot />
</Button>
