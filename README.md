# Project starter

A copy-pasteable kit that builds a project's agent ruleset **and its harness**
by interview. Drop it into a new repository, put whatever documents you have
into `input/`, and run it.

## Install

Copy the contents of this folder into the root of the target repository:

```
.claude/skills/project-startup/     the skill
.claude/agents/                     input-analyst, ruleset-reviewer
.claude/hooks/check-ruleset.mjs     verifies the generated ruleset
.claude/settings.json               starter permissions + the Stop hook
input/                              your documents go here
```

Nothing else is needed. Everything the run produces — `CLAUDE.md`, `rules/`,
`docs/concepts.md`, `REQUIREMENTS.md` — is generated during the interview, not
shipped as a template to fill in.

The shipped `settings.json` allows read-only inspection, asks before commits
and installs, and denies reading `.env` files and private keys. Phase 8 extends
it with whatever this project actually needs.

## Run

```
/project-startup
```

The skill is manual-invocation only. It writes files and asks a lot of
questions, so it runs when you say so and not because something looked
relevant.

## What it does

**Phases 1–2 run in subagents** so the documents and the repository survey never
enter the interview's context. Everything after that is a conversation.

1. **Reads `input/`** completely and writes `input/_analysis.md` — what the
   documents actually state, with citations, and a list of everything that
   could not be determined. The questions come first.
2. **Surveys the repository** — stack, structure, existing config, and what it
   could not work out from the code. Skipped if there is no code yet.
3. **Works through the business background with you** — resolves what the
   documents left open, then confirms the project profile: stage, stakes, where
   it runs. Builds `docs/concepts.md`, the glossary, as terms get settled. Ends
   when you agree it has understood the subject matter.
4. **Builds `REQUIREMENTS.md` with you**, one requirement at a time. A
   requirement is written only when it is unambiguous; where it isn't, it tells
   you *exactly* what is unclear and what the competing readings are.
5. **Picks the domains** worth working through, from the catalog.
6. **Proposes rules one at a time**, each with evidence, an enforcement tier,
   and an honest account of what it costs if the rule turns out to be wrong.
   You answer accept / edit / reject / defer / record on every single one.
7. **Writes the ruleset** — a lean `CLAUDE.md` router plus portable domain rule
   files.
8. **Wires the harness** — the hooks and CI the accepted tiers already imply,
   permissions, the verification command, subagents, CLI tools and MCP servers.
   Each piece approved individually, same as the rules.
9. **Records the decisions** — rejections, deferrals, and your edits.
10. **Reviews its own output** in a fresh subagent that never saw the interview,
    then hands off.

Expect 20–35 rules across roughly ten domains, and expect to reject some. A
ruleset where you rejected a third is better than one where you accepted
everything.

## The two constraints it will not bend on

**Every rule is approved individually.** Not in batches, not by implication.
A ruleset you did not author is one you will not enforce.

**Nothing about your project is inferred.** Not the domain rules, not the
business logic, not what a term means, not the edge cases. If the documents
don't say it and you haven't said it, it goes in the questions list — never
into a rule. An inferred business rule is indistinguishable from a real one
once it's written down, and from then on it gets implemented with confidence.

If you ever catch it stating something about your domain that you never told
it, that is a bug in the run. Stop and say so.

## What you get

```
CLAUDE.md            router — commands, always-on rule citations, routing, bindings
REQUIREMENTS.md      every change traces to a requirement
docs/concepts.md     domain glossary, including the terms nobody defined
input/_analysis.md   what your documents said, and what they didn't
rules/
  <domain>.md        portable policy — no paths, no commands, no stack specifics
  _decisions.md      rejections, your edits with originals, structural decisions
  _progress.md       the ruleset index, findings, follow-ups
.claude/
  settings.json      permissions and hooks, extended from the starter
  hooks/             enforcement for rules accepted at hook tier
  agents/            project-specific subagents, if any were worth it
.mcp.json            MCP servers, if any were agreed
```

The split matters: **rules are portable, bindings are not.** `rules/*.md`
carries policy that would fire in any project. `CLAUDE.md` carries everything
tying it to this one. That's what lets you lift a ruleset into the next
repository whole.

## Verification

`node .claude/hooks/check-ruleset.mjs` checks that the ruleset is internally
consistent: the router stays under 200 lines, every `rules/` path it cites
exists, every rule id in its Always block resolves to a real rule, no domain
file is pulled in eagerly with `@`, and the logs are present.

It runs as a `Stop` hook, so a run cannot end on a broken ruleset. It checks
what exists rather than what is complete, so it never blocks a half-finished
elicitation.

## A deliberate deviation

Claude Code's own guidance says on-demand knowledge belongs in **skills**, which
the harness surfaces automatically. This kit puts domain rules in `rules/*.md`
reached through a routing table in `CLAUDE.md` instead.

The trade: you get portability — a `rules/` directory lifts into the next repo
whole — and explicit triggers you can read and edit. You give up harness-level
loading, so the routing table only works if it is short enough to be obeyed.
That is why the Always block is capped at ten and the router at 200 lines.

If you would rather have skills, the rule files convert cleanly: one skill per
domain, the routing trigger becomes the description.

## Resuming

Long runs get paused. `rules/_progress.md` is created before the first proposal
and records the exact rule awaiting a verdict, quoted in full. Clear context,
run `/project-startup` again, and it picks up there without re-surveying or
re-proposing anything settled.
