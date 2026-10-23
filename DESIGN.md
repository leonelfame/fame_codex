---
name: Fame Codex
description: Compact terminal-style desktop controls for the Codex and ChatGPT bridge.
colors:
  ground: "#0b1017"
  navigation: "#101821"
  elevated: "#172230"
  accent: "#8dbbff"
  text-primary: "#d2dce8"
  text-secondary: "#a9b8ca"
  text-tertiary: "#8e9fb4"
  border: "#334357"
  border-light: "#222f3f"
  nav-selected: "#1c304d"
  nav-selected-text: "#c6ddff"
  nav-selected-border: "#6288bc"
  nav-hover: "#17273d"
  nav-hover-text: "#d4e5ff"
  button-primary: "#97c0ff"
  button-primary-text: "#0b1525"
  button-primary-border: "#83b0ee"
  button-primary-hover: "#bedaff"
  button-secondary-hover: "#15263c"
  button-secondary-hover-border: "#80a7db"
  field: "#070d15"
  field-border: "#3c5576"
  mode-selected: "#14243a"
  notice: "#172332"
  success: "#40c977"
  warning: "#ff8549"
  error: "#ff6764"
typography:
  title:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  setting-label:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  supporting:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  status:
    fontFamily: "\"Cascadia Mono\", \"Consolas\", \"SFMono-Regular\", \"Menlo\", \"Meiryo\", monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  square: "0px"
spacing:
  tight: "4px"
  nav-gap: "2px"
  small: "8px"
  frame-inset: "12px"
  row-gap: "18px"
  pane-inline: "20px"
components:
  button-primary:
    backgroundColor: "{colors.button-primary}"
    textColor: "{colors.button-primary-text}"
    rounded: "{rounded.square}"
    padding: "0 14px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.square}"
    padding: "0 11px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.square}"
    height: "30px"
    padding: "0 10px"
  nav-selected:
    backgroundColor: "{colors.nav-selected}"
    textColor: "{colors.nav-selected-text}"
    rounded: "{rounded.square}"
    height: "30px"
    padding: "0 9px"
  mode-card:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.square}"
    padding: "12px"
  switch-on:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.square}"
    width: "42px"
    height: "30px"
  dev-badge:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.square}"
    height: "18px"
    padding: "0 6px"
  statusbar:
    backgroundColor: "{colors.navigation}"
    textColor: "{colors.text-tertiary}"
    height: "26px"
    padding: "0 12px"
---

# Design System: Fame Codex
## Overview

**Creative North Star: "Terminal/TUI"**

The user-requested Terminal/TUI replacement, with their latest blue color preference, uses installed monospace fonts, near-black blue-tinted surfaces, pale blue accents, square controls, and thin frames. Numbered horizontal navigation leads to a full-width work pane; a compact footer reports actual profile, surface, browser state, and version.

Keep the Fame Codex name and existing logo, with DEV visibly distinct. The interface is media-free and uses no remote fonts, glow, blur, or decorative texture. Smaller windows and reduced RAM/CPU overhead are confirmed priorities; no end-to-end resource reduction is claimed without measurement.

**Key Characteristics:**
- Numbered text navigation and real Alt+1?6 shortcuts.
- Full-width framed pane with a real status footer.
- Square controls, text switches, and installed monospace fonts.

## Colors

Pale blue marks selection, focus, headings, and enabled switches against near-black blue-tinted neutrals. Primary actions use a filled blue surface with dark text; secondary actions stay transparent with a thin frame. Body text uses three pale neutral roles. Green, orange, and red retain semantic success, warning, and error meaning. Frontmatter records the shipped values, including local component overrides.

**The Real State Rule.** Display runtime and profile values from application state; do not invent telemetry or pretend commands.

## Typography

Use the installed Cascadia Mono / Consolas / SFMono-Regular / Menlo / Meiryo stack. Monospace is an explicit user requirement for this world. Surface titles use the title role; settings labels use the medium-weight setting-label role, descriptions use supporting, controls use control, and the footer uses status. The welcome title is a 24px exception; wizard headings use 14px. Do not download fonts.

