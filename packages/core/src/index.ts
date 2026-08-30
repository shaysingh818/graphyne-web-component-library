import type { App } from "vue";
import "./styles/tailwind.css";
import "./styles/tokens.css";
import "./styles/shared.css";

import { GnButton, GnIconButton } from "./components/buttons";
import { GnCard } from "./components/layout";
import { GnFormInputField, GnFormDropDownField, GnSearchFormField, GnFormTextField } from "./components/forms";
import { GnNavigationItem } from "./components/navigation";

export * from "./components/buttons";
export * from "./components/layout";
export * from "./components/forms";
export * from "./components/navigation";

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
    app.component("GnIconButton", GnIconButton);
    app.component("GnCard", GnCard);
    app.component("GnFormInputField", GnFormInputField);
    app.component("GnFormDropDownField", GnFormDropDownField);
    app.component("GnSearchFormField", GnSearchFormField);
    app.component("GnFormTextField", GnFormTextField);
    app.component("GnNavigationItem", GnNavigationItem);
  }
};
