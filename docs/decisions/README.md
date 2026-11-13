# Decision records

One file per bigger decision: hard to reverse, or something that would surprise someone reading the code. See "Decision records" in [AGENTS.md](../../AGENTS.md) for when to write one.

## Index

| No.                          | Decision                                       | Status   | Date       |
| ---------------------------- | ---------------------------------------------- | -------- | ---------- |
| [0001](0001-demo-account.md) | Keep a shared demo account, allowed by its UID | Accepted | 2026-11-13 |

## Template

Copy this into `NNNN-short-title.md` with the next number, and add a row to the index.

```md
# NNNN: Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Issue: #NN

## Context

What problem or situation forces a choice.

## Decision

What we do, in one or two sentences.

## Why

The reasons that decided it.

## Alternatives considered

- Option: why not.

## Consequences

What changes, what it costs, what to watch.
```
