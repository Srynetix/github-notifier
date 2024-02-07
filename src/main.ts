import "carbon-components-svelte/css/all.css";
import "open-props/style";

import App from "./App.svelte";
import "./app.css";

const target = document.getElementById("app");
if (!target) {
  throw new Error("Application target not found.");
}

const app = new App({
  target,
});

export default app;
