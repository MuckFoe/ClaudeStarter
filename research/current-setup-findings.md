# Current setup — findings

Survey of `project-starter` as it exists right now. Originally written
2026-09-06 against `main` @ `3989f7a` with a clean working tree. Since then, in
the same session, two rounds of edits landed on top of that commit, still
uncommitted: (1) a phase-numbering fix plus the new `baseline` domain,
`project-build` skill, and Phase 11/`ProjectPlan.md`, and (2) a portability fix
plus an `AGENTS.md`/`CLAUDE.md` split, made in response to this file's own
findings and a round of best-practices research. This revision describes the
tree as it stands now — findings below that were fixed mid-session are marked
so, not silently dropped, since the point of this file is to not have to
re-derive what was already checked.

## What this repo is

A copy-pasteable kit for other repositories. Nothing in it runs standalone; the
deliverable is `.claude/` + `input/`, and correctness is judged by "does it still
work after being pasted into an unrelated repo." Confirmed by `CLAUDE.md` and
`README.md` — both explicit about this.

## File inventory

```
.claude/
  agents/
    input-analyst.md        Phase 1 subagent — reads input/, writes input/_analysis.md
    ruleset-reviewer.md     Phase 10 subagent — adversarial review, fresh context
  hooks/
    check-ruleset.mjs       Stop hook — validates ruleset internal consistency
  settings.json             starter permissions (allow/ask/deny) + Stop hook wiring
  settings.local.json       untracked (gitignored), currently holds leftover
                            permissions from a prior manual hook test in a scratch dir
  skills/
    project-startup/
      SKILL.md              the 11-phase process, ~315 lines
      references/
        ingestion.md        Phase 1 spec: infer-nothing protocol, citation format
        requirements.md     Phase 4 spec: the five-point clarity bar
        rule-catalog.md     Phase 5/6 spec: baseline defaults, candidate domains
        templates.md        Phases 3/4/5/7/11 spec: exact file shapes for every output
        harness.md          Phase 8 spec: permissions, hooks, subagents, MCP, plugins
        planning.md         Phase 11 spec: reconciling goals, sequencing ProjectPlan.md
    project-build/
      SKILL.md              the five-step build cycle, resumes from ProjectPlan.md
      references/
        build-cycle.md      plan → offer solution → build → verify → finish, in detail
.gitignore                   OS/editor noise + settings.local.json
CLAUDE.md                    this kit's own project rules (meta — governs editing the kit)
README.md                    install + run instructions, mirrors SKILL.md phases at a glance
input/README.md              instructions for whoever drops documents into input/
research/                    this file and the best-practices research it's checked against
```

`project-build/` and `references/planning.md` are new since the original
snapshot — `/project-startup` used to hand off to implementation directly from
Phase 10; it now ends by sequencing a `ProjectPlan.md` (Phase 11) that a
separate `/project-build` skill executes. Still no `package.json`, no CI
config, no test fixtures directory — consistent with being a docs-only kit.

## The process, in one pass

11 phases now (was 10 at the original snapshot). Phases 1–2 are delegated to
subagents so raw documents/repo survey never enter the interview context;
phases 3–11 run as a conversation under two constraints that never bend:
**every rule gets an individual verdict** (accept/edit/reject/defer/record —
never a batch), and **nothing about the target project is inferred** (gaps
become questions, not answers). Phase 5 now always proposes a pre-drafted
`baseline` domain first — five universal-default rules (evidence over
assertion, confirm before irreversible actions, ask rather than infer, prune
stale rules, scope investigation into subagents) confirmed rather than
elicited from scratch, still one verdict each. Phase 11, the new last phase,
reconciles any goal that came into focus during the ruleset conversation into
`REQUIREMENTS.md` and sequences the open items into `ProjectPlan.md`, which the
companion `/project-build` skill then executes one item at a time (plan →
offer solution → build → verify → finish).

Output is a portable `rules/*.md`, an `AGENTS.md` router, a thin `CLAUDE.md`
entry point, plus `REQUIREMENTS.md`, `ProjectPlan.md`, `docs/concepts.md`, and
decision/progress logs. Verified by `check-ruleset.mjs`, which runs as a Stop
hook so a session can't end on a broken ruleset — it checks structural
invariants (router line cap, no eager `@rules/*` imports, cited paths exist,
Always-block rule ids resolve, `CLAUDE.md` actually imports `AGENTS.md` when
one exists, logs present) rather than completeness, so it never blocks a
half-finished run.

