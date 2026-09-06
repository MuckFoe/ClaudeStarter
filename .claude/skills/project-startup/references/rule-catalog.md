# Rule catalog

Read during Phase 5 (domain selection) and Phase 6 (elicitation).

Every domain here except `baseline` is an **elicitation prompt, not a rule
library** — never paste one of these as a finished rule. Use them to find what
is actually true in this project, then propose a rule in the project's own
terms with evidence. `baseline` is the one exception: its entries are
pre-drafted rule text, confirmed rather than elicited — see why at the top of
that section.

Order below is roughly the order worth working through: the baseline defaults
first, then what the project is, then how to verify it, then everything else.

---

## `baseline` — universal defaults, confirmed not elicited

Always proposed first, in every run. These do not need Phase 1 evidence to
justify — they hold regardless of what this particular project turns out to
be, which is exactly why they can be drafted in advance instead of elicited.
"Confirmed" does not mean "rubber-stamped": each still gets its own verdict
under the same five dispositions as every other rule, using this text as the
starting proposal instead of a blank one. An **edit** here usually means
narrowing scope or sharpening the wording for this project, not disagreeing
with the substance.

They deliberately do not duplicate the project-specific domains below:
`verification` still elicits *which command* proves this project works,
`agent-conduct` still elicits *which specific actions* need confirmation here.
Baseline states the behavior that holds no matter what those answers turn out
to be.

```
RULE  baseline/1
─────────────────────────────────────────────
Statement   Show evidence for claimed completion — command run and its
            output, a diff, a screenshot — rather than asserting a task is
            done.
Why         Without a runnable check, "looks done" is the only signal
            available, and it is not reliable. Evidence is also what makes an
            unattended or reviewed-later session auditable.
Evidence    universal default
Tier        rule-file (raise to hook if a Stop-tier check exists — Phase 8)
If wrong    Costs nothing to state; costs a false "done" to skip.
```

```
RULE  baseline/2
─────────────────────────────────────────────
Statement   Confirm before an action that is hard to reverse or touches
            shared state — force-push, resetting or discarding uncommitted
            work, deleting branches or files, a migration — even when a
            broader permission already allows the underlying command.
Why         The cost of pausing to confirm is low. The cost of an unwanted
            irreversible action, or one visible to people other than the
            user, can be very high.
Evidence    universal default
Tier        hook where the action is scriptable (a PreToolUse check), else
            advisory
If wrong    An unnecessary confirmation is friction; a missing one is
            sometimes unrecoverable.
```

```
RULE  baseline/3
─────────────────────────────────────────────
Statement   Where this ruleset or the user's instructions do not state
            something, ask or record it as unknown — never fill the gap from
            general knowledge, convention, or what seems likely.
Why         An inferred fact and a stated one are indistinguishable once
            acted on. A wrong assumption compounds silently; a recorded
            unknown gets asked about.
Evidence    universal default
Tier        advisory — this is a reasoning discipline, not a checkable action
If wrong    A wrong invented fact is worse than a missing one, because a
            missing one is visibly missing.
```

```
RULE  baseline/4
─────────────────────────────────────────────
Statement   Treat this ruleset like code: when a rule stops changing
            behavior, or a review shows it is not being read, prune it rather
            than leaving it to accumulate.
Why         An overlong or stale ruleset does not fail gracefully — it gets
            ignored in whole, including the parts that still matter.
Evidence    universal default
Tier        advisory
If wrong    Skipping this is how every ruleset becomes the over-specified
            CLAUDE.md this rule exists to prevent.
```

```
RULE  baseline/5
─────────────────────────────────────────────
Statement   Scope investigation narrowly to what the current task needs.
            Push open-ended "read everything and figure it out" work into a
            subagent instead of filling the primary context with it.
Why         Context is the scarcest resource in a session, and degradation
            from a full context is gradual and easy to miss until it has
            already caused a mistake.
Evidence    universal default
Tier        advisory
If wrong    Skipping this is how a session runs out of usable context before
            the actual task is done.
```

---

## `project` — identity and scope

What the thing is and, more usefully, what it is not.

- What does this system do, in one sentence a stranger would understand?
- Who runs it — you alone, a team, end users?
- What is explicitly **out of scope**? (The most valuable rule in this domain.)
- What is the cost of it being down or wrong for a day?
- Is there a deadline or external commitment shaping decisions?

## `verification` — how "done" is decided

The highest-leverage domain. Do this one early; it changes how much autonomy
every later rule can safely grant.

