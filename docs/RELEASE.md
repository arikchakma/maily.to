# Release Guide

## Dependency Graph

```
@maily-to/shared                    ← root, no internal deps
  ├── @maily-to/ui
  └── @maily-to/migration

@maily-to/render                    ← depends on shared + migration
@maily-to/core                      ← depends on shared + ui + migration
```

Extensions (`extension-variable`, `extension-ai-actions`, `extension-inline-suggestion`) are **not published separately** — they are bundled into `@maily-to/core` at build time via `devDependencies`.

## How to Release

All packages use coordinated versioning — one version, one release.

### 1. Verify everything works

```bash
vp run build
vp check
```

### 2. Run the release

```bash
pnpm release
```

This runs `bumpp` which:

- Prompts for the new version
- Bumps all 5 publishable `package.json` files
- Commits with `release: v<version>`
- Tags with `v<version>`
- Pushes to remote

### 3. CI handles the rest

The `v*` tag triggers `.github/workflows/release.yml` which builds, tests, and publishes all packages to npm in dependency order:

1. `@maily-to/shared`
2. `@maily-to/ui` + `@maily-to/migration`
3. `@maily-to/render`
4. `@maily-to/core`

A GitHub changelog is generated automatically.

## Notes

- Extensions are bundled into `@maily-to/core` — do **not** publish them separately
- `@maily-to/tsconfig` is `private: true` — do **not** publish it
- The `apps/` directory (`app`, `web`) are not published
- pnpm replaces `workspace:*` → `^<version>` at publish time automatically
- Each package has a `prepublishOnly` script as a safety net
- Individual `release:*` scripts are still available for edge cases (e.g. `pnpm release:core`)