**The router is `AGENTS.md`, not `CLAUDE.md` — a design change made this
session.** At the original snapshot the router *was* `CLAUDE.md` directly.
Forum/web research turned up `AGENTS.md` as a now-widely-adopted (60k+ repos,
Linux Foundation-stewarded, 30+ tools including Claude Code) cross-tool
convention for exactly this content, with the documented interop pattern being
a `@AGENTS.md` import inside a thin `CLAUDE.md`. The kit was changed to match:
`AGENTS.md` now holds everything the old `CLAUDE.md` template held (identity,
commands, Always block, routing table, bindings), and `CLAUDE.md` is generated
as `# <Project name>\n\n@AGENTS.md` and nothing else, unless something is
genuinely Claude-Code-specific. `check-ruleset.mjs` enforces the link: it fails
if `AGENTS.md` exists but `CLAUDE.md` doesn't import it, since Claude Code
reads `CLAUDE.md`, not `AGENTS.md`, and a missing import means the router
silently never loads for a Claude Code session. Verified against two ad hoc
fixtures (not committed): missing import → exit 2 with that exact message;
import present → exit 0.

Separately deliberate, documented deviation (unchanged): Claude Code's own
guidance puts on-demand knowledge in skills (harness-loaded automatically);
this kit instead puts domain rules in `rules/*.md` reached through a
hand-maintained routing table in `AGENTS.md`, trading harness-level loading for
portability (a `rules/` folder lifts whole into the next repo) and
human-readable/editable triggers.

## Consistency check: phase numbers (CLAUDE.md's own stated risk) — RESOLVED

`CLAUDE.md` warns explicitly: *"Phase numbers appear in four places —
`SKILL.md`, the `## References` list at its end, the header of each reference
file, and `README.md`. Renumbering a phase means changing all four. They have
drifted before."*

**At the original snapshot** (`main` @ `3989f7a`), `requirements.md` and
`rule-catalog.md` were missing their own phase number in the header — a real,
localized instance of the drift the project's own rules warn about.

**As of this revision**, both are fixed (independently, mid-session, before
this file was updated to say so): `requirements.md` now opens "Runs in Phase
4, after..."; `rule-catalog.md` now opens "Read during Phase 5 (domain
selection) and Phase 6 (elicitation)." Re-checked all four locations against
the current 11-phase numbering:

| Reference file | Owning phase (per SKILL.md References list) | Phase number present in the file's own header/intro? |
|---|---|---|
| `references/ingestion.md` | Phase 1 | ✅ "Run by the `input-analyst` subagent (Phase 1)" |
| `references/requirements.md` | Phase 4 | ✅ "Runs in Phase 4, after the business background is settled..." |
| `references/rule-catalog.md` | Phase 5, Phase 6 | ✅ "Read during Phase 5 (domain selection) and Phase 6 (elicitation)." |
| `references/templates.md` | Phases 3, 4, 5, 7, 11 | ✅ "Exact shapes for the files this skill writes (Phases 3, 4, 5, 7 and 11)" |
| `references/harness.md` | Phase 8 | ✅ "Runs after the ruleset is written (Phase 8)" |
| `references/planning.md` | Phase 11 | ✅ "Runs in Phase 11, the last phase of `/project-startup`..." |

`SKILL.md`'s phase headers (`### Phase 1` … `### Phase 11`) and its
`## References` list are internally consistent with each other and with
`README.md`'s one phase citation (Phase 8). The agents' descriptions
(`input-analyst.md` → Phase 1, `ruleset-reviewer.md` → Phase 10) also agree.
All four locations are now consistent — nothing currently drifted, on this
axis at least.

## Portability check: references/ content

Scanned `references/*.md` for leaked project-specifics (rule ids, commands, file
names, stack details) per the "No project-specific content in references/" rule.
No concrete rule ids like the `GIT1` example in `CLAUDE.md` were found. One
borderline case worth a second look rather than a fix: `templates.md` illustrates
the ID-naming convention with `VER3 in verification, SEC1 in security` — these
are domain names drawn from the kit's own generic catalog (`rule-catalog.md`
defines `verification` and `security` as universal domains), not specifics of any
one generated project, so they read as scheme illustration rather than a leaked
example ruleset. Flagging it because it's structurally the same shape as the
anti-pattern `CLAUDE.md` calls out, even though the content itself isn't
project-specific.

