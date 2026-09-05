# project-starter

A kit that gets copied into *other* repositories. Nothing here runs on its own —
the deliverable is `.claude/` plus `input/`, and the test of a change is whether
it still works after being pasted into an unrelated repo.

## Commands

| Task | Command |
|---|---|
| Verify a generated ruleset | `node .claude/hooks/check-ruleset.mjs` |
| Test the hook against a fixture | run it from a directory containing `CLAUDE.md` + `rules/` |

The hook exits 0 when there is no `CLAUDE.md` to check, so running it in this
repo passes trivially. Test it against a fixture, not here.

## Rules

**Paths stay relative.** Every path in the skill and the agents is resolved in
the target repository, not this one. An absolute path works here and breaks the
moment the kit is pasted somewhere else.

**No project-specific content in `references/`.** Rule ids, commands, file
names, stack details. These files are read while generating a ruleset for a
project that is not this one, and a leaked example reads as a prescription —
a template saying `(GIT1)` puts `GIT1` into a repo where no such rule exists.
Illustrations must be visibly generic.

**Phase numbers appear in four places** — `SKILL.md`, the `## References` list
at its end, the header of each reference file, and `README.md`. Renumbering a
phase means changing all four. They have drifted before.

**The kit ships enforcement, so it must pass its own bar.** A rule the skill
would classify at `hook` tier needs a hook here too, or it gets downgraded.
The kit teaching verification while having none was a real defect.

## Editing the skill

`SKILL.md` is the process. `references/*.md` are loaded on demand by the phase
that needs them — keep them self-contained, since a reference file is often
read without `SKILL.md` in context.

Prefer adding to a reference file over adding to `SKILL.md`. `SKILL.md` is
loaded whenever the skill is invoked and pays rent on the whole run.

## Context

When compacting, preserve: which files have been edited this session, and any
phase renumbering in progress along with the four places it must land.