## Layout

The shell is one full-width column: 40px titlebar, wrapping horizontal navigation, flexible workspace, and 26px footer. Initial window dimensions are 880?640; the minimum is 640?520. The former sidebar width token remains in source but does not define the shipped topology.

Navigation items are 30px tall. The workspace has a 12px outer inset and a thin frame around the scrolling content; the content uses 18px top, 20px horizontal, and 24px bottom padding. Settings rows are at least 52px tall with an 18px column gap. Interaction choices share a divided two-column frame.

At 680px or below navigation becomes a toggleable tray beneath the titlebar, closed controls are inert, the outer inset becomes 8px, and content padding becomes 14px by 12px. The footer hides its shortcut hint. At 460px or below the plugin row and interaction choices stack. The embedded ChatGPT page remains a native browser surface.

## Elevation & Depth

Use flat tonal surfaces and thin frames. Terminal overrides remove cast shadows from menus, tooltips, dialogs, reminders, and text switches. Focus uses a 1px pale-blue outline with a 2px offset, rather than a glow.

**The Thin Frame Rule.** Use square corners, tonal surfaces, and thin borders to separate controls and panes; do not add glow or decorative blur.

Page and tray changes are immediate; micro and panel duration tokens are zero. Functional loading indicators remain. The inherited primary-button press still moves 0.5px over 100ms; this is recorded behavior, not a decorative-motion prescription. Respect reduced-motion preferences.

## Shapes

Every radius token is zero. Controls, input frames, mode choices, badges, tabs, and menus use square corners. Small circular runtime/loading indicators remain functional exceptions. Borders are thin, generally 1px; selected navigation changes its border as well as fill and text.

## Components

- **Navigation:** horizontal numbered text buttons with bracketed numbers, selected fill/border, and actual Alt+1 through Alt+6 shortcuts for Browser, Setup, MCP, Activity, Limits, and Settings. Shortcuts leave editing in inputs, textareas, selects, and editable content alone.
- **Buttons:** filled blue primary actions and transparent framed secondary actions; hover changes fill and border. Common minimum height is 30px. Disabled controls reduce opacity. Keyboard focus follows the shared outline.
- **Inputs:** dark inset fill, thin muted-blue border, 30px height, 10px horizontal padding, and the common monospace stack.
- **Mode choices:** adjacent radio buttons share a square frame and divider; the selected option has a darker blue fill and check mark.
- **Switches:** real buttons with switch semantics and `[x]` / `[ ]` text; enabled text uses the accent. Tracks and sliding thumbs are absent.
- **Profile badge:** square, transparent, accent-framed DEV marker beside the retained logo and product name.
- **Status footer:** actual profile/surface, browser status or idle fallback, shortcut hint, and application version. Values are read from state; component previews illustrate their layout only.
- **MCP steps:** square numbered steps and framed active selection; actions remain pinned in the wizard footer.

## Do's and Don'ts

### Do:

- Do retain the existing logo and clearly identify DEV.
- Do use the installed monospace stack throughout the terminal shell.
- Do preserve visible keyboard focus and semantic switch, radio, and navigation states.
- Do keep the framed pane usable in the minimum desktop window.

### Don't:

- Don't restore the persistent left-sidebar composition.
- Don't add remote fonts, tutorial media, decorative texture, glow, or blur.
- Don't fabricate status data or display nonfunctional command prompts.
- Don't report RAM/CPU savings from layout or bundle size alone.

Source grounding: `launcher/src/tokens.css`, `styles.css`, and the final `terminal.css` overrides; behavior is grounded in `App.tsx` and `useLimits.ts`. Limits refresh every 10 seconds on the visible Limits page and every 60 seconds elsewhere; hidden windows stop reads and manual mode has no repeated polling. These are implemented schedules, not measured RAM/CPU results. Superseded slate/mint sidebar guidance is intentionally replaced by the user's explicit terminal request.
