import type { App } from "vue";
import "./styles/tailwind.css";
import "./styles/tokens.css";
import "./styles/shared.css";
import { GnButton } from "./components/buttons";
import { GnCard } from "./components/layout";

export * from "./components/buttons";
export * from "./components/layout";

/**
 * Vue plugin for globally registering every Graphyne component at once:
 *
 * ```ts
 * import { createApp } from 'vue'
 * import GraphyneCore from '@graphyne/core'
 *
 * createApp(App).use(GraphyneCore).mount('#app')
 * ```
 */
export default {
  install(app: App) {
    app.component("GnButton", GnButton);
    app.component("GnCard", GnCard);
  }
};
