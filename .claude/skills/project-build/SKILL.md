---
name: project-build
description: Build a repository from its ProjectPlan.md, one item at a time — plan, offer a solution, build it, verify it, finish it. Companion to /project-startup, which writes ProjectPlan.md; run this afterward, and again in later sessions for the next item.
disable-model-invocation: true
---

# Project Build

Take the next open item in `ProjectPlan.md` through five steps — **plan, offer
solution, build, verify, finish** — under the ruleset `/project-startup`
already wrote. This skill does not decide policy; `AGENTS.md` and `rules/`
already did. It executes against them.

Manual-invocation only, same reasoning as `/project-startup`: it writes code
and commits, so it runs when you say so.

## Before anything else

Read `CLAUDE.md` (a thin `@AGENTS.md` import) and follow `AGENTS.md`'s routing
table into whatever `rules/*.md` the current item touches — this session is
bound by that ruleset, not by generic defaults. Read `ProjectPlan.md`. If it
does not exist, say so and stop: it is written by `/project-startup` Phase 11,
and there is nothing to resume without it.

**Carry the infer-nothing discipline forward.** `/project-startup` would not
state a business fact the user never gave it; this skill will not invent
behavior the requirement, the ruleset, or the user never specified. Where the
plan step surfaces something genuinely unknown, ask — do not pick the likely
reading and keep going.

## Resuming

Find the first item in `ProjectPlan.md` whose `Status` is not `done`. Its
`Status` says exactly which of the five steps to resume at — do not redo a
step already recorded, and do not restart from `not started` if the file says
`building`.

Ask how many items to attempt this session before starting; default to one if
the user doesn't say. Small, verifiable steps are the point — see
`.claude/skills/project-startup/references/planning.md` for why items are
sized the way they are.

## The five-step cycle

Full mechanics, the verdict points, and what each `ProjectPlan.md` field
should hold at each step: `references/build-cycle.md`.

In brief, per item: restate what it builds and name the approach before
touching any code (**plan**); propose that approach concretely and get an
explicit verdict before building it (**offer solution**); implement only the
approved approach (**build**); run the project's verification command and show
the result, not an assertion (**verify**); record the outcome and stop or
continue (**finish**).

## When verification fails

Do not mark the item done. Fix and re-verify, or — if the approach itself was
wrong, not just the implementation — go back to **plan** with what was
learned. After a couple of failed attempts, stop and ask rather than
continuing to iterate quietly; a session that keeps trying without saying so
is the "correcting over and over" failure pattern, not persistence.

## When blocked

Stop and ask. A blocked item left half-built with an invented workaround is
worse than one left at `not started` with a clear note of what's missing.

## Ending a session

Update `ProjectPlan.md`'s status line to say how many items are done and what
is next. Tell the user running `/project-build` again resumes from exactly
where this session stopped.
