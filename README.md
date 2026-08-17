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
│  └─ core/                     @graphyne/core — the component library
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ GnButton/
│     │  │  │  ├─ GnButton.vue          component
│     │  │  │  ├─ GnButton.stories.ts   Storybook stories
│     │  │  │  ├─ GnButton.test.ts      Vitest unit tests
│     │  │  │  └─ index.ts              barrel export
│     │  │  └─ GnCard/                  same shape as above
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

Every component lives in its own folder under
`packages/core/src/components/` with four files: the `.vue` component, a
`.stories.ts` file, a `.test.ts` file, and an `index.ts` barrel export. Look
at `GnButton/` and `GnCard/` as templates — they demonstrate typed props
with defaults, a namespaced custom event (`gn-click`), and slot usage
(default + named slots).

To add a new component:

1. Create `packages/core/src/components/MyThing/MyThing.vue`.
2. Add `packages/core/src/components/MyThing/index.ts` that re-exports it.
3. Export it from `packages/core/src/index.ts` (and add it to the
   `install()` plugin if it should be globally registerable).
4. Register it in `packages/core/src/elements.ts` if it should also ship as
   a custom element (almost everything should).
5. Add a `.stories.ts` file so it shows up in Storybook, and a `.test.ts`
   file with Vitest + `@vue/test-utils` coverage.

Naming convention: components are prefixed `Gn` (short for Graphyne) in Vue
land, and compile down to `gn-*` custom element tag names (e.g. `GnButton`
→ `<gn-button>`).

## Two build outputs, one source

`packages/core/package.json` exposes two entry points:

| Import | What it is | Vue required in the consumer? |
|---|---|---|
| `@graphyne/core` | Plain Vue components (`GnButton`, `GnCard`, …) plus a Vue `install()` plugin | Yes |
| `@graphyne/core/elements` | Self-registering custom elements (`<gn-button>`, `<gn-card>`, …) | No |

```ts
// Inside a Vue app
import { createApp } from "vue";
import GraphyneCore from "@graphyne/core";
createApp(App).use(GraphyneCore).mount("#app");

// Anywhere else (React, Svelte, plain HTML)
import "@graphyne/core/elements";
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
`packages/core/src/styles/tailwind.css` — add your `@theme` tokens and any
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
pnpm --filter @graphyne/core run test:watch
```

## Storybook (the playground)

[Storybook](https://storybook.js.org/) is the way to visually try out
components while building them, and doubles as living documentation via the
`autodocs` tag on every story.

```bash
pnpm storybook          # dev server at http://localhost:6006
pnpm build-storybook    # static build, e.g. for deploying docs
```

Storybook config lives in `packages/core/.storybook/`. Add a `.stories.ts`
file next to any component and it's picked up automatically.

## Publishing

`packages/core` builds to `packages/core/dist/` with proper `exports`,
`types`, and a `peerDependencies` entry for `vue`. Before publishing for
real:

- Decide on and reserve an actual npm scope/org (this scaffold uses
  `@graphyne` as a placeholder — update the `name` field in
  `packages/core/package.json` if that's not the final name).
- Consider adding [Changesets](https://github.com/changesets/changesets) for
  versioning and changelogs once there's more than one package to publish.
- `pnpm --filter @graphyne/core publish` once logged in to npm (`npm login`)
  and the package name/version are finalized.

## Future frameworks (React, Svelte, …)

Because the components already compile to plain custom elements via
`@graphyne/core/elements`, framework-specific packages can be added later
without touching how components are authored:

- `packages/react/` — thin typed wrappers around the custom elements
  (e.g. via `@lit/react`-style wrapping, or hand-written wrapper
  components) so React apps get idiomatic props/refs/event handlers.
- `packages/svelte/` — the custom elements work directly in Svelte with
  little to no wrapping needed; a package here would mostly add
  Svelte-flavored typings and docs.

Both would live as new entries under `packages/` in this same pnpm
workspace, each with its own `package.json`, consuming
`@graphyne/core/elements` as a dependency rather than reimplementing the
components.

## License

MIT — see [`LICENSE`](./LICENSE).
