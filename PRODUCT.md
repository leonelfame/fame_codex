# Fame Codex

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers running Codex through their authenticated ChatGPT session. The current user tests locally on Windows before releasing builds on GitHub.

## Product Purpose

Provide a desktop bridge between Codex tasks, ChatGPT, and an MCP tunnel, with an isolated DEV profile for testing.

## Operating Context

Electron hosts a React interface and an embedded ChatGPT browser. Setup, MCP, Activity, Limits, and Settings manage the bridge. DEV and production profiles must stay isolated.

## Capabilities and Constraints

Preserve existing controls, account sessions, tool approvals, runtime supervision, connector names, and localization. The user confirmed a small window and lower RAM/CPU use as priorities. Do not sacrifice the live tunnel or correctness for resource savings. Resource improvements require evidence; a compact layout alone does not prove lower memory use.

## Brand Commitments

Keep the Fame Codex name and existing logo. DEV must remain visibly distinguishable.

The user explicitly requested a replacement Terminal/TUI theme with blue-toned text, monospace typography, compact text navigation and squared controls. Keep the media-free approach and prioritize RAM/CPU overhead.

## Product Principles

- Make frequent controls easy to find in a small desktop window.
- Avoid decorative work and unnecessary background updates.
- Preserve working behavior and safe separation between profiles.
- Describe measured results without inventing performance claims.
