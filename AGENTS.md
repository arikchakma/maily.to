<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Comments and copy

Comments follow ASD-STE100 (Simplified Technical English) and the Google
developer documentation style guide: short declarative sentences, present
tense, active voice, one idea per sentence. A comment explains **why**, never
what the code already says.

# Releasing

Agents must never run release or publish commands — the maintainer does.

1. `pnpm release` — bumpp bumps `shared`, `migration`, `render`, `core`, commits `release: v%s`, tags, pushes.
2. The `v*` tag triggers `release.yml`: build, check, `pnpm publish` per package. Prereleases go to the npm `beta` dist-tag.

Never add `publishConfig.exports` — pnpm substitutes it at publish time; a stale copy broke `2.0.0-beta.6` (#236). Exports live in the top-level `exports` field only.

# Code conventions

- **No comments inside JSX.** Don't add `{/* ... */}` blocks or `//` comments within JSX markup (including inside `className`/`cn(...)` and other prop expressions).
- **Component props shape.** Every component takes a single `props` argument typed with a named `XxxProps` type, then destructures inside the body — never destructure or inline the type in the parameter list. Applies to all components, including small private helpers in the same file.

  ```tsx
  type ComponentProps = {/* ... */};

  export function Component(props: ComponentProps) {
    const {/* ... */} = props;
  }
  ```
