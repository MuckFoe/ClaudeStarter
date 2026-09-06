# Reddit research — inputs and practices for CLAUDE.md/AGENTS.md project starters

Requested 2026-09-06, continued same day: search Reddit specifically for
discussion relevant to `project-startup`'s design — what people use as inputs
when starting an AI-agent-coding project, and what makes a good
CLAUDE.md/AGENTS.md. An earlier pass in this file concluded Reddit was
unreachable; that conclusion no longer holds.

## Access technique that worked

Direct navigation to `reddit.com/search` shows a "Prove your humanity"
reCAPTCHA, and `old.reddit.com/search` redirects to a login wall — neither
was attempted further (no captcha-solving, no login). What worked instead:

1. Navigate to `https://www.google.com/search?q=site:reddit.com+<query>`
   (quoted phrases and `OR` work as normal Google syntax).
2. First load shows a German cookie-consent dialog ("Bevor Sie zur Google
   Suche weitergehen") — dismiss with "Alle ablehnen" before clicking any
   result, otherwise clicks time out against the dialog's overlay.
3. Click a `reddit.com` result link directly from the Google results snapshot
   (the underlying `/goto?url=...` redirect resolves fine on click — no need
   to unwrap it). This lands on the real thread with full read access, no
   login or captcha.
4. Thread page snapshots are large and routinely exceed the tool's inline
   token limit, so pass `filename` to `browser_snapshot` to force it to a
   file, then `Grep` that file for `^\s*- (text|paragraph|heading)` to pull
   post/comment text without the accessibility-tree noise.
5. Reddit's own "People also ask about section" on a thread page is an
   AI-generated synopsis of that thread's comments — useful as a fast summary
   layer but treated here as secondary to comments quoted directly.

This is a real, repeatable path to Reddit content from this toolset — worth
keeping for future research tasks, not just this one.

## Synthesis, organized by what matters for `project-startup`

### What people actually use as inputs

Real-project workflows described on Reddit lean heavily on **structured,
written artifacts feeding the agent**, not ad hoc prompting:
- "Lots of architectural documents," sprints laid out in advance, GitHub
  Epic issues with detailed labels and milestones, sub-issues revised
  round-robin by multiple models (Claude/Codex/Gemini) before work starts
  (r/ClaudeAI, "Tell us your best practices for coding with Claude Code").
- Several people described formal registries: "plan-registry, spec-registry,
  development-registry, test-registry" — i.e., the project's own plan/spec
  state kept as first-class input, not just code.
- One detailed shared CLAUDE.md (r/ClaudeAI, "Best practices for Claude md")
  models session start as: read a plan/milestone file to find "the active
  milestone and next action," read a decisions/rules file that "overrides
  skill instructions," and re-read both after context compaction — i.e., the
  living plan file is treated as a required input re-read every session, not
  a one-time seed.
- A recurring theme across threads: **README.md as the shared human+agent
  onboarding doc**, with CLAUDE.md/AGENTS.md pointing at it rather than
  duplicating it ("Humans and ai largely need the same context info to
  onboard and work well in a project" — architecture, coding/test guidelines,
  build/test commands, repo structure).
- Discovered but not deep-dived: **r/SpecDrivenDevelopment** (~5,030
  followers) and **r/BMAD_Method**, both dedicated to PRD/spec-first agentic
  workflows — one snippet mentioned "the same PRD was implemented once with
  OpenSpec and once with Claude Code" for comparison. Relevant communities to
  search directly if `project-startup`'s ingestion phase needs more on
  PRD-as-input conventions specifically.

### CLAUDE.md / AGENTS.md structure and length — strong consensus

This validates several choices `project-startup` already makes (see
`SKILL.md` Phase 7):
- **Length ceiling.** Repeated, specific: "no more than 100 lines" / "the
  official docs say 200 lines, and after that lean on rules" / "Limit to
  essentials (≈200 lines) so Claude doesn't re-read noise" (the Golden Rule,
  per the AI-generated synopsis of the 70-comment "Tell us your best
  practices" thread). Matches `SKILL.md`'s own 200-line cap on `AGENTS.md`.
- **Point to files, don't inline.** The top comment on "What to include in
  CLAUDE.md... and what not?" (r/ClaudeCode, 38 upvotes, 44 comments): "biggest
  lesson for me: point to files, don't inline everything. my CLAUDE.md links
  to separate docs (style guides, hook configs, etc.) with file paths. the
  agent reads them when it actually needs them instead of loading everything
  on every conversation." Also: "directory-level CLAUDE.md files that layer
  on top of the root one... root stays short and generic, each subdirectory
  adds its own context." This is exactly the router/rule-file split
  `project-startup` builds.
- **What to exclude** (same thread's original post, widely endorsed):
  common stack knowledge, anything an LLM already knows, anything
  discoverable by searching the codebase, or instructions to "review
  materials before it needs them" (i.e. don't front-load).
- **What to include:** project-specific gotchas not obvious from reading the
  code — "we use snake_case for X but camelCase for Y," "never run
  migrations without backing up first"; exact build/test/lint/deploy
  commands ("The agent can't guess `npm test` vs `pytest` vs whatever you
  use"); a running "mistakes the agent keeps making" section updated
  periodically. One comment: "'Auth logic: app/middleware/auth.js' tells the
  model where to look... 'don't modify auth' gives it rules to carry around
  in context without grounding" — file paths beat prose intent.
- **A cited study** (InfoQ, per one commenter, unverified beyond the Reddit
  mention): a human-written CLAUDE.md performed ~8% better than an
  LLM-written one, but both burned ~20% more tokens than no file at all —
  cited in-thread as the reason to only include what Claude can't already
  figure out.
- **A contrarian minority view** worth noting: "honestly i found the best
  thing is to keep the file entirely blank, and only add something if theres
  a recurring issue that it constantly gets wrong" — i.e., start from zero
  and grow reactively rather than front-loading a template.
- **Periodic audits, not just periodic edits:** "Every few weeks, I ask
  Claude itself 'which of these rules did you actually use this session?'" —
  a pruning practice with no analog yet in `project-startup`'s phases (worth
  considering for a maintenance/re-run note).

### AGENTS.md vs CLAUDE.md — the split project-startup already assumes

The dedicated thread ("How do you all use CLAUDE.md vs AGENTS.md when also
using Codex alongside CC?", r/ClaudeCode, ~20 comments) converges hard on one
model, matching `SKILL.md`'s router design almost exactly:
- **AGENTS.md = the durable, vendor-neutral project contract** (architecture,
  conventions, directory structure, test commands, do-not-touch rules) —
  "write it as if you're onboarding a new developer... neither tool needs to
  be mentioned in it."
- **CLAUDE.md = a thin Claude-specific adapter**, commonly just
  `@AGENTS.md` plus a short delta (prompting quirks, tool/MCP notes,
  Claude-specific gotchas). Several people literally run `CLAUDE.md` as one
  line: `@agents.md`.
- **The named failure mode is drift**, not "which file wins": "duplicating
  project context across both files and then having them drift... both
  tools get confused and you spend time debugging the config rather than the
  code." Symlinks were the most common anti-drift mechanic mentioned; a few
  people use hooks to keep files in sync instead, noting symlinks "break with
  Windows setup."
- One dissenting/pragmatic note: "They are more or less the same file
  purpose, one is used by claude and one is used by other services. Make
  them identical" — a minority position favoring duplication over the
  router pattern, for teams that don't want an indirection layer.
- A tool-drift problem raised but out of scope for `project-startup` (no
  action needed, just context): people are building small tools
  ("ccmd", "markjason", "Perseus") specifically to score/sync/auto-generate
  these files, suggesting manual upkeep is a felt pain point in the wild.

### Complaints and gotchas relevant to a generator like project-startup

- **Context/token cost of rule files is real and resented** if rules go
  stale: "the extra context usage of the markdown files costs tokens too.
  especially if the context file is out of date, causing it to read the
  file, then explore the codebase, then deal with hallucinations due to the
  mismatch in information" — an argument for keeping rule files few, current,
  and cited (which `project-startup`'s evidence-per-rule requirement already
  addresses).
- **Rules the agent doesn't reliably follow once context grows**: "unless
  you also reduce the context size CC quickly forgets the instructions
  you've given it in CLAUDE.md" — an argument for the hook/CI enforcement
  tiers `project-startup` already distinguishes from advisory rules, not just
  prose rules.
- **Multi-agent/multi-tool handoff is an open, unsolved problem** in
  practice: several people log agent handoffs manually ("a log in the repo
  root... read the latest entry before you start, append an entry when you
  finish") because rule files alone don't prevent two agents/tools from
  overwriting each other's work on the same repo.
- At least one reply in a thread read as templated/possibly bot-generated
  marketing copy (generic tone, unrelated product plug) — flagged here rather
  than quoted as genuine practitioner sentiment.

## Per-thread sources

| Thread | Subreddit | Activity | Value |
|---|---|---|---|
| [What to include in CLAUDE.md... and what not?](https://www.reddit.com/r/ClaudeCode/comments/1rohbj0/what_to_include_in_claudemd_and_what_not/) | r/ClaudeCode | 38 upvotes, 44 comments, ~6mo ago | High — primary source for structure/length/inclusion consensus above |
| [How do you all use CLAUDE.md vs AGENTS.md when also using Codex alongside CC?](https://www.reddit.com/r/ClaudeCode/comments/1thhl39/how_do_you_all_use_claudemd_vs_agentsmd_when_also/) | r/ClaudeCode | ~20 comments, ~3mo ago | High — primary source for the AGENTS.md/CLAUDE.md split |
| [Best practices for Claude md](https://www.reddit.com/r/ClaudeAI/comments/1uc89wf/best_practices_for_claude_md/) | r/ClaudeAI | ~20 comments, ~2mo ago | Medium-high — includes one full, detailed real-world CLAUDE.md shared in-thread (session-start protocol, hard rules, milestone files) |
| [Tell us your best practices for coding with Claude Code](https://www.reddit.com/r/ClaudeAI/comments/1o98c8f/tell_us_your_best_practices_for_coding_with/) | r/ClaudeAI | 70 comments, ~10mo ago | Medium-high — architecture-docs/issue-driven workflow description; Reddit's own AI synopsis is a clean secondary summary |
| A research-backed CLAUDE.md starter kit with copy-paste templates | r/ClaudeCode | 1 comment, ~7mo ago | Low — checked, single comment, no discussion to mine beyond the OP's template list (already summarized in the prior version of this file) |
| Portable Multi-Agent AI Team Starter Pack for Claude Code | r/ClaudeWorkflows | recent (~3wk ago) | Not visited this pass — surfaced by search, time-boxed out |
| AGENTS.md CODEX.md INSTRUCTIONS.md CLAUDE.md | r/OpenAI | ~10 comments, ~1yr ago | Not visited this pass — older, likely superseded by the more recent AGENTS.md-vs-CLAUDE.md thread above |
| Wie ich Claude Code-Projekte strukturiere (CLAUDE.md, Skills...) | r/VibeCodeDevs | ~15 comments, German | Not visited this pass — time-boxed out |
| r/SpecDrivenDevelopment | subreddit, ~5,030 followers | — | Discovered, not explored — dedicated PRD/spec-first agentic dev community, directly relevant to `project-startup`'s input-analysis phase; worth a dedicated pass if PRD-as-input conventions become a design question |
| r/BMAD_Method | subreddit | — | Discovered, not explored — another spec/PRD-first methodology community |

## Bottom line

Reddit is reachable via Google's `site:reddit.com` results, clicked directly
(not via the Reddit search UI). The threads visited strongly validate
`project-startup`'s existing design choices — the 200-line AGENTS.md cap,
router-plus-rule-files split, AGENTS.md-as-source-of-truth with CLAUDE.md as
a thin adapter, evidence-per-rule discipline, and the hook/advisory
enforcement-tier distinction all match what practitioners converge on
independently. The clearest gap surfaced but not yet reflected in the skill:
no periodic-audit/pruning step for an already-written ruleset (practitioners
do this manually every few weeks), and no guidance on multi-agent/multi-tool
handoff logs for repos worked by more than one AI tool.
