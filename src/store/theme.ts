import { writable } from "svelte/store";
import type { CarbonTheme } from "carbon-components-svelte/src/Theme/Theme.svelte";

const THEME_NAME = "ghn-theme";
const DEFAULT_THEME = "g10" as CarbonTheme;

function createThemeStore() {
  const theme = localStorage.getItem(THEME_NAME) ?? DEFAULT_THEME;
  const { subscribe, set } = writable(theme as CarbonTheme);

  return {
    subscribe,
    set: (value: CarbonTheme) => {
      localStorage.setItem(THEME_NAME, value);
      set(value);
    },
    reset: () => {
      localStorage.removeItem(THEME_NAME);
      set(DEFAULT_THEME);
    },
  };
}

export const theme = createThemeStore();
