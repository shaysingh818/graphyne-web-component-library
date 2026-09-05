# graphyne-web-component-library

Reusable, publishable component library for Graphyne Studios.

Components are authored once as Vue 3 single-file components and built two
ways: as plain Vue components for use inside Vue apps, and as native
[custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
(Web Components) that work in *any* framework — or no framework at all. That
second build is what will let this library be dropped into React or Svelte
projects later without rewriting anything, once wrapper packages for those
frameworks are added.

For now the scaffolding is intentionally scoped to Vue: authoring, building,
testing, and previewing components in Storybook.

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/) 10.x (`corepack enable` will pick up the pinned
  version from `packageManager` in the root `package.json`)

## Getting started

```bash
pnpm install
pnpm storybook   # opens the component playground at http://localhost:6006
pnpm test        # runs unit tests for every package
pnpm build       # builds every publishable package
```

## Repository layout

```
graphyne-web-component-library/
├─ packages/
│  └─ core/                     @graphyne/web-components — the component library
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ buttons/
│     │  │  │  └─ GnButton/
│     │  │  │     ├─ GnButton.vue          component
│     │  │  │     ├─ GnButton.stories.ts   Storybook stories
│     │  │  │     ├─ GnButton.test.ts      Vitest unit tests
│     │  │  │     └─ index.ts              barrel export
│     │  │  ├─ layout/
│     │  │  │  └─ GnCard/                  same shape as GnButton
│     │  │  └─ index.ts (per category)     re-exports every component in it
│     │  ├─ index.ts             Vue entry point (+ install() plugin)
│     │  └─ elements.ts          custom-elements entry point
│     ├─ vite.config.ts          builds the Vue components bundle
│     ├─ vite.elements.config.ts builds the custom-elements bundle
│     └─ vitest.config.ts
├─ pnpm-workspace.yaml
└─ package.json                  root scripts, shared devDependencies
```

