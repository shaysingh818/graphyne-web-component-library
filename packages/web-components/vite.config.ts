import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

/**
 * Library build for consuming components directly as Vue components,
 * e.g. `import { GnButton } from '@graphyne/web-components'` inside a Vue app.
 * Vue is treated as a peer dependency (externalized) since the host
 * Vue app already provides the runtime.
 *
 * Tailwind runs here because this build's CSS is a normal page-level
 * stylesheet (dist/style.css) — it is NOT applied to the custom-elements
 * build (vite.elements.config.ts), since Tailwind's generated utility CSS
 * doesn't cross into shadow DOM. See the "Styling" section in the README.
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "GraphyneWebComponents",
      formats: ["es"],
      fileName: () => "graphyne-web-components.js"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" }
      }
    }
  }
});
