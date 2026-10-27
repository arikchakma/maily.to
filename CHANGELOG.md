# Changelog

All notable changes to Maily Core v2 are documented here, organized by week.

## Week of Mar 1, 2026

### Global Theme Configuration

- Add CSS variable–based theme system for body, container, button, link, and font ([`5d10a82`](https://github.com/arikchakma/maily-core-v2/commit/5d10a82))
- Split `EditorFrame` into composable `Editor.Body` and `Editor.Container` components; `Editor.Frame` composes both for backwards compatibility ([`5dd2fc8`](https://github.com/arikchakma/maily-core-v2/commit/5dd2fc8))
- Add controlled/uncontrolled `theme`, `defaultTheme`, and `onThemeChange` props to `EditorRoot` ([`f9c3dbe`](https://github.com/arikchakma/maily-core-v2/commit/f9c3dbe))
- Add `useTheme` hook for reading and updating theme from context ([`5d10a82`](https://github.com/arikchakma/maily-core-v2/commit/5d10a82))
- Export `ThemeSettings` compound component (`Root`, `Font`, `Layout`, `Button`, `Link`) from `@maily-to/core` ([`e35b6e9`](https://github.com/arikchakma/maily-core-v2/commit/e35b6e9), [`bdbc72f`](https://github.com/arikchakma/maily-core-v2/commit/bdbc72f))
- Export `EditorThemeOptions` type and `DEFAULT_EDITOR_THEME` constant ([`5d10a82`](https://github.com/arikchakma/maily-core-v2/commit/5d10a82))
- Add `ThemeSettings` floating panel with font, layout, button, and link settings ([`e35b6e9`](https://github.com/arikchakma/maily-core-v2/commit/e35b6e9), [`bdbc72f`](https://github.com/arikchakma/maily-core-v2/commit/bdbc72f))
- Default button background and text colors to `null` for theme inheritance via CSS variables ([`0209bdf`](https://github.com/arikchakma/maily-core-v2/commit/0209bdf))
- Button view falls back to `--mly-button-*` CSS variables when per-node attributes are unset ([`0209bdf`](https://github.com/arikchakma/maily-core-v2/commit/0209bdf))

### Font Registry

- Centralize `FontFamilyItem` type: use `fontFamily` as the unique key, drop `id`/`value` ([`6f7842c`](https://github.com/arikchakma/maily-core-v2/commit/6f7842c))
- Merge web font CDN URLs into `DEFAULT_FONT_FAMILIES` (Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Raleway, Ubuntu) with system-only fallbacks (Arial, Helvetica, Georgia, Times New Roman, Verdana, Courier New, Trebuchet MS) ([`6f7842c`](https://github.com/arikchakma/maily-core-v2/commit/6f7842c))
- Add `fontFamilies` option to render config so per-node font overrides produce correct `@font-face` in rendered HTML ([`6f7842c`](https://github.com/arikchakma/maily-core-v2/commit/6f7842c))
- Extract `useLoadFont` hook for deduped font face injection across font pickers ([`83bf5fe`](https://github.com/arikchakma/maily-core-v2/commit/83bf5fe))
- Extract `FONT_WEIGHTS` / `FontWeight` into leaf file `font-weight.ts` to fix circular dependency ([`72f02fa`](https://github.com/arikchakma/maily-core-v2/commit/72f02fa))

### Theme Settings UI

- Add `SettingsField` compound component (`Root`, `Label`, `UnitField`, `ColorField`, `FieldGroup`) for consistent field layout ([`93ea329`](https://github.com/arikchakma/maily-core-v2/commit/93ea329), [`2f8602f`](https://github.com/arikchakma/maily-core-v2/commit/2f8602f))
- Add `ColorField` component with popover color picker ([`e35b6e9`](https://github.com/arikchakma/maily-core-v2/commit/e35b6e9))
- Add `ThemeSettingsContext` with `container` ref for floating UI positioning ([`e35b6e9`](https://github.com/arikchakma/maily-core-v2/commit/e35b6e9))
- Fix theme settings label width, select display, and live update propagation ([`78306bf`](https://github.com/arikchakma/maily-core-v2/commit/78306bf))
- Fix composition patterns: read `container` from context instead of prop drilling, use React 19 `use()` ([`a34eff3`](https://github.com/arikchakma/maily-core-v2/commit/a34eff3))

### Color Picker

- Add transparent color option to color swatches with checkerboard pattern ([`7e34767`](https://github.com/arikchakma/maily-core-v2/commit/7e34767))
- Add gray, teal, indigo, and lime color swatches ([`7e34767`](https://github.com/arikchakma/maily-core-v2/commit/7e34767))

### Toolbar

- Add `Toolbar.CommonActions` compound component (undo/redo, bold/italic/underline/strikethrough/code, align/direction) ([`91ed60e`](https://github.com/arikchakma/maily-core-v2/commit/91ed60e))

### Enterprise Landing Page

- Move enterprise app to `maily-pro` repo ([`f3ae346`](https://github.com/arikchakma/maily-core-v2/commit/f3ae346))

### Breaking Changes & Migration

**`FontFamilyItem` shape changed** — If you pass custom `fontFamilies` to the font style extension:

```typescript
// Before
{ id: 'inter', label: 'Inter', value: 'Inter' }

// After
{ fontFamily: 'Inter', webFont: { url: '...', format: 'woff2' } }
// label is optional, defaults to fontFamily
```

**Theme values are now numbers** — Padding, width, border-radius, and border-width changed from CSS strings to numbers:

```typescript
// Before
{ container: { paddingTop: '8px', maxWidth: '600px' } }

// After
{ container: { paddingTop: 8, maxWidth: 600 } }
```

**`isDef()` now excludes `null`** — Previously only excluded `undefined`. This enables button padding/color defaults to fall through to CSS variables when set to `null`.

**Button defaults changed to `null`** — `backgroundColor`, `color`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` default to `null` so they inherit from theme CSS variables. Existing documents with buttons that never set these attributes will now use theme values instead of hardcoded defaults.

**`getNodeFontStyleDefaults` moved** — From `font-style.ts` to `theme.ts`. Still exported from `@maily-to/shared`, so imports via the package are unchanged. Direct file imports need updating.

**`FONT_WEIGHTS` / `FontWeight` moved** — From `font-style.ts` to `font-weight.ts`. Still exported from `@maily-to/shared`. No longer re-exported from `font-style.ts`, so direct file imports need updating.

### Variable Extension

- Add `variables` option to `VariableExtension` for configurable autocomplete suggestions ([`e80dbe4`](https://github.com/arikchakma/maily-core-v2/commit/e80dbe4))
- Replace hardcoded suggestion items with `filterVariableSuggestions` utility ([`d50d7ce`](https://github.com/arikchakma/maily-core-v2/commit/d50d7ce))
- Propagate variables from main editor to sub-editors via `useEditorVariables` hook ([`cc48954`](https://github.com/arikchakma/maily-core-v2/commit/cc48954))
- Add `metadata` field to `Variable` type ([`fe51477`](https://github.com/arikchakma/maily-core-v2/commit/fe51477))
- Rename `Variable` export to `VariableExtension` with pre-configured default suggestion ([`a5c94f2`](https://github.com/arikchakma/maily-core-v2/commit/a5c94f2))
- Export `VariableExtension`, `useEditorVariables`, `filterVariableSuggestions`, and variable types from `@maily-to/core` ([`e9505a0`](https://github.com/arikchakma/maily-core-v2/commit/e9505a0))

### Render Pipeline

- Add default email meta tags to document head (format-detection, color-scheme, etc.) ([`0cae61a`](https://github.com/arikko/maily-core-v2/commit/0cae61a))
- Add custom meta tags and HTML props to render config ([`0cae61a`](https://github.com/arikko/maily-core-v2/commit/0cae61a))
- Support JSONContent preview text with variable resolution ([`0cae61a`](https://github.com/arikko/maily-core-v2/commit/0cae61a))
- Refactor preview resolver to use tree walker pattern ([`8ed118c`](https://github.com/arikko/maily-core-v2/commit/8ed118c))

### Inline Image

- Add `title` attribute to inline image extension ([`2c1362f`](https://github.com/arikko/maily-core-v2/commit/2c1362f))
- Replace alt text link popover with metadata popover (alt text + title) ([`2c1362f`](https://github.com/arikko/maily-core-v2/commit/2c1362f))
- Fix bubble menu closing when editing metadata on inline atom nodes ([`2c1362f`](https://github.com/arikko/maily-core-v2/commit/2c1362f))
- Add cursor-default to inline image wrapper ([`15f66a0`](https://github.com/arikko/maily-core-v2/commit/15f66a0))

### AI Actions Extension

- Add AI actions extension package with streaming support (`extension-ai-actions`) ([`fe9f93d`](https://github.com/arikko/maily-core-v2/commit/fe9f93d))
- Add streaming support via write callback ([`85ccbe2`](https://github.com/arikko/maily-core-v2/commit/85ccbe2))
- Remap stream positions on external transactions ([`93455c3`](https://github.com/arikko/maily-core-v2/commit/93455c3))
- Restore original text before final commit for clean undo history ([`b291ab4`](https://github.com/arikko/maily-core-v2/commit/b291ab4))
- Integrate AI actions dropdown into text bubble menu ([`7267bd8`](https://github.com/arikko/maily-core-v2/commit/7267bd8))
- Replace chevron icon with AI label in dropdown trigger ([`cdb948c`](https://github.com/arikko/maily-core-v2/commit/cdb948c))
- Split transform/suggest callbacks into `(params, ctx)` signature ([`7c7be56`](https://github.com/arikko/maily-core-v2/commit/7c7be56))
- Extract plugin name into exported constant ([`9cac7c7`](https://github.com/arikko/maily-core-v2/commit/9cac7c7))
- Add JSDoc to types, commands, and key logic ([`425312c`](https://github.com/arikko/maily-core-v2/commit/425312c))

---

## Week of Feb 24–28, 2026

### Inline Suggestion Extension

- Add inline suggestion extension package (`extension-inline-suggestion`) ([`be89f99`](https://github.com/arikko/maily-core-v2/commit/be89f99))
- Integrate inline suggestion extension into core editor ([`17b3908`](https://github.com/arikko/maily-core-v2/commit/17b3908))
- Fix storage mutation and rename completion to suggest ([`6c831bd`](https://github.com/arikko/maily-core-v2/commit/6c831bd))
- Fix stale positions, modifier keys, and dismiss command ([`b57a873`](https://github.com/arikko/maily-core-v2/commit/b57a873))
- Dismiss suggestion on selection change ([`9cf854c`](https://github.com/arikko/maily-core-v2/commit/9cf854c))
- Extract key string literals to constants ([`f16d542`](https://github.com/arikko/maily-core-v2/commit/f16d542))
- Use shared error prefix constants ([`7f192d5`](https://github.com/arikko/maily-core-v2/commit/7f192d5))
- Move mock inline suggestion config to demo app ([`ba7c997`](https://github.com/arikko/maily-core-v2/commit/ba7c997))

### Modular Email Renderer (major overhaul)

- Migrate to method-based `RenderContext` API ([`f88c801`](https://github.com/arikko/maily-core-v2/commit/f88c801))
- Add typed `RenderContext` with shared state ([`4612a12`](https://github.com/arikko/maily-core-v2/commit/4612a12))
- Unify variables, payload, and links into single variables map ([`322e0d0`](https://github.com/arikko/maily-core-v2/commit/322e0d0))
- Restructure theme to per-node entries ([`e71776b`](https://github.com/arikko/maily-core-v2/commit/e71776b))
- Consume per-node theme entries in renderers ([`4e8c13c`](https://github.com/arikko/maily-core-v2/commit/4e8c13c))
- Tighten `VariableValue` and item types to ban `any` ([`6628beb`](https://github.com/arikko/maily-core-v2/commit/6628beb))
- Wrap primitive repeat items, fix inline-image link ([`14c4e73`](https://github.com/arikko/maily-core-v2/commit/14c4e73))
- Use getter properties for styles, fonts, and var cache ([`b87d2a0`](https://github.com/arikko/maily-core-v2/commit/b87d2a0))
- Match inline code styles to editor ([`6033b0a`](https://github.com/arikko/maily-core-v2/commit/6033b0a))
- Collect and register font faces dynamically during render ([`90004bb`](https://github.com/arikko/maily-core-v2/commit/90004bb))
- Update font types and merge defaults into `getFontStyle` ([`3ab3d36`](https://github.com/arikko/maily-core-v2/commit/3ab3d36))
- Unexport mark renderer map, add JSDoc to `links()` ([`eb0235c`](https://github.com/arikko/maily-core-v2/commit/eb0235c))
- Document config and context scoping model ([`ed4660c`](https://github.com/arikko/maily-core-v2/commit/ed4660c))
- Add context tests and update existing for new API ([`7cf7c28`](https://github.com/arikko/maily-core-v2/commit/7cf7c28))
- Comprehensive audit comparing v2 with old renderer ([`bfb1852`](https://github.com/arikko/maily-core-v2/commit/bfb1852))

### Image Upload System

- Add image upload with empty state, drag-and-drop, and paste ([`36b1cac`](https://github.com/arikko/maily-core-v2/commit/36b1cac))
- Pass position and `removeImage` to upload callbacks ([`fb8af14`](https://github.com/arikko/maily-core-v2/commit/fb8af14))
- Default image width to 100% ([`0080d69`](https://github.com/arikko/maily-core-v2/commit/0080d69))
- Use `insertContentAt` for image upload ([`1f3568c`](https://github.com/arikko/maily-core-v2/commit/1f3568c))
- Use constant for image upload extension name ([`01b57b3`](https://github.com/arikko/maily-core-v2/commit/01b57b3))
- Use `IMAGE_UPLOAD_STATUSES` const for all status literals ([`ffb9424`](https://github.com/arikko/maily-core-v2/commit/ffb9424))
- Show variable state for images with dynamic source ([`0998624`](https://github.com/arikko/maily-core-v2/commit/0998624))
- Restyle image placeholder to match v1 design ([`31f814b`](https://github.com/arikko/maily-core-v2/commit/31f814b))
- Use Loader2Icon for image loading spinner ([`8c2a090`](https://github.com/arikko/maily-core-v2/commit/8c2a090))
- Show image bubble menu during all upload states ([`c87e7bf`](https://github.com/arikko/maily-core-v2/commit/c87e7bf))
- Extract `ImageState` compound component into folder ([`bef5299`](https://github.com/arikko/maily-core-v2/commit/bef5299))

### Editor Enhancements

- Add email preview with HTML/React tabs, auto-height iframe, viewport toggle ([`5bb5695`](https://github.com/arikko/maily-core-v2/commit/5bb5695), [`37e72a8`](https://github.com/arikko/maily-core-v2/commit/37e72a8), [`f317cb7`](https://github.com/arikko/maily-core-v2/commit/f317cb7))
- Add vitest infrastructure and unit tests for shared and render packages ([`bb9749b`](https://github.com/arikko/maily-core-v2/commit/bb9749b))
- Add `EXTRA_BOLD` font weight and fix weight label formatting ([`a721f68`](https://github.com/arikko/maily-core-v2/commit/a721f68))
- Add font style (italic/normal) to font style config ([`84c340e`](https://github.com/arikko/maily-core-v2/commit/84c340e))
- Cascade box width through `RenderContext` ([`8c78214`](https://github.com/arikko/maily-core-v2/commit/8c78214))
- Replace `useId` with `useMailyId` hook ([`bf9141c`](https://github.com/arikko/maily-core-v2/commit/bf9141c))
- Accept `extensions` array instead of individual callback props ([`196ebc7`](https://github.com/arikko/maily-core-v2/commit/196ebc7))
- Extract `useControllableState` hook ([`75cf896`](https://github.com/arikko/maily-core-v2/commit/75cf896))
- Move `buildDocFromVariableTemplate` to shared package ([`bad5865`](https://github.com/arikko/maily-core-v2/commit/bad5865))
- Migrate image upload state from Zustand to editor storage ([`b74945b`](https://github.com/arikko/maily-core-v2/commit/b74945b))
- Preload Inter font and define font-sans ([`a01edf3`](https://github.com/arikko/maily-core-v2/commit/a01edf3))
- Move font types and defaults into `font.ts` ([`b559194`](https://github.com/arikko/maily-core-v2/commit/b559194))
- Add antialiased font smoothing to paragraph, list-item, and code ([`9306643`](https://github.com/arikko/maily-core-v2/commit/9306643))
- Add placeholder and `showOpenInNewTabButton` props to `LinkPopover` ([`ae715be`](https://github.com/arikko/maily-core-v2/commit/ae715be))
- Add `inlineImage` node with resize handles and bubble menu ([`ae715be`](https://github.com/arikko/maily-core-v2/commit/ae715be))
- Use uniform size for `inlineImage` and add empty placeholder ([`6ba6268`](https://github.com/arikko/maily-core-v2/commit/6ba6268))

### Renderer Fixes

- Set default columns gap to 8 matching old renderer ([`b9bd688`](https://github.com/arikko/maily-core-v2/commit/b9bd688))
- Align footer font size with old renderer (14px) ([`15e4d51`](https://github.com/arikko/maily-core-v2/commit/15e4d51))
- Align footer and button defaults with editor CSS ([`d506a32`](https://github.com/arikko/maily-core-v2/commit/d506a32))
- Use `isDef` for font style checks to allow falsy values ([`891c52f`](https://github.com/arikko/maily-core-v2/commit/891c52f))
- Use `FontStyleValue` for blockquote `fontStyle` type ([`fe6df8b`](https://github.com/arikko/maily-core-v2/commit/fe6df8b))

### Infrastructure

- Add CI workflow with format check step ([`bb117c7`](https://github.com/arikko/maily-core-v2/commit/bb117c7), [`cb9c1a8`](https://github.com/arikko/maily-core-v2/commit/cb9c1a8))
- Add z-index to editor toolbar ([`735be2f`](https://github.com/arikko/maily-core-v2/commit/735be2f))
- Update Inter font URL to `cdn.usemaily.com` ([`ac2128c`](https://github.com/arikko/maily-core-v2/commit/ac2128c))
- Add JSDoc for slash command render prop ([`9e0ecbd`](https://github.com/arikko/maily-core-v2/commit/9e0ecbd))
- Use `node-html-parser` to strip head in HTML code block ([`d17bc9d`](https://github.com/arikko/maily-core-v2/commit/d17bc9d))
- Add project documentation ([`6ebd96e`](https://github.com/arikko/maily-core-v2/commit/6ebd96e))

---

## Week of Feb 17–23, 2026

### Renderer Architecture

- Implement full-featured modular renderer ([`983b514`](https://github.com/arikko/maily-core-v2/commit/983b514))
- Expand shared types for renderer parity ([`1a75e94`](https://github.com/arikko/maily-core-v2/commit/1a75e94))
- Make `NodeRenderer` generic for typed context ([`1fab8ee`](https://github.com/arikko/maily-core-v2/commit/1fab8ee))
- Replace magic strings with constants in renderers ([`d55a827`](https://github.com/arikko/maily-core-v2/commit/d55a827))
- Extract `buildConfig` into `config.ts` ([`7c4d3b9`](https://github.com/arikko/maily-core-v2/commit/7c4d3b9))
- Consolidate types into config and render ([`8727648`](https://github.com/arikko/maily-core-v2/commit/8727648))
- Move HTML shell into document renderer ([`68b096a`](https://github.com/arikko/maily-core-v2/commit/68b096a))
- Add `FontStyleAttributes` to paragraph and heading types ([`9552145`](https://github.com/arikko/maily-core-v2/commit/9552145))
- Add block margin suppression logic ([`ded6b24`](https://github.com/arikko/maily-core-v2/commit/ded6b24))
- Add `shouldSuppressMarginTop` for horizontal rule ([`4693ea5`](https://github.com/arikko/maily-core-v2/commit/4693ea5))
- Simplify `IS_FALSE` operator check ([`071c968`](https://github.com/arikko/maily-core-v2/commit/071c968))
- Improve ref and prop handling in render ([`5a500e0`](https://github.com/arikko/maily-core-v2/commit/5a500e0))
- Replace `useEffect` with `setState` during render ([`70e1b3a`](https://github.com/arikko/maily-core-v2/commit/70e1b3a))
- Add missing hook dependencies ([`fd69075`](https://github.com/arikko/maily-core-v2/commit/fd69075))
- Add missing `type module` to render package ([`3c98e3e`](https://github.com/arikko/maily-core-v2/commit/3c98e3e))

### Blockquote

- Add blockquote node to core editor and renderer ([`fbd6c27`](https://github.com/arikko/maily-core-v2/commit/fbd6c27))
- Add blockquote editor styles to `_editor.css` ([`94eb575`](https://github.com/arikko/maily-core-v2/commit/94eb575))
- Add font style support to blockquote ([`55c1b66`](https://github.com/arikko/maily-core-v2/commit/55c1b66))
- Match blockquote render styles to editor ([`100bd77`](https://github.com/arikko/maily-core-v2/commit/100bd77))
- Correct margin bottom values per node type ([`e56f0f0`](https://github.com/arikko/maily-core-v2/commit/e56f0f0))

### Columns & Layout

- Use `UnitField` for column width inputs ([`42ce54f`](https://github.com/arikko/maily-core-v2/commit/42ce54f))
- Replace vertical alignment cycle with popover picker ([`b09cbe9`](https://github.com/arikko/maily-core-v2/commit/b09cbe9))
- Prioritize columns over section/button in selection rect ([`893b581`](https://github.com/arikko/maily-core-v2/commit/893b581))
- Import types from source files directly ([`46c522a`](https://github.com/arikko/maily-core-v2/commit/46c522a))

### Tooling

- Set `oxfmt` as default formatter per language ([`77d0e45`](https://github.com/arikko/maily-core-v2/commit/77d0e45))
- Add render audit comparing v2 vs old renderer ([`9a58954`](https://github.com/arikko/maily-core-v2/commit/9a58954))
- Bump dependencies ([`9f2fdaa`](https://github.com/arikko/maily-core-v2/commit/9f2fdaa))

---

## Week of Feb 10–16, 2026

### Visibility Rules

- Add shared visibility types and constants ([`f2e4128`](https://github.com/arikko/maily-core-v2/commit/f2e4128))
- Add visibility extension with hidden and condition attributes ([`d4350f7`](https://github.com/arikko/maily-core-v2/commit/d4350f7))
- Add headless `ConditionBuilder` to UI package ([`bd10a78`](https://github.com/arikko/maily-core-v2/commit/bd10a78))
- Add `Switch` component and `FieldLabel` render prop ([`65bc042`](https://github.com/arikko/maily-core-v2/commit/65bc042))
- Add `VisibilityConfig` and drag context menu integration ([`557c124`](https://github.com/arikko/maily-core-v2/commit/557c124))
- Add visibility rule icon indicator on nodes ([`e1849e2`](https://github.com/arikko/maily-core-v2/commit/e1849e2))
- Skip hidden blocks in render output ([`7b0580e`](https://github.com/arikko/maily-core-v2/commit/7b0580e))
- Rename `visibilityCondition` → `visibilityRule` ([`c507bd0`](https://github.com/arikko/maily-core-v2/commit/c507bd0))
- Remove visibility mode in favor of condition only ([`0a8dd85`](https://github.com/arikko/maily-core-v2/commit/0a8dd85))
- Rename hidden boolean to mode visibility enum ([`95cea9c`](https://github.com/arikko/maily-core-v2/commit/95cea9c))
- Use options arrays and add none action for visibility ([`8d66b78`](https://github.com/arikko/maily-core-v2/commit/8d66b78))
- Close drag context menu on copy to clipboard ([`d84d47f`](https://github.com/arikko/maily-core-v2/commit/d84d47f))
- Handle nullable value in condition builder action ([`c28f47b`](https://github.com/arikko/maily-core-v2/commit/c28f47b))

### Columns

- Exit columns on triple enter ([`e177cfa`](https://github.com/arikko/maily-core-v2/commit/e177cfa))
- Replace empty block when inserting columns from slash command ([`defd881`](https://github.com/arikko/maily-core-v2/commit/defd881))

### Misc

- Fix: block extra `{` in variable-only editor ([`f98d060`](https://github.com/arikko/maily-core-v2/commit/f98d060))
- Hide text bubble menu inside `htmlCodeBlock` ([`257c9d4`](https://github.com/arikko/maily-core-v2/commit/257c9d4))
- Allow variables in `htmlCodeBlock` content ([`ccfe662`](https://github.com/arikko/maily-core-v2/commit/ccfe662))
- Rename data node type ([`4f7781c`](https://github.com/arikko/maily-core-v2/commit/4f7781c))
- Use `data-node-type` and add content type ([`ef03c73`](https://github.com/arikko/maily-core-v2/commit/ef03c73))
- Correct `data-[checked]` prefix order in switch ([`f9a426f`](https://github.com/arikko/maily-core-v2/commit/f9a426f))
- Clean up editor root `onUpdate` and rename `EditorContext` ([`71eb083`](https://github.com/arikko/maily-core-v2/commit/71eb083))
- Close drag context menu on move up/down ([`14c672e`](https://github.com/arikko/maily-core-v2/commit/14c672e))
- Add dev-only JSON logging to demo app ([`2ae05d0`](https://github.com/arikko/maily-core-v2/commit/2ae05d0))

---

## Week of Feb 3–9, 2026

### Repeat Extension

- Add repeat extension for looping over data collections ([`2c256f5`](https://github.com/arikko/maily-core-v2/commit/2c256f5))
- Center repeat bubble menu on container ([`aed8121`](https://github.com/arikko/maily-core-v2/commit/aed8121))

### Text Direction (RTL/LTR)

- Add text direction support to button node ([`90bdb0e`](https://github.com/arikko/maily-core-v2/commit/90bdb0e))
- Fix button alignment on text direction change ([`4839d2f`](https://github.com/arikko/maily-core-v2/commit/4839d2f))
- Support RTL direction in button node view ([`03e0568`](https://github.com/arikko/maily-core-v2/commit/03e0568))
- Controlled/uncontrolled text direction in `EditorRoot` ([`e9e31f3`](https://github.com/arikko/maily-core-v2/commit/e9e31f3))
- Move text direction to drag handle context menu ([`72b9698`](https://github.com/arikko/maily-core-v2/commit/72b9698))

### Variable Editor

- Protect `{{` trigger in variable-only editor ([`92dfa77`](https://github.com/arikko/maily-core-v2/commit/92dfa77))
- Limit variable-only editor to single variable ([`012f0a1`](https://github.com/arikko/maily-core-v2/commit/012f0a1))
- Simplify variable-only editor text input handling ([`235812d`](https://github.com/arikko/maily-core-v2/commit/235812d))
- Deduplicate variable trigger constants to shared ([`ca80011`](https://github.com/arikko/maily-core-v2/commit/ca80011))

### Tooling & Infra

- Migrate formatter from Prettier to `oxfmt` ([`58af508`](https://github.com/arikko/maily-core-v2/commit/58af508))
- Rename tsconfig package to `@maily-to/tsconfig` ([`09c4839`](https://github.com/arikko/maily-core-v2/commit/09c4839))
- Add focus extension to main editor ([`44eb66e`](https://github.com/arikko/maily-core-v2/commit/44eb66e))
- Convert editor CSS to Tailwind utilities ([`139f8d1`](https://github.com/arikko/maily-core-v2/commit/139f8d1))
- Add `@tiptap/react` to catalog ([`3e116cc`](https://github.com/arikko/maily-core-v2/commit/3e116cc))
- Extract React email preview into separate component ([`f801b85`](https://github.com/arikko/maily-core-v2/commit/f801b85))
- Add curly brace rule and fix nullable alignment type ([`a2bc62c`](https://github.com/arikko/maily-core-v2/commit/a2bc62c))
- Bump dependencies ([`91570b7`](https://github.com/arikko/maily-core-v2/commit/91570b7))

---

## Week of Jan 27 – Feb 2, 2026

### Font Style System

- Add font style defaults to slash commands ([`4acae03`](https://github.com/arikko/maily-core-v2/commit/4acae03))
- Move font style settings to drag handle context menu ([`4ee5eab`](https://github.com/arikko/maily-core-v2/commit/4ee5eab))
- Rename typography commands ([`4b6f8e8`](https://github.com/arikko/maily-core-v2/commit/4b6f8e8))
- Simplify font style defaults lookup ([`5c7e669`](https://github.com/arikko/maily-core-v2/commit/5c7e669))
- Fix floating element z-index ([`3767f16`](https://github.com/arikko/maily-core-v2/commit/3767f16))
- Fix drag handle on resize ([`4907f3d`](https://github.com/arikko/maily-core-v2/commit/4907f3d))
- Fix drag handle positioning ([`80cd2b4`](https://github.com/arikko/maily-core-v2/commit/80cd2b4))

---

## Week of Jan 20–26, 2026

### Text Direction

- Initial text direction (RTL/LTR) implementation ([`f5633c5`](https://github.com/arikko/maily-core-v2/commit/f5633c5), [`73a2a62`](https://github.com/arikko/maily-core-v2/commit/73a2a62))
- Formatting and icon updates ([`0eef5db`](https://github.com/arikko/maily-core-v2/commit/0eef5db))
- Add oxlint configuration ([`b7ca6be`](https://github.com/arikko/maily-core-v2/commit/b7ca6be))

---

## Week of Jan 13–19, 2026

### Section & Columns

- Implement section node ([`2fa330c`](https://github.com/arikko/maily-core-v2/commit/2fa330c))
- Columns bubble menu improvements ([`fa9b7c9`](https://github.com/arikko/maily-core-v2/commit/fa9b7c9))

---

## Week of Dec 29, 2025 – Jan 4, 2026

### Columns

- Fix columns bubble menu ([`6b4e7d4`](https://github.com/arikko/maily-core-v2/commit/6b4e7d4))
- Column layout iteration ([`a88dc56`](https://github.com/arikko/maily-core-v2/commit/a88dc56), [`039078d`](https://github.com/arikko/maily-core-v2/commit/039078d), [`584d754`](https://github.com/arikko/maily-core-v2/commit/584d754), [`3352c5f`](https://github.com/arikko/maily-core-v2/commit/3352c5f))
- Fix linting issues ([`499ad5e`](https://github.com/arikko/maily-core-v2/commit/499ad5e))

---

## Week of Dec 22–28, 2025

### Drag Handle Context Menu

- Implement drag handle context menu ([`363ae4d`](https://github.com/arikko/maily-core-v2/commit/363ae4d), [`486f373`](https://github.com/arikko/maily-core-v2/commit/486f373), [`991068e`](https://github.com/arikko/maily-core-v2/commit/991068e))
- Hide bubble menus when drag handle context menu opens ([`6fb566a`](https://github.com/arikko/maily-core-v2/commit/6fb566a))
- Close context menu when drag starts ([`cc70fdf`](https://github.com/arikko/maily-core-v2/commit/cc70fdf))
- Fix dropdown menu interactions ([`1a4fd89`](https://github.com/arikko/maily-core-v2/commit/1a4fd89))
- Add context tooltip ([`634fa6a`](https://github.com/arikko/maily-core-v2/commit/634fa6a))

### Slash Commands

- Refactor slash command filtering ([`bc8d663`](https://github.com/arikko/maily-core-v2/commit/bc8d663))
- Refactor slash command navigation ([`2770539`](https://github.com/arikko/maily-core-v2/commit/2770539))
- Extract scroll-into-view logic and improve variable keyboard nav ([`6a0e97b`](https://github.com/arikko/maily-core-v2/commit/6a0e97b))
- Extract suggestion fader scroll logic into reusable hook ([`627ad13`](https://github.com/arikko/maily-core-v2/commit/627ad13))
- Add oxlint configuration ([`f3d5a3a`](https://github.com/arikko/maily-core-v2/commit/f3d5a3a))

---

## Week of Dec 15–21, 2025

### Bug Fixes

- Fix color swatch rendering ([`e0645a6`](https://github.com/arikko/maily-core-v2/commit/e0645a6))
- Fix grid layout issue ([`d285211`](https://github.com/arikko/maily-core-v2/commit/d285211))
- Fix hook placement ([`2ada413`](https://github.com/arikko/maily-core-v2/commit/2ada413))
- Fix build error ([`4c63137`](https://github.com/arikko/maily-core-v2/commit/4c63137))

---

## Week of Dec 1–14, 2025

### Slash Commands

- Slash command implementation and iteration ([`67a1da1`](https://github.com/arikko/maily-core-v2/commit/67a1da1), [`a020599`](https://github.com/arikko/maily-core-v2/commit/a020599), [`3064bd9`](https://github.com/arikko/maily-core-v2/commit/3064bd9))

### Button Bubble Menu

- Implement button bubble menu ([`449e642`](https://github.com/arikko/maily-core-v2/commit/449e642))
- Add button color reset ([`5ebea8c`](https://github.com/arikko/maily-core-v2/commit/5ebea8c))
- Add data type constant ([`0784d5d`](https://github.com/arikko/maily-core-v2/commit/0784d5d))

---

## Week of Nov 24–30, 2025

### Button Node

- Add button padding configuration ([`afa8566`](https://github.com/arikko/maily-core-v2/commit/afa8566))
- Add button border style ([`ee55f2d`](https://github.com/arikko/maily-core-v2/commit/ee55f2d))
- Button bubble menu iteration ([`acf15c5`](https://github.com/arikko/maily-core-v2/commit/acf15c5))

### Floating Element Stack

- Implement floating element stacking for nested menus ([`3846c21`](https://github.com/arikko/maily-core-v2/commit/3846c21), [`d6e9c07`](https://github.com/arikko/maily-core-v2/commit/d6e9c07))
- Fix bubble placement ([`52f1df5`](https://github.com/arikko/maily-core-v2/commit/52f1df5))

### Horizontal Rule

- Add horizontal rule node ([`650bcd2`](https://github.com/arikko/maily-core-v2/commit/650bcd2))
- Improve on-blur handling ([`0e2af6a`](https://github.com/arikko/maily-core-v2/commit/0e2af6a))

---

## Week of Nov 17–23, 2025

### Floating Element Stack

- Floating element stack architecture ([`4adf44c`](https://github.com/arikko/maily-core-v2/commit/4adf44c))

### Variable Bubble Menu

- Variable bubble menu implementation ([`0d822ce`](https://github.com/arikko/maily-core-v2/commit/0d822ce))
- Select node after update ([`12dd509`](https://github.com/arikko/maily-core-v2/commit/12dd509))
- Fix content change handling ([`d3d2c1c`](https://github.com/arikko/maily-core-v2/commit/d3d2c1c))
- Remove label on change ([`7b1e983`](https://github.com/arikko/maily-core-v2/commit/7b1e983))

### Field Interface

- Begin field interface design ([`f2dc69a`](https://github.com/arikko/maily-core-v2/commit/f2dc69a))
- Package upgrades ([`f68bdca`](https://github.com/arikko/maily-core-v2/commit/f68bdca))

---

## Week of Nov 3–9, 2025

### Renderer (initial)

- Begin HTML email renderer ([`c1d61c0`](https://github.com/arikko/maily-core-v2/commit/c1d61c0), [`5e3813e`](https://github.com/arikko/maily-core-v2/commit/5e3813e))
- Add mark rendering (bold, italic, links, etc.) ([`7462d46`](https://github.com/arikko/maily-core-v2/commit/7462d46))
- Render HTML output ([`c38a0a1`](https://github.com/arikko/maily-core-v2/commit/c38a0a1))
- Add helper functions for render pipeline ([`48fd358`](https://github.com/arikko/maily-core-v2/commit/48fd358))

### Spacer

- Add spacer node ([`3bde6df`](https://github.com/arikko/maily-core-v2/commit/3bde6df))
- Add spacer height drag handle ([`87f3bb4`](https://github.com/arikko/maily-core-v2/commit/87f3bb4))

### Shared Package

- Extract shared field components ([`02672d6`](https://github.com/arikko/maily-core-v2/commit/02672d6))
- Refactor variable selected style ([`30fb14e`](https://github.com/arikko/maily-core-v2/commit/30fb14e))

---

## Week of Oct 27 – Nov 2, 2025

### Image Styling

- Add image border style configuration ([`c2aadd1`](https://github.com/arikko/maily-core-v2/commit/c2aadd1))
- Update border style icons ([`0220f61`](https://github.com/arikko/maily-core-v2/commit/0220f61))
- Enhance resizable image attributes ([`33156f6`](https://github.com/arikko/maily-core-v2/commit/33156f6))

### Horizontal Rule

- Add horizontal rule color and styling ([`74f0a34`](https://github.com/arikko/maily-core-v2/commit/74f0a34))

### Bug Fixes

- Fix initial focus behavior ([`53f0c50`](https://github.com/arikko/maily-core-v2/commit/53f0c50))
- Add color swatch and border color ([`3979685`](https://github.com/arikko/maily-core-v2/commit/3979685))

---

## Week of Oct 20–26, 2025

### Unit Field Component

- Build `UnitField` compound component (Root, Input, DragArea) ([`0acc77d`](https://github.com/arikko/maily-core-v2/commit/0acc77d), [`9c43ed9`](https://github.com/arikko/maily-core-v2/commit/9c43ed9), [`9b27912`](https://github.com/arikko/maily-core-v2/commit/9b27912))
- Add context-based state management ([`5887242`](https://github.com/arikko/maily-core-v2/commit/5887242))
- Add drag-to-adjust value functionality ([`c0608a1`](https://github.com/arikko/maily-core-v2/commit/c0608a1))
- Add keyboard interactions and accessibility ([`5c059a3`](https://github.com/arikko/maily-core-v2/commit/5c059a3))
- Enhance unit field with popover positioning ([`c9a7802`](https://github.com/arikko/maily-core-v2/commit/c9a7802))
- Unify props structure ([`2b248cf`](https://github.com/arikko/maily-core-v2/commit/2b248cf))

### Image Bubble Menu

- Enhance image style popover with unit field integration ([`ca8f8c1`](https://github.com/arikko/maily-core-v2/commit/ca8f8c1))
- Refactor multi-unit field for border radius ([`9d67f23`](https://github.com/arikko/maily-core-v2/commit/9d67f23))
- Always call value change ([`061424d`](https://github.com/arikko/maily-core-v2/commit/061424d))

---

## Week of Oct 13–19, 2025

### Unit Field (early)

- Initial unit field prototyping ([`9d6746b`](https://github.com/arikko/maily-core-v2/commit/9d6746b))
- Drag handle integration with unit field ([`94f1be6`](https://github.com/arikko/maily-core-v2/commit/94f1be6))

---

## Week of Oct 6–12, 2025

### Image System

- Build image bubble menu ([`9a41c1f`](https://github.com/arikko/maily-core-v2/commit/9a41c1f), [`ea8fadd`](https://github.com/arikko/maily-core-v2/commit/ea8fadd))
- Add image metadata support (alt text, link) ([`4badeca`](https://github.com/arikko/maily-core-v2/commit/4badeca), [`67defe6`](https://github.com/arikko/maily-core-v2/commit/67defe6))
- Add shared image utilities ([`711fa94`](https://github.com/arikko/maily-core-v2/commit/711fa94))

### Drag Handle

- Implement drag handle plugin ([`5f1b5af`](https://github.com/arikko/maily-core-v2/commit/5f1b5af))
- Hide bubble menus on drag ([`49d2252`](https://github.com/arikko/maily-core-v2/commit/49d2252))

### Variable Extension

- Add variable fader for suggestion list ([`8ec3ceb`](https://github.com/arikko/maily-core-v2/commit/8ec3ceb))
- Variable extension iteration ([`b9afeb7`](https://github.com/arikko/maily-core-v2/commit/b9afeb7))
- Text field popover ([`e872896`](https://github.com/arikko/maily-core-v2/commit/e872896), [`ce43109`](https://github.com/arikko/maily-core-v2/commit/ce43109))
- Fix resize and scroll handle ([`fc2e14a`](https://github.com/arikko/maily-core-v2/commit/fc2e14a))
- Fix import type usage ([`9514439`](https://github.com/arikko/maily-core-v2/commit/9514439), [`d6232ee`](https://github.com/arikko/maily-core-v2/commit/d6232ee))

---

## Week of Sep 29 – Oct 5, 2025

### Core Editor Foundation

- Add resizable image node ([`cdda024`](https://github.com/arikko/maily-core-v2/commit/cdda024))
- Add controlled floating menu system ([`cdb7c13`](https://github.com/arikko/maily-core-v2/commit/cdb7c13))
- Build bubble menu with arrow positioning ([`d3ce76e`](https://github.com/arikko/maily-core-v2/commit/d3ce76e))
- Implement link popover ([`1808244`](https://github.com/arikko/maily-core-v2/commit/1808244))
- Build color picker with swatches ([`55eaac1`](https://github.com/arikko/maily-core-v2/commit/55eaac1), [`1612a2d`](https://github.com/arikko/maily-core-v2/commit/1612a2d))
- Add text alignment support ([`f6b1c08`](https://github.com/arikko/maily-core-v2/commit/f6b1c08), [`14039c6`](https://github.com/arikko/maily-core-v2/commit/14039c6))
- Add text style color and background controls ([`512caad`](https://github.com/arikko/maily-core-v2/commit/512caad))
- Add highlight color ([`108602a`](https://github.com/arikko/maily-core-v2/commit/108602a))
- Add inline paragraph variables ([`24a28c5`](https://github.com/arikko/maily-core-v2/commit/24a28c5))
- Simplify color picker API ([`5783a44`](https://github.com/arikko/maily-core-v2/commit/5783a44))
- Configure Tailwind CSS build for library output ([`0c0459c`](https://github.com/arikko/maily-core-v2/commit/0c0459c))
- Fix accidental focus ([`08e2034`](https://github.com/arikko/maily-core-v2/commit/08e2034))

---

## Week of Sep 22–28, 2025

### Project Bootstrap

- Initialize Turbo monorepo with pnpm ([`4d4dca1`](https://github.com/arikko/maily-core-v2/commit/4d4dca1), [`4a87db4`](https://github.com/arikko/maily-core-v2/commit/4a87db4), [`9e2665f`](https://github.com/arikko/maily-core-v2/commit/9e2665f), [`aaed9d4`](https://github.com/arikko/maily-core-v2/commit/aaed9d4))
- Set up package structure and project scaffolding ([`395f975`](https://github.com/arikko/maily-core-v2/commit/395f975))
- Build initial bubble menu prototype ([`122f8e9`](https://github.com/arikko/maily-core-v2/commit/122f8e9))
- Add turn-into dropdown for block type switching ([`37ff544`](https://github.com/arikko/maily-core-v2/commit/37ff544))
- Set up Base UI primitives integration ([`173189a`](https://github.com/arikko/maily-core-v2/commit/173189a))
- Add initial styling foundation ([`6f30c94`](https://github.com/arikko/maily-core-v2/commit/6f30c94))

---

_480 commits across 23 weeks of development (Sep 2025 – Mar 2026)_
