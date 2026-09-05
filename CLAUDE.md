# Graphyne Web Component Library

A pnpm monorepo. Components are authored as Vue 3 SFCs and compiled to
framework-agnostic custom elements (Web Components), so a component's public
API (props/emits/slots) has to make sense to a consumer who isn't using Vue.

## Layout

- `packages/*` — publishable packages. Currently just `packages/web-components`
  (`@graphyne/web-components`), the actual component library. See
  `packages/web-components/CLAUDE.md` for how components in there are authored.
- `apps/*` — reserved by the workspace glob (`pnpm-workspace.yaml`) for
  consumer apps, none exist yet.

## Commands (run from repo root, fan out via `pnpm --filter`)

```bash
pnpm test         # vitest run, all packages
pnpm typecheck    # vue-tsc --noEmit, all packages
pnpm lint         # eslint . --ext .ts,.vue
pnpm build        # build all packages
pnpm storybook    # Storybook dev server for @graphyne/web-components, localhost:6006
```

## Working conventions

- Always run `pnpm test` (or the package-scoped equivalent) and a type check
  after editing a component — don't just eyeball the diff. Verify visually in
  the Storybook preview (`.claude/launch.json` has a `storybook` launch
  config) when the change affects rendered output.
- A pre-existing, unrelated test failure may already be present when you run
  the suite (`GnFormDropDownField`'s "renders the label associated" test —
  the `label` prop isn't wired into that component's template yet). Don't
  let it block unrelated work, but don't quietly "fix" it as a drive-by
  either unless asked.
- Files in this repo get edited iteratively across a session — re-read a file
  before assuming its contents from earlier in the conversation, since it
  may have changed since (either by you, a linter, or the user).
