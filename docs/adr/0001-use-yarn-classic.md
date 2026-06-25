# ADR 0001 - Use Yarn Classic 1.22.22

## Status

Accepted

## Decision

Use Yarn Classic 1.22.22 with workspaces.

## Reason

The project owner prefers Yarn Classic, and it is stable and familiar.

## Consequence

Do not use the `workspace:*` protocol. Internal dependencies should use matching package versions such as `0.1.0`.
