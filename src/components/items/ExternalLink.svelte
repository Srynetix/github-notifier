<script lang="ts">
  /** @restProps {a} */
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a rel="noopener noreferrer" target="_blank" {...$$restProps}>
  <slot />
</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
