# The five-step cycle

One pass of this is one `ProjectPlan.md` item. Update the item's `Status` and
the relevant field as each step completes — the file is the resume point, so
an accurate status is what makes stopping mid-item recoverable.

---

## 1. Plan

Restate the item and the requirement id it builds toward. Read that
requirement in `REQUIREMENTS.md` — a plan for a requirement you haven't
re-read is a plan for what you remember it said.

Name, concretely:

- Which files or areas this touches
- The approach in outline, not full detail yet
- Anything genuinely unknown — a design choice the requirement doesn't settle,
  a dependency on another item, a rule that seems to conflict with what the
  requirement asks for

If a rule and the requirement conflict, stop here and surface both, same as
`/project-startup` does when an ingested rule conflicts with an approved one:
quote each, say what each would mean concretely, and ask. Do not pick a
reading and continue into **offer solution**.

Write the outline into the item's `Plan` field. Set `Status: planning` while
this is in progress, and leave it there if you stop before the next step.

## 2. Offer solution

Turn the outline into a concrete proposal: what you will actually build, named
specifically enough that "yes" means something. Not "add validation" — "add a
Zod schema at `src/api/schema.ts` and enforce it in the handler at
`src/api/routes/report.ts`."

Get a verdict with **`AskUserQuestion`**, offering approve / adjust / skip:

- **Approve** — proceed to build exactly this.
- **Adjust** — the user redirects; take their correction as the solution and
  confirm it back before building. Treat this the way `/project-startup`
  treats an **edit** verdict — their version, not a negotiated middle.
- **Skip** — leave the item at `not started`, move to the next item this
  session, and note why it was skipped in the item's `Solution` field so the
  next session doesn't re-propose the same thing blind.

Do not start building on an implied yes. This is the one checkpoint in the
cycle that must not be silently skipped, because it is the only point where
the user sees the approach before it exists as code.

Write the approved solution into the item's `Solution` field. Set
`Status: solution offered` while awaiting the verdict, `Status: building` once
approved.

## 3. Build

Implement exactly the approved solution. If, mid-build, the approach turns out
to be wrong in a way that changes what was offered — not just an
implementation detail — stop and go back to **offer solution** with the
revised proposal rather than quietly building something else.

Follow every applicable rule from `rules/*.md` as you go — this is what the
ruleset was built for. If a rule makes the approved solution meaningfully
harder or different, that's worth surfacing to the user, not silently working
around.

## 4. Verify

Run the verification command `AGENTS.md`'s command table names for this kind
of change. If the ruleset defined a narrower check for this specific area, run
that too.

**Show the command and its actual output.** Not "tests pass" — the command
and the result, the same evidence discipline `baseline/1` establishes in the
ruleset itself. If nothing can be verified automatically for this item, say so
plainly rather than skipping the step, and note in the item what a human
should check instead.

Write the command and result into the item's `Verify` field. Set
`Status: verifying` while this runs.

If it fails, see "When verification fails" in `SKILL.md` — do not proceed to
**finish**.

## 5. Finish

Once verification passes:

- Set `Status: done` and fill `Finished` with the date and the commit or diff
  it landed in.
- Commit if the ruleset's `git` rules and `agent-conduct` rules allow
  committing without asking further, and if they require confirmation first,
  ask now — the offer-solution approval was for the approach, not
  automatically for pushing it to history.
- Name the requirement this closed or advanced, so `REQUIREMENTS.md` stays
  traceable — update its `Status` if the item was the requirement's last open
  piece.

Then continue to the next open item, or stop if the session's item budget
(from "Resuming" in `SKILL.md`) is reached.
