import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

/**
 * Library build for consuming components directly as Vue components,
 * e.g. `import { GnButton } from '@graphyne/core'` inside a Vue app.
 * Vue is treated as a peer dependency (externalized) since the host
 * Vue app already provides the runtime.
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "GraphyneCore",
      formats: ["es"],
      fileName: () => "graphyne-core.js"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" }
      }
    }
  }
});