It's a pnpm workspace so more packages can be added under `packages/`
without restructuring anything — that's how React/Svelte support gets added
later (see [Future frameworks](#future-frameworks-react-svelte-)).

## Authoring a component

Components are grouped into category folders under
`packages/web-components/src/components/` — `buttons/`, `layout/`, and so on — so the
source tree stays organized as the library grows instead of a single flat
folder of unrelated components. Within a category, every component still
gets its own folder with four files: the `.vue` component, a `.stories.ts`
file, a `.test.ts` file, and an `index.ts` barrel export. Look at
`buttons/GnButton/` and `layout/GnCard/` as templates — they demonstrate
typed props with defaults, a namespaced custom event (`gn-click`), and slot
usage (default + named slots).

Each category folder also has its own `index.ts` that re-exports everything
in it (e.g. `components/buttons/index.ts` does `export * from "./GnButton"`)
— that's what `src/index.ts` imports from, so adding a new component to an
existing category never requires touching anything outside that category
folder.

To add a new component to an existing category (e.g. a second button):

1. Create `packages/web-components/src/components/buttons/MyThing/MyThing.vue`.
2. Add `packages/web-components/src/components/buttons/MyThing/index.ts` that
   re-exports it.
3. Add `export * from "./MyThing";` to
   `packages/web-components/src/components/buttons/index.ts`.
4. Register it in `packages/web-components/src/elements.ts` if it should also ship as
   a custom element (almost everything should).
5. Add a `.stories.ts` file (`title: "Buttons/MyThing"` — see
   [Storybook](#storybook-the-playground) below) and a `.test.ts` file with
   Vitest + `@vue/test-utils` coverage.
6. If it should be globally registerable via the `install()` Vue plugin,
   add it to `packages/web-components/src/index.ts`.

To start a brand-new category (e.g. `navigation`):

1. Create `packages/web-components/src/components/navigation/`.
2. Add your first component inside it, following the same folder shape as
   above.
3. Add `packages/web-components/src/components/navigation/index.ts` re-exporting it.
4. Add `export * from "./components/navigation";` to
   `packages/web-components/src/index.ts`.

Naming convention: components are prefixed `Gn` (short for Graphyne) in Vue
land, and compile down to `gn-*` custom element tag names (e.g. `GnButton`
→ `<gn-button>`). Category folder names are lowercase and plural where it
reads naturally (`buttons`, not `Buttons`/`button`).

## Two build outputs, one source

`packages/web-components/package.json` exposes two entry points:

| Import | What it is | Vue required in the consumer? |
|---|---|---|
| `@graphyne/web-components` | Plain Vue components (`GnButton`, `GnCard`, …) plus a Vue `install()` plugin | Yes |
| `@graphyne/web-components/elements` | Self-registering custom elements (`<gn-button>`, `<gn-card>`, …) | No |

```ts
// Inside a Vue app
import { createApp } from "vue";
import GraphyneWebComponents from "@graphyne/web-components";
createApp(App).use(GraphyneWebComponents).mount("#app");

// Anywhere else (React, Svelte, plain HTML)
import "@graphyne/web-components/elements";
// <gn-button variant="primary">Save</gn-button> now works as an HTML tag
```

The two builds are configured by `vite.config.ts` and
`vite.elements.config.ts` respectively. The Vue build treats `vue` as an
external peer dependency (the host app already has it); the custom-elements
build bundles Vue in and compiles every SFC with `customElement: true`
(styles get inlined into each element's shadow DOM instead of extracted to
a shared stylesheet), so the elements are fully self-contained.

## Styling

[Tailwind CSS v4](https://tailwindcss.com/) is wired in via the
[`@tailwindcss/vite`](https://www.npmjs.com/package/@tailwindcss/vite)
plugin. The entry stylesheet is
`packages/web-components/src/styles/tailwind.css` — add your `@theme` tokens and any
shared `@layer` rules there.

It's currently only wired into two places:

- `vite.config.ts` (the plain Vue components build) — imported once from
  `src/index.ts`, so it behaves like a normal global stylesheet.
- `.storybook/main.ts` / `.storybook/preview.ts` — so utility classes
  render correctly in the Storybook canvas.

It is **not** wired into `vite.elements.config.ts` (the custom-elements
build). Each custom element renders in its own shadow DOM, which a global
Tailwind stylesheet doesn't reach — only CSS custom properties (like the
ones Tailwind's `@theme` generates) inherit across the shadow boundary,
plain utility rules don't. The straightforward fix, when custom-elements
distribution is actually needed, is to author component styles with
Tailwind's `@apply` inside each SFC's scoped `<style>` block rather than
utility classes in the template — that compiles to concrete CSS scoped to
that component, so it gets inlined into its shadow root like any other
scoped style. Revisit this once the React/Svelte packages are underway.

## Testing

Unit tests use [Vitest](https://vitest.dev/) with `@vue/test-utils` and a
jsdom environment, co-located next to each component:

```bash
pnpm test              # run once
pnpm --filter @graphyne/web-components run test:watch
```

## Storybook (the playground)

[Storybook](https://storybook.js.org/) is the way to visually try out
components while building them, and doubles as living documentation via the
`autodocs` tag on every story.

```bash
pnpm storybook          # dev server at http://localhost:6006
pnpm build-storybook    # static build, e.g. for deploying docs
```

Storybook config lives in `packages/web-components/.storybook/`. Add a `.stories.ts`
file next to any component and it's picked up automatically.

The Storybook sidebar is grouped by each story's `title` field, not by file
location — `title: "Buttons/GnButton"` puts it under a "Buttons" group in
the sidebar. By convention that title should match the component's category
folder name (capitalized), so the sidebar mirrors the source layout.

## Publishing

`packages/web-components` builds to `packages/web-components/dist/` with proper `exports`,
`types`, and a `peerDependencies` entry for `vue`. Before publishing for
real:

- Decide on and reserve an actual npm scope/org (this scaffold uses
  `@graphyne` as a placeholder — update the `name` field in
  `packages/web-components/package.json` if that's not the final name).
- Consider adding [Changesets](https://github.com/changesets/changesets) for
  versioning and changelogs once there's more than one package to publish.
- `pnpm --filter @graphyne/web-components publish` once logged in to npm (`npm login`)
  and the package name/version are finalized.

## Future frameworks (React, Svelte, …)

Because the components already compile to plain custom elements via
`@graphyne/web-components/elements`, framework-specific packages can be added later
without touching how components are authored:

- `packages/react/` — thin typed wrappers around the custom elements
  (e.g. via `@lit/react`-style wrapping, or hand-written wrapper
  components) so React apps get idiomatic props/refs/event handlers.
- `packages/svelte/` — the custom elements work directly in Svelte with
  little to no wrapping needed; a package here would mostly add
  Svelte-flavored typings and docs.

Both would live as new entries under `packages/` in this same pnpm
workspace, each with its own `package.json`, consuming
`@graphyne/web-components/elements` as a dependency rather than reimplementing the
components.

## License

MIT — see [`LICENSE`](./LICENSE).
