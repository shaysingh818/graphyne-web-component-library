import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

/**
 * Library build for the framework-agnostic custom elements bundle,
 * e.g. `import '@graphyne/web-components/elements'` from React, Svelte, or plain HTML.
 *
 * `customElement: /\.vue$/` tells @vitejs/plugin-vue to compile every SFC in
 * this build for shadow-DOM custom element usage (styles get inlined into
 * the component definition instead of extracted to a shared stylesheet).
 * Vue itself is intentionally bundled (not externalized) so the resulting
 * elements are self-contained and work in apps that don't have Vue at all.
 */
export default defineConfig({
  plugins: [vue({ customElement: /\.vue$/ })],
  build: {
    outDir: "dist/elements",
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/elements.ts", import.meta.url)),
      name: "GraphyneElements",
      formats: ["es"],
      fileName: () => "graphyne-elements.js"
    }
  }
});