- What single command proves the project still works?
- What must pass before a change is considered complete?
- What evidence must the agent show — test output, build exit code, a screenshot?
- Is there anything that *cannot* be verified automatically? Those areas need
  tighter human review, and that is itself a rule.
- Should the agent be blocked from ending a turn while the check fails?

## `commands` — the invocations that can't be guessed

- Build, run, test, lint, typecheck — exact commands including working directory
- How to run the full stack locally (compose, scripts, ports)
- Anything with a non-obvious flag, env var, or ordering requirement
- Commands that are slow enough to avoid running casually

## `architecture` — boundaries and placement

- What are the real layers, and what is forbidden from crossing them?
- Where does a new feature's code go? A new endpoint? A new type?
- What is shared between frontend and backend, and how is it kept in sync?
- Which parts are load-bearing and should not be refactored casually?
- Are there decisions already made that should not be relitigated?

## `code-style` — deviations only

Only rules that differ from the language's defaults or from what a formatter
already enforces. If `gofmt` or Prettier owns it, it is not a rule.

- Naming conventions that differ from the language norm
- Error handling policy — wrap, sentinel errors, panic policy
- Logging: what level, what must never be logged
- Comment policy where it differs from "comment the non-obvious"

## `testing` — what must be covered and how

- What kinds of tests exist, and what is each responsible for?
- What must have a test before it merges? What legitimately doesn't need one?
- Fixtures, factories, or mocking policy — especially "avoid mocks" style rules
- Is there a test that must be written *first* for bug fixes? (Repro-first policy)
- What is the expected runtime, and what may be skipped locally?

## `api` — contract rules

- Request/response shape conventions, casing, envelope
- Error format and status code policy
- Versioning: how, and when a change counts as breaking
- Pagination, filtering, and limits
- What may change freely vs what has consumers depending on it

## `data` — persistence and schema

- Where the schema lives and how it changes
- Migration policy — reversible? forward-only? who runs them?
- What data is derived vs authoritative
- Retention, and anything that must never be stored
- Backup or export expectations before destructive operations

## `security` — the non-negotiables

- Where secrets live and how they are loaded (never inline, never committed)
- Authentication and authorization model, and where checks must occur
- Input validation and sanitization boundaries
- PII: what qualifies here, and what handling it requires
- Dependencies: what makes one acceptable to add

## `git` — repository etiquette

- Branch naming and whether work happens on the default branch
- Commit granularity and message format
- What must never be committed
- Whether the agent may commit and push unprompted, or only on request
- PR expectations if any

## `agent-conduct` — what the agent must confirm first

This domain is about the user's control surface. It is where "mostly AI-driven,
still in control" gets made concrete.

- What may the agent do without asking? (Name it — the default matters more than the exceptions.)
- What must it always confirm first? Candidates: schema changes, deleting files,
  installing dependencies, touching auth, rewriting tests, force operations,
  anything outside the stated task scope
- What must it never do, regardless of instruction?
- How should it report — evidence expected, or assertion accepted?
- What should it do when blocked or uncertain rather than guessing?
- Scope discipline: is it allowed to fix unrelated things it notices, or should
  it flag them and leave them alone?

## `agent-tooling` — what the agent reaches for

Policy about the agent's own tools. Distinct from `agent-conduct`, which is
about what it may *do*; this is about what it may *use*, and it feeds Phase 8
directly — every rule here becomes something to configure or deliberately not
configure.

- What proves the project works, as one command? (If `verification` has not
  already settled this, settle it here — everything else is downstream of it.)
- Which external services does this project touch, and is there a CLI for each?
  Name the auth prerequisite: a CLI the agent cannot authenticate is not a tool.
- May the agent add an MCP server, or is that a decision the user makes? An MCP
  server is a dependency and a trust boundary, not a convenience.
- When must work be delegated to a subagent rather than done inline? Answers
  worth having name a threshold — a file count, a whole-repo survey, a review
  that should not be done by whoever wrote the code.
- What may run without asking, what must be confirmed, what is denied outright
  even when the agent is convinced it should proceed? The last list is the only
  one that survives the agent being talked into something.
- Which checks must be deterministic — a hook or CI — rather than trusted to
  the agent? Each answer is enforcement to build, and an answer with nothing
  behind it is a tier that is currently a lie.


---

## Domains to propose sparingly

Only if Phase 1 found evidence, or the user's stated stage demands it:

- `performance` — budgets, hot paths, what may not regress
- `accessibility` — if there is a real UI with real users
- `observability` — logging, metrics, tracing expectations
- `release` — versioning, changelog, deployment gates
- `docs` — what must be updated alongside code

A domain with two real rules is worth more than a domain with eight generic ones.
