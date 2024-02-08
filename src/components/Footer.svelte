<script lang="ts">
  import ExternalLink from "@/components/items/ExternalLink.svelte";
</script>

<div class="footer">
  Made with <span class="heart">🩵</span> by
  <ExternalLink href="https://github.com/Srynetix">@Srynetix</ExternalLink>
  using
  <ExternalLink href="https://svelte.dev">Svelte</ExternalLink>,
  <ExternalLink href="https://open-props.style">Open Props</ExternalLink>
  and
  <ExternalLink
    href="https://github.com/carbon-design-system/carbon-components-svelte"
    >IBM's Carbon Components</ExternalLink
  >
</div>

<style>
  .footer {
    font-style: italic;
    margin-top: var(--size-5);
    font-size: var(--font-size-1);
    color: var(--gray-6);
    text-align: center;
  }

  .heart {
    display: inline-block;
    animation: 2s heart infinite;
  }

  @keyframes heart {
    from {
      transform: rotateY(0deg);
    }

    to {
      transform: rotateY(360deg);
    }
  }
</style>
