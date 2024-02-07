<script lang="ts">
  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderGlobalAction,
    HeaderPanelLink,
  } from "carbon-components-svelte";
  import type { CarbonTheme } from "carbon-components-svelte/src/Theme/Theme.svelte";
  import {
    NotificationFilled,
    Sun,
    Moon,
    Password,
    LogoGithub,
    Warning,
    Settings,
    TrashCan,
  } from "carbon-icons-svelte";
  import { theme } from "@/store/theme";

  const PROJECT_URL = "https://github.com/Srynetix/github-notifier";
  const APP_VERSION = "1.0.0";
  const DARK_THEME = "g100" as CarbonTheme;
  const LIGHT_THEME = "g10" as CarbonTheme;

  export let showConfigureTokenModal: boolean;
  export let showClearDataModal: boolean;

  let showSettingsMenu: boolean;

  function toggleTheme() {
    if ($theme === DARK_THEME) {
      theme.set(LIGHT_THEME);
    } else {
      theme.set(DARK_THEME);
    }
  }
</script>

<Header>
  <span class="company" slot="company">
    <div class="animated-bell">
      <NotificationFilled />
    </div>
    GitHub Notifier
  </span>
  <span class="platform" slot="platform"
    ><a
      href={PROJECT_URL}
      rel="noopener noreferrer"
      target="_blank"
      title="Link to the GitHub project">v{APP_VERSION}</a
    ></span
  >

  <HeaderUtilities>
    <HeaderGlobalAction
      on:click={toggleTheme}
      title={$theme === DARK_THEME
        ? "Switch to light theme"
        : "Switch to dark theme"}
      icon={$theme === DARK_THEME ? Sun : Moon}
    />
    <HeaderAction
      title="Open settings"
      bind:isOpen={showSettingsMenu}
      icon={Settings}
    >
      <HeaderPanelLinks>
        <HeaderPanelLink
          on:click={() => {
            showSettingsMenu = false;
            showConfigureTokenModal = true;
          }}><Password /> Configure personal token</HeaderPanelLink
        >
        <HeaderPanelLink
          href="https://github.com/notifications"
          rel="noopener noreferrer"
          target="_blank"
          ><LogoGithub /> Your GitHub notifications</HeaderPanelLink
        >
        <HeaderPanelLink
          href="https://github.com/Srynetix/github-notifier/issues"
          rel="noopener noreferrer"
          target="_blank"><Warning /> Report an issue</HeaderPanelLink
        >
        <HeaderPanelDivider
          ><span class="divider"><Settings /> Advanced</span
          ></HeaderPanelDivider
        >
        <HeaderPanelLink
          on:click={() => {
            showSettingsMenu = false;
            showClearDataModal = true;
          }}><TrashCan /> Clear data</HeaderPanelLink
        >
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<style>
  @keyframes shaking {
    from {
      transform: rotate(-45deg);
    }

    to {
      transform: rotate(45deg);
    }
  }

  .animated-bell {
    display: flex;
    align-items: center;
    animation: 1s shaking alternate infinite;
  }

  .company {
    display: flex;
    align-items: center;
    padding-right: var(--size-1);
    gap: var(--size-1);
  }

  .company > :global(svg) {
    margin-right: var(--size-1);
  }

  .platform > :global(a) {
    color: inherit;
    text-decoration: none;
  }

  .platform > :global(a:hover) {
    text-decoration: underline;
  }

  :global(.bx--switcher__item-link) {
    display: flex !important;
    align-items: center;
    gap: var(--size-2);
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-2);
  }
</style>
