<script lang="ts">
  // Adapted from https://github.com/carbon-design-system/carbon-components-svelte/blob/v0.82.8/src/Tag/Tag.svelte

  /** @restProps {div | span} */

  /**
   * Specify the color of the tag
   * @type {string}
   */
  export let color = "";

  /** @type {"sm" | "default"} */
  export let size = "default";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let icon: typeof SvelteComponent<any> | undefined = undefined;

  import { SvelteComponent, createEventDispatcher } from "svelte";
  import invert from "invert-color";

  const dispatch = createEventDispatcher();

  $: textColor = color ? invert(color, true) : "white";
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="tag"
  class:bx--tag={true}
  class:bx--tag--sm={size === "sm"}
  style:background-color={color}
  style:color={textColor}
  {...$$restProps}
  on:click={() => dispatch("select")}
  on:keypress={() => dispatch("select")}
  on:mouseover
  on:mouseenter
  on:mouseleave
>
  {#if $$slots.icon || icon}
    <div class:bx--tag__custom-icon={true}>
      <slot name="icon">
        <svelte:component this={icon} />
      </slot>
    </div>
  {/if}
  <span>
    <slot />
  </span>
</div>

<style>
  .tag {
    cursor: pointer;
  }

  .tag:hover {
    filter: brightness(80%);
  }
</style>
