---
name: new-gn-page
description: Scaffold a new Storybook showcase page in packages/core that composes multiple existing Gn* components into a full demo screen (e.g. an app shell, a settings screen), following this repo's established conventions. Use when the user asks to create, add, or scaffold a new demo/example page, or a composed multi-component screen.
---

# Scaffolding a new Graphyne showcase page

A "page" here is not a routed app page — no consumer app exists yet under
`apps/*`. It's a Storybook story that composes several existing `Gn*`
components into one realistic screen, the same idea as
`GnNavigationBar.stories.ts`'s `SideNav`/`TopBar`/`WithTrailingIcons`
stories, just promoted to its own file instead of living inside one
component's folder.

Reference implementation, cleanest to copy from:
`src/stories/pages/SettingsDashboard.stories.ts` — a workspace settings
screen composing every component in the library at once (dark side nav +
`GnBackBar` header with search/actions + `GnTabNavigationBar` sections +
`GnCard` forms). It's also the proof for this file's conventions below.

## 1. Ask if unclear

- What screen is this demonstrating (e.g. "app shell with side nav +
  content cards", "settings screen using GnBackBar + form fields")?
- Which existing `Gn*` components does it compose?
- Does it need any layout-only wrapper markup (a positioning `<div>`
  decorator, like `GnNavigationBar`'s `SideNav` story uses to pin itself
  to a screen edge) that doesn't belong to any single component?

## 2. Where it lives

```
packages/core/src/stories/pages/<PageName>.stories.ts
```

Title it `"Pages/<PageName>"` so it groups separately from component-level
stories in the Storybook sidebar. There's no `.vue` file and no
`.test.ts` — a page is pure composition of components that are already
tested on their own, expressed entirely as a `render:` function in the
story (same shape as `GnNavigationBar.stories.ts`'s composed stories).

Because a page has no single wrapping component, its `meta` has no
`component:` field — type it as `satisfies Meta` (no generic) rather than
`satisfies Meta<typeof Whatever>`. Set `parameters.layout: "fullscreen"`
so the canvas isn't padded like a normal component story.

## 3. Compose, don't invent

- Import components from their **group barrel** (`../../components/navigation`,
  `../../components/forms`, etc.) rather than each one's individual `.vue`
  path — a page typically spans several groups, so this reads as one
  import block per group instead of one per component.
- Every slot/prop used must already exist — a page demo surfaces gaps in
  the component API, it doesn't paper over them with inline markup or
  one-off CSS. If the screen needs something a component doesn't support,
  that's a `new-gn-component` (or component-editing) task first.
- Local UI state (which tab is active, form field values) lives in the
  story's own `setup()` via plain `ref`/`reactive` — components like
  `GnTabNavigationBar` deliberately don't track this themselves (see its
  own doc comment), so the page has to, exactly as a real consumer would.
- Give the story its own `parameters.docs.description.component`
  explaining what real screen this represents and why these components
  were chosen together.

## 4. Verify

- Check it renders in the Storybook preview — navigate to
  `http://localhost:6006/iframe.html?id=pages-<pagename>--default&viewMode=story`.
- `read_console_messages` should show no errors, and `javascript_tool`
  spot-checks (computed background colors, element counts, clicking a tab
  and confirming the right `v-show` section becomes visible) are a
  reasonable substitute for a screenshot when the Browser pane can't
  compose frames — confirm actual behavior, not just that nothing throws.
- `pnpm --filter @graphyne/core run typecheck` and
  `pnpm --filter @graphyne/core run test` should stay green (a page adds
  no component logic, so this is really "did I break something else").