`harness.md` names `gh` as a specific CLI tool by name (for GitHub work). Judged
not a violation — it's a universally-applicable tool, not a stack/project detail
— but noting it since "illustrations must be visibly generic" is a stated bar.

Re-scanned after this session's additions (`baseline` domain in
`rule-catalog.md`, `planning.md`, `project-build/references/build-cycle.md`,
the new `AGENTS.md`/`CLAUDE.md` template sections): no leaks found. The
`baseline` rules are explicitly framed as universal defaults with no
per-project evidence, which is the one place a citation-free rule is
intentional rather than a sign of drift.

## Harness self-consistency (the "kit ships enforcement" rule)

`CLAUDE.md` requires: *"A rule the skill would classify at `hook` tier needs a
hook here too, or it gets downgraded."* This kit's structural claims needing
enforcement are (1) "the generated ruleset must stay internally consistent"
and, as of this session, (2) "if `AGENTS.md` exists, `CLAUDE.md` must import
it." Both are covered by `check-ruleset.mjs` + the `Stop` hook in
`settings.json`. No other hook-tier claims exist in this repo's own rules, so
there's nothing else to check enforcement for right now.

**Portability fix made this session:** `settings.json`'s Stop hook command and
its matching `allow` permission entry both used to invoke the hook with a bare
relative path (`node .claude/hooks/check-ruleset.mjs`). Best-practices research
had already flagged this exact pattern — citing `anthropics/claude-code#18200`,
relative permission patterns not reliably matching Claude Code's actual
(absolute) internal tool invocations — as a documented sharp edge for any
`settings.json` meant to be pasted into other repos, with `${CLAUDE_PROJECT_DIR}`
as the documented fix. Both spots now use
`node ${CLAUDE_PROJECT_DIR}/.claude/hooks/check-ruleset.mjs`. `harness.md`
(Phase 8's reference) was also given a line teaching this forward, so every
ruleset this kit generates writes its own hooks the same way rather than
reintroducing the same gotcha per project.

## Gaps / things worth knowing before changing anything

- **No committed test fixture for the hook.** `CLAUDE.md` says to test
  `check-ruleset.mjs` "against a fixture, not here," but there's still no
  `fixtures/` or similar checked in. This session ran two more ad hoc fixtures
  in a scratch temp directory (one exercising the new AGENTS.md-import check
  missing, one with it present) — both behaved correctly (exit 2 / exit 0) —
  but nothing was persisted, same gap as before. Anyone re-verifying the hook
  still has to reconstruct a fixture from scratch.
- **`settings.local.json` has stale permissions.** Unchanged from the original
  snapshot: it only contains allow rules from an earlier scratch hook-test
  session (a `mkdir`, `cat`, a `node` invocation with an absolute path, an
  `echo`). Harmless (gitignored, local-only) but not representative of
  anything durable.
- **No CI.** Consistent with "documentation only" repo status. This repo's own
  root `CLAUDE.md` still exists, so `check-ruleset.mjs` doesn't take the "no
  CLAUDE.md" early exit here — confirmed again after this session's changes:
  `node ${CLAUDE_PROJECT_DIR}/.claude/hooks/check-ruleset.mjs` still exits `0`
  against this repo's own meta files, via the same vacuous-pass path as before
  (no `AGENTS.md`, no `rules/`, under 200 lines).
- **Working tree is not clean.** Unlike the original snapshot, there are now
  nine modified tracked files and three untracked additions
  (`.claude/skills/project-build/`, `references/planning.md`, `research/`) —
  none committed. Anyone picking this up should treat the working tree, not
  `origin/main` @ `3989f7a`, as the current state of the kit.

## Not investigated

- Git history beyond the two commits shown by `git log` (`a26dd2b` initial kit,
  `3989f7a` harness + internal-consistency fixes) — no deeper archaeology done.
  All changes described above are uncommitted working-tree edits on top of
  `3989f7a`, not a new commit.
- Reddit-specific community discussion of project-starter-style kits. Multiple
  access paths were tried this session (direct fetch of reddit.com/old.reddit.com,
  a domain-restricted search, the pullpush.io mirror API, four redlib
  privacy-frontend instances) and all were blocked, rate-limited, or behind
  anti-bot challenges — no genuine Reddit content was retrieved through any of
  them. The AGENTS.md and spec-driven-development findings above came from
  non-Reddit web sources instead.
