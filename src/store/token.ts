import { writable } from "svelte/store";

const TOKEN_NAME = "ghn-token";

function createTokenStore() {
  const token = localStorage.getItem(TOKEN_NAME) ?? "";
  const { subscribe, set } = writable(token);

  return {
    subscribe,
    set: (value: string) => {
      localStorage.setItem(TOKEN_NAME, value);
      set(value);
    },
    reset: () => {
      localStorage.removeItem(TOKEN_NAME);
      set("");
    },
  };
}

export const token = createTokenStore();
