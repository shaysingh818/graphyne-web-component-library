import type { App } from "vue";
import { GnButton } from "./components/GnButton";
import { GnCard } from "./components/GnCard";

export { GnButton } from "./components/GnButton";
export { GnCard } from "./components/GnCard";

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
